"use client";

import { EventDetails } from "@/types/eventDetails";
import { User } from "@/types/user";
import {
  DollarSign,
  Users,
  Award,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  ChevronRight,
  Edit2,
  X,
  Loader2 as Spinner,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EventSidebarProps {
  event: EventDetails;
  user: User | null;
  canJoinInfo: { canJoin: boolean; reasons: string[] } | null;
  isUserHost: boolean;
  isUserParticipant: boolean;
  onJoinEvent: () => Promise<void>;
  onLeaveEvent: () => Promise<void>;
  joining: boolean;
  leaving: boolean;
  showReviewForm: boolean;
  setShowReviewForm: (show: boolean) => void;
  userReview: { rating: number; comment: string; _id?: string };
  setUserReview: (review: {
    rating: number;
    comment: string;
    _id?: string;
  }) => void;
  userHasReview: boolean;
  submittingReview: boolean;
  onSubmitReview: () => Promise<void>;
  onDeleteReview: () => Promise<void>;
  isUserAdmin?: boolean;
  canEditDeleteEvent?: boolean;
  onEditEvent?: () => void;
  onDeleteEvent?: () => void;
}

export function EventSidebar({
  event,
  user,
  canJoinInfo,
  isUserHost,
  isUserParticipant,
  onJoinEvent,
  onLeaveEvent,
  joining,
  leaving,
  showReviewForm,
  setShowReviewForm,
  userReview,
  setUserReview,
  userHasReview,
  submittingReview,
  onSubmitReview,
  onDeleteReview,
  isUserAdmin = false,
  canEditDeleteEvent = false,
  onEditEvent,
  onDeleteEvent,
}: EventSidebarProps) {
  const [showParticipants, setShowParticipants] = useState(false);

  const canUserJoinLeave = () => {
    if (!user) return false;
    return user.role === "user";
  };

  const canUserSubmitReview = () => {
    if (!user) return false;
    return user.role === "user" && isUserParticipant;
  };

  const getSpecialUserMessage = () => {
    if (!user) return "";
    if (user.role === "admin") return "Administrator Access";
    if (user.role === "host" && isUserHost) return "Host Access";
    return "";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-400";
    if (rating >= 4.0) return "text-green-300";
    if (rating >= 3.5) return "text-yellow-400";
    if (rating >= 3.0) return "text-yellow-300";
    return "text-red-400";
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
        <span className="ml-2 font-medium text-white">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleSubmitReview = async () => {
    if (!canUserSubmitReview()) return;
    await onSubmitReview();
  };

  const handleDeleteReview = async () => {
    if (!canUserSubmitReview()) return;
    await onDeleteReview();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="top-8 sticky bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl"
      >
        {canEditDeleteEvent && (
          <div className="bg-gradient-to-r from-[#234C6A]/20 to-[#D2C1B6]/20 mb-4 p-3 border-[#234C6A]/30 border-2 rounded-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#234C6A]" />
              <span className="font-bold text-[#234C6A] text-sm">
                {getSpecialUserMessage()}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Joining Fee</p>
              <p
                className={`font-bold text-3xl ${
                  event.joiningFee === 0 ? "text-[#96A78D]" : "text-white"
                }`}
              >
                {event.joiningFee === 0
                  ? "FREE"
                  : `$${event.joiningFee.toFixed(2)}`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-sm">Spots Left</p>
            <p className="font-bold text-white text-3xl">
              {event.maxParticipants - event.currentParticipants}
            </p>
          </div>
        </div>

        <div className="relative bg-white/10 mb-4 rounded-xl h-3">
          <div
            className="top-0 left-0 absolute bg-gradient-to-r from-[#96A78D] to-[#889c7e] rounded-xl h-full transition-all duration-300"
            style={{
              width: `${
                (event.currentParticipants / event.maxParticipants) * 100
              }%`,
            }}
          />
        </div>
        <p className="mb-8 text-white/60 text-sm text-center">
          {event.currentParticipants} of {event.maxParticipants} spots filled
        </p>

        {canJoinInfo &&
          !canJoinInfo.canJoin &&
          canJoinInfo.reasons.length > 0 && (
            <div className="bg-gradient-to-r from-white/10 to-white/5 mb-6 p-4 border-2 border-white/20 rounded-xl">
              <div className="flex items-start">
                <AlertCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-white/60" />
                <div className="text-sm">
                  <p className="font-bold text-white">Cannot join because:</p>
                  <ul className="mt-2 text-white/60 list-disc list-inside">
                    {canJoinInfo.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

        <div className="space-y-4">
          {canEditDeleteEvent ? (
            <div className="space-y-3">
              <div className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 to-[#D2C1B6]/20 p-4 border-[#234C6A]/30 border-2 rounded-xl">
                <Shield className="w-5 h-5 text-[#234C6A]" />
                <span className="font-bold text-[#234C6A]">
                  {isUserAdmin ? "Administrator Mode" : "Host Mode"}
                </span>
              </div>

              <div className="gap-3 grid grid-cols-2">
                <button
                  onClick={onEditEvent}
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#1a3d57] to-[#D2C1B6] hover:to-[#c4b1a6] shadow-lg backdrop-blur-sm px-4 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Event
                </button>

                <button
                  onClick={onDeleteEvent}
                  className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#D2C1B6] hover:from-[#c4b1a6] to-[#D2C1B6] hover:to-[#c4b1a6] shadow-lg backdrop-blur-sm px-4 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Event
                </button>
              </div>
            </div>
          ) : canUserJoinLeave() ? (
            <>
              {isUserParticipant ? (
                <>
                  <div className="flex justify-center items-center gap-2 bg-gradient-to-r from-[#96A78D]/20 to-[#889c7e]/20 p-4 border-[#96A78D]/30 border-2 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-[#96A78D]" />
                    <span className="font-bold text-[#96A78D]">
                      You are attending
                    </span>
                  </div>
                  <button
                    onClick={onLeaveEvent}
                    disabled={leaving}
                    className="bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 disabled:opacity-50 shadow-lg backdrop-blur-sm px-6 py-4 border-2 border-white/20 rounded-xl w-full font-bold text-white transition-all disabled:cursor-not-allowed"
                  >
                    {leaving ? (
                      <span className="flex justify-center items-center gap-2">
                        <Spinner className="w-4 h-4 animate-spin" />
                        Leaving...
                      </span>
                    ) : (
                      "Leave Event"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={onJoinEvent}
                  disabled={joining || (canJoinInfo && !canJoinInfo.canJoin)}
                  className={`w-full px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border-2 border-white/20 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] ${
                    event.joiningFee === 0
                      ? "bg-gradient-to-r from-[#96A78D] to-[#889c7e] hover:from-[#889c7e] hover:to-[#96A78D] text-white"
                      : "bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] text-white"
                  }`}
                >
                  {joining ? (
                    <span className="flex justify-center items-center gap-2">
                      <Spinner className="w-4 h-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Join Event"
                  )}
                </button>
              )}
            </>
          ) : !user ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#96A78D]/20 to-[#889c7e]/20 p-4 border-[#96A78D]/30 border-2 rounded-xl">
                <p className="text-white text-center">
                  Login as a user to join this event
                </p>
              </div>
              <Link
                href="/login"
                className="block bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] shadow-lg backdrop-blur-sm px-6 py-4 border-2 border-white/20 rounded-xl w-full font-bold text-white text-center hover:scale-[1.02] transition-all"
              >
                Login to Join
              </Link>
            </div>
          ) : (user.role === "host" || user.role === "admin") && !isUserHost ? (
            <div className="bg-gradient-to-r from-[#234C6A]/10 to-[#D2C1B6]/10 p-4 border-[#234C6A]/20 border-2 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#234C6A]" />
                <span className="font-bold text-[#234C6A]">
                  {user.role === "admin" ? "Administrator" : "Host"} Account
                </span>
              </div>
              <p className="text-white/70 text-sm">
                {user.role === "admin"
                  ? "Administrator account access"
                  : "Host account access"}
              </p>
            </div>
          ) : null}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-white text-xl">Event Host</h3>
          </div>
          <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-white/70 text-sm">
            Verified
          </span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] blur-md rounded-full"></div>
            <div className="relative flex justify-center items-center bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg rounded-full w-16 h-16">
              {event.host.avatar ? (
                <img
                  src={event.host.avatar}
                  alt={event.host.name}
                  className="rounded-full w-16 h-16"
                />
              ) : (
                <span className="font-bold text-white text-2xl">
                  {event.host.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="mb-1 font-bold text-white text-lg">
              {event.host.name}
            </h4>
            <p className="mb-2 text-white/60 text-sm">
              {event.host.bio || "Event Organizer"}
            </p>

            {event.host.averageRating && event.host.averageRating > 0 ? (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(event.host.averageRating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <span
                  className={`ml-2 font-bold ${getRatingColor(
                    event.host.averageRating
                  )}`}
                >
                  {event.host.averageRating.toFixed(1)}
                </span>
                <span className="ml-2 text-white/60 text-sm">
                  ({event.host.totalReviews || 0} reviews)
                </span>
              </div>
            ) : (
              <div className="flex items-center text-white/60 text-sm">
                <Star className="mr-1 w-4 h-4 text-white/30" />
                <span>No ratings yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="gap-4 grid grid-cols-2 mb-6">
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl">
            <p className="text-white/60 text-sm">Response Rate</p>
            <p className="font-bold text-white text-lg">98%</p>
          </div>
          <div className="bg-white/5 p-4 border border-white/10 rounded-xl">
            <p className="text-white/60 text-sm">Events Hosted</p>
            <p className="font-bold text-white text-lg">
              {event.host.eventsHosted || 0}
            </p>
          </div>
        </div>

        <div className="gap-2 grid grid-cols-2">
          <Link
            href={`/profile/${event.host._id}`}
            className="group flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
          >
            <span>View Profile</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {canUserSubmitReview() && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex justify-center items-center gap-3 bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
            >
              <Star className="w-4 h-4" />
              <span>{userHasReview ? "Edit Review" : "Add Review"}</span>
            </button>
          )}

          {user && (user.role === "host" || user.role === "admin") && (
            <div className="col-span-2 bg-white/5 p-3 border border-white/10 rounded-lg">
              <p className="text-white/60 text-sm text-center">
                Hosts and administrators cannot submit reviews
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {canUserSubmitReview() && (
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl">
                    {userHasReview ? "Edit Your Review" : "Write a Review"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-white/70">Your Rating</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setUserReview({ ...userReview, rating: star })
                      }
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= userReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  value={userReview.comment}
                  onChange={(e) =>
                    setUserReview({ ...userReview, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  className="bg-white/10 backdrop-blur-sm px-4 py-3 border border-white/20 focus:border-white/40 rounded-lg focus:outline-none w-full h-32 text-white resize-none placeholder-white/40"
                  maxLength={500}
                />
                <p className="mt-1 text-white/40 text-sm text-right">
                  {userReview.comment.length}/500
                </p>
              </div>

              <div className="flex justify-end gap-3">
                {userHasReview && (
                  <button
                    onClick={handleDeleteReview}
                    className="bg-gradient-to-r from-[#D2C1B6] hover:from-[#c4b1a6] to-[#c4b1a6] hover:to-[#D2C1B6] px-4 py-2 rounded-lg font-bold text-white transition-all"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg font-medium text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !userReview.rating}
                  className="bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] disabled:opacity-50 px-4 py-2 rounded-lg font-bold text-white transition-all"
                >
                  {submittingReview ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-4 h-4 animate-spin" />
                      {userHasReview ? "Updating..." : "Submitting..."}
                    </span>
                  ) : userHasReview ? (
                    "Update Review"
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg p-3 rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">What to Expect</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="bg-[#96A78D]/20 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#96A78D]" />
            </div>
            <span className="text-white">Professional organization</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="bg-[#96A78D]/20 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#96A78D]" />
            </div>
            <span className="text-white">All equipment provided</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="bg-[#96A78D]/20 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#96A78D]" />
            </div>
            <span className="text-white">Refreshments included</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="bg-[#96A78D]/20 p-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-[#96A78D]" />
            </div>
            <span className="text-white">Photos & memories</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
