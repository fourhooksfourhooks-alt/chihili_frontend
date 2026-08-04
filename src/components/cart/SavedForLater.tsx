"use client"
import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useSaveForLaterItems, useSaveForLaterSummary, useCartLoading, useCartError, useCartActions } from "../../store/cartStore";

const SavedForLater = () => {
  const savedItems = useSaveForLaterItems();
  const summary = useSaveForLaterSummary();
  const loading = useCartLoading();
  const error = useCartError();
  const { fetchSaveForLater, moveToCart, removeFromSaveForLater, clearSaveForLater } = useCartActions();

  useEffect(() => {
    fetchSaveForLater();
  }, [fetchSaveForLater]);

  if(!savedItems || savedItems.length === 0) {
    return null; // Don't render the component if there are no saved items
  }

  const handleMoveToCart = async (productId: string, variantSku?: string) => {
    await moveToCart(productId, variantSku);
  };

  const handleRemoveFromSaveForLater = async (productId: string, variantSku?: string) => {
    await removeFromSaveForLater(productId, variantSku);
  };

  const handleClearSaveForLater = async () => {
    if (window.confirm('Are you sure you want to clear all saved for later items?')) {
      await clearSaveForLater();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8 sm:mb-12 fade-in-up">
        <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-10 font-crimson-pro">
          SAVED FOR LATER
        </h1>
        {summary && (
          <div className="text-sm text-gray-500">{summary.itemCount} item(s) saved</div>
        )}
        {loading && <div className="text-sm text-blue-500">Loading...</div>}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {savedItems.length > 0 && (
          <button
            onClick={handleClearSaveForLater}
            disabled={loading}
            className="mt-4 px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            Clear All Saved Items
          </button>
        )}
      </div>

      {/* Mobile horizontal scroll container */}
      <div className="md:hidden">
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex space-x-4">
            {savedItems.length === 0 && !loading ? (
              <div className="text-gray-400">No items saved for later.</div>
            ) : (
              savedItems.map((item, idx) => {
                const productId = typeof item.productId === "object" ? item.productId._id : item.productId;
                return (
                  <div
                    key={productId || idx}
                    className="flex-shrink-0 w-64 bg-white border border-secondary1 overflow-hidden group relative"
                  >
                    <img
                      src={typeof item.productId === "object" ? item.productId.images?.[0] : "/best1.jpg"}
                      alt={typeof item.productId === "object" ? item.productId.name : "Saved item"}
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4 bg-secondary">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-medium text-base sm:text-lg mb-2">
                            {typeof item.productId === "object" ? item.productId.name : item.productId}
                          </h3>
                          <p className="text-gray-800 text-sm sm:text-base">
                            ₹{item.priceAtAdd?.toLocaleString() || "-"}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <button 
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Add to cart"
                            onClick={() => handleMoveToCart(productId, item.variantSku)}
                          >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          </button>
                          <button
                            className="text-xs text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Remove from save for later"
                            disabled={loading}
                            onClick={() => handleRemoveFromSaveForLater(productId, item.variantSku)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Desktop grid layout */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
        {savedItems.length === 0 && !loading ? (
          <div className="text-gray-400">No items saved for later.</div>
        ) : (
          savedItems.map((item, idx) => {
            const productId = typeof item.productId === "object" ? item.productId._id : item.productId;
            return (
              <div
                key={productId || idx}
                className="bg-white border border-secondary1 overflow-hidden group relative"
              >
                <img
                  src={typeof item.productId === "object" ? item.productId.images?.[0] : "/best1.jpg"}
                  alt={typeof item.productId === "object" ? item.productId.name : "Saved item"}
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 bg-secondary">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        {typeof item.productId === "object" ? item.productId.name : item.productId}
                      </h3>
                      <p className="text-gray-800">
                        ₹{item.priceAtAdd?.toLocaleString() || "-"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button 
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Add to cart"
                        onClick={() => handleMoveToCart(productId, item.variantSku)}
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        className="text-xs text-red-600 hover:text-red-800 transition-colors"
                        aria-label="Remove from save for later"
                        disabled={loading}
                        onClick={() => handleRemoveFromSaveForLater(productId, item.variantSku)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavedForLater;