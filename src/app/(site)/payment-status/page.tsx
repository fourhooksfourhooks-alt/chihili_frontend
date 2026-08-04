"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Package,
  Truck,
  ArrowRight,
  Home,
  RotateCcw,
} from "lucide-react";
import { Suspense } from "react";
import ProtectedRoute from "@/components/RouteProtect";
import ChihiliLoader from "@/components/ChihiliLoader";
import {
  usePaymentActions,
  usePaymentLoading,
  usePaymentError,
  usePaymentStatus,
} from "@/store/paymentStore";
import { PaymentStatusResponse } from "@/api/payment.api";

interface OrderDetails {
  orderId: string;
  transactionId: string;
  amount: number;
  items: number;
  paymentMode: string;
  paymentState: string;
  estimatedDelivery: string;
  paymentDate: string;
  accountHolderName?: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  const { checkPaymentStatus } = usePaymentActions();
  const loading = usePaymentLoading();
  const error = usePaymentError();
  const paymentStatus = usePaymentStatus();

  const orderId = searchParams.get("orderId") || "";
 
  useEffect(() => {
    if (!orderId) {
      console.log("No orderId found in URL params"); // Debug log
      setOrderDetails({
        orderId: "ORDER_NOT_FOUND",
        transactionId: "",
        amount: 0,
        items: 0,
        paymentMode: "",
        paymentState: "FAILED",
        estimatedDelivery: "15-20 business days",
        paymentDate: new Date().toISOString(),
      });
      return;
    }

    console.log("Fetching payment status for orderId:", orderId); // Debug log

    // Fetch payment status
    const fetchPaymentStatus = async () => {
      try {
        const result = await checkPaymentStatus(orderId);
        console.log("Payment status result:", result); // Debug log
      } catch (err) {
        console.error("Error fetching payment status:", err); // Debug log
      }
    };

    fetchPaymentStatus();
  }, [orderId, checkPaymentStatus]);

  // Process payment status data when it's available
  useEffect(() => {
    if (paymentStatus) {
      // Based on the actual API response structure
      const status = paymentStatus.status; // This is now a string like "COMPLETED"
      const orderData = paymentStatus.data; // Contains orderId, state, amount, etc.
      const paymentData = paymentStatus.payment; // Contains payment details
      const paymentDetails = orderData?.paymentDetails?.[0] || null;

      console.log("status:", status);
      console.log("orderData:", orderData);
      console.log("paymentData:", paymentData);
      console.log("paymentDetails:", paymentDetails);

      // Map the correct data structure
      const orderIdFromData =
        paymentData?.orderId || orderData?.orderId || orderId || "";
      const transactionId =
        paymentData?.transactionId || paymentDetails?.transactionId || "";
      const amount = paymentData?.amount || orderData?.amount || 0;
      const items = paymentData?.products?.length || 0;
      const paymentMode = paymentDetails?.paymentMode || "Online Payment";
      const paymentState = status || orderData?.state || paymentData?.status || "UNKNOWN";
      const paymentDate =
        paymentData?.paidAt ||
        paymentData?.createdAt ||
        paymentData?.updatedAt ||
        new Date().toISOString();
      const accountHolderName =
        paymentDetails?.splitInstruments?.[0]?.instrument?.accountHolderName;

      setOrderDetails({
        orderId: orderIdFromData,
        transactionId,
        amount,
        items,
        paymentMode,
        paymentState,
        estimatedDelivery: "15-20 business days",
        paymentDate,
        accountHolderName,
      });
    } else if (error) {
      // If we have an error
      console.log("Payment status indicates error:", error); // Debug log
      setOrderDetails({
        orderId: orderId,
        transactionId: "",
        amount: 0,
        items: 0,
        paymentMode: "",
        paymentState: "FAILED",
        estimatedDelivery: "15-20 business days",
        paymentDate: new Date().toISOString(),
      });
    }
  }, [paymentStatus, orderId, error]);

  const isSuccess = () => {
    if (!paymentStatus) return false;

    const status = paymentStatus.status; // This is now a string
    const orderData = paymentStatus.data;
    const paymentData = paymentStatus.payment;

    return (
      status === "COMPLETED" ||
      orderData?.state === "COMPLETED" ||
      status === "SUCCESS" ||
      orderData?.state === "SUCCESS" ||
      paymentData?.status === "COMPLETED" ||
      paymentData?.status === "SUCCESS"
    );
  };

  const success = isSuccess();

  const handleContinueShopping = () => router.push("/");
  const handleViewOrders = () => router.push("/orderConfirmation");
  const handleRetryPayment = () => router.push("/payment");

  // Auto-redirect to order confirmation page when payment is successful
  useEffect(() => {
    if (success && orderDetails?.orderId && orderDetails.orderId !== "ORDER_NOT_FOUND") {
      setRedirectCountdown(3);
      
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval);
            router.push(`/order-confirmation/${orderDetails.orderId}`);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [success, orderDetails?.orderId, router]);

  if (loading) {
    return <ChihiliLoader message="Checking payment status..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-lato">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary1 text-white py-2 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails && !loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center font-lato">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600 mb-6">
            Unable to load payment information. Please check the URL or try
            again.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Order ID: {orderId || "Not provided"}
            </p>
            <p className="text-sm text-gray-500">
              Payment Status: {paymentStatus ? "Loaded" : "Not loaded"}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-4 bg-primary1 text-white py-2 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 font-lato">
      <div className="max-w-4xl mx-auto">
        {/* Professional Bill Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {/* Company Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">CHIHILI</h1>
                <p className="text-gray-200 text-sm">Premium Fashion & Custom Tailoring</p>
                <p className="text-gray-300 text-xs mt-1">support@chihili.com | +91-XXX-XXX-XXXX</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  success 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {success ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  {success ? "PAID" : "FAILED"}
                </div>
              </div>
            </div>
          </div>

          {/* Bill Details Header */}
          <div className="px-6 py-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  {success ? "INVOICE" : "PAYMENT RECEIPT"}
                </h2>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium text-gray-600">Invoice #:</span> {orderDetails?.orderId || "N/A"}</p>
                  <p><span className="font-medium text-gray-600">Date:</span> {orderDetails?.paymentDate
                    ? new Date(orderDetails.paymentDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })
                    : "N/A"}</p>
                  <p><span className="font-medium text-gray-600">Transaction ID:</span> {orderDetails?.transactionId || "N/A"}</p>
                </div>
              </div>
              <div className="md:text-right">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">BILL TO</h3>
                <div className="text-sm text-gray-600">
                  {orderDetails?.accountHolderName && (
                    <p className="font-medium">{orderDetails.accountHolderName}</p>
                  )}
                  <p>Customer Account</p>
                  <p>Payment Method: {orderDetails?.paymentMode || "Online Payment"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Items Section */}
          <div className="px-6 py-6">
            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Product Details</th>
                      <th className="text-center py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Qty</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">GST</th>
                      <th className="text-right py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Check if we have actual order/cart items from paymentStatus
                      const orderData = paymentStatus?.data;
                      const paymentData = paymentStatus?.payment;
                      
                      // Ensure actualItems is always an array
                      let actualItems: any[] = [];
                      if (Array.isArray(paymentData?.products)) {
                        actualItems = paymentData.products;
                      } else if (Array.isArray((orderData as any)?.items)) {
                        actualItems = (orderData as any).items;
                      } else {
                        actualItems = [];
                      }
                      
                      if (Array.isArray(actualItems) && actualItems.length > 0) {
                        // Display actual purchased items
                        return actualItems.map((item: any, index: number) => {
                          const itemPrice = item.priceAtAdd || item.price || item.amount || 0;
                          const quantity = item.quantity || 1;
                          const itemTotal = itemPrice * quantity;
                          
                          // Calculate GST for each item
                          const gstRate = itemTotal <= 2500 ? 5 : 5; // Always 5% (Option 2 for >2500)
                          const priceBeforeGST = itemTotal / (1 + gstRate / 100);
                          const gstAmount = itemTotal - priceBeforeGST;
                          
                          // Get product details
                          const productName = item.productName || item.name || item.productId?.name || 'Custom Fashion Item';
                          const variant = item.variant || item.variantTitle || '';
                          const sku = item.sku || item.variantSku || '';
                          
                          return (
                            <tr key={`${item._id || item.productId || index}`} className="border-b border-gray-100">
                              <td className="py-4">
                                <div className="flex items-start space-x-3">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={productName}
                                      className="w-12 h-12 object-cover rounded border"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{productName}</p>
                                    {variant && <p className="text-xs text-gray-600">{variant}</p>}
                                    {sku && <p className="text-xs text-gray-500">SKU: {sku}</p>}
                                    <p className="text-xs text-blue-600 mt-1">
                                      {itemTotal <= 2500 ? 'GST @ 5%' : 'GST @ 5% (Split Method)'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 text-center text-gray-900">{quantity}</td>
                              <td className="py-4 text-right font-medium text-gray-900">₹{priceBeforeGST.toFixed(2)}</td>
                              <td className="py-4 text-right text-gray-700">₹{gstAmount.toFixed(2)}</td>
                              <td className="py-4 text-right font-medium text-gray-900">₹{itemTotal.toFixed(2)}</td>
                            </tr>
                          );
                        });
                      } else {
                        // Fallback: Display order summary when individual items are not available
                        const totalAmount = orderDetails?.amount || 0;
                        const gstRate = 5; // Always 5% effective rate
                        const subtotalBeforeGST = totalAmount / (1 + gstRate / 100);
                        const gstAmount = totalAmount - subtotalBeforeGST;
                        
                        return (
                          <tr className="border-b border-gray-100">
                            <td className="py-4">
                              <div>
                                <p className="font-medium text-gray-900">Custom Fashion Order</p>
                                <p className="text-sm text-gray-600">Premium tailored garments and accessories</p>
                                <p className="text-xs text-gray-500 mt-1">Order ID: {orderDetails?.orderId}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                  {totalAmount <= 2500 ? 'GST @ 5%' : 'GST @ 5% (Split Method)'}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 text-center text-gray-900">{orderDetails?.items || 1}</td>
                            <td className="py-4 text-right font-medium text-gray-900">₹{subtotalBeforeGST.toFixed(2)}</td>
                            <td className="py-4 text-right text-gray-700">₹{gstAmount.toFixed(2)}</td>
                            <td className="py-4 text-right font-medium text-gray-900">₹{totalAmount.toFixed(2)}</td>
                          </tr>
                        );
                      }
                    })()}
                  </tbody>
                </table>
              </div>
             
            </div>

            {/* Bill Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Payment Summary</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  success 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {success ? "COMPLETED" : orderDetails?.paymentState || "FAILED"}
                </div>
              </div>
              
              <div className="space-y-3">
                {(() => {
                  // Get actual items for detailed calculation
                  const orderData = paymentStatus?.data;
                  const paymentData = paymentStatus?.payment;
                  
                  // Ensure actualItems is always an array
                  let actualItems: any[] = [];
                  if (Array.isArray(paymentData?.products)) {
                    actualItems = paymentData.products;
                  } else if (Array.isArray((orderData as any)?.items)) {
                    actualItems = (orderData as any).items;
                  } else {
                    actualItems = [];
                  }
                  
                  let totalSubtotalBeforeGST = 0;
                  let totalGSTAmount = 0;
                  let totalAmount = orderDetails?.amount || 0;
                  let hasHighValueItems = false;
                  
                  if (Array.isArray(actualItems) && actualItems.length > 0) {
                    // Calculate from actual items
                    actualItems.forEach((item: any) => {
                      const itemPrice = item.priceAtAdd || item.price || item.amount || 0;
                      const quantity = item.quantity || 1;
                      const itemTotal = itemPrice * quantity;
                      
                      if (itemTotal > 2500) hasHighValueItems = true;
                      
                      const gstRate = 5; // Always 5% (Option 2 for >2500)
                      const priceBeforeGST = itemTotal / (1 + gstRate / 100);
                      const gstAmount = itemTotal - priceBeforeGST;
                      
                      totalSubtotalBeforeGST += priceBeforeGST;
                      totalGSTAmount += gstAmount;
                    });
                  } else {
                    // Fallback to total amount calculation
                    if (totalAmount > 2500) hasHighValueItems = true;
                    const gstRate = 5;
                    totalSubtotalBeforeGST = totalAmount / (1 + gstRate / 100);
                    totalGSTAmount = totalAmount - totalSubtotalBeforeGST;
                  }
                  
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal (Before GST):</span>
                        <span className="text-gray-900">₹{totalSubtotalBeforeGST.toFixed(2)}</span>
                      </div>
                      
                      {hasHighValueItems && (
                        <div className="bg-blue-50 p-3 rounded-md mb-3">
                          <p className="text-xs text-blue-800 font-medium mb-2">GST Calculation Method:</p>
                          <div className="text-xs text-blue-700">
                            <p>• Products {`>`} ₹2,500: Split into Fabric + Stitching components</p>
                            <p>• Each component taxed at 5% (Instead of 18%)</p>
                            <p>• <strong>Customer Benefit:</strong> Effective 5% GST rate</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-600">Total GST @ 5%:</span>
                          {hasHighValueItems ? (
                            <span className="text-xs text-gray-500">(Split Method Applied)</span>
                          ) : (
                            <span className="text-xs text-gray-500">(Standard Rate)</span>
                          )}
                        </div>
                        <span className="text-gray-900">₹{totalGSTAmount.toFixed(2)}</span>
                      </div>
                      
                      {actualItems.length > 0 && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Items in order:</span>
                          <span>{actualItems.length} product(s)</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900">Total Paid (Inc. GST):</span>
                          <span className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Payment Details */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="ml-2 text-gray-900">{orderDetails?.paymentMode || "Online Payment"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Transaction Date:</span>
                    <span className="ml-2 text-gray-900">
                      {orderDetails?.paymentDate
                        ? new Date(orderDetails.paymentDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success State - Order Status & Timeline */}
            {success && (
              <div className="mb-6 p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
                    <p className="text-sm text-green-700">Your order has been confirmed and is being processed.</p>
                  </div>
                </div>

                {redirectCountdown && (
                  <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Redirecting to order details in <span className="font-bold">{redirectCountdown}</span> seconds...
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="font-medium text-gray-800 mb-3">Order Progress</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Order Placed</span>
                    </div>
                    <div className="hidden sm:block flex-1 border-t border-gray-300"></div>
                    <div className="flex items-center text-gray-400">
                      <Package className="w-4 h-4 mr-2" />
                      <span>Processing</span>
                    </div>
                    <div className="hidden sm:block flex-1 border-t border-gray-300"></div>
                    <div className="flex items-center text-gray-400">
                      <Truck className="w-4 h-4 mr-2" />
                      <span>Shipped</span>
                    </div>
                    <div className="hidden sm:block flex-1 border-t border-gray-300"></div>
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Delivered</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Estimated delivery: {orderDetails?.estimatedDelivery || "15-20 business days"}
                  </p>
                </div>
              </div>
            )}

            {/* Failed State - Error Information */}
            {!success && (
              <div className="mb-6 p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center mb-4">
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Payment Failed</h3>
                    <p className="text-sm text-red-700">We encountered an issue processing your payment.</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-red-800 mb-2">What happened?</h4>
                  <ul className="text-red-600 text-sm space-y-1">
                    <li>• Your payment could not be processed successfully</li>
                    <li>• No amount has been charged to your account</li>
                    <li>• Please verify your payment details and try again</li>
                  </ul>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Need help?</strong> If you continue facing issues, please contact our support team with 
                    Transaction ID: <code className="bg-gray-100 px-1 rounded">{orderDetails?.transactionId || "N/A"}</code>
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {success ? (
                <>
                  <button
                    onClick={handleViewOrders}
                    className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    View Order Details
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 border-2 border-gray-800 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Home className="w-4 h-4" />
                    Continue Shopping
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="flex-1 border-2 border-gray-800 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Home className="w-4 h-4" />
                    Back to Home
                  </button>
                </>
              )}
            </div>

            {/* Bill Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                <div className="mb-2 sm:mb-0">
                  <p className="font-medium">Thank you for choosing CHIHILI!</p>
                  <p className="text-xs">Premium Fashion & Custom Tailoring</p>
                </div>
                <div className="text-xs">
                  <p>Questions? Contact us at:</p>
                  <button
                    onClick={() => router.push("/customer-support")}
                    className="text-gray-800 hover:underline font-medium"
                  >
                    support@chihili.com
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Professional Bill Notice */}
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>📄 This is a computer-generated invoice</span>
            <span>•</span>
            <span>🔒 Secure payment processed</span>
            <span>•</span>
            <span>📧 Email receipt sent</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<ChihiliLoader message="Loading order details..." />}>
        <OrderSuccessContent />
      </Suspense>
    </ProtectedRoute>
  );
}
