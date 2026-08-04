"use client";
import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, Edit, Trash2, Loader2 } from "lucide-react";
import useReviewStore from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import { Review } from "@/api/review.api";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  // Get reviews from store
  const {
    reviews,
    isLoading,
    error,
    userReview,
    pagination,
    getProductPageReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
    clearReviews,
  } = useReviewStore();

  // Get user info
  const { user, isAuthenticated } = useAuthStore();

  // Fetch reviews on component mount and when page changes
  useEffect(() => {
    let isMounted = true;
    
    if (productId) {
      getProductPageReviews(productId, currentPage, reviewsPerPage ).then(() => {
      });
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      // Only call clearReviews when actually unmounting, not on every render
      if (productId) {
        clearReviews();
      }
    };
  }, [productId, currentPage, reviewsPerPage,  clearReviews]);

  // Ensure reviews is always an array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];

  // Calculate average rating
  const averageRating =
    reviewsArray.length > 0
      ? reviewsArray.reduce((sum, review) => sum + review.rating, 0) / reviewsArray.length
      : 0;

  // Get total reviews count from pagination or reviews length
  const totalReviewsCount = pagination ? 
    (pagination.total || pagination.totalReviews || reviewsArray.length) : 
    reviewsArray.length;

  // Handle star rating selection
  const handleRatingChange = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  // Submit review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !isAuthenticated) return;

    setSubmitLoading(true);
    let success = false;

    try {
      if (isEditing && editingReviewId) {
        // Update existing review
        success = await updateReview(
          editingReviewId,
          newReview.rating,
          newReview.comment
        );
      } else {
        // Create new review
        success = await createReview(
          productId,
          newReview.rating,
          newReview.comment
        );
      }

      if (success) {
        // Reset form
        setNewReview({ rating: 5, comment: "" });
        setIsEditing(false);
        setEditingReviewId(null);
        
        // Refresh reviews - go to page 1 for new reviews
        if (!isEditing) {
          setCurrentPage(1);
          await getProductPageReviews(productId, 1, reviewsPerPage);
        } else {
          // Stay on current page for edits
          await getProductPageReviews(productId, currentPage, reviewsPerPage);
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Edit review
  const handleEditReview = (review: Review) => {
    setNewReview({
      rating: review.rating,
      comment: review.comment,
    });
    setIsEditing(true);
    setEditingReviewId(review._id);
  };

  // Delete review
  const handleDeleteReview = async (reviewId: string) => {
    try {
      const success = await deleteReview(reviewId);
      
      if (success) {
        console.log('Review deleted successfully');
        // Refresh reviews after deletion
        await getProductPageReviews(productId, currentPage, reviewsPerPage);
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Toggle like
  const handleToggleLike = async (reviewId: string) => {
    if (!isAuthenticated) {
      alert("Please login to like reviews");
      return;
    }
    
    try {
      // Call the API to toggle like
      const success = await toggleLike(reviewId);
      
      if (success) {
        console.log('Like toggled successfully');
      } else {
        console.error('Failed to toggle like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Check if user is the author of a review
  const isUserReviewAuthor = (review: Review) => {
    if (!user) return false;
    
    // Handle both string userId and object userId
    if (typeof review.userId === 'string') {
      return user._id === review.userId;
    } else if (typeof review.userId === 'object' && review.userId) {
      return user._id === review.userId._id;
    }
    
    return false;
  };
  
  // Check if user has liked a review
  const hasUserLikedReview = (review: Review) => {
    if (!user) return false;
    
    // Check if likes array exists
    if (!review.likes || !Array.isArray(review.likes) || review.likes.length === 0) {
      return false;
    }
    
    // Check both formats: likes as string array or as object array with _id property
    return review.likes.some(like => {
      // Format 1: like is a string ID
      if (typeof like === 'string') {
        return like === user._id;
      }
      // Format 2: like is an object with _id property
      else if (typeof like === 'object' && like !== null) {
        return like._id === user._id;
      }
      return false;
    });
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h2>

      {/* Review Summary */}
      <div className="flex items-start mb-8">
        <div className="mr-8">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg ml-2 text-gray-500">
              out of 5 ({totalReviewsCount} {totalReviewsCount === 1 ? "review" : "reviews"})
            </span>
          </div>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Form (only when editing or user hasn't reviewed) */}
      {isAuthenticated ? (
        isEditing || !userReview ? (
          <div className="p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Your Review" : "Write a Review"}
            </h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="mr-1 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newReview.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="review-comment"
                  className="block text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="review-comment"
                  value={newReview.comment}
                  onChange={handleCommentChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary1 focus:border-primary1"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingReviewId(null);
                      setNewReview({ rating: 5, comment: "" });
                    }}
                    className="mr-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-3 bg-primary1 text-white rounded-lg hover:opacity-90 transition-colors flex items-center disabled:opacity-50"
                >
                  {submitLoading && (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  )}
                  {isEditing ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
  ) : null
      ) : (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-8">
          <p className="text-gray-700">
            Please{" "}
            <a href="/auth/login" className="text-primary1 underline">
              log in
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary1" />
            <span className="ml-3">Loading reviews...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        ) : reviewsArray.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
            <p className="text-gray-600">
              This product doesn't have any reviews yet. Be the first to review it!
            </p>
          </div>
        ) : (
          <>
            {userReview && (
              <ReviewCard
                review={userReview}
                isCurrentUser
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                onToggleLike={handleToggleLike}
                isAuthenticated={isAuthenticated}
                hasUserLiked={hasUserLikedReview}
              />
            )}

            {reviewsArray
              .filter(r => !userReview || r._id !== userReview._id)
              .map(r => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onToggleLike={handleToggleLike}
                  isAuthenticated={isAuthenticated}
                  hasUserLiked={hasUserLikedReview}
                />
              ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        (() => {
          // Handle both old and new pagination formats
          const totalPages = pagination.pages || pagination.totalPages || 0;
          const currentPageNum = pagination.page || pagination.currentPage || currentPage;
          
          if (totalPages > 1) {
            return (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPageNum === 1}
                    className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full ${
                        currentPageNum === page
                          ? 'bg-primary1 text-white'
                          : 'border hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPageNum === totalPages}
                    className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            );
          }
          return null;
        })()
      )}
    </div>
  );
};

export default ReviewSection;
