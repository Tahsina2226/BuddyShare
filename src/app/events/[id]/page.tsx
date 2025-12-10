'use client'

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EventDetails, Review } from "@/types/eventDetails";
import {
  Heart,
  Share2,
  Bell,
  Loader2,
  AlertCircle,
  ArrowLeft,
  XCircle,
  Sparkles,
  X,
  Rocket,
  Crown,
  Star,
  Zap,
  Shield,
  AlertTriangle,
  Clock,
  Trophy,
  Gift,
  CheckCircle,
  Trash2,
  Edit,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import API from '@/utils/api';
import { EventDetailsHeader } from "@/components/EventDetailsHeader";
import { EventContent } from "@/components/EventContent";
import { EventSidebar } from "@/components/EventSidebar";
import { ParticipantsSection } from "@/components/ParticipantsSection";
import { ReviewsSection } from "@/components/ReviewsSection";

// Custom Toast Hook
const useToast = () => {
  const toastShown = useRef<Record<string, boolean>>({});

  const showToast = (type: string, id: string, ...args: any[]) => {
    if (toastShown.current[id]) {
      toast.dismiss(toastShown.current[id] as any);
    }

    toastShown.current[id] = true;

    setTimeout(() => {
      delete toastShown.current[id];
    }, 1000);

    let toastId: string | undefined;

    switch (type) {
      case "success":
        fancyToast.success(...args);
        break;
      case "error":
        fancyToast.error(...args);
        break;
      case "info":
        fancyToast.info(...args);
        break;
      case "custom":
        toastId = toast.custom(...args) as string;
        break;
      case "promise":
        toastId = toast.promise(
          ...(args as [Promise<any>, any, any?])
        ) as string;
        break;
      default:
        toastId = toast(...args) as string;
    }

    if (toastId) {
      toastShown.current[id] = toastId as any;
    }

    return toastId;
  };

  return { showToast };
};

// Fancy Toast Functions
const fancyToast = {
  success: (message: string) => {
    return toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-2xl backdrop-blur-xl p-6 border-2 border-emerald-400/30 rounded-2xl max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
              <div className="relative bg-white/20 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-white text-lg">Success!</h3>
              <p className="text-white/90">{message}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="-top-1 -right-1 absolute">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
              <Star className="relative w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </motion.div>
      ),
      { duration: 3000, position: "top-right" }
    );
  },

  error: (message: string) => {
    return toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 shadow-2xl backdrop-blur-xl p-6 border-2 border-rose-400/30 rounded-2xl max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
              <div className="relative bg-white/20 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-white text-lg">Oops!</h3>
              <p className="text-white/90">{message}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="right-2 bottom-2 absolute opacity-30">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </motion.div>
      ),
      { duration: 4000, position: "top-right" }
    );
  },

  info: (message: string, title: string = "Info") => {
    return toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-r from-cyan-500 via-cyan-600 to-sky-600 shadow-2xl backdrop-blur-xl p-6 border-2 border-cyan-400/30 rounded-2xl max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
              <div className="relative bg-white/20 p-3 rounded-full">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-white text-lg">{title}</h3>
              <p className="text-white/90">{message}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          <div className="-bottom-2 -left-2 absolute opacity-20">
            <Crown className="w-12 h-12 text-white" />
          </div>
        </motion.div>
      ),
      { duration: 3000, position: "top-right" }
    );
  },

  confirmDelete: (
    eventTitle: string,
    onConfirm: () => void,
    onCancel: () => void,
    isAdmin: boolean = false,
    isHost: boolean = false
  ) => {
    return toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-br from-red-500 via-rose-600 to-pink-700 shadow-2xl backdrop-blur-xl p-8 border-2 border-red-400/40 rounded-2xl max-w-lg"
        >
          <div className="-top-3 -right-3 absolute">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <div className="relative bg-red-500/20 p-3 border-2 border-red-400/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-lg rounded-full"></div>
                <div className="relative bg-white/10 p-3 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">
                  ⚠️ Critical Action
                </h3>
                <p className="text-white/70 text-sm">
                  {isAdmin
                    ? "Administrative Deletion"
                    : isHost
                    ? "Host Deletion"
                    : "Event Deletion"}
                </p>
              </div>
            </div>

            {isHost && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 mb-4 p-4 border border-yellow-400/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-300 text-sm">
                    ⚠️ As the host, deleting this event will remove it
                    permanently.
                  </p>
                </div>
              </div>
            )}

            {isAdmin && !isHost && (
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 mb-4 p-4 border border-blue-400/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <p className="text-blue-300 text-sm">
                    ⚠️ You are deleting this event as an administrator.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 mb-6 p-6 border border-red-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Clock className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-white">
                    Warning: Permanent Deletion
                  </h4>
                  <p className="text-white/80 text-sm">
                    You are about to permanently delete{" "}
                    <span className="font-bold text-white">"{eventTitle}"</span>
                    . This will remove all event data including:
                  </p>
                  <ul className="space-y-2 mt-3 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>All participant registrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Event statistics and analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Photos and media content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Reviews and ratings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-yellow-400" />
                <p className="font-medium text-yellow-300 text-sm">
                  Consider archiving instead to preserve data
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                onCancel();
                toast.dismiss(t.id);
                fancyToast.info(
                  "Deletion cancelled. Your event is safe.",
                  "Action Cancelled"
                );
              }}
              className="group relative flex-1 bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 shadow-lg py-4 border-2 border-white/20 rounded-xl overflow-hidden font-bold text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 group-hover:from-green-500/10 to-emerald-500/0 group-hover:to-emerald-500/10 transition-all"></div>
              <div className="relative flex justify-center items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Keep Event</span>
              </div>
            </button>
            <button
              onClick={() => {
                onConfirm();
                toast.dismiss(t.id);
              }}
              className="group relative flex-1 bg-gradient-to-r from-red-600 hover:from-red-700 to-rose-700 hover:to-rose-800 shadow-lg py-4 border-2 border-red-500/30 rounded-xl overflow-hidden font-bold text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 group-hover:from-white/10 to-white/0 group-hover:to-white/5 transition-all"></div>
              <div className="relative flex justify-center items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Delete Forever</span>
              </div>
            </button>
          </div>

          <div className="-bottom-4 -left-4 absolute opacity-10">
            <Trophy className="w-24 h-24 text-white rotate-12" />
          </div>
        </motion.div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  },
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
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
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserHostOfThisEvent, setIsUserHostOfThisEvent] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchEventDetails();
      if (user) {
        checkCanJoin();
        fetchReviews();
        checkUserReview();
        checkUserRole();
      }
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    if (!id) return;

    try {
      const response = await API.get(`/events/${id}`);
      if (response.data.success) {
        setEvent({ ...response.data.data.event });
        checkIfUserIsHost(response.data.data.event);
      } else {
        throw new Error(response.data.message || "Event not found");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load event";
      setError(errorMessage);
      showToast("error", "load-error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = () => {
    if (!user) {
      setIsUserAdmin(false);
      setIsUserHostOfThisEvent(false);
      return;
    }
    setIsUserAdmin(user.role === "admin");
  };

  const checkIfUserIsHost = (eventData: EventDetails) => {
    if (!user || !eventData) {
      setIsUserHostOfThisEvent(false);
      return;
    }
    setIsUserHostOfThisEvent(eventData.host._id === user.id);
  };

  const fetchReviews = async () => {
    if (!id) return;

    try {
      setLoadingReviews(true);
      const response = await API.get(`/events/${id}/reviews`);
      if (response.data.success) {
        const userReviews = (response.data.data.reviews || []).filter(
          (review: Review) => review.user && review.user.role === "user"
        );
        setReviews(userReviews);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const checkUserReview = async () => {
    if (!user || user.role !== "user" || !id) return;
    try {
      const response = await API.get(`/events/${id}/reviews/check`);
      if (response.data.success && response.data.data.review) {
        setUserReview({
          rating: response.data.data.review.rating,
          comment: response.data.data.review.comment,
          _id: response.data.data.review._id,
        });
        setUserHasReview(true);
      } else setUserHasReview(false);
    } catch (err) {
      console.error("Error checking user review:", err);
    }
  };

  const checkCanJoin = async () => {
    if (!user || user.role !== "user" || !id) {
      setCanJoinInfo({
        canJoin: false,
        reasons: [
          "Only regular users can join events. Hosts and admins cannot join.",
        ],
      });
      return;
    }

    try {
      const response = await API.get(`/events/${id}/can-join`);
      if (response.data.success) {
        setCanJoinInfo({ ...response.data.data });
      } else setCanJoinInfo(null);
    } catch (err) {
      console.error("Error checking join status:", err);
      setCanJoinInfo(null);
    }
  };

  const handleEditEvent = () => {
    if (!canEditDeleteEvent()) {
      showToast(
        "error",
        "edit-auth-error",
        "You are not authorized to edit this event"
      );
      return;
    }
    router.push(`/events/edit/${id}`);
  };

  const handleDeleteEvent = async () => {
    if (!canEditDeleteEvent() || !event) {
      showToast(
        "error",
        "delete-auth-error",
        "You are not authorized to delete this event"
      );
      return;
    }

    showToast(
      "custom",
      `delete-event-confirm-${id}`,
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="relative bg-gradient-to-br from-red-500 via-rose-600 to-pink-700 shadow-2xl backdrop-blur-xl p-8 border-2 border-red-400/40 rounded-2xl max-w-lg"
        >
          <div className="-top-3 -right-3 absolute">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <div className="relative bg-red-500/20 p-3 border-2 border-red-400/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-lg rounded-full"></div>
                <div className="relative bg-white/10 p-3 rounded-full">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">
                  ⚠️ Critical Action
                </h3>
                <p className="text-white/70 text-sm">
                  {isUserAdmin
                    ? "Administrative Deletion"
                    : isUserHostOfThisEvent
                    ? "Host Deletion"
                    : "Event Deletion"}
                </p>
              </div>
            </div>

            {isUserHostOfThisEvent && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 mb-4 p-4 border border-yellow-400/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <p className="text-yellow-300 text-sm">
                    ⚠️ As the host, deleting this event will remove it
                    permanently.
                  </p>
                </div>
              </div>
            )}

            {isUserAdmin && !isUserHostOfThisEvent && (
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 mb-4 p-4 border border-blue-400/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <p className="text-blue-300 text-sm">
                    ⚠️ You are deleting this event as an administrator.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 mb-6 p-6 border border-red-400/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Clock className="w-5 h-5 text-red-300" />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-white">
                    Warning: Permanent Deletion
                  </h4>
                  <p className="text-white/80 text-sm">
                    You are about to permanently delete{" "}
                    <span className="font-bold text-white">
                      "{event.title}"
                    </span>
                    . This will remove all event data including:
                  </p>
                  <ul className="space-y-2 mt-3 text-white/70 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>All participant registrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Event statistics and analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Photos and media content</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="bg-red-400 rounded-full w-1.5 h-1.5"></div>
                      <span>Reviews and ratings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-yellow-400" />
                <p className="font-medium text-yellow-300 text-sm">
                  Consider archiving instead to preserve data
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                showToast(
                  "info",
                  "delete-cancelled",
                  "Deletion cancelled. Your event is safe.",
                  "Action Cancelled"
                );
                toast.dismiss(t.id);
              }}
              className="group relative flex-1 bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 shadow-lg py-4 border-2 border-white/20 rounded-xl overflow-hidden font-bold text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 group-hover:from-green-500/10 to-emerald-500/0 group-hover:to-emerald-500/10 transition-all"></div>
              <div className="relative flex justify-center items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Keep Event</span>
              </div>
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await performDeleteEvent();
              }}
              className="group relative flex-1 bg-gradient-to-r from-red-600 hover:from-red-700 to-rose-700 hover:to-rose-800 shadow-lg py-4 border-2 border-red-500/30 rounded-xl overflow-hidden font-bold text-white transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 group-hover:from-white/10 to-white/0 group-hover:to-white/5 transition-all"></div>
              <div className="relative flex justify-center items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Delete Forever</span>
              </div>
            </button>
          </div>

          <div className="-bottom-4 -left-4 absolute opacity-10">
            <Trophy className="w-24 h-24 text-white rotate-12" />
          </div>
        </motion.div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const performDeleteEvent = async () => {
    if (!id) return;

    try {
      const loadingToast = showToast(
        "custom",
        "delete-loading",
        (t) => (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 shadow-2xl backdrop-blur-xl p-6 border-2 border-blue-400/30 rounded-2xl max-w-md"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-lg rounded-full"></div>
                <div className="relative">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-bold text-white text-lg">
                  Deleting Event...
                </h3>
                <p className="text-white/90">
                  Please wait while we delete "{event?.title}"
                </p>
              </div>
              <div className="flex space-x-1">
                <div
                  className="bg-white/60 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="bg-white/60 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="bg-white/60 rounded-full w-2 h-2 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </motion.div>
        ),
        { duration: Infinity, position: "top-right" }
      );

      const response = await API.delete(`/events/${id}`);

      if (response.data.success) {
        toast.dismiss(loadingToast);
        showToast(
          "success",
          "delete-success",
          `"${event?.title}" deleted successfully!`
        );
        router.push("/events");
      } else {
        throw new Error(response.data.message || "Failed to delete event");
      }
    } catch (err: any) {
      showToast(
        "error",
        "delete-error",
        err.response?.data?.message || err.message || "Failed to delete event"
      );
    }
  };

  const canEditDeleteEvent = (): boolean => {
    if (!user || !event) return false;
    return isUserHostOfThisEvent || isUserAdmin;
  };

  const handleJoinEvent = async () => {
    if (!user || !id) {
      showToast(
        "custom",
        "login-required",
        (t) => (
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
                <p className="text-white/70 text-sm">
                  Please login as a user to join events
                </p>
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
        ),
        { duration: 4000, position: "top-right" }
      );
      return;
    }

    if (user.role !== "user") {
      showToast(
        "error",
        "join-role-error",
        "Only regular users can join events. Hosts and admins cannot join events."
      );
      return;
    }

    // Paid event হলে payment page-এ redirect করুন
    if (event?.joiningFee > 0) {
      router.push(`/payment/${id}`);
      return;
    }

    try {
      setJoining(true);
      const response = await API.post(`/events/${id}/join`);
      if (response.data.success) {
        if (event && user) {
          const updatedParticipants = [
            ...(event.participants || []),
            {
              _id: user.id,
              name: user.name || "User",
              avatar: user.avatar,
              location: user.location || "Unknown",
              role: user.role,
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
        showToast("success", "join-success", "Successfully joined the event!");
      } else throw new Error(response.data.message || "Failed to join event");
    } catch (err: any) {
      console.error("Error joining event:", err);
      showToast(
        "error",
        "join-error",
        err.response?.data?.message || err.message || "Failed to join event"
      );
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user || !id || !event) return;

    if (user.role !== "user") {
      showToast(
        "error",
        "leave-role-error",
        "Only regular users can leave events"
      );
      return;
    }

    showToast(
      "custom",
      `leave-event-${id}`,
      (t) => (
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
              <p className="mt-1 text-white/70">
                Are you sure you want to leave "{event.title}"?
              </p>
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
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const performLeaveEvent = async () => {
    if (!id) return;

    try {
      setLeaving(true);
      const response = await API.post(`/events/${id}/leave`);
      if (response.data.success) {
        if (event && user) {
          const updatedParticipants = (event.participants || []).filter(
            (p) => p._id !== user.id
          );
          setEvent({
            ...event,
            currentParticipants: updatedParticipants.length,
            participants: updatedParticipants,
          });
        }
        await fetchEventDetails();
        await checkCanJoin();
        showToast("success", "leave-success", "Successfully left the event!");
      } else throw new Error(response.data.message || "Failed to leave event");
    } catch (err: any) {
      console.error("Error leaving event:", err);
      showToast(
        "error",
        "leave-error",
        err.response?.data?.message || err.message || "Failed to leave event"
      );
    } finally {
      setLeaving(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || user.role !== "user" || !id) {
      showToast(
        "error",
        "review-auth-error",
        "Only regular users can submit reviews. Hosts and admins cannot submit reviews."
      );
      return;
    }

    if (!userReview.rating) {
      showToast("error", "review-rating-error", "Please provide a rating");
      return;
    }
    try {
      setSubmittingReview(true);
      const endpoint = userHasReview
        ? `/events/${id}/reviews/${userReview._id}`
        : `/events/${id}/reviews`;
      const method = userHasReview ? "PUT" : "POST";
      
      const response = await API[method.toLowerCase()](endpoint, {
        rating: userReview.rating,
        comment: userReview.comment,
        hostId: event?.host._id,
      });
      
      if (response.data.success) {
        showToast(
          "success",
          "review-submit-success",
          userHasReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        await fetchReviews();
        await fetchEventDetails();
        await checkUserReview();
        setShowReviewForm(false);
      } else throw new Error(response.data.message || "Failed to submit review");
    } catch (err: any) {
      showToast(
        "error",
        "review-submit-error",
        err.response?.data?.message || err.message || "Failed to submit review"
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview._id || !id) return;

    if (!user || user.role !== "user") {
      showToast(
        "error",
        "review-delete-auth",
        "Only regular users can delete reviews"
      );
      return;
    }

    showToast(
      "custom",
      `delete-review-${id}`,
      (t) => (
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
              <p className="mt-1 text-white/70">
                Are you sure you want to delete your review? This action cannot
                be undone.
              </p>
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
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  const performDeleteReview = async () => {
    if (!userReview._id || !id) return;
    try {
      const response = await API.delete(`/events/${id}/reviews/${userReview._id}`);
      if (response.data.success) {
        showToast(
          "success",
          "review-delete-success",
          "Review deleted successfully!"
        );
        await fetchReviews();
        await fetchEventDetails();
        await checkUserReview();
        setUserReview({ rating: 0, comment: "" });
        setShowReviewForm(false);
      }
    } catch (err: any) {
      showToast(
        "error",
        "review-delete-error",
        err.response?.data?.message || "Failed to delete review"
      );
    }
  };

  const handleLikeEvent = () => {
    showToast(
      "custom",
      "like-event",
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-4 border-2 border-white/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Event added to favorites!</p>
              <p className="text-white/70 text-sm">
                You can find it in your liked events
              </p>
            </div>
          </div>
        </motion.div>
      ),
      { duration: 3000, position: "top-right" }
    );
  };

  const handleShareEvent = () => {
    if (!id) return;

    showToast(
      "custom",
      `share-event-${id}`,
      (t) => (
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
                navigator.clipboard.writeText(
                  `${window.location.origin}/events/${id}`
                );
                showToast(
                  "success",
                  "copy-success",
                  "Link copied to clipboard!"
                );
                toast.dismiss(t.id);
              }}
              className="bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] px-4 py-2 rounded-lg font-bold text-white text-sm transition-all"
            >
              Copy
            </button>
          </div>
        </motion.div>
      ),
      { duration: 4000, position: "top-right" }
    );
  };

  const handleRemindMe = () => {
    showToast(
      "promise",
      "reminder-set",
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: "Setting reminder...",
        success: (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">Reminder set!</p>
              <p className="text-white/70 text-sm">
                You'll be notified 1 hour before
              </p>
            </div>
          </div>
        ),
        error: "Failed to set reminder",
      },
      { duration: 3000, position: "top-right" }
    );
  };

  const isUserParticipant = () => {
    if (!user || !event || !event.participants) return false;
    return event.participants.some((p) => p._id === user.id);
  };

  // Payment এর জন্য নতুন function
  const handlePaymentClick = () => {
    if (!user) {
      showToast(
        "custom",
        "login-required-payment",
        (t) => (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-2xl backdrop-blur-xl p-4 border-2 border-white/20 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Login Required</p>
                <p className="text-white/70 text-sm">
                  Please login to proceed with payment
                </p>
              </div>
              <button
                onClick={() => {
                  router.push(`/login?redirect=/events/${id}`);
                  toast.dismiss(t.id);
                }}
                className="bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] ml-4 px-4 py-2 rounded-lg font-bold text-white text-sm transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>
        ),
        { duration: 4000, position: "top-right" }
      );
      return;
    }

    if (user.role !== "user") {
      showToast(
        "error",
        "payment-role-error",
        "Only regular users can make payments. Hosts and admins cannot join paid events."
      );
      return;
    }

    router.push(`/payment/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <Loader2 className="relative w-16 h-16 text-white animate-spin" />
          </div>
          <p className="mb-2 font-bold text-white text-2xl">
            Loading Event Details
          </p>
          <p className="text-white/60">
            We're preparing the perfect experience for you
          </p>
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
          style: {
            background: "transparent",
            padding: 0,
            margin: 0,
          },
          duration: 4000,
          position: "top-right",
        }}
      />

      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {user &&
            !canEditDeleteEvent() &&
            (isUserHostOfThisEvent || isUserAdmin) && (
              <div className="bg-yellow-500/20 mb-4 p-3 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  Note: You have special permissions (
                  {isUserAdmin ? "Administrator" : "Host"}) but cannot
                  edit/delete this event.
                </p>
              </div>
            )}

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
                isUserHost={isUserHostOfThisEvent}
                isUserParticipant={isUserParticipant()}
                onJoinEvent={handleJoinEvent}
                onLeaveEvent={handleLeaveEvent}
                onPaymentClick={handlePaymentClick}
                joining={joining}
                leaving={leaving}
                processingPayment={processingPayment}
                showReviewForm={showReviewForm}
                setShowReviewForm={setShowReviewForm}
                userReview={userReview}
                setUserReview={setUserReview}
                userHasReview={userHasReview}
                submittingReview={submittingReview}
                onSubmitReview={handleSubmitReview}
                onDeleteReview={handleDeleteReview}
                isUserAdmin={isUserAdmin}
                canEditDeleteEvent={canEditDeleteEvent()}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />

              <ParticipantsSection
                participants={event.participants || []}
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
                  if (user && user.role === "user") {
                    setUserReview({
                      rating: review.rating,
                      comment: review.comment,
                      _id: review._id,
                    });
                    setShowReviewForm(true);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}