"use client";

import React, { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import ProtectedRoute from "@/components/RouteProtect";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import ChihiliLoader from "@/components/ChihiliLoader";

const WishlistPage = () => {
  const { items, error, fetchWishlist, removeItem } = useWishlistStore();
  const { addToCart } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true);
      await fetchWishlist();
      setIsLoading(false);
    };
    
    loadWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeItem(productId);
  };

  const handleMoveToCart = async (item: any) => {
    try {
      if (item.variants && item.variants.length > 0) {
        const variant = item.variants[0]; // Using first variant as default
        await addToCart({
          productId: item._id,
          variantSku: variant.sku,
          quantity: 1,
        });
        await removeItem(item._id);
        router.push("/cart-details");
      }
    } catch (error) {
      console.error("Failed to move item to cart:", error);
    }
  };

  const WishlistContent = () => {
    if (isLoading) {
      return <ChihiliLoader message="Loading your wishlist..." />;
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
          {error}
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Heart className="w-16 h-16 text-gray-300" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500">Start adding items you love!</p>
          <Link
            href="/"
            className="mt-4 px-6 py-2 bg-primary1 text-white rounded-md hover:bg-primary2 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <h1 className="text-2xl font-bold mb-8">
          My Wishlist ({items.length} items)
        </h1>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="p-3 border-b border-secondary1 border-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-3">
                {/* Product Image */}
                <div className="flex-shrink-0 w-24 h-30 sm:w-38 sm:h-50">
                  <Link href={`/product-details/${item.slug}`}>
                    <img
                      src={item.images[0] || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-fit bg-secondary"
                    />
                  </Link>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  {/* Name and Price Row */}
                  <div className="flex justify-between items-start mb-2 sm:mb-15">
                    <div className="flex flex-col gap-1">
                      <Link href={`/product-details/${item.slug}`}>
                        <h3 className="text-sm sm:text-xl font-light font-lato hover:text-primary1">
                          {item.name}
                        </h3>
                      </Link>

                      {item.variants && item.variants.length > 0 && (
                        <>
                          <span className="text-xs text-gray-600">
                            {item.variants[0].title}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            SKU: {item.variants[0].sku}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                    {item.variants && item.variants.length > 0 && (
                      <p className="text-sm sm:text-xl font-bold font-lato">
                        ₹{item.variants[0].price.toFixed(2)}
                      </p>
                    )}
                    {item.variants && item.variants.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          {item.variants[0].mrp > item.variants[0].price && (
                            <>
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                ₹{item.variants[0].mrp.toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex items-center gap-2 bg-primary1 rounded text-white py-2 px-4 hover:bg-primary2 transition-colors text-xs sm:text-sm font-lato"
                    >
                      <ShoppingCart size={16} />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="flex text-xs sm:text-sm items-center gap-1 sm:gap-2 py-1 sm:py-2 text-primary1 hover:text-red-700 transition-colors font-lato cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
};

export default WishlistPage;
