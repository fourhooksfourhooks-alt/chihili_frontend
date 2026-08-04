import React, { useEffect, useState } from "react";
import { Clock, Package, Eye, ChevronRight, Star, Loader2 } from "lucide-react";
import { getUserOrders, Order } from "@/api/order.api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserOrders({ page: 1, limit: 10 });
        
        if (response.success) {
          setOrders(response.data.orders);
          setPagination(response.data.pagination);
        } else {
          setError(response.message || 'Failed to fetch orders');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return 'text-green-600';
      case 'PENDING':
        return 'text-blue-600';
      case 'FAILED':
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string, createdAt: string, paidAt?: string) => {
    const date = new Date(paidAt || createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    switch (status.toUpperCase()) {
      case 'SUCCESS':
      case 'COMPLETED':
        return `Delivered on ${date}`;
      case 'PENDING':
        return 'Order Confirmed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'FAILED':
        return 'Payment Failed';
      default:
        return `Order ${status}`;
    }
  };

  const shouldShowReview = (status: string) => {
    return status.toUpperCase() === 'SUCCESS' || status.toUpperCase() === 'COMPLETED';
  };

  const getProductImage = (product: Order['products'][0]) => {
    if (product.productId?.images && product.productId.images.length > 0) {
      return product.productId.images[0];
    }
    return '/best1.jpg'; // fallback image
  };

  const getProductDescription = (product: Order['products'][0]) => {
    return product.productId?.description || product.productId?.name || 'Product description not available';
  };

  const renderStars = (rating: number, isClickable = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${isClickable ? "cursor-pointer hover:text-yellow-400" : ""}`}
          />
        ))}
      </div>
    );
  };

  const formatOrderDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalItems = (products: Order['products']) => {
    return products.reduce((total, product) => total + product.quantity, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        <span className="ml-2 text-gray-600">Loading your orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Empty orders state */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-6">
            Your order history will appear here
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 cursor-pointer rounded">
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Orders List */}
          {orders.map((order) => (
            <Link href={`/order-details/${order.orderId}`} key={order._id}>
              <div className="rounded-lg p-6 border border-transparent  hover:border-gray-800 transition-colors duration-200 cursor-pointer">
                {/* Display each product in the order */}
                {order.products.map((product, index) => (
                  <div key={`${order._id}-${index}`} className="flex items-start space-x-4 mb-6 last:mb-0">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-40 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={getProductImage(product)}
                          alt={product.productId?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status, order.createdAt, order.paidAt)}
                        </h3>
                        <ChevronRight className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                      </div>

                      <h4 className="font-medium text-gray-900 mb-2">
                        {product.productId?.name || "Product Name"}
                      </h4>

                      <div className="text-gray-600 text-sm space-y-1 mb-3">
                        <p>Order ID: <span className="font-medium text-gray-800">{order.orderId}</span></p>
                        <p>Quantity: {product.quantity} | Price: ₹{product.price.toLocaleString()}</p>
                        <p>Order Date: {formatOrderDate(order.createdAt)}</p>
                        {order.transactionId && (
                          <p>Transaction ID: <span className="font-medium text-gray-800">{order.transactionId}</span></p>
                        )}
                        <p>Total Amount: <span className="font-medium text-gray-800">₹{order.amount.toLocaleString()}</span></p>
                      </div>

                      {/* <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">
                        {getProductDescription(product)}
                      </p> */}

                      {/* Address Information */}
                      {order.address && (
                        <div className="bg-gray-50 p-3 rounded-md mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                          <p className="text-sm text-gray-600">
                            {order.address.name && `${order.address.name}, `}
                            {order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}
                            {order.address.phone && ` | Phone: ${order.address.phone}`}
                          </p>
                        </div>
                      )}

                      {shouldShowReview(order.status) && (
                        <div className="flex items-center space-x-3">
                          {renderStars(0)}
                          <span className="text-sm text-gray-500">
                            Rate this product
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          ))}

          {/* Show pagination info if available */}
          {pagination && pagination.totalPages > 1 && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Showing {orders.length} of {pagination.totalOrders} orders
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
