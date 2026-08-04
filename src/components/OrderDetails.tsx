"use client";

import ProductCarousel from "@/components/PeopleBought";
import React, { useEffect, useState } from "react";
import { getOrderDetails, Order } from "@/api/order.api";
import { trackShipment, Shipment } from "@/api/shipment.api";
import { useRouter } from "next/navigation";

interface OrderDetailsProps {
  orderId: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [shipmentLoading, setShipmentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipmentError, setShipmentError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrderDetails(orderId);
        setOrder(response.data.order);

        // If order is successful, try to fetch shipment details
        if (response.data.order.status === 'COMPLETED' || response.data.order.status === 'SUCCESS') {
          fetchShipmentDetails(orderId);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchShipmentDetails = async (orderIdParam: string) => {
    try {
      setShipmentLoading(true);
      setShipmentError(null);

      const response = await trackShipment(orderIdParam);
      setShipment(response.data.tracking);
    } catch (err: any) {
      setShipmentError(err.response?.data?.message || "Failed to fetch shipment details");
    } finally {
      setShipmentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "PENDING":
        return 25;
      case "SUCCESS":
      case "COMPLETED":
        return 100;
      case "FAILED":
        return 0;
      case "CANCELLED":
        return 0;
      default:
        return 0;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Processing your order";
      case "SUCCESS":
      case "COMPLETED":
        return "Payment confirmed, order completed";
      case "FAILED":
        return "Payment failed";
      case "CANCELLED":
        return "Order cancelled";
      default:
        return "Unknown status";
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getShipmentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600";
      case "out for delivery":
        return "text-blue-600";
      case "in transit":
        return "text-yellow-600";
      case "manifested":
        return "text-purple-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-xl">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-secondary min-h-screen flex items-center justify-center">
        <div className="text-xl">Order not found</div>
      </div>
    );
  }
  return (
    <div className="bg-secondary">
      <div className="px-4 sm:px-6 md:px-24 pt-16">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Back
        </button>
      </div>
      <div className="px-4 sm:px-6 py-4 sm:py-8 md:px-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-gray-900 mb-2">
              ORDER #{order.orderId}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Order placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base self-start sm:self-auto">
            View invoice →
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Product Details */}
          <div className="md:col-span-2 lg:col-span-1">
            {order.products.map((product, index) => (
              <div key={product._id} className={`flex gap-4 ${index > 0 ? 'mt-6' : ''}`}>
                <div className="w-20 h-24 sm:w-24 sm:h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.productId.images?.[0] || "/best1.jpg"}
                    alt={product.productId.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/best1.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.productId.name}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-gray-900 mb-3">
                    ₹{product.price.toFixed(2)} x {product.quantity}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {product.productId.description || "No description available"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Delivery address
            </h4>
            <div className="space-y-1 text-gray-700 text-sm sm:text-base">
              <p>{order.address?.name || "N/A"}</p>
              <p>{order.address?.street || "N/A"}</p>
              <p>
                {order.address?.city || "N/A"}, {order.address?.state || "N/A"} {order.address?.postalCode || order.address?.zipCode || "N/A"}
              </p>
              <p>{order.address?.country || "N/A"}</p>
            </div>
          </div>

          {/* Payment Status */}
          <div className="lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Payment Status
            </h4>
            <div className="space-y-2 text-gray-700">
              <p className={`font-medium text-sm sm:text-base ${
                order.status === 'SUCCESS' || order.status === 'COMPLETED'
                  ? 'text-green-600'
                  : order.status === 'FAILED'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {order.status}
              </p>
              {order.paidAt && (
                <p className="text-sm">
                  Paid on {formatDate(order.paidAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {getStatusText(order.status)}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex items-center">
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary1 rounded-full transition-all duration-300"
                  style={{ width: `${getStatusProgress(order.status)}%` }}
                ></div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6">
              <div className="text-center">
                <h5 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                  Order placed
                </h5>
                <p className="text-xs text-gray-600">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-center">
                <h5 className={`text-xs sm:text-sm mb-1 ${
                  order.status !== 'PENDING' ? 'font-semibold text-gray-900' : 'font-medium text-gray-500'
                }`}>
                  Processing
                </h5>
                <p className={`text-xs ${
                  order.status !== 'PENDING' ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {order.status !== 'PENDING' ? formatDate(order.updatedAt) : 'Pending'}
                </p>
              </div>
              <div className="text-center">
                <h5 className={`text-xs sm:text-sm mb-1 ${
                  order.status === 'SUCCESS' || order.status === 'COMPLETED'
                    ? 'font-semibold text-gray-900' 
                    : 'font-medium text-gray-500'
                }`}>
                  Payment
                </h5>
                <p className={`text-xs ${
                  order.status === 'SUCCESS' || order.status === 'COMPLETED'
                    ? 'text-gray-600' 
                    : 'text-gray-500'
                }`}>
                  {order.status === 'SUCCESS' || order.status === 'COMPLETED'
                    ? formatDate(order.paidAt || order.updatedAt) 
                    : 'Pending'}
                </p>
              </div>
              <div className="text-center">
                <h5 className={`text-xs sm:text-sm mb-1 ${
                  order.status === 'SUCCESS' || order.status === 'COMPLETED'
                    ? 'font-semibold text-gray-900' 
                    : 'font-medium text-gray-500'
                }`}>
                  Completed
                </h5>
                <p className={`text-xs ${
                  order.status === 'SUCCESS' || order.status === 'COMPLETED'
                    ? 'text-gray-600' 
                    : 'text-gray-500'
                }`}>
                  {order.status === 'SUCCESS' || order.status === 'COMPLETED' ? formatDate(order.updatedAt) : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Tracking Section */}
        {(order.status === 'SUCCESS' || order.status === 'COMPLETED') && (
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Shipment Tracking
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    fetchShipmentDetails(orderId);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  disabled={shipmentLoading}
                >
                  {shipmentLoading ? 'Loading...' : 'Refresh tracking'}
                </button>
                <button
                  onClick={() => {
                    fetchShipmentDetails(orderId);
                  }}
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                  disabled={shipmentLoading}
                >
                  Test API
                </button>
              </div>
            </div>

            {shipmentLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">Loading shipment details...</span>
              </div>
            ) : shipmentError ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-yellow-600 text-sm">
                    {shipmentError}
                  </div>
                </div>
              </div>
            ) : shipment ? (
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <p className={`text-lg font-semibold ${getShipmentStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Waybill Number</p>
                      <p className="text-sm font-mono text-gray-900">{shipment.waybill}</p>
                    </div>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">
                      Shipment Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consignee:</span>
                        <span className="text-gray-900">{shipment.consigneeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900">{shipment.consigneePhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="text-gray-900">{shipment.city}, {shipment.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipped:</span>
                        <span className="text-gray-900">{formatDate(shipment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-3">
                      Package Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      {shipment.products.map((product, index) => (
                        <div key={product._id} className="flex justify-between">
                          <span className="text-gray-600">Item {index + 1}:</span>
                          <span className="text-gray-900">Qty: {product.quantity} × ₹{product.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tracking History */}
                {shipment.statusHistory && shipment.statusHistory.length > 0 && (
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 mb-4">
                      Tracking History
                    </h4>
                    <div className="space-y-4">
                      {shipment.statusHistory
                        .sort((a, b) => new Date(b.ScanDetail.ScanDateTime).getTime() - new Date(a.ScanDetail.ScanDateTime).getTime())
                        .map((history, index) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {history.ScanDetail.Scan}
                              </p>
                              <p className="text-sm text-gray-600">
                                {history.ScanDetail.Instructions}
                              </p>
                              <p className="text-sm text-gray-500">
                                📍 {history.ScanDetail.ScannedLocation}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">
                                {formatDateTime(history.ScanDetail.ScanDateTime)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {history.ScanDetail.StatusCode}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-blue-700 text-sm">
                  Shipment is being prepared. Tracking information will be available once the package is dispatched.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Billing and Payment Information */}
      <div className="bg-secondary1 px-4 sm:px-6 py-4 sm:py-8 md:px-24 mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Billing Address */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Billing address
            </h4>
            <div className="space-y-1 text-gray-700 text-sm sm:text-base">
              <p>{order.address?.name || "N/A"}</p>
              <p>{order.address?.street || "N/A"}</p>
              <p>
                {order.address?.city || "N/A"}, {order.address?.state || "N/A"} {order.address?.postalCode || order.address?.zipCode || "N/A"}
              </p>
              <p>{order.address?.country || "N/A"}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Payment information
            </h4>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold w-fit">
                {order.currency || 'INR'}
              </div>
              <div className="text-gray-700 text-sm sm:text-base">
                <p className="break-all">Transaction ID: {order.transactionId || 'N/A'}</p>
                <p className="text-sm text-gray-600">
                  Status: {order.status}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h4>
            <div className="space-y-3">
              {order.products.map((product, index) => (
                <div key={product._id} className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600 truncate mr-2">
                    {product.productId.name} x {product.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ₹{(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Order total
                </span>
                <span className="text-base sm:text-lg font-semibold text-primary">
                  ₹{order.amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
