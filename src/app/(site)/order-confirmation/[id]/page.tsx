"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getOrderDetails, Order } from "@/api/order.api";
import ProtectedRoute from "@/components/RouteProtect";
import ChihiliLoader from "@/components/ChihiliLoader";

const orderConfirmation = () => {
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await getOrderDetails(orderId);
        if (response.success) {
          setOrder(response.data.order);
        } else {
          setError("Failed to fetch order details");
        }
      } catch (err) {
        setError("Error fetching order details");
        console.error("Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleShopMore = () => {
    router.push("/categoryPage");
  };

  if (loading) {
    return <ChihiliLoader message="Loading order details..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-4 mt-20 sm:mt-40 font-lato flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="text-primary1 hover:text-primary2 font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 pt-16 font-lato">
      <div className="max-w-[90rem] mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <p className="text-green-600 font-medium mb-2">
              {order.status === "SUCCESS" ? "Payment successful" : "Payment " + order.status.toLowerCase()}
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Thanks for ordering
            </h1>
            <p className="text-gray-600 text-sm max-w-xl">
              We appreciate your order, we're currently processing it. So hang
              tight and we'll send you confirmation very soon!
            </p>
          </div>
          <div className="lg:self-center">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 lg:text-right">
              Ordsder#{order.orderId}
            </h2>
          </div>
        </div>

        {/* Tracking Number */}
        <div className="mb-8 ">
          <p className="text-zinc-700 mb-2">Transaction ID</p>
          <p className="text-secondary2 font-medium text-lg">
            {order.transactionId || order._id}
          </p>
        </div>

        {/* Products and Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 border-b border-secondary1 pb-8">
          {/* Products Section */}
          <div className="lg:col-span-2 border-t border-secondary1 pt-4">
            <div className="space-y-6">
              {order.products.map((product) => (
                <div key={product._id} className="flex gap-4">
                  <div className=" flex items-center justify-center">
                    <img
                      src={product.productId.images[0] || "/best1.jpg"}
                      alt={product.productId.name}
                      className="w-20 h-25 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-md md:text-xl font-medium text-gray-900 mb-2">
                          {product.productId.name}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md">
                          {product.productId.description || "No description available"}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className=" text-md sm:text-xl font-semibold text-gray-900">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-10">
              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Shipping address
                </h3>
                <div className="text-gray-700 space-y-1">
                  <p>{order.address.name || "N/A"}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.postalCode || order.address.zipCode}</p>
                  <p>{order.address.country}</p>
                  {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="text-gray-700 space-y-2">
                  <p>{order.address.phone || "N/A"}</p>
                  <button className="text-secondary2 hover:text-primary1 cursor-pointer font-medium">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 bg-secondary p-6 ">
            <div className="space-y-6 ">
              <div className="flex justify-between border-b border-secondary1 pb-4  text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.amount}</span>
              </div>

              <div className="flex justify-between items-center border-b border-secondary1 pb-4">
                <div className="flex items-center gap-2  text-sm">
                  <span className="text-gray-600">Shipping charges</span>
                  <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center text-white text-xs">
                    ?
                  </div>
                </div>
                <span className="font-medium  text-sm">₹0.00</span>
              </div>

              <div className="flex justify-between border-b border-secondary1 pb-4 ">
                <span className="text-gray-600  text-sm">Total Discount</span>
                <span className="font-medium  text-sm">- ₹0.00</span>
              </div>

              <div className="flex  text-sm justify-between items-center border-b border-secondary1 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tax estimate</span>
                  <div className="w-4 h-4 bg-zinc-800 rounded-full flex items-center justify-center text-white text-xs">
                    ?
                  </div>
                </div>
                <span className="font-medium  text-sm">₹0.00</span>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Amount Paid</span>
                <span>₹{order.amount}</span>
              </div>
            </div>
            {/* Bottom Section - Address and Payment Info */}
            <div className="flex flex-col sm:flex-row gap-3  justify-between mt-10">
              {/* Billing Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Billing address
                </h3>
                <div className="text-gray-700 space-y-1">
                  <p>{order.address.name || "N/A"}</p>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.postalCode || order.address.zipCode}</p>
                  <p>{order.address.country}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Payment information
                </h3>
                <div className="flex gap-3">
                    <img
                    src="/visa.png"
                    alt="Payment Method"
                    className="h-9 w-auto object-contain"
                    />
                  <div className="text-gray-700">
                    <p>Transaction ID: {order.transactionId || "N/A"}</p>
                    <p className="text-sm">Currency: {order.currency}</p>
                    {order.paidAt && (
                      <p className="text-sm">Paid on: {new Date(order.paidAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Shop More Button */}
        <div className="flex justify-end mt-12">
          <button onClick={handleShopMore} className="inline-flex items-center gap-2 text-primary1 hover:text-primary2 font-medium cursor-pointer">
            Shop More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ProtectedOrderConfirmation = () => {
  return (
    <ProtectedRoute>
      {orderConfirmation()}
    </ProtectedRoute>
  );
};

export default ProtectedOrderConfirmation;
