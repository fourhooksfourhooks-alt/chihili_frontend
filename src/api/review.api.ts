import axiosInstance from './axiosInstance';

export interface Review {
  _id: string;
  productId: string;
  userId: string | { _id: string; name?: string; avatar?: string };
  rating: number;
  comment: string;
  images: string[];
  likes: Array<string | { _id: string }>;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

export interface PaginationInfo {
  totalReviews?: number; // Old format
  currentPage?: number;  // Old format
  totalPages?: number;   // Old format
  pageSize?: number;     // Old format
  // New format
  total?: number;
  limit?: number;
  page?: number;
  pages?: number;
}

export interface ReviewResponse {
  statusCode: number;
  data: {
    reviews?: Review[] | {
      reviews: Review[];
      pagination: PaginationInfo;
    };
    review?: Review;
    likes?: number;
    // New structure for product page reviews
    myReview?: Review | null;
    otherReviews?: Review[];
    pagination?: PaginationInfo;
  };
  message: string;
  success: boolean;
}

/**
 * Create a new review for a product
 * @param productId - ID of the product being reviewed
 * @param rating - Rating from 1 to 5
 * @param comment - Optional review comment
 * @param images - Optional array of image URLs
 * @returns Promise with the created review
 */
export const createReview = async (
  productId: string,
  rating: number,
  comment?: string,
  images?: string[]
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.post<ReviewResponse>('/review/addReview', {
      productId,
      rating,
      comment,
      images
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      statusCode: error.response?.status || 500,
      data: {},
      message: error.message || 'Failed to create review',
      success: false
    };
  }
};

/**
 * Get reviews for a product page (frontend display)
 * @param productId - ID of the product
 * @param page - Page number for pagination (optional)
 * @param limit - Number of reviews per page (optional)
 * @returns Promise with an array of reviews and pagination info
 */
export const getProductPageReviews = async (
  productId: string, 
  page: number = 1, 
  limit: number = 10
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.get<ReviewResponse>(
      `/review/productpage/${productId}?page=${page}&limit=${limit}`
    );
    
    return response.data;
  } catch (error: any) {
    // Simple error handling
    return {
      statusCode: error.response?.status || 500,
      data: { 
        myReview: null, 
        otherReviews: [], 
        pagination: { total: 0, page: 1, pages: 0, limit: limit } 
      },
      message: error.message || 'Failed to fetch reviews',
      success: false
    };
  }
};

/**
 * Update an existing review
 * @param reviewId - ID of the review to update
 * @param rating - Updated rating
 * @param comment - Updated comment
 * @returns Promise with the updated review
 */
export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.put<ReviewResponse>(`/review/updateReview/${reviewId}`, {
      rating,
      comment: comment
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      statusCode: error.response?.status || 500,
      data: {},
      message: error.message || 'Failed to update review',
      success: false
    };
  }
};

/**
 * Delete a review
 * @param reviewId - ID of the review to delete
 * @returns Promise with success status
 */
export const deleteReview = async (reviewId: string): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.delete<ReviewResponse>(`/review/deleteReview/${reviewId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      statusCode: error.response?.status || 500,
      data: {},
      message: error.message || 'Failed to delete review',
      success: false
    };
  }
};

/**
 * Toggle like/unlike on a review
 * @param reviewId - ID of the review to like/unlike
 * @returns Promise with updated review and like count
 */
export const toggleLikeReview = async (reviewId: string): Promise<ReviewResponse> => {
  try {
    const response = await axiosInstance.post<ReviewResponse>(`/review/Like/${reviewId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      statusCode: error.response?.status || 500,
      data: {},
      message: error.message || 'Failed to toggle like',
      success: false
    };
  }
};
