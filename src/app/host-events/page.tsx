"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types/event";
import {
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  UserCircle,
  Mail,
  Phone,
  Award,
  Target,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Search,
  XCircle,
  RefreshCw,
  BarChart3,
  TrendingUp as TrendingUpIcon,
  PieChart,
  Sparkles,
  Zap,
  Rocket,
  Crown,
  Star,
  X,
  CheckCircle,
  Shield,
  AlertTriangle,
  Clock,
  Trophy,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

// Custom Toast Hook to prevent multiple toasts
const useToast = () => {
  const toastShown = useRef<Record<string, boolean>>({});

  const showToast = (type: string, id: string, ...args: any[]) => {
    if (toastShown.current[id]) return;
    toastShown.current[id] = true;

    setTimeout(() => {
      delete toastShown.current[id];
    }, 1000);

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
      case "loading":
        return fancyToast.loading(...args);
      case "confirmDelete":
        fancyToast.confirmDelete(...args);
        break;
    }
  };

  return { showToast };
};

const fancyToast = {
  success: (message: string) => {
    toast.custom(
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
    toast.custom(
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

  loading: (message: string) => {
    return toast.custom(
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
                Processing...
              </h3>
              <p className="text-white/90">{message}</p>
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
  },

  info: (message: string, title: string = "Info") => {
    toast.custom(
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
    onCancel: () => void
  ) => {
    toast.custom(
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
                  This action is irreversible
                </p>
              </div>
            </div>

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

export default function HostEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    completedEvents: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    avgRating: 0,
  });
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "draft"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const toastIdRef = useRef<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchHostEvents();
    }
  }, [user, filter]);

  const fetchHostEvents = async () => {
    if (!user) {
      setError("Please login as host to view your events");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Clear previous loading toast if exists
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    const loadingToast = showToast(
      "loading",
      "fetch-events",
      "Loading your events..."
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const eventsResponse = await fetch(
        `http://localhost:5000/api/events/host/${user.id}?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!eventsResponse.ok) {
        throw new Error("Failed to fetch events");
      }

      const eventsData = await eventsResponse.json();

      if (eventsData.success) {
        setEvents(eventsData.data.events || []);

        const totalEvents = eventsData.data.events.length;
        const activeEvents = eventsData.data.events.filter(
          (e: Event) => e.status === "active" || e.status === "upcoming"
        ).length;
        const completedEvents = eventsData.data.events.filter(
          (e: Event) => e.status === "completed"
        ).length;

        const totalParticipants = eventsData.data.events.reduce(
          (sum: number, event: Event) => sum + (event.currentParticipants || 0),
          0
        );

        const totalRevenue = eventsData.data.events.reduce(
          (sum: number, event: Event) =>
            sum + (event.currentParticipants || 0) * (event.joiningFee || 0),
          0
        );

        const avgRating =
          eventsData.data.events.reduce(
            (sum: number, event: Event) => sum + (event.averageRating || 0),
            0
          ) / (totalEvents || 1);

        setStats({
          totalEvents,
          activeEvents,
          completedEvents,
          totalParticipants,
          totalRevenue,
          avgRating,
        });

        toast.dismiss(loadingToast);
        showToast(
          "success",
          "fetch-success",
          `Loaded ${totalEvents} events successfully!`
        );
      } else {
        throw new Error(eventsData.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error fetching host events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
      toast.dismiss(loadingToast);
      showToast("error", "fetch-error", "Failed to load your events");
    } finally {
      setLoading(false);
      toastIdRef.current = null;
    }
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    setDeletingEventId(eventId);

    showToast(
      "confirmDelete",
      `delete-${eventId}`,
      eventTitle,
      async () => {
        const loadingToast = showToast(
          "loading",
          "deleting",
          "Deleting event..."
        );

        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:5000/api/events/${eventId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (data.success) {
            toast.dismiss(loadingToast);
            showToast(
              "success",
              "delete-success",
              `"${eventTitle}" deleted successfully!`
            );
            fetchHostEvents();
          } else {
            throw new Error(data.message || "Failed to delete event");
          }
        } catch (err) {
          toast.dismiss(loadingToast);
          showToast(
            "error",
            "delete-error",
            err instanceof Error ? err.message : "Failed to delete event"
          );
        } finally {
          setDeletingEventId(null);
        }
      },
      () => {
        showToast(
          "info",
          "delete-cancelled",
          `Cancelled deletion of "${eventTitle}"`,
          "Delete Cancelled"
        );
        setDeletingEventId(null);
      }
    );
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    const loadingToast = showToast(
      "loading",
      "status-change",
      "Updating event status..."
    );

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.dismiss(loadingToast);
        showToast(
          "success",
          "status-success",
          `Event status updated to ${newStatus}!`
        );
        fetchHostEvents();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      showToast(
        "error",
        "status-error",
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  };

  const filteredEvents = events.filter((event) => {
    if (searchQuery) {
      return (
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  if (!user || user.role !== "host") {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
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
              Host Access Required
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              You need to be logged in as a host to view this page.
            </p>
            <Link
              href="/login"
              className="group inline-flex relative items-center gap-3 bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/20 rounded-xl font-bold text-white text-lg transition-all duration-300"
            >
              <UserCircle className="w-5 h-5" />
              <span>Login as Host</span>
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
          <div className="mb-8">
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h1 className="mb-2 font-bold text-white text-3xl lg:text-4xl">
                  My Events Dashboard
                </h1>
                <p className="text-white/70">
                  Manage and track all your hosted events
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/events/create"
                  onClick={() =>
                    showToast(
                      "info",
                      "create-event",
                      "Let's create something amazing!",
                      "Create Event"
                    )
                  }
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] shadow-lg px-6 py-3 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create New Event
                </Link>
                <button
                  onClick={() => {
                    showToast(
                      "info",
                      "refresh",
                      "Refreshing your events...",
                      "Refresh"
                    );
                    fetchHostEvents();
                  }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl font-bold text-white transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#234C6A]/80 to-[#1a3d57]/80 shadow-2xl backdrop-blur-xl mb-8 p-6 border-2 border-white/20 rounded-2xl">
              <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-xl">
                    <UserCircle className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-2xl">
                      {user.name}
                    </h2>
                    <p className="text-white/70">Event Host</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-white/70">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-white/70">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-white">Verified Host</span>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {[
              {
                label: "Total Events",
                value: stats.totalEvents,
                icon: CalendarIcon,
                color: "from-[#234C6A] to-[#1a3d57]",
                change: "+12%",
              },
              {
                label: "Active Events",
                value: stats.activeEvents,
                icon: Target,
                color: "from-[#96A78D] to-[#889c7e]",
                change: "+8%",
              },
              {
                label: "Total Participants",
                value: stats.totalParticipants,
                icon: UsersIcon,
                color: "from-[#D2C1B6] to-[#c4b1a6]",
                change: "+24%",
              },
              {
                label: "Total Revenue",
                value: `$${stats.totalRevenue.toFixed(2)}`,
                icon: DollarSign,
                color: "from-[#234C6A] to-[#D2C1B6]",
                change: "+18%",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm p-6 border border-white/20 hover:border-white/30 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
                onClick={() =>
                  showToast(
                    "info",
                    `stat-${stat.label}`,
                    `${stat.value} ${stat.label.toLowerCase()}`,
                    "Stats"
                  )
                }
              >
                <div className="relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="mb-2 font-medium text-white/60 text-sm">
                        {stat.label}
                      </p>
                      <p className="font-bold text-white text-3xl">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUpIcon className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">
                          {stat.change}
                        </span>
                        <span className="text-white/40 text-sm">
                          from last month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`rounded-xl bg-gradient-to-br ${stat.color} p-3`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="bg-white/10 shadow-xl backdrop-blur-sm mb-8 p-6 border-2 border-white/20 rounded-2xl">
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setFilter("all");
                    showToast(
                      "info",
                      "filter-all",
                      "Showing all events",
                      "Filter"
                    );
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    filter === "all"
                      ? "bg-gradient-to-r from-[#234C6A] to-[#1a3d57] text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  All Events ({stats.totalEvents})
                </button>
                <button
                  onClick={() => {
                    setFilter("active");
                    showToast(
                      "info",
                      "filter-active",
                      "Showing active events",
                      "Filter"
                    );
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    filter === "active"
                      ? "bg-gradient-to-r from-[#96A78D] to-[#889c7e] text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  Active ({stats.activeEvents})
                </button>
                <button
                  onClick={() => {
                    setFilter("completed");
                    showToast(
                      "info",
                      "filter-completed",
                      "Showing completed events",
                      "Filter"
                    );
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    filter === "completed"
                      ? "bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6] text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/80"
                  }`}
                >
                  Completed ({stats.completedEvents})
                </button>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="top-1/2 left-3 absolute w-5 h-5 text-white/50 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your events..."
                    className="bg-white/10 shadow-lg backdrop-blur-sm py-3 pr-4 pl-10 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white placeholder-white/50"
                  />
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    showToast("success", "search-clear", "Search cleared!");
                  }}
                  className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl font-bold text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-32"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                <Loader2 className="relative w-16 h-16 text-white animate-spin" />
              </div>
              <p className="mb-2 font-bold text-white text-2xl">
                Loading Your Events
              </p>
              <p className="text-white/60">
                We're gathering all your hosted events
              </p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 shadow-2xl backdrop-blur-sm p-12 border-2 border-white/20 rounded-2xl text-center"
            >
              <div className="mx-auto max-w-md">
                <div className="inline-flex justify-center items-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm p-8 border border-white/20 rounded-2xl">
                      <AlertCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="mb-4 font-bold text-white text-2xl">
                  Unable to Load Events
                </h3>
                <p className="mb-8 text-white/70 leading-relaxed">{error}</p>
                <button
                  onClick={fetchHostEvents}
                  className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white text-base transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {!loading && !error && (
            <>
              {filteredEvents.length > 0 ? (
                <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="bg-white/5 backdrop-blur-sm border-2 border-white/20 hover:border-white/30 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image || "/api/placeholder/400/200"}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="top-4 right-4 absolute flex gap-2">
                            <span
                              className={`px-3 py-1 rounded-full font-bold text-xs ${
                                event.status === "active"
                                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                  : event.status === "completed"
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                              }`}
                            >
                              {event.status.charAt(0).toUpperCase() +
                                event.status.slice(1)}
                            </span>
                            {event.joiningFee > 0 ? (
                              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/20 rounded-full font-bold text-white text-xs">
                                ${event.joiningFee}
                              </span>
                            ) : (
                              <span className="bg-green-500/20 backdrop-blur-sm px-3 py-1 border border-green-500/30 rounded-full font-bold text-green-300 text-xs">
                                FREE
                              </span>
                            )}
                          </div>
                          <div className="right-4 bottom-4 left-4 absolute">
                            <h3 className="font-bold text-white text-xl truncate">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()}
                              <MapPin className="ml-2 w-4 h-4" />
                              {event.location}
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <p className="mb-4 text-white/70 text-sm line-clamp-2">
                            {event.description}
                          </p>

                          <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-white/60" />
                                <span className="font-medium text-white">
                                  {event.currentParticipants}/
                                  {event.maxParticipants}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white/60 text-sm">
                                Category
                              </div>
                              <div className="font-medium text-white">
                                {event.category}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/events/${event._id}`}
                              onClick={() =>
                                showToast(
                                  "info",
                                  `view-${event._id}`,
                                  `Viewing ${event.title}`,
                                  "Event Details"
                                )
                              }
                              className="inline-flex flex-1 justify-center items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/20 rounded-xl font-medium text-white text-sm transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Link>
                            <Link
                              href={`/events/edit/${event._id}`}
                              onClick={() =>
                                showToast(
                                  "info",
                                  `edit-${event._id}`,
                                  `Editing ${event.title}`,
                                  "Edit Event"
                                )
                              }
                              className="inline-flex flex-1 justify-center items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 border border-blue-500/30 rounded-xl font-medium text-blue-300 text-sm transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteEvent(event._id, event.title)
                              }
                              disabled={deletingEventId === event._id}
                              className={`inline-flex flex-1 justify-center items-center gap-2 ${
                                deletingEventId === event._id
                                  ? "bg-gray-500/20 cursor-not-allowed"
                                  : "bg-red-500/20 hover:bg-red-500/30"
                              } px-4 py-2 border border-red-500/30 rounded-xl font-medium text-red-300 text-sm transition-colors`}
                            >
                              {deletingEventId === event._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              {deletingEventId === event._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>

                          <div className="mt-4 pt-4 border-white/10 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-white/60 text-sm">
                                Status:
                              </span>
                              <div className="flex gap-2">
                                {event.status !== "active" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(event._id, "active")
                                    }
                                    className="bg-green-500/20 hover:bg-green-500/30 px-3 py-1 border border-green-500/30 rounded-lg font-medium text-green-300 text-xs transition-colors"
                                  >
                                    Activate
                                  </button>
                                )}
                                {event.status !== "completed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(event._id, "completed")
                                    }
                                    className="bg-blue-500/20 hover:bg-blue-500/30 px-3 py-1 border border-blue-500/30 rounded-lg font-medium text-blue-300 text-xs transition-colors"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 shadow-2xl backdrop-blur-sm p-12 border-2 border-white/20 rounded-2xl text-center"
                >
                  <div className="mx-auto max-w-md">
                    <div className="inline-flex justify-center items-center mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                        <div className="relative bg-white/10 backdrop-blur-sm p-8 border border-white/20 rounded-2xl">
                          <Calendar className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="mb-4 font-bold text-white text-2xl">
                      No Events Found
                    </h3>
                    <p className="mb-8 text-white/70 leading-relaxed">
                      {filter === "all"
                        ? "You haven't created any events yet."
                        : `You don't have any ${filter} events.`}
                    </p>
                    <Link
                      href="/events/create"
                      onClick={() =>
                        showToast(
                          "info",
                          "create-first-event",
                          "Let's create your first event!",
                          "Get Started"
                        )
                      }
                      className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#96A78D] hover:from-[#889c7e] to-[#889c7e] hover:to-[#96A78D] shadow-lg px-8 py-4 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Create Your First Event
                    </Link>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <div className="bg-gradient-to-r from-[#234C6A]/50 to-[#152a3d]/40 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-white text-2xl">
                      Performance Overview
                    </h3>
                    <p className="mt-2 text-white/70">
                      Your event statistics and growth
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full transition-colors cursor-pointer"
                    onClick={() =>
                      showToast(
                        "info",
                        "analytics",
                        "Analytics dashboard coming soon!",
                        "Performance"
                      )
                    }
                  >
                    <BarChart3 className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">Last 30 days</span>
                  </div>
                </div>

                <div className="flex justify-center items-center h-64">
                  <div className="text-center">
                    <div className="inline-block bg-white/10 backdrop-blur-sm p-8 rounded-2xl">
                      <PieChart className="mx-auto mb-4 w-16 h-16 text-white/30" />
                      <p className="text-white/50">
                        Performance chart coming soon
                      </p>
                      <p className="mt-2 text-white/30 text-sm">
                        View detailed analytics and insights
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
