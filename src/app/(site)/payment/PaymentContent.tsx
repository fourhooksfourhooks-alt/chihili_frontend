"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  X,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import {
  usePaymentStore,
  usePaymentLoading,
  usePaymentError,
  usePaymentActions,
} from "@/store/paymentStore";
import { getAddressById } from "@/api/address.api";
import { getCartById } from "@/api/cart.api";
import type { Address } from "@/api/address.api";
import type { Cart } from "@/api/cart.api";

export const PaymentContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get addressId and cartId from URL parameters
  const addressId = searchParams.get("addressId");
  const cartId = searchParams.get("cartId");

  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  // Additional state for cart details
  const [cartSummary, setCartSummary] = useState<{
    itemCount: number;
    subtotal: number;
    discount: number;
    total: number;
    items: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Additional state for cart details that might not be in the type
  const [shippingCharge, setShippingCharge] = useState<number>(0);

  const paymentLoading = usePaymentLoading();
  const paymentError = usePaymentError();
  const { initiatePayment } = usePaymentActions();

  // Fetch address and cart data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch address data
        if (addressId) {
          try {
            const addressResponse = await getAddressById(addressId);
            if (addressResponse.success) {
              setAddress(addressResponse.data.address);
            } else {
              throw new Error(
                addressResponse.message || "Failed to fetch address"
              );
            }
          } catch (addressError: any) {
            console.error("Address fetch error:", addressError);
            setError(`Address error: ${addressError.message}`);
          }
        }

        // Fetch cart data
        if (cartId) {
          try {
            // Add cache busting parameter to avoid 304 Not Modified
            const timestamp = new Date().getTime();
            // Use a clean URL structure for the API call
            const cleanCartId = cartId.split("?")[0]; // Remove any existing query params
            const response = await getCartById(`${cleanCartId}?_=${timestamp}`);

            console.log("Cart API Response:", response); // Debug log

            // The API should return the success response with cart data
            if (response.success && response.data) {
              const cartData = response.data.cart;
              const summaryData = response.data.summary;

              if (cartData) {
                setCart(cartData);

                // Set cart summary
                if (summaryData) {
                  setCartSummary(summaryData);
                  console.log("Cart Summary:", summaryData); // Debug log
                } else {
                  // If summary is not provided, create one from cart data
                  const cartItems = cartData.items || [];
                  const calculatedSummary = {
                    itemCount: cartItems.length,
                    subtotal: cartItems.reduce(
                      (sum: number, item: any) =>
                        sum + item.priceAtAdd * item.quantity,
                      0
                    ),
                    discount: 0,
                    total: cartItems.reduce(
                      (sum: number, item: any) =>
                        sum + item.priceAtAdd * item.quantity,
                      0
                    ),
                    items: cartItems.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0
                    ),
                  };
                  setCartSummary(calculatedSummary);
                  console.log("Calculated Summary:", calculatedSummary); // Debug log
                }

                // Set shipping charge - free over 1000
                const subtotal = summaryData?.subtotal || 0;
                setShippingCharge(subtotal > 1000 ? 0 : 50);
              } else {
                console.error("No cart data in response:", response); // Debug log
                throw new Error("Cart data not found in response");
              }
            } else {
              console.error("Invalid response:", response); // Debug log
              throw new Error(
                response.message || "Invalid response from server"
              );
            }
          } catch (cartError: any) {
            console.error("Cart fetch error:", cartError); // Debug log
            setError(
              `Cart error: ${cartError.message || "Failed to fetch cart data"}`
            );
          }
        }

        setLoading(false);
      } catch (err: any) {
        console.error("General fetch error:", err);
        setError(err.message || "Failed to load data");
        setLoading(false);
      }
    };

    if (addressId || cartId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [addressId, cartId]);

  // Redirect if addressId is missing
  useEffect(() => {
    if (!addressId && !loading) {
      router.push("/address");
    }
  }, [addressId, router, loading]);

  const handlePayment = () => {
    if (!addressId) {
      alert("Please select a delivery address first");
      router.push("/address");
      return;
    }

    if (!cartId) {
      alert("No cart found. Please add items to your cart first.");
      router.push("/");
      return;
    }

    // Process payment directly with success status
    processPayment(true);
  };

  const processPayment = async (isSuccess: boolean) => {
    if (!isSuccess) {
      // For failed demo, just simulate
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);

        const orderParams = new URLSearchParams({
          status: "failed",
          orderId: `ORD${Date.now()}`,
          amount: cartSummary?.total.toString() || "0",
          ...(addressId ? { addressId } : {}),
          ...(cartId ? { cartId } : {}),
        });

        router.push(`/order-success?${orderParams.toString()}`);
      }, 2000);
      return;
    }

    // For success, actually call the API
    setIsProcessing(true);

    try {
      // Call the payment API
      const paymentUrl = await initiatePayment({
        cartId: cartId!,
        addressId: addressId!,
      });

      setIsProcessing(false);

      if (paymentUrl) {
        // Redirect to the payment gateway
        const link = document.createElement("a");
        link.href = paymentUrl;
        link.target = "_self";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        throw new Error("Failed to get payment URL");
      }
    } catch (err: any) {
      setIsProcessing(false);
      alert(err.message || "Payment initiation failed");
    }
  };

  return (
    <div className="min-h-screen py-4 mt-20 sm:mt-40 font-lato">
      <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-xl sm:text-3xl text-center font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2  mb-10 font-crimson-pro">
          PAYMENT METHODS
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Cart Summary */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <div className="bg-secondary border border-secondary1 p-6">
              <h2 className="text-md lg:text-xl items-center font-light tracking-[0.1rem] sm:tracking-[0.2rem] mb-3 sm:mb-6 text-start font-crimson-pro">
                CART SUMMARY
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-primary1 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : cart && cartSummary ? (
                (() => {
                  // Calculate GST based on government rules for each cart item
                  let totalGST = 0;
                  let subtotalBeforeGST = 0;
                  let hasHighValueItems = false;
                  
                  if (cart.items && cart.items.length > 0) {
                    cart.items.forEach((item: any) => {
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
                  } else {
                    // Fallback calculation
                    const gstRate = 5;
                    subtotalBeforeGST = cartSummary.subtotal / (1 + gstRate / 100);
                    totalGST = cartSummary.subtotal - subtotalBeforeGST;
                  }
                  
                  const finalTotal = subtotalBeforeGST + totalGST + shippingCharge - cartSummary.discount;
                  
                  return (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-secondary1 pb-3">
                        <span className="text-zinc-800">Subtotal (Before GST)</span>
                        <span className="font-medium">
                          ₹{subtotalBeforeGST.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b border-secondary1 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-800">Shipping charges</span>
                          <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center text-white text-xs">
                            ?
                          </div>
                        </div>
                        <span className="font-medium">
                          ₹{shippingCharge.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-secondary1 pb-3">
                        <span className="text-zinc-800">Total Discount</span>
                        <span className="font-medium text-green-600">
                          - ₹{cartSummary.discount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center border-b border-secondary1 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span className="text-zinc-800">GST @ 5%</span>
                            {hasHighValueItems && (
                              <span className="text-xs text-blue-600">(Split Method Applied)</span>
                            )}
                          </div>
                          <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center text-white text-xs">
                            ?
                          </div>
                        </div>
                        <span className="font-medium">
                          ₹{totalGST.toFixed(2)}
                        </span>
                      </div>

                      {hasHighValueItems && (
                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200 -mx-2 sm:-mx-0">
                          <p className="text-xs font-medium text-blue-800 mb-1">GST Optimization Applied</p>
                          <p className="text-xs text-blue-700">
                            Items {`>`} ₹2,500: Split into fabric + stitching @ 5% each (instead of 18%)
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between text-lg font-medium">
                        <span>Total Payable (Inc. GST)</span>
                        <span>
                          ₹{finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-4">
                  <p>No cart information available</p>
                </div>
              )}
            </div>

            {/* Product Summary */}
            <div className="bg-white p-6 border border-secondary1">
              <h2 className="text-md lg:text-xl items-center font-light tracking-[0.1rem] sm:tracking-[0.2rem] mb-3 sm:mb-6 text-start font-crimson-pro">
                PRODUCT SUMMARY
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-primary1 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : cart && cart.items && cart.items.length > 0 ? (
                <div className="space-y-4">
                  {cart.items.map((item, index) => {
                    // Handle the nested structure where productId can be an object
                    const product =
                      typeof item.productId !== "string"
                        ? item.productId
                        : null;
                    const variant =
                      product?.variants?.find(
                        (v: any) => v.sku === item.variantSku
                      ) || null;
                    const productId =
                      typeof item.productId !== "string"
                        ? item.productId._id
                        : item.productId;

                    return (
                      <div
                        key={`${productId}-${item.variantSku || ""}-${index}`}
                        className="flex gap-4"
                      >
                        <div className="flex items-center justify-center">
                          <img
                            src={
                              product?.images && product.images.length > 0
                                ? product.images[0]
                                : variant?.images && variant.images.length > 0
                                ? variant.images[0]
                                : "/best1.jpg"
                            }
                            alt={product?.name || "Product"}
                            className="w-20 h-25 object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">
                            {product?.name || "Product"}
                            {variant && variant.title && ` (${variant.title})`}
                          </h3>
                          <p className="text-sm mt-1">
                            Quantity: {item.quantity}
                          </p>
                          {variant && variant.attributes && (
                            <p className="text-sm text-gray-600">
                              {variant.attributes.size &&
                                `Size: ${variant.attributes.size}`}
                              {variant.attributes.color &&
                                variant.attributes.size &&
                                " • "}
                              {variant.attributes.color &&
                                `Color: ${variant.attributes.color}`}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {(() => {
                            const itemTotal = item.priceAtAdd * item.quantity;
                            const gstRate = 5;
                            const priceBeforeGST = itemTotal / (1 + gstRate / 100);
                            const gstAmount = itemTotal - priceBeforeGST;
                            
                            return (
                              <>
                                <span className="font-semibold text-lg">
                                  ₹{item.priceAtAdd.toFixed(2)}
                                </span>
                                <div className="text-xs text-gray-600 mt-1">
                                  <div>Price: ₹{(priceBeforeGST / item.quantity).toFixed(2)}</div>
                                  <div>+ GST: ₹{(gstAmount / item.quantity).toFixed(2)}</div>
                                  {itemTotal > 2500 && (
                                    <div className="text-blue-600">5% GST (Split)</div>
                                  )}
                                  {itemTotal <= 2500 && (
                                    <div className="text-green-600">5% GST</div>
                                  )}
                                </div>
                                {variant &&
                                  variant.mrp &&
                                  variant.mrp > item.priceAtAdd && (
                                    <p className="text-sm line-through text-gray-500">
                                      ₹{variant.mrp.toFixed(2)}
                                    </p>
                                  )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No products in cart</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Address Information and Payment Button */}
          <div className="space-y-6">
            <div className="p-6 border border-secondary1 bg-white">
              <h2 className="text-md lg:text-xl items-center font-light tracking-[0.1rem] sm:tracking-[0.2rem] mb-6 text-start font-crimson-pro">
                DELIVERY ADDRESS
              </h2>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 text-primary1 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : address ? (
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.street},{" "}
                        {address.landmark && `${address.landmark}, `}
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Phone: {address.phone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary p-3 text-sm my-4 rounded">
                    <p className="flex items-center text-secondary2">
                      <Package className="w-4 h-4 mr-2" />
                      Delivery expected in 3-5 business days
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 mb-6">
                  <p>No address selected. Please select a delivery address.</p>
                  <button
                    onClick={() => router.push("/address")}
                    className="mt-4 px-4 py-2 bg-primary1 text-white rounded-md"
                  >
                    Add Address
                  </button>
                </div>
              )}

              {/* <div className="bg-secondary border border-secondary1 p-4 mb-6">
                <p className="text-md">
                  Your order is eligible for{" "}
                  <span className="font-semibold text-secondary2">
                    Cash on Delivery
                  </span>
                </p>
              </div> */}

              <button
                onClick={handlePayment}
                disabled={paymentLoading || isProcessing || !address || !cart}
                className="w-full mt-4 bg-primary1 hover:bg-primary2 text-white font-medium py-3 px-6 transition-colors cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {paymentLoading || isProcessing ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </div>
                ) : (
                  "Proceed to Pay"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* GST Information Section */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              GST Information & Tax Optimization
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-blue-800">
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <h4 className="font-semibold mb-1 sm:mb-2">Government GST Rules:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Garments ≤ ₹2,500: <strong>5% GST</strong></li>
                  <li>• Garments {`>`} ₹2,500: <strong>5% GST</strong> (Split Method)</li>
                </ul>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-3">
                <h4 className="font-semibold mb-1 sm:mb-2">CHIHILI Advantage:</h4>
                <p className="text-xs">
                  We apply the <strong>Split Method</strong> (fabric + stitching) to give you 
                  <strong> 5% GST instead of 18%</strong> on high-value items.
                </p>
              </div>
            </div>

            {(() => {
              const hasHighValueItems = cart.items.some((item: any) => 
                (item.priceAtAdd * item.quantity) > 2500
              );
              
              if (hasHighValueItems) {
                return (
                  <div className="mt-3 bg-green-50 border-l-4 border-green-400 p-2 sm:p-3 rounded">
                    <p className="text-xs text-green-800">
                      <strong>Tax Savings Applied!</strong> Your order contains items {`>`} ₹2,500. 
                      We've applied the split method to minimize your GST burden.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> All prices shown include GST. Final invoice will show detailed GST breakdown as per government regulations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
