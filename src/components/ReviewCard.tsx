"use client";
import React from "react";
import { Star, ThumbsUp, Edit, Trash2 } from "lucide-react";
import { Review } from "@/api/review.api";

interface Props {
  review: Review;
  isCurrentUser?: boolean;
  compact?: boolean;
  onEdit?: (r: Review) => void;
  onDelete?: (id: string) => void;
  onToggleLike?: (id: string) => void;
  isAuthenticated?: boolean;
  hasUserLiked?: (r: Review) => boolean;
}

const ReviewCard: React.FC<Props> = ({
  review,
  isCurrentUser = false,
  compact = false,
  onEdit,
  onDelete,
  onToggleLike,
  isAuthenticated,
  hasUserLiked,
}) => {
  return (
    <div className={`p-6 ${compact ? 'py-3' : ''} rounded-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-2">
            <div className="mr-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold text-gray-700">
                {review.user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">
                {isCurrentUser ? <span className="text-primary1">You</span> : (review.user?.name || "Anonymous User")}
              </h4>
              <div className="flex items-center">
                {[1,2,3,4,5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {review.isVerifiedPurchase && (
            <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
              Verified Purchase
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {isCurrentUser && onEdit && (
            <button onClick={() => onEdit(review)} className="text-primary1 hover:text-primary1/80">
              <Edit className="w-5 h-5" />
            </button>
          )}
          {isCurrentUser && onDelete && (
            <button onClick={() => onDelete(review._id)} className="text-red-600 hover:text-red-800">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-700 my-4">{review.comment}</p>

      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {review.images.map((image, idx) => (
            <img key={idx} src={image} alt={`Review image ${idx + 1}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => onToggleLike && onToggleLike(review._id)}
          className={`flex items-center text-sm ${hasUserLiked && hasUserLiked(review) ? 'text-primary1 font-semibold' : 'text-gray-600 hover:text-primary1' } ${!isAuthenticated ? 'opacity-60' : 'cursor-pointer'}`}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? 'Please login to like reviews' : ''}
        >
          <ThumbsUp className={`w-4 h-4 mr-1 ${hasUserLiked && hasUserLiked(review) ? 'fill-primary1' : ''}`} />
          <span>{review.likes.length > 0 ? `${review.likes.length} ${review.likes.length === 1 ? 'like' : 'likes'}` : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
