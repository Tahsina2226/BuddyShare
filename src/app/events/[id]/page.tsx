"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EventDetails, Review } from "@/types/eventDetails";
import { Heart, Share2, Bell, Loader2, AlertCircle, ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { EventDetailsHeader } from "@/components/EventDetailsHeader";
import { EventContent } from "@/components/EventContent";
import { EventSidebar } from "@/components/EventSidebar";
import { ParticipantsSection } from "@/components/ParticipantsSection";
import { ReviewsSection } from "@/components/ReviewsSection";

const toastStyle = {
  style: {
    background: "linear-gradient(135deg, #234C6A 0%, #1a3d57 100%)",
    border: "2px solid rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    borderRadius: "16px",
    padding: "16px 20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
  },
  duration: 4000,
  position: "top-right" as const,
};

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [canJoinInfo, setCanJoinInfo] = useState<{
    canJoin: boolean;
    reasons: string[];
  } | null>(null);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState<{
    rating: number;
    comment: string;
    _id?: string;
  }>({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReview, setUserHasReview] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      checkCanJoin();
      fetchReviews();
      checkUserReview();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      if (!response.ok) throw new Error("Event not found");
      const data = await response.json();
      if (data.success) setEvent({ ...data.data.event });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load event";
      setError(errorMessage);
      toast.error(errorMessage, { ...toastStyle, icon: "❌" });
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) setReviews(data.data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkUserReview = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/reviews/check`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.review) {
          setUserReview({
            rating: data.data.review.rating,
            comment: data.data.review.comment,
            _id: data.data.review._id,
          });
          setUserHasReview(true);
        } else setUserHasReview(false);
      }
    } catch (err) {
      console.error("Error checking user review:", err);
    }
  };

  const checkCanJoin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/can-join`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCanJoinInfo({ ...data.data });
      } else setCanJoinInfo(null);
    } catch (err) {
      console.error("Error checking join status:", err);
      setCanJoinInfo(null);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-4 border-2 border-white/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Login Required</p>
              <p className="text-white/70 text-sm">Please login to join events</p>
            </div>
            <button
              onClick={() => {
                router.push("/login");
                toast.dismiss(t.id);
              }}
              className="bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] ml-4 px-4 py-2 rounded-lg font-bold text-white text-sm transition-all"
            >
              Login
            </button>
          </div>
        </motion.div>
      ));
      return;
    }

    try {
      setJoining(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        if (event) {
          const updatedParticipants = [
            ...event.participants,
            {
              _id: user.id,
              name: user.name || "User",
              avatar: user.avatar,
              location: user.location || "Unknown",
            },
          ];
          setEvent({
            ...event,
            currentParticipants: updatedParticipants.length,
            participants: updatedParticipants,
          });
        }
        await fetchEventDetails();
        await checkCanJoin();
        toast.success("Successfully joined the event!", { ...toastStyle, icon: "🎉" });
      } else throw new Error(data.message || "Failed to join event");
    } catch (err) {
      console.error("Error joining event:", err);
      toast.error(err instanceof Error ? err.message : "Failed to join event", { ...toastStyle, icon: "❌" });
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user) return;
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-xl max-w-sm"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">Leave Event?</p>
            <p className="mt-1 text-white/70">Are you sure you want to leave "{event?.title}"?</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg font-medium text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await performLeaveEvent();
            }}
            className="bg-gradient-to-r from-[#D2C1B6] hover:from-[#c4b1a6] to-[#c4b1a6] hover:to-[#D2C1B6] px-4 py-2 rounded-lg font-bold text-white transition-all"
          >
            Yes, Leave
          </button>
        </div>
      </motion.div>
    ));
  };

  const performLeaveEvent = async () => {
    try {
      setLeaving(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        if (event && user) {
          const updatedParticipants = event.participants.filter((p) => p._id !== user.id);
          setEvent({
            ...event,
            currentParticipants: updatedParticipants.length,
            participants: updatedParticipants,
          });
        }
        await fetchEventDetails();
        await checkCanJoin();
        toast.success("Successfully left the event!", { ...toastStyle, icon: "👋" });
      } else throw new Error(data.message || "Failed to leave event");
    } catch (err) {
      console.error("Error leaving event:", err);
      toast.error(err instanceof Error ? err.message : "Failed to leave event", { ...toastStyle, icon: "❌" });
    } finally {
      setLeaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review", { ...toastStyle, icon: "🔒" });
      return;
    }
    if (!userReview.rating) {
      toast.error("Please provide a rating", { ...toastStyle, icon: "⭐" });
      return;
    }
    try {
      setSubmittingReview(true);
      const endpoint = userHasReview
        ? `http://localhost:5000/api/events/${id}/reviews/${userReview._id}`
        : `http://localhost:5000/api/events/${id}/reviews`;
      const method = userHasReview ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          rating: userReview.rating,
          comment: userReview.comment,
          hostId: event?.host._id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(userHasReview ? "Review updated successfully!" : "Review submitted successfully!", { ...toastStyle, icon: "🎉" });
        await fetchReviews();
        await fetchEventDetails();
        await checkUserReview();
        setShowReviewForm(false);
      } else throw new Error(data.message || "Failed to submit review");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review", { ...toastStyle, icon: "❌" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview._id) return;
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-xl max-w-sm"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">Delete Review?</p>
            <p className="mt-1 text-white/70">Are you sure you want to delete your review? This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg font-medium text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await performDeleteReview();
            }}
            className="bg-gradient-to-r from-[#D2C1B6] hover:from-[#c4b1a6] to-[#c4b1a6] hover:to-[#D2C1B6] px-4 py-2 rounded-lg font-bold text-white transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    ));
  };

  const performDeleteReview = async () => {
    if (!userReview._id) return;
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/reviews/${userReview._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Review deleted successfully!", { ...toastStyle, icon: "🗑️" });
        await fetchReviews();
        await fetchEventDetails();
        await checkUserReview();
        setUserReview({ rating: 0, comment: "" });
        setShowReviewForm(false);
      }
    } catch (err) {
      toast.error("Failed to delete review", { ...toastStyle, icon: "❌" });
    }
  };

  const handleLikeEvent = () => {
    toast(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Event added to favorites!</span>
        </div>
      ),
      toastStyle
    );
  };

  const handleShareEvent = () => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">Share Event</p>
            <p className="text-white/70 text-sm">Copy link to share</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/events/${id}`}
            className="flex-1 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-lg text-white text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/events/${id}`);
              toast.success("Link copied to clipboard!", { ...toastStyle, icon: "📋" });
              toast.dismiss(t.id);
            }}
            className="bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] px-4 py-2 rounded-lg font-bold text-white text-sm transition-all"
          >
            Copy
          </button>
        </div>
      </motion.div>
    ));
  };

  const handleRemindMe = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-[#96A78D] animate-spin" />
            <span className="font-bold text-white">Setting reminder...</span>
          </div>
        ),
        success: (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Reminder set!</p>
              <p className="text-white/70 text-sm">You'll be notified 1 hour before</p>
            </div>
          </div>
        ),
        error: (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Failed to set reminder</span>
          </div>
        ),
      },
      toastStyle
    );
  };

  const isUserParticipant = () => {
    if (!user || !event) return false;
    return event.participants.some((p) => p._id === user.id);
  };

  const isUserHost = () => {
    if (!user || !event) return false;
    return event.host._id === user.id;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <Loader2 className="relative w-16 h-16 text-white animate-spin" />
          </div>
          <p className="mb-2 font-bold text-white text-2xl">Loading Event Details</p>
          <p className="text-white/60">We're preparing the perfect experience for you</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex justify-center items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-4xl tracking-tight">
              Event Not Found
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              {error || "The event you are looking for does not exist."}
            </p>
            <Link
              href="/events"
              className="group inline-flex relative items-center gap-3 bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/20 rounded-xl font-bold text-white text-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        toastOptions={{
          style: toastStyle.style,
          duration: toastStyle.duration,
          position: toastStyle.position,
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />

      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <EventDetailsHeader
            event={event}
            onLike={handleLikeEvent}
            onShare={handleShareEvent}
            onRemindMe={handleRemindMe}
          />

          <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
            <EventContent event={event} />
            
            <div className="space-y-6">
              <EventSidebar
                event={event}
                user={user}
                canJoinInfo={canJoinInfo}
                isUserHost={isUserHost()}
                isUserParticipant={isUserParticipant()}
                onJoinEvent={handleJoinEvent}
                onLeaveEvent={handleLeaveEvent}
                joining={joining}
                leaving={leaving}
                showReviewForm={showReviewForm}
                setShowReviewForm={setShowReviewForm}
                userReview={userReview}
                setUserReview={setUserReview}
                userHasReview={userHasReview}
                submittingReview={submittingReview}
                onSubmitReview={handleSubmitReview}
                onDeleteReview={handleDeleteReview}
              />

              <ParticipantsSection
                participants={event.participants}
                currentParticipants={event.currentParticipants}
              />

              <ReviewsSection
                reviews={reviews}
                loadingReviews={loadingReviews}
                showAllReviews={showAllReviews}
                setShowAllReviews={setShowAllReviews}
                hostAverageRating={event.host.averageRating}
                totalReviews={reviews.length}
                user={user}
                onEditReview={(review) => {
                  setUserReview({
                    rating: review.rating,
                    comment: review.comment,
                    _id: review._id,
                  });
                  setShowReviewForm(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}