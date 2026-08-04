"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, Star, ChevronUp } from "lucide-react";
import ChihiliLoader from "./ChihiliLoader";
import Link from "next/link";
import { getUserOrders, type Order, type GetUserOrdersParams } from "@/api/order.api";

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [hasInfiniteScroll, setHasInfiniteScroll] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Infinite scroll detection
  useEffect(() => {
    if (!hasInfiniteScroll) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
        !loadingMore &&
        currentPage < totalPages
      ) {
        handleLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasInfiniteScroll, loadingMore, currentPage, totalPages]);

  const fetchOrders = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
        setLoadMoreError(null);
      }

      const params: GetUserOrdersParams = {
        page,
        limit: 2,
      };

      const response = await getUserOrders(params);
      
      if (response.success) {
        const newOrders = response.data.orders;
        
        if (append) {
          setOrders(prev => [...prev, ...newOrders]);
        } else {
          setOrders(newOrders);
        }
        
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalOrders(response.data.pagination.totalOrders);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      
      if (page === 1) {
        setError(errorMessage);
      } else {
        setLoadMoreError(errorMessage);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchOrders(nextPage, true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
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
    return status.toUpperCase() === 'SUCCESS';
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

  if (loading) {
    return (
      <div className="bg-secondary1 min-h-screen py-8 font-lato px-4 md:px-24 md:py-12">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-10 font-crimson-pro">
            ORDER HISTORY
          </h1>
        </div>
        <ChihiliLoader fullScreen={false} message="Loading your orders..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary1 min-h-screen py-8 font-lato px-4 md:px-24 md:py-12">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2 mb-10 font-crimson-pro">
            ORDER HISTORY
          </h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="px-6 py-2 bg-secondary2 text-white rounded-md hover:bg-opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-secondary1 min-h-screen py-8  font-lato px-4 md:px-24 md:py-12">
      {/* Header */}

              <div className="text-center mb-4">
          <h1 className="text-xl sm:text-3xl font-light tracking-[0.3rem] sm:tracking-[0.4rem] text-secondary2  mb-10 font-crimson-pro">
          ORDER HISTORY
          </h1>
        </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <Link href={`/order-details/${order.orderId}`} key={order._id}>
              <div className="rounded-lg p-6 border border-transparent hover:border-gray-800 transition-colors duration-200 cursor-pointer">
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

                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        Quantity: {product.quantity} | Price: ₹{product.price}
                      </p>

                      <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-3xl">
                        {getProductDescription(product)}
                      </p>

                      {/* Review Section */}
                      {shouldShowReview(order.status) && (
                        <div className="flex items-center space-x-3">
                          {renderStars(0)} {/* Default to 0 rating, you can add rating system later */}
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
          ))
        )}
      </div>

      {/* Load More Button and Infinite Scroll Toggle */}
      {currentPage < totalPages && (
        <div className="text-center mt-12">
          {loadMoreError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{loadMoreError}</p>
              <button
                onClick={() => setLoadMoreError(null)}
                className="text-red-500 text-xs underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {/* Infinite Scroll Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={hasInfiniteScroll}
                onChange={(e) => setHasInfiniteScroll(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Enable auto-load on scroll</span>
            </label>
          </div>

          {!hasInfiniteScroll && (
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="group px-8 py-3 hover:bg-secondary2 hover:text-white text-gray-700 font-medium rounded-md transition-all duration-200 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:border-secondary2"
            >
              {loadingMore ? (
                <>
                  <div className="inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading more orders...
                </>
              ) : (
                <>
                  Load More Orders
                  <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          )}

          {loadingMore && hasInfiniteScroll && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-gray-600">Loading more orders...</span>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            Showing {orders.length} of {totalOrders} orders
          </p>
        </div>
      )}

      {/* Show when all orders are loaded */}
      {currentPage >= totalPages && orders.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-gray-600">
            You've reached the end of your order history
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Total orders: {totalOrders}
          </p>
        </div>
      )}
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-secondary2 text-white rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200 z-50"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default OrderHistory;
