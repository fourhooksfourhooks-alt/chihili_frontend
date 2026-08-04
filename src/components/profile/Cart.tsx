import React, { useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Heart } from "lucide-react";
import {
  useCartStore,
  useCartItems,
  useCartSummary,
  useCartLoading,
  useCartError,
  useCartActions,
} from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Cart() {
  const router = useRouter();
  const { fetchCart } = useCartStore();
  const cartItems = useCartItems();
  const summary = useCartSummary();
  const loading = useCartLoading();
  const error = useCartError();
  const { updateCartItem, removeFromCart, moveToSaveForLater } =
    useCartActions();

  // Fetch cart when component mounts
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (
    productId: string,
    variantSku: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) {
      await removeFromCart(productId, variantSku);
    } else {
      await updateCartItem(productId, variantSku, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string, variantSku: string) => {
    await removeFromCart(productId, variantSku);
  };

  const handleMoveToWishlist = async (
    productId: string,
    variantSku?: string
  ) => {
    await moveToSaveForLater(productId, variantSku);
  };

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary1"></div>
      </div>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-500 mb-6">Add some items to get started</p>
        <button
          onClick={handleContinueShopping}
          className="px-6 py-2 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 cursor-pointer rounded"
        >
          Continue Shopping
        </button>
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

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => {
          const product =
            typeof item.productId === "object" ? item.productId : null;
          const productId =
            typeof item.productId === "string"
              ? item.productId
              : product?._id || "";

          return (
            <div
              key={`${productId}-${item.variantSku}`}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                    {product?.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name || "Product"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-medium text-gray-900">
                        {product?.name || `Product ${productId}`}
                      </h3>
                      {item.variantSku && (
                        <p className="text-sm text-gray-500">
                          SKU: {item.variantSku}
                        </p>
                      )}
                      <p className="text-sm font-semibold text-primary1 mt-1">
                        ₹{item.priceAtAdd.toFixed(2)} / each
                      </p>
                    </div>

                    {/* Quantity Controls and Total */}
                    <div className="flex flex-col sm:items-end gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              productId,
                              item.variantSku || "",
                              item.quantity - 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={loading || item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              productId,
                              item.variantSku || "",
                              item.quantity + 1
                            )
                          }
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg font-semibold text-primary1 mt-1">
                          ₹{(item.priceAtAdd * item.quantity).toFixed(2)}
                        </p>
                        
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() =>
                        handleMoveToWishlist(productId, item.variantSku)
                      }
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary1 transition-colors"
                      disabled={loading}
                    >
                      <Heart className="w-4 h-4" />
                      Save for Later
                    </button>
                    <button
                      onClick={() =>
                        handleRemoveItem(productId, item.variantSku || "")
                      }
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {/* {summary && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Items ({summary.itemCount})</span>
              <span>₹{summary.subtotal.toFixed(2)}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{summary.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContinueShopping}
              className="flex-1 px-6 py-3 border border-primary1 text-primary1 hover:bg-primary1 hover:text-white transition-colors duration-200 rounded text-center"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 px-6 py-3 bg-primary1 text-white hover:bg-primary2 transition-colors duration-200 rounded text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}
