"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Heart, Plus, Minus, Star, Truck, Award } from "lucide-react";
import ChihiliLoader from "./ChihiliLoader";
import RecentReviews from "./RecentReview";
import SizeChartModal from "./SizeChartModal";
import CustomSizeModal from "./customSizeModal";
import { useRouter, useParams } from "next/navigation";
import { useCartStore, useCartUtils } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useHomeStore } from "@/store/homeStore";
import useProductStore from "@/store/ProductStore";
import ReviewSection from "./ReviewSection";
import { useAuthStore } from "@/store/authStore";
import { ShoppingCart } from "lucide-react";

interface ProductDetailsProps {
  slug?: string;
  onProductLoaded?: (productId: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  slug: propSlug,
  onProductLoaded,
}) => {
  const params = useParams();
  const router = useRouter();

  // Get slug from props or URL params
  const slug = propSlug || (params?.slug as string);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const [wishlistError, setWishlistError] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  // Product store
  const {
    currentProduct,
    productLoading,
    error: productError,
    getProductBySlug,
  } = useProductStore();

  // Initialize state variables for variant selection
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Get product data on component mount
  useEffect(() => {
    if (slug) {
      getProductBySlug(slug);
    }

    // Cleanup function
    return () => {
      useProductStore.getState().clearCurrentProduct();
    };
  }, [slug, getProductBySlug]);

  // Initialize variant selection when product loads
  useEffect(() => {
    if (currentProduct?.variants?.length) {
      const firstVariant = currentProduct.variants[0];
      setSelectedVariantIndex(0);
      setSelectedSize(firstVariant.attributes?.size || "");
      setSelectedColor(firstVariant.attributes?.color || "");
      setSelectedImage(0); // Reset image selection
      setQuantity(1); // Reset quantity
      setAddError(""); // Clear any previous errors
    }
  }, [currentProduct]);

  // Get current selected variant
  const selectedVariant = currentProduct?.variants?.[selectedVariantIndex];
  const productId = currentProduct?._id;
  const variantSku = selectedVariant?.sku;

  // Call onProductLoaded when productId is available
  useEffect(() => {
    if (productId && onProductLoaded) {
      onProductLoaded(productId);
    }
  }, [productId, onProductLoaded]);

  // Update selected variant when size or color changes
  useEffect(() => {
    if (currentProduct?.variants && (selectedSize || selectedColor)) {
      const variantIndex = currentProduct.variants.findIndex((v) => {
        const sizeMatch = !selectedSize || v.attributes.size === selectedSize;
        const colorMatch =
          !selectedColor || v.attributes.color === selectedColor;
        return sizeMatch && colorMatch;
      });

      if (variantIndex !== -1 && variantIndex !== selectedVariantIndex) {
        setSelectedVariantIndex(variantIndex);
        setSelectedImage(0); // Reset image to first when variant changes
        setQuantity(1); // Reset quantity when variant changes
        setAddError(""); // Clear errors when variant changes
      }
    }
  }, [selectedSize, selectedColor, currentProduct, selectedVariantIndex]);

  // Cart state selectors
  const { addToCart, fetchCart } = useCartStore();
  const { isItemInCart } = useCartUtils();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {
        // Silent error handling for background fetch
      });
    }
  }, [isAuthenticated, fetchCart]);

  // Wishlist state and actions
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
    itemIds,
    fetchWishlist,
  } = useWishlistStore();

  // Fetch wishlist when user is authenticated and wishlist is empty
  useEffect(() => {
    if (isAuthenticated && itemIds.length === 0) {
      fetchWishlist().catch(() => {
        // Silent error handling for background fetch
      });
    }
  }, [isAuthenticated, itemIds.length, fetchWishlist]);

  // Auto-dismiss wishlist error after 3 seconds
  useEffect(() => {
    if (wishlistError) {
      const timer = setTimeout(() => {
        setWishlistError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [wishlistError]);

  // Recently viewed
  const { addProductToRecentlyViewed } = useHomeStore();

  // Add to recently viewed when component mounts
  useEffect(() => {
    if (productId) {
      addProductToRecentlyViewed(productId);
    }
  }, [productId, addProductToRecentlyViewed]);

  // Extract variant images only (no main product images)
  const productImages = useMemo(() => {
    if (!currentProduct) return [];

    let images = [];

    // Add variant-specific images only if available
    if (selectedVariant?.images?.length) {
      images.push(...selectedVariant.images);
    }

    // Remove duplicates and filter out null/undefined
    const uniqueImages = [...new Set(images.filter(Boolean))];

    // Return at least one fallback image if no variant images exist
    return uniqueImages.length > 0 ? uniqueImages : ["/image.png"];
  }, [currentProduct, selectedVariant]);

  // Reset selected image if it's out of bounds
  useEffect(() => {
    if (selectedImage >= productImages.length) {
      setSelectedImage(0);
    }
  }, [productImages.length, selectedImage]);

  // Extract available colors and sizes from variants
  const availableOptions = useMemo(() => {
    if (!currentProduct?.variants) return { colors: [], sizes: [] };

    // Get unique colors
    const colors = currentProduct.variants
      .map((v) => v.attributes.color)
      .filter(Boolean)
      .filter((color, index, self) => self.indexOf(color) === index)
      .map((color) => ({
        name: color,
        available: currentProduct.variants.some(
          (v) => v.attributes.color === color && v.stock > 0
        ),
      }));

    // Get sizes only for the selected color (if any color is selected)
    let sizes = [];
    if (selectedColor) {
      // Only show sizes for the selected color
      sizes = currentProduct.variants
        .filter((v) => v.attributes.color === selectedColor)
        .map((v) => v.attributes.size)
        .filter(Boolean)
        .filter((size, index, self) => self.indexOf(size) === index)
        .map((size) => ({
          name: size,
          available: currentProduct.variants.some(
            (v) =>
              v.attributes.color === selectedColor &&
              v.attributes.size === size &&
              v.stock > 0
          ),
        }));
    } else {
      // If no color is selected, show all sizes (original behavior)
      sizes = currentProduct.variants
        .map((v) => v.attributes.size)
        .filter(Boolean)
        .filter((size, index, self) => self.indexOf(size) === index)
        .map((size) => ({
          name: size,
          available: currentProduct.variants.some(
            (v) => v.attributes.size === size && v.stock > 0
          ),
        }));
    }

    return { colors, sizes };
  }, [currentProduct, selectedColor]); // Added selectedColor as dependency

  // Optimized quantity handlers
  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const increaseQuantity = useCallback(() => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  }, [selectedVariant, quantity]);

  // Optimized wishlist toggle
  const toggleWishlist = useCallback(async () => {
    console.log("toggleWishlist called", {
      isAuthenticated,
      productId,
      wishlistLoading,
    });

    if (!isAuthenticated) {
      setWishlistError("Please login to add items to wishlist");
      return;
    }

    if (wishlistLoading || !productId) return;

    setWishlistError("");
    setWishlistLoading(true);

    // Trigger quick pop animation
    setWishlistAnimating(true);
    setTimeout(() => {
      setWishlistAnimating(false);
    }, 100);

    try {
      const isCurrentlyInWishlist = isInWishlist(productId);
      console.log("Current wishlist state:", {
        isCurrentlyInWishlist,
        itemIds,
      });

      if (isCurrentlyInWishlist) {
        console.log("Removing from wishlist");
        await removeFromWishlist(productId);
      } else {
        console.log("Adding to wishlist");
        await addToWishlist(productId);
      }
      console.log("Wishlist operation completed successfully");
    } catch (error: any) {
      console.error("Wishlist operation failed:", error);
      setWishlistError(error?.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  }, [
    isAuthenticated,
    wishlistLoading,
    productId,
    isInWishlist,
    removeFromWishlist,
    addToWishlist,
    itemIds,
  ]);

  // Optimized buy now handler
  const handleBuyNow = useCallback(async () => {
    if (
      !selectedVariant ||
      selectedVariant.stock <= 0 ||
      !productId ||
      !variantSku
    )
      return;

    // Add to cart first, then navigate
    try {
      await addToCart({ productId, variantSku, quantity });
      router.push("/cart-details");
    } catch (error) {
      setAddError("Failed to add item to cart");
    }
  }, [selectedVariant, productId, variantSku, quantity, addToCart, router]);

  // Add to Cart handler with better error handling
  const handleAddToCart = useCallback(async () => {
    if (!productId || !variantSku || !selectedVariant) {
      setAddError("Please select a valid product variant");
      return;
    }

    if (selectedVariant.stock <= 0) {
      setAddError("This variant is out of stock");
      return;
    }

    setAddLoading(true);
    setAddError("");

    try {
      await addToCart({ productId, variantSku, quantity });
    } catch (err: any) {
      setAddError(err?.message || "Failed to add to cart");
    } finally {
      setAddLoading(false);
    }
  }, [productId, variantSku, selectedVariant, quantity, addToCart]);

  // Size selection handler
  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(size);
    setAddError(""); // Clear errors when selection changes
  }, []);

  // Color selection handler
  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      setAddError(""); // Clear errors when selection changes

      // Auto-select the first available size for the new color
      if (currentProduct?.variants) {
        const availableSizesForColor = currentProduct.variants
          .filter(
            (v) =>
              v.attributes.color === color && v.stock > 0 && v.attributes.size
          )
          .map((v) => v.attributes.size!)
          .filter((size, index, self) => self.indexOf(size) === index);

        if (availableSizesForColor.length > 0) {
          // Sort sizes and select the first one
          const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
          const sortedSizes = availableSizesForColor.sort((a, b) => {
            const aIndex = sizeOrder.indexOf(a);
            const bIndex = sizeOrder.indexOf(b);

            if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          });

          setSelectedSize(sortedSizes[0]);
        } else {
          setSelectedSize(""); // No available sizes for this color
        }
      }
    },
    [currentProduct]
  );

  // Loading state
  if (productLoading) {
    return <ChihiliLoader message="Loading product details..." />;
  }

  // Error state
  if (productError || !currentProduct) {
    return (
      <div className="min-h-screen bg-secondary py-8 pt-16 font-lato">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-500">
                {productError || "Product Not Found"}
              </h2>
              <p className="mt-2 text-gray-600">
                {productError || "The product you're looking for doesn't exist"}
              </p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-primary1 text-white rounded-lg"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8 pt-16 font-lato">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] bg-white overflow-hidden shadow-lg">
              <img
                src={productImages[selectedImage]}
                alt={`${currentProduct.name} - View ${selectedImage + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 px-16"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/image.png";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden shadow-sm border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-blue-500 scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1} of ${currentProduct.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/image.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentProduct.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(currentProduct.avgRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {currentProduct.avgRating.toFixed(1)}
                  </span>
                  {currentProduct.totalReviews > 0 && (
                    <button className="text-blue-600 hover:text-blue-700 text-sm underline">
                      See all {currentProduct.totalReviews} reviews
                    </button>
                  )}
                </div>
                {currentProduct.shortDescription && (
                  <p className="text-gray-600 mt-1">
                    {currentProduct.shortDescription}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading || !productId || !isAuthenticated}
                  className={`relative transition-all duration-150 ease-out transform ${
                    wishlistLoading ? "opacity-50" : "hover:scale-105"
                  }`}
                >
                  <Heart
                    className={`w-8 h-8 cursor-pointer p-1 transition-all duration-100 ease-out transform ${
                      isInWishlist(productId || "")
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500 hover:scale-105"
                    } ${
                      wishlistLoading ? "animate-pulse scale-95 opacity-70" : ""
                    } 
                    ${wishlistAnimating ? "heart-pop" : ""}`}
                  />
                </button>
                {!isAuthenticated && (
                  <span className="text-xs text-gray-500 mt-1">
                    Login to save
                  </span>
                )}
                {wishlistError && (
                  <span className="text-red-500 text-xs mt-1">
                    {wishlistError}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline">
              {selectedVariant && (
                <>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{selectedVariant.price.toFixed(2)}
                  </span>
                  {selectedVariant.mrp &&
                    selectedVariant.mrp > selectedVariant.price && (
                      <>
                        <span className="ml-3 text-xl text-gray-500 line-through">
                          ₹{selectedVariant.mrp.toFixed(2)}
                        </span>
                        <span className="ml-3 text-sm text-green-600">
                          {Math.round(
                            ((selectedVariant.mrp - selectedVariant.price) /
                              selectedVariant.mrp) *
                              100
                          )}
                          % off
                        </span>
                      </>
                    )}
                </>
              )}
            </div>

            {/* Discount or Offer */}
            {currentProduct.buyXGetY &&
              currentProduct.buyXGetY.x > 0 &&
              currentProduct.buyXGetY.y > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800">
                  <p className="font-medium">
                    Special Offer: Buy {currentProduct.buyXGetY.x} Get{" "}
                    {currentProduct.buyXGetY.y} Free!
                  </p>
                </div>
              )}

            {/* Color Selection */}
            {availableOptions.colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Color {selectedColor && `- ${selectedColor}`}
                  </h3>
                </div>
                <div className="flex space-x-3">
                  {availableOptions.colors.map((color) => {
                    const colorMap: { [key: string]: string } = {
                      Red: "#FF0000",
                      Blue: "#0000FF",
                      Green: "#008000",
                      Yellow: "#FFFF00",
                      Golden: "#FFD700",
                      Black: "#000000",
                      White: "#FFFFFF",
                      Gray: "#808080",
                      Silver: "#C0C0C0",
                      Brown: "#A52A2A",
                      Orange: "#FFA500",
                      Pink: "#FFC0CB",
                      Purple: "#800080",
                      Violet: "#EE82EE",
                      Indigo: "#4B0082",
                      Cyan: "#00FFFF",
                      Teal: "#008080",
                      Navy: "#000080",
                      Maroon: "#800000",
                      Olive: "#808000",
                      Lime: "#00FF00",
                      Coral: "#FF7F50",
                      Beige: "#F5F5DC",
                      Khaki: "#F0E68C",
                      Gold: "#FFD700",
                      SilverGray: "#C0C0C0",
                      Magenta: "#FF00FF",
                      SkyBlue: "#87CEEB",
                      LightBlue: "#ADD8E6",
                      DarkBlue: "#00008B",
                      LightGreen: "#90EE90",
                      DarkGreen: "#006400",
                      LightGray: "#D3D3D3",
                      DarkGray: "#A9A9A9",
                      Chocolate: "#D2691E",
                      Crimson: "#DC143C",
                      Turquoise: "#40E0D0",
                      Aqua: "#00FFFF",
                      Lavender: "#E6E6FA",
                      Peach: "#FFE5B4",
                      Mint: "#98FF98",
                      Rose: "#FF007F",
                    };

                    const bgColor = color.name ? (colorMap[color.name] || "#FFFFFF") : "#FFFFFF";
                    return (
                      <button
                        key={color.name}
                        onClick={() =>
                          color.name && handleColorSelect(color.name)
                        }
                        disabled={!color.available}
                        className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 relative ${
                          selectedColor === color.name
                            ? "border-blue-500 scale-110 shadow-lg"
                            : color.available
                            ? "border-gray-300 hover:border-gray-400"
                            : "border-gray-200 opacity-50"
                        }`}
                        title={color.name}
                        style={{ backgroundColor: bgColor }}
                      >
                        {!color.available && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableOptions.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Size {selectedSize && `- ${selectedSize}`}
                  </h3>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm underline"
                  >
                    See sizing chart
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {availableOptions.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => size.name && handleSizeSelect(size.name)}
                      disabled={!size.available}
                      className={`py-3 px-4 rounded-lg border transition-all duration-200 text-sm font-medium relative ${
                        selectedSize === size.name
                          ? "bg-primary1 text-white border-primary1"
                          : size.available
                          ? "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {size.name}
                      {!size.available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-0.5 bg-red-500 rotate-45"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  📏{" "}
                  {selectedVariant?.title ||
                    "Select size and color to see variant details"}
                </div>
              </div>
            )}

            {/* Stock Information */}
            {selectedVariant && (
              <div className="text-sm">
                {selectedVariant.stock > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ In Stock ({selectedVariant.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    × Out of Stock
                  </span>
                )}
              </div>
            )}

            {/* Shipping Info */}
            <div className="rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Standard Shipping</p>
                  <p className="text-gray-600">
                    The estimated shipping date for this product is by{" "}
                    {new Date(
                      new Date().setDate(new Date().getDate() + 7)
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Return Policy */}
            {currentProduct.returnPolicy && (
              <div className="text-sm text-gray-600">
                <p>✓ {currentProduct.returnPolicy}</p>
              </div>
            )}

            {/* Custom Size Login */}
            <button
              className={`w-full py-3 rounded-lg transition-colors ${
                isAuthenticated
                  ? "bg-white text-gray-700 hover:bg-gray-200"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() => isAuthenticated && setIsCustomSizeOpen(true)}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? "Custom Size" : "Login to get Custom Size"}
            </button>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stock <= 0 ||
                      quantity <= 1
                    }
                    className="p-3 hover:bg-gray-100 transition-colors rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 text-lg font-medium text-gray-900 border-x border-gray-300">
                    {quantity.toString().padStart(2, "0")}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={
                      !selectedVariant ||
                      selectedVariant.stock <= 0 ||
                      quantity >= selectedVariant.stock
                    }
                    className="p-3 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {productId &&
                variantSku &&
                isItemInCart(productId, variantSku) ? (
                  <button
                    onClick={() => router.push("/cart-details")}
                    className="py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                  >
                    Go to Cart
                    <ShoppingCart className="w-4 h-4 ml-3" />
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={
                      addLoading ||
                      !selectedVariant ||
                      selectedVariant.stock <= 0 ||
                      !selectedSize
                    }
                    className="py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Adding...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Add to Cart
                        <ShoppingCart className="w-4 h-4 ml-3" />
                      </div>
                    )}
                  </button>
                )}
                <button
                  onClick={handleBuyNow}
                  disabled={
                    !selectedVariant ||
                    selectedVariant.stock <= 0 ||
                    !selectedSize
                  }
                  className="py-4 bg-primary1 text-white rounded-lg hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now →
                </button>
              </div>
              {addError && (
                <p className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
                  {addError}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="flex flex-col justify-center items-center gap-4 font-crimson-pro w-full">
              <div className="bg-secondary1 rounded-lg p-4 text-center w-full">
                <Truck className="w-8 h-8 text-primary2 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  INTERNATIONAL DELIVERY
                </h4>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <div className="text-gray-600 leading-relaxed">
                <p 
                  className={`transition-all duration-300 ${
                    isDescriptionExpanded 
                      ? 'max-h-none' 
                      : 'max-h-12 overflow-hidden'
                  }`}
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: isDescriptionExpanded ? 'none' : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: isDescriptionExpanded ? 'visible' : 'hidden'
                  }}
                >
                  {currentProduct.description}
                </p>
                {currentProduct.description && currentProduct.description.length > 150 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors flex items-center"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show Less
                        <svg 
                          className="w-4 h-4 ml-1 transform transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Read More
                        <svg 
                          className="w-4 h-4 ml-1 transform transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Tags */}
            {currentProduct.tags && currentProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentProduct.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Review Section */}
            <ReviewSection productId={productId || ""} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {isSizeChartOpen && (
        <SizeChartModal onClose={() => setIsSizeChartOpen(false)} />
      )}
      {isCustomSizeOpen && (
        <CustomSizeModal onClose={() => setIsCustomSizeOpen(false)} />
      )}
    </div>
  );
};

export default ProductDetails;
