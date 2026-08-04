import React, { useEffect } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Wishlist() {
  const router = useRouter();
  const { items, loading, error, fetchWishlist, removeItem } = useWishlistStore();

  // Fetch wishlist when component mounts
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeItem(productId);
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
    }
  };

  const handleAddToCart = (productId: string, variantSku?: string) => {
    // This would integrate with cart store
    console.log('Add to cart:', productId, variantSku);
    // You can implement cart integration here
  };

  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const handleBrowseProducts = () => {
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Error: </span>
            {error}
          </div>
        </div>
      )}

      {/* Empty wishlist state */}
      {!items || items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items in wishlist
          </h3>
          <p className="text-gray-500 mb-6">Save your favorite items here</p>
          <button 
            onClick={handleBrowseProducts}
            className="px-6 py-2 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 cursor-pointer rounded">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {/* Wishlist Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>
          </div>

          {/* Wishlist Items List */}
          <div className="space-y-4 mb-8">
            {items.map((item) => {
              const defaultVariant = item.variants?.[0];
              const price = defaultVariant?.price || 0;
              const mrp = defaultVariant?.mrp || 0;
              const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden relative">
                        {item.images && item.images.length > 0 ? (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => handleViewProduct(item.slug)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Heart className="w-8 h-8" />
                          </div>
                        )}
                        

                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="mb-2 sm:mb-0">
                          <h3 
                            className="font-medium text-gray-900 cursor-pointer hover:text-primary1 transition-colors"
                            onClick={() => handleViewProduct(item.slug)}
                          >
                            {item.name}
                          </h3>
                          
                          {item.shortDescription && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2 max-w-md">
                              {item.shortDescription}
                            </p>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-semibold text-primary1">
                              ₹{price.toFixed(2)}
                            </span>
                            {mrp > price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{mrp.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-center justify-center sm:items-end gap-3">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleAddToCart(item._id, defaultVariant?.sku)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 rounded text-sm whitespace-nowrap"
                              disabled={loading}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleViewProduct(item.slug)}
                              className="px-4 py-2 border border-primary1 text-primary1 hover:bg-primary1 hover:text-white transition-colors duration-200 rounded text-sm whitespace-nowrap"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-start mt-3">
                        <button
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove from Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center mt-8">
            <button
              onClick={handleBrowseProducts}
              className="px-8 py-3 border border-primary1 text-primary1 hover:bg-primary1 hover:text-white transition-colors duration-200 rounded"
            >
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
}
