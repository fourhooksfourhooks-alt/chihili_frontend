"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Minus, Info, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCartItems,
  useCartLoading,
  useCartSummary,
  useCartError,
  useCartActions,
  useCartStore,
  // ...existing code...
} from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const ShoppingCart = () => {
  const router = useRouter();
  const { updateCartItem, removeFromCart, clearCart, fetchUserCarts, moveToSaveForLater } = useCartActions();
  const items = useCartItems();
  const summary = useCartSummary();
  const loading = useCartLoading();
  const error = useCartError();
  const user = useAuthStore((s) => s.user);

  const [couponCode, setCouponCode] = useState("");

  const handleUpdateQuantity = async (productId: string, variantSku: string, newQuantity: number) => {
    if (newQuantity > 0) {
      await updateCartItem(productId, variantSku, newQuantity);
    }
  };

  const handleRemoveItem = async (productId: string, variantSku: string) => {
    await removeFromCart(productId, variantSku);
  };

  const handleSaveForLater = async (productId: string, variantSku: string) => {
    await moveToSaveForLater(productId, variantSku);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const applyCoupon = () => {
    console.log("Applying coupon:", couponCode);
  };

  useEffect(() => {
    if (user?._id) {
      // Fetch user carts when component mounts
      fetchUserCarts(user._id, 1, 10);
      console.log('Fetching carts for user:', user._id);
    }
  }, [user?._id, fetchUserCarts]);

  // Get cart data for summary and calculate GST
  const subtotal = useMemo(() => summary?.subtotal ?? 0, [summary]);
  const shippingEstimate = 0.00;
  
  // Calculate GST based on government rules for each item
  const gstCalculation = useMemo(() => {
    let totalGST = 0;
    let subtotalBeforeGST = 0;
    let hasHighValueItems = false;
    
    items.forEach(item => {
      const itemPrice = item.priceAtAdd || 0;
      const itemTotal = itemPrice * item.quantity;
      
      if (itemTotal > 2500) {
        hasHighValueItems = true;
      }
      
      // Always use 5% GST rate (Option 2 for high-value items)
      const gstRate = 5;
      const priceBeforeGST = itemTotal / (1 + gstRate / 100);
      const gstAmount = itemTotal - priceBeforeGST;
      
      subtotalBeforeGST += priceBeforeGST;
      totalGST += gstAmount;
    });
    
    return {
      subtotalBeforeGST,
      totalGST,
      hasHighValueItems,
      effectiveGSTRate: 5
    };
  }, [items]);
  
  const taxEstimate = gstCalculation.totalGST;
  const cartTotal = useMemo(() => gstCalculation.subtotalBeforeGST + gstCalculation.totalGST, [gstCalculation]);
  
  const handleCheckout = () => {
    // Get cartId from the store's cart object
    const cart = useCartStore.getState().cart;
    const cartId = cart?._id;
    
    if (cartId) {
      console.log('Checkout with cart ID:', cartId);
      router.push(`/address?cartId=${cartId}`);
    } else {
      console.log('No cart ID available for checkout');
      router.push('/address');
    }
  };

  const handleContinueShopping = () => {
    router.push('/'); // Navigate back to shop/home page
  };

  // Empty cart state
  if (!loading && items.length === 0) {
    return (
      <div className="py-4 md:py-20">
        <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-6 font-crimson-pro">
              SHOPPING CART
            </h1>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Empty Cart Message */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-300 mb-6">
              <ShoppingBag className="w-24 h-24 sm:w-32 sm:h-32" />
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-gray-600 mb-4 font-crimson-pro tracking-wide">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-8 text-center max-w-md font-lato">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-primary1 hover:bg-primary2 text-white font-medium py-3 px-8 transition-colors cursor-pointer font-lato text-sm sm:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-20">
      <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-6 font-crimson-pro">
            SHOPPING CART
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              Clear Cart
            </button>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* Cart Items - Same layout but scaled down */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${(item.productId === null ? 'deleted' : typeof item.productId === 'string' ? item.productId : item.productId?._id) || index}-${item.variantSku || 'base'}`}
                  className="p-3 border-b border-secondary1 sm:border-0"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-3">
                    {/* Product Image - Smaller but same ratio */}
                    <div className="flex-shrink-0 w-24 h-30 sm:w-48 sm:h-60">
                      <img
                        src={(() => {
                          let imageSrc = "/best1.jpg";
                          if (item.productId && typeof item.productId !== 'string') {
                            if (Array.isArray(item.productId.images) && item.productId.images.length > 0) {
                              imageSrc = item.productId.images[0];
                              if (!/^https?:\/\//.test(imageSrc) && !imageSrc.startsWith('/')) {
                                imageSrc = `/products/${imageSrc}`;
                              }
                            }
                          }
                          return imageSrc;
                        })()}
                        alt={
                          (item.productId && typeof item.productId !== 'string' && item.productId?.name) ||
                          'Product Unavailable'
                        }
                        className="w-full h-full object-cover bg-secondary"
                        onError={e => { e.currentTarget.src = '/best1.jpg'; }}
                      />
                    </div>

                    {/* Product Details - Same layout but compact */}
                    <div className="flex-1">
                      {/* Name and Price Row */}
                      <div className="flex justify-between items-start mb-2 sm:mb-6">
                        <div className="flex-1 pr-2">
                          <h3 className="text-sm sm:text-xl font-light font-lato">
                            {item.productId === null ? (
                              <span className="text-red-500">Product No Longer Available</span>
                            ) : (
                              (typeof item.productId !== 'string' && item.productId?.name) || 'Unknown Product'
                            )}
                          </h3>
                          {(() => {
                            const itemPrice = item.priceAtAdd || 0;
                            const itemTotal = itemPrice * item.quantity;
                            const gstRate = 5; // Always 5% effective rate
                            const priceBeforeGST = itemTotal / (1 + gstRate / 100);
                            const gstAmount = itemTotal - priceBeforeGST;
                            
                            return (
                              <div className="text-xs text-gray-600 mt-1">
                                <div>Price: ₹{priceBeforeGST.toFixed(2)} + GST ₹{gstAmount.toFixed(2)}</div>
                                {itemTotal > 2500 && (
                                  <div className="text-blue-600">GST @ 5% (Split Method)</div>
                                )}
                                {itemTotal <= 2500 && (
                                  <div className="text-green-600">GST @ 5% (Standard)</div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-right">
                          <p className="text-sm sm:text-xl font-bold font-lato">
                            ₹{typeof item.priceAtAdd === 'number' ? item.priceAtAdd.toFixed(2) : '0.00'}
                          </p>
                          <p className="text-xs text-gray-500 font-lato">
                            per item (Inc. GST)
                          </p>
                        </div>
                      </div>

                      {/* Variant title if present */}
                      {typeof item.productId !== 'string' && item.variantSku && Array.isArray(item.productId?.variants) && (
                        (() => {
                          const v = (item.productId?.variants as any[]).find((x) => x?.sku === item.variantSku);
                          return v?.title ? (
                            <div className="text-xs text-gray-600 mb-2">{v.title}</div>
                          ) : null;
                        })()
                      )}

                      {/* Quantity Controls and Action Buttons Row */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Controls - Smaller but same layout */}
                        <div className="flex items-center overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(
                              typeof item.productId === 'string' ? item.productId : item.productId?._id || '',
                              item.variantSku || '',
                              item.quantity - 1
                            )}
                            className="p-1 sm:p-3 hover:bg-gray-100 border border-zinc-200 rounded-l-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1 || loading}
                          >
                            <Minus className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                          <span className="px-2 sm:px-6 py-1 sm:py-2 font-medium min-w-[1.5rem] sm:min-w-[3rem] border border-zinc-200 text-center bg-white font-lato text-xs sm:text-base">
                            {item.quantity.toString().padStart(2, "0")}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(
                              typeof item.productId === 'string' ? item.productId : item.productId?._id || '',
                              item.variantSku || '',
                              item.quantity + 1
                            )}
                            className="p-1 sm:p-3 hover:bg-gray-100 border border-zinc-200 rounded-r-sm transition-colors"
                            disabled={loading}
                          >
                            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Action Buttons - Same layout but smaller */}
                        <div className="flex flex-col">
                          {item.variantSku && (
                            <span className="text-[11px] text-gray-500">SKU: {item.variantSku}</span>
                          )}
                          <button
                            onClick={() => handleSaveForLater(
                              typeof item.productId === 'string' ? item.productId : item.productId?._id || '',
                              item.variantSku || ''
                            )}
                            disabled={loading}
                            className="flex text-xs sm:text-sm justify-end items-center gap-1 sm:gap-2 py-1 sm:py-2 text-slate-600 hover:text-slate-900 transition-colors font-lato cursor-pointer disabled:opacity-50"
                          >
                            Save for Later
                          </button>
                          <button
                            onClick={() => handleRemoveItem(
                              typeof item.productId === 'string' ? item.productId : item.productId?._id || '',
                              item.variantSku || ''
                            )}
                            disabled={loading}
                            className="flex text-xs sm:text-sm justify-end items-center gap-1 sm:gap-2 py-1 sm:py-2 text-primary1 hover:text-red-700 transition-colors font-lato cursor-pointer disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Summary - Same layout but scaled down */}
          <div className="lg:col-span-5 mt-4 lg:mt-0">
            <div className="bg-secondary p-3 top-8 border border-gray-100">
              <h2 className="text-md lg:text-xl items-center font-light tracking-[0.1rem] sm:tracking-[0.2rem] mb-3 sm:mb-6 text-start font-crimson-pro">
                PRICE DETAILS
              </h2>

              <div className="space-y-7 sm:space-y-4 mb-3 sm:mb-6">
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-secondary1">
                  <span className="text-sm sm:text-base text-gray-600 font-lato">Subtotal (Before GST)</span>
                  <span className="text-sm sm:text-base font-medium font-lato">
                    ₹{gstCalculation.subtotalBeforeGST.toFixed(2)}
                  </span>
                </div>

             
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-secondary1">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm sm:text-base text-gray-600 font-lato">
                        GST @ {gstCalculation.effectiveGSTRate}%
                      </span>
                      {gstCalculation.hasHighValueItems && (
                        <span className="text-xs text-blue-600 font-lato">(Split Method Applied)</span>
                      )}
                    </div>
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                  <span className="text-sm sm:text-base font-medium font-lato">
                    ₹{gstCalculation.totalGST.toFixed(2)}
                  </span>
                </div>

                {gstCalculation.hasHighValueItems && (
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-md border border-blue-200 -mx-1 sm:-mx-0">
                    <p className="text-xs font-medium text-blue-800 mb-1">GST Optimization Applied</p>
                    <p className="text-xs text-blue-700">
                      Items {`>`} ₹2,500: Split into fabric + stitching components @ 5% each (instead of 18%)
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-lg font-medium font-lato">
                    Order total (Inc. GST)
                  </span>
                  <span className="text-sm sm:text-xl font-semibold font-lato">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Coupon Code - Same layout but smaller */}
              {/* <div className="mb-3 sm:mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-2 sm:px-4 py-3 sm:py-3 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary1 focus:border-primary1 transition-all bg-white font-lato text-sm sm:text-base"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-3 sm:px-6 py-1 sm:py-3 bg-primary1 text-white hover:bg-primary1/90 transition-all duration-300 font-medium cursor-pointer font-lato text-xs sm:text-base"
                  >
                    Apply
                  </button>
                </div>
              </div> */}

              {/* Checkout Button - Same but smaller */}
              <button 
                onClick={handleCheckout} 
                className="w-full mt-6 bg-primary1 hover:bg-primary2 text-white font-medium py-3 px-6 transition-colors cursor-pointer"
                disabled={loading || items.length === 0}
              >
                {loading ? "Loading..." : "Check-out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;