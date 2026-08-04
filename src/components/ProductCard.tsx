"use client";

import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { getMinPrice, getDiscountedPrice, hasDiscount, type Product } from "@/api/Product.api";

interface ProductCardProps {
  product: Product;
  onProductClick: (productSlug: string) => void;
  isMobile?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onProductClick, 
  isMobile = false 
}) => {
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const { 
    addItem: addToWishlist, 
    removeItem: removeFromWishlist, 
    isInWishlist 
  } = useWishlistStore();

  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");

  const minPrice = getMinPrice(product);
  const isDiscounted = hasDiscount(product);
  const discountedPrice = isDiscounted ? getDiscountedPrice(minPrice, product) : minPrice;
  const discountPercentage = isDiscounted && product.discountValue ? product.discountValue : 0;

  const toggleWishlist = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to product page
    
    if (!isAuthenticated) {
      setWishlistError("Please login to add items to wishlist");
      return;
    }

    if (wishlistLoading) return;
    
    setWishlistError("");
    setWishlistLoading(true);
    
    // Trigger pop animation
    setWishlistAnimating(true);
    setTimeout(() => {
      setWishlistAnimating(false);
    }, 200);
    
    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error: any) {
      setWishlistError(error?.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleProductClick = () => {
    onProductClick(product.slug);
  };

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to product page
    
    if (!isAuthenticated) {
      setCartError("Please login to add items to cart");
      return;
    }

    if (cartLoading) return;
    
    setCartError("");
    setCartLoading(true);
    
    try {
      // Get the default variant SKU if product has variants
      const variantSku = product.variants && product.variants.length > 0 
        ? product.variants[0].sku 
        : undefined;

      await addToCart({
        productId: product._id,
        variantSku,
        quantity: 1
      });
      
      // Optional: Show success message
      console.log("Product added to cart successfully");
    } catch (error: any) {
      setCartError(error?.message || "Failed to add item to cart");
      console.error("Add to cart error:", error);
    } finally {
      setCartLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div
        className="bg-white overflow-hidden border border-zinc-100 cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="relative bg-white aspect-[3/4] flex items-center justify-center p-2">
          <img
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
            }}
          />
          <button 
            className="absolute top-2 right-2 p-1"
            onClick={toggleWishlist}
            disabled={wishlistLoading}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ease-out transform ${
                isInWishlist(product._id)
                  ? "fill-red-500 text-red-500 heart-beat"
                  : "text-gray-400 hover:text-red-500 hover:scale-110"
              } ${wishlistLoading ? 'animate-bounce scale-95 opacity-70' : ''} 
              ${wishlistAnimating ? 'heart-pop' : ''} cursor-pointer`}
            />
          </button>
        </div>
        <div className="mx-2 mb-2 p-2 bg-gray-50">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-1">
              {product.name}
            </h3>
            <button 
              className={`p-1 flex-shrink-0 transition-all duration-200 ${
                cartLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              onClick={handleAddToCart}
              disabled={cartLoading}
            >
              <ShoppingCart className={`w-4 h-4 text-primary ${cartLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
          <div className="text-[10px]">
            <span className="font-bold text-gray-900">
              Rs. {Math.round(discountedPrice)}
            </span>
            {isDiscounted && (
              <>
                <span className="text-gray-400 line-through ml-2">
                  Rs. {Math.round(minPrice)}
                </span>
                <span className="text-orange-600 text-xs ml-1">
                  ({Math.round(discountPercentage)}% OFF)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div
      className="group cursor-pointer mb-8"
      onClick={handleProductClick}
    >
      <div className="relative mb-3">
        <div className="aspect-[3/4] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.images?.[0] || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+PC9zdmc+";
            }}
          />
        </div>
        <button 
          className="absolute top-3 right-3 p-1"
          onClick={toggleWishlist}
          disabled={wishlistLoading}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ease-out transform ${
              isInWishlist(product._id)
                ? "fill-red-500 text-red-500 heart-beat"
                : "text-gray-400 hover:text-red-500 hover:scale-110"
            } ${wishlistLoading ? 'animate-bounce scale-95 opacity-70' : ''} 
            ${wishlistAnimating ? 'heart-pop' : ''} cursor-pointer`}
          />
        </button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-2">
            {product.name}
          </h3>
          <button 
            className={`p-1 flex-shrink-0 transition-all duration-200 ${
              cartLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
            }`}
            onClick={handleAddToCart}
            disabled={cartLoading}
          >
            <ShoppingCart className={`w-4 h-4 text-primary ${cartLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">
          {product.shortDescription || product.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-900">
            Rs. {Math.round(discountedPrice)}
          </span>
          {isDiscounted && (
            <>
              <span className="text-gray-400 line-through">
                Rs. {Math.round(minPrice)}
              </span>
              <span className="text-orange-600 text-xs">
                ({Math.round(discountPercentage)}% OFF)
              </span>
            </>
          )}
        </div>
        {cartError && (
          <p className="text-xs text-red-500 mt-1">{cartError}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
