import { create } from 'zustand';
import {
  Review,
  PaginationInfo,
  getProductPageReviews,
  createReview as apiCreateReview,
  updateReview as apiUpdateReview,
  deleteReview as apiDeleteReview,
  toggleLikeReview as apiToggleLikeReview
} from '../api/review.api';

interface ReviewState {
  // State
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  userReview: Review | null; // The current user's review if they've written one
  pagination: PaginationInfo | null;
  
  // Actions
  getProductPageReviews: (productId: string, page?: number, limit?: number) => Promise<void>;
  createReview: (productId: string, rating: number, comment?: string, images?: string[]) => Promise<boolean>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  toggleLike: (reviewId: string) => Promise<boolean>;
  clearReviews: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  // Initial state
  reviews: [],
  isLoading: false,
  error: null,
  userReview: null,
  pagination: null,

  // Get all reviews for a product
  getProductPageReviews: async (productId: string, page = 1, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await getProductPageReviews(productId, page, limit);
      
      if (response.success && response.data) {
        // Handle the new response structure with myReview and otherReviews
        if (response.data.myReview !== undefined && response.data.otherReviews !== undefined) {
          const myReview = response.data.myReview;
          const otherReviews = response.data.otherReviews || [];
          
          // Combine myReview and otherReviews for the reviews array
          const allReviews = myReview ? [myReview, ...otherReviews] : otherReviews;
          
          set({ 
            reviews: allReviews,
            pagination: response.data.pagination || null,
            userReview: myReview,
            isLoading: false 
          });
        } else if (Array.isArray(response.data.reviews)) {
          // Handle simple array response - just use the reviews as they are
          set({ 
            reviews: response.data.reviews,
            pagination: response.data.pagination || null,
            userReview: null, // No myReview provided, so we don't know which is user's
            isLoading: false 
          });
        } else {
          // Fallback to empty array
          set({ 
            reviews: [],
            pagination: null,
            userReview: null,
            error: 'Invalid response format',
            isLoading: false 
          });
        }
      } else {
        // Always set reviews to empty array on error to avoid undefined
        set({ 
          reviews: [],
          pagination: null,
          userReview: null,
          error: response.message || 'Failed to fetch reviews',
          isLoading: false 
        });
      }
    } catch (error) {
      // Also set reviews to empty array on exception
      set({ 
        reviews: [],
        pagination: null,
        userReview: null,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
    }
  },

  // Create a new review
  createReview: async (productId: string, rating: number, comment?: string, images?: string[]) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiCreateReview(productId, rating, comment, images);
      
      if (response.success && response.data.review) {
        // Add the new review to the reviews array
        const updatedReviews = [response.data.review, ...get().reviews];
        set({ 
          reviews: updatedReviews,
          userReview: response.data.review,
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: response.message || 'Failed to create review',
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
      return false;
    }
  },

  // Update an existing review
  updateReview: async (reviewId: string, rating: number, comment: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiUpdateReview(reviewId, rating, comment);
      
      if (response.success && response.data.review) {
        // Update the review in the reviews array
        const updatedReviews = get().reviews.map(review => 
          review._id === reviewId ? response.data.review! : review
        );
        
        set({ 
          reviews: updatedReviews,
          userReview: response.data.review,
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: response.message || 'Failed to update review',
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
      return false;
    }
  },

  // Delete a review
  deleteReview: async (reviewId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiDeleteReview(reviewId);
      
      if (response.success) {
        // Remove the review from the reviews array
        const updatedReviews = get().reviews.filter(review => review._id !== reviewId);
        set({ 
          reviews: updatedReviews,
          userReview: null,
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: response.message || 'Failed to delete review',
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
      return false;
    }
  },

  // Toggle like on a review
  toggleLike: async (reviewId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await apiToggleLikeReview(reviewId);
      
      if (response.success && response.data.review) {
        // Get current reviews
        const currentReviews = get().reviews;
        
        // Ensure currentReviews is an array
        const reviewsArray = Array.isArray(currentReviews) ? currentReviews : [];
        
        // Update the review in the reviews array
        const updatedReviews = reviewsArray.map(review => 
          review._id === reviewId ? response.data.review! : review
        );
        
        set({ 
          reviews: updatedReviews,
          isLoading: false 
        });
        return true;
      } else {
        set({ 
          error: response.message || 'Failed to toggle like',
          isLoading: false 
        });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false
      });
      return false;
    }
  },

  // Clear reviews (when unmounting or changing products)
  clearReviews: () => {
    // Check if there are any reviews to clear to avoid unnecessary updates
    const { reviews, userReview, pagination } = get();
    const hasReviews = Array.isArray(reviews) && reviews.length > 0;
    const hasUserReview = userReview !== null;
    const hasPagination = pagination !== null;
    
    if (hasReviews || hasUserReview || hasPagination) {
      set({ reviews: [], userReview: null, pagination: null });
    }
  }
}));

export default useReviewStore;
