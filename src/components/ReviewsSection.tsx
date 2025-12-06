"use client";

import { Review } from "@/types/eventDetails";
import { User } from "@/types/user";
import { Star, ChevronRight, Loader2 as Spinner, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ReviewsSectionProps {
  reviews: Review[];
  loadingReviews: boolean;
  showAllReviews: boolean;
  setShowAllReviews: (show: boolean) => void;
  hostAverageRating: number;
  totalReviews: number;
  user: User | null;
  onEditReview: (review: Review) => void;
}

export function ReviewsSection({
  reviews,
  loadingReviews,
  showAllReviews,
  setShowAllReviews,
  hostAverageRating,
  totalReviews,
  user,
  onEditReview,
}: ReviewsSectionProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-white/30"
            }`}
          />
        ))}
        <span className="ml-2 font-medium text-white">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-2 rounded-lg">
            <Star className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">
            Reviews ({totalReviews})
          </h3>
        </div>
        {hostAverageRating && hostAverageRating > 0 && (
          <div className="text-right">
            <p className="text-white/60 text-sm">Average Rating</p>
            <p className="font-bold text-white text-2xl">
              {hostAverageRating.toFixed(1)}/5
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {loadingReviews ? (
          <div className="py-8 text-center">
            <Spinner className="inline w-6 h-6 text-white animate-spin" />
            <p className="mt-2 text-white/60">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center">
            <div className="inline-flex justify-center items-center mb-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <Star className="w-8 h-8 text-white/40" />
              </div>
            </div>
            <p className="text-white/60">No reviews yet</p>
            <p className="mt-1 text-white/40 text-sm">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <>
            {reviews
              .slice(0, showAllReviews ? undefined : 3)
              .map((review) => (
                <div
                  key={review._id}
                  className="bg-white/5 p-4 border border-white/10 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-md rounded-full"></div>
                        <div className="relative flex justify-center items-center bg-white/10 rounded-full w-10 h-10">
                          {review.user.avatar ? (
                            <img
                              src={review.user.avatar}
                              alt={review.user.name}
                              className="rounded-full w-10 h-10"
                            />
                          ) : (
                            <span className="font-bold text-white">
                              {review.user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-white">{review.user.name}</p>
                        <p className="text-white/60 text-sm">
                          {getTimeAgo(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating, "sm")}
                    </div>
                  </div>
                  <p className="text-white/80">{review.comment}</p>
                  
                  {user && review.user._id === user.id && (
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        onClick={() => onEditReview(review)}
                        className="flex items-center gap-1 text-white/60 hover:text-white text-sm"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {!showAllReviews && reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="flex justify-center items-center gap-2 py-3 w-full text-white/70 hover:text-white transition-colors"
              >
                <span>Show all {reviews.length} reviews</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {showAllReviews && reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(false)}
                className="flex justify-center items-center gap-2 py-3 w-full text-white/70 hover:text-white transition-colors"
              >
                <span>Show less</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}