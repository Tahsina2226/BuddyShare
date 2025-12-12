"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  host: {
    _id: string;
    name: string;
    email: string;
  } | null; // Make host nullable
  participants: Array<{ _id: string; name: string }>;
  maxParticipants: number;
  currentParticipants: number;
  joiningFee: number;
  status: "open" | "full" | "cancelled" | "completed";
  category: string;
  tags: string[];
  createdAt: string;
}

export default function ManageEventsPage() {
  const {
    user,
    loading: authLoading,
    isAuthenticated,
    initialized,
  } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });

  const showSuccessAlert = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background:
          "linear-gradient(135deg, rgba(150, 167, 141, 0.9), rgba(35, 76, 106, 0.9))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(210, 193, 182, 0.3)",
        color: "#F5F0EB",
        borderRadius: "16px",
        padding: "20px 24px",
        fontSize: "15px",
        fontWeight: "500",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
      icon: "🎉",
      iconTheme: {
        primary: "#F5F0EB",
        secondary: "#234C6A",
      },
    });
  };

  const showErrorAlert = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
      style: {
        background:
          "linear-gradient(135deg, rgba(156, 106, 80, 0.9), rgba(210, 193, 182, 0.9))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(210, 193, 182, 0.3)",
        color: "#F5F0EB",
        borderRadius: "16px",
        padding: "20px 24px",
        fontSize: "15px",
        fontWeight: "500",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
      icon: "⚠️",
      iconTheme: {
        primary: "#F5F0EB",
        secondary: "#9C6A50",
      },
    });
  };

  const showWarningAlert = (message: string) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      style: {
        background:
          "linear-gradient(135deg, rgba(210, 193, 182, 0.9), rgba(156, 106, 80, 0.9))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(245, 240, 235, 0.3)",
        color: "#234C6A",
        borderRadius: "16px",
        padding: "20px 24px",
        fontSize: "15px",
        fontWeight: "500",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
      icon: "🔥",
      iconTheme: {
        primary: "#234C6A",
        secondary: "#D2C1B6",
      },
    });
  };

  const showConfirmationAlert = (message: string, onConfirm: () => void) => {
    toast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } bg-gradient-to-br from-[#234C6A] to-[#2E5A7A] backdrop-blur-xl border border-[#96A78D]/30 rounded-2xl p-6 shadow-2xl max-w-md`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-gradient-to-br from-[#96A78D]/30 to-[#234C6A]/30 p-3 rounded-xl">
              <span className="text-2xl">🤔</span>
            </div>
            <div className="flex-1 ml-4">
              <h3 className="mb-2 font-semibold text-white text-lg">
                Confirmation
              </h3>
              <p className="mb-4 text-[#F5F0EB]/80">{message}</p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.dismiss(t.id)}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/20 rounded-xl text-white transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onConfirm();
                    toast.dismiss(t.id);
                  }}
                  className="bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] hover:opacity-90 px-4 py-2 rounded-xl font-medium text-white transition-all"
                >
                  Confirm
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const showLoadingAlert = () => {
    return toast.loading("Processing...", {
      duration: Infinity,
      position: "top-right",
      style: {
        background:
          "linear-gradient(135deg, rgba(35, 76, 106, 0.9), rgba(46, 90, 122, 0.9))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(210, 193, 182, 0.3)",
        color: "#F5F0EB",
        borderRadius: "16px",
        padding: "20px 24px",
        fontSize: "15px",
        fontWeight: "500",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      },
    });
  };

  useEffect(() => {
    if (!initialized || authLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      showWarningAlert("Please login to access this page.");
      router.push("/auth/login");
      return;
    }

    if (user.role !== "admin") {
      showWarningAlert("Admin access required.");
      router.push("/dashboard");
      return;
    }

    fetchEvents();
  }, [
    user,
    isAuthenticated,
    authLoading,
    initialized,
    router,
    page,
    statusFilter,
    categoryFilter,
    searchTerm,
  ]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const loadingToast = showLoadingAlert();

      let url = `http://localhost:5000/api/events?page=${page}&limit=20`;

      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }

      if (categoryFilter !== "all") {
        url += `&category=${categoryFilter}`;
      }

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss(loadingToast);
        showErrorAlert("Authentication token not found. Please login again.");
        router.push("/auth/login");
        return;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.dismiss(loadingToast);
        showErrorAlert("Session expired. Please login again.");
        router.push("/auth/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Ensure host is never null in the events array
        const eventsWithSafeHost = data.data.events.map((event: any) => ({
          ...event,
          host: event.host || {
            _id: "unknown",
            name: "Unknown Host",
            email: "unknown@example.com",
          },
        }));

        setEvents(eventsWithSafeHost);
        setTotalPages(data.data.pagination.pages);

        const eventsList = eventsWithSafeHost;
        const statsData = {
          total: eventsList.length,
          open: eventsList.filter((e: Event) => e.status === "open").length,
          completed: eventsList.filter((e: Event) => e.status === "completed")
            .length,
          cancelled: eventsList.filter((e: Event) => e.status === "cancelled")
            .length,
          totalRevenue: eventsList.reduce(
            (sum: number, e: Event) =>
              sum + e.joiningFee * e.currentParticipants,
            0
          ),
        };
        setStats(statsData);

        toast.dismiss(loadingToast);
        showSuccessAlert(`Loaded ${eventsList.length} events successfully!`);
      } else {
        setError(data.message || "Failed to load events");
        toast.dismiss(loadingToast);
        showErrorAlert(data.message || "Failed to load events");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events");
      toast.dismiss(loadingToast);
      showErrorAlert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
    showSuccessAlert("Search filters applied successfully!");
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    const loadingToast = showLoadingAlert();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss(loadingToast);
        showErrorAlert("Authentication token not found. Please login again.");
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401) {
        toast.dismiss(loadingToast);
        showErrorAlert("Session expired. Please login again.");
        router.push("/auth/login");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setEvents(
          events.map((event) =>
            event._id === eventId
              ? { ...event, status: newStatus as any }
              : event
          )
        );
        setShowActions(null);
        toast.dismiss(loadingToast);
        showSuccessAlert(
          `Event status updated to ${newStatus.toUpperCase()} successfully!`
        );
      } else {
        toast.dismiss(loadingToast);
        showErrorAlert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      toast.dismiss(loadingToast);
      showErrorAlert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    showConfirmationAlert(
      "Are you sure you want to delete this event? This action cannot be undone.",
      async () => {
        const loadingToast = showLoadingAlert();

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.dismiss(loadingToast);
            showErrorAlert(
              "Authentication token not found. Please login again."
            );
            router.push("/auth/login");
            return;
          }

          const response = await fetch(
            `http://localhost:5000/api/events/${eventId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 401) {
            toast.dismiss(loadingToast);
            showErrorAlert("Session expired. Please login again.");
            router.push("/auth/login");
            return;
          }

          const data = await response.json();

          if (data.success) {
            setEvents(events.filter((event) => event._id !== eventId));
            setShowActions(null);
            toast.dismiss(loadingToast);
            showSuccessAlert("Event deleted successfully! 🗑️");
          } else {
            toast.dismiss(loadingToast);
            showErrorAlert(data.message || "Failed to delete event");
          }
        } catch (err) {
          console.error("Error deleting event:", err);
          toast.dismiss(loadingToast);
          showErrorAlert("Failed to delete event. Please try again.");
        }
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: "bg-[#96A78D]/20 text-[#96A78D] border border-[#96A78D]/30",
      full: "bg-[#9C6A50]/20 text-[#9C6A50] border border-[#9C6A50]/30",
      cancelled: "bg-gray-100/20 text-gray-400 border border-gray-300/30",
      completed: "bg-[#234C6A]/20 text-[#96A78D] border border-[#234C6A]/30",
    };

    return (
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const categories = Array.from(new Set(events.map((event) => event.category)));

  if (!initialized || authLoading) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="border-[#D2C1B6]/30 border-4 border-t-[#D2C1B6] rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-[#D2C1B6]/20 rounded-full w-8 h-8"></div>
              </div>
            </div>
            <p className="mt-6 text-[#F5F0EB] animate-pulse">
              Checking authentication...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (loading && events.length === 0) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="border-[#D2C1B6]/30 border-4 border-t-[#D2C1B6] rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-[#D2C1B6]/20 rounded-full w-8 h-8"></div>
              </div>
            </div>
            <p className="mt-6 text-[#F5F0EB] animate-pulse">
              Loading events...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        gutter={20}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background:
                "linear-gradient(135deg, rgba(150, 167, 141, 0.95), rgba(35, 76, 106, 0.95))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(210, 193, 182, 0.4)",
              color: "#F5F0EB",
              borderRadius: "18px",
              padding: "22px 26px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 15px 35px rgba(35, 76, 106, 0.4)",
            },
            iconTheme: {
              primary: "#F5F0EB",
              secondary: "#234C6A",
            },
          },
          error: {
            style: {
              background:
                "linear-gradient(135deg, rgba(156, 106, 80, 0.95), rgba(210, 193, 182, 0.95))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(210, 193, 182, 0.4)",
              color: "#F5F0EB",
              borderRadius: "18px",
              padding: "22px 26px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 15px 35px rgba(156, 106, 80, 0.4)",
            },
            iconTheme: {
              primary: "#F5F0EB",
              secondary: "#9C6A50",
            },
          },
          loading: {
            style: {
              background:
                "linear-gradient(135deg, rgba(35, 76, 106, 0.95), rgba(46, 90, 122, 0.95))",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(210, 193, 182, 0.4)",
              color: "#F5F0EB",
              borderRadius: "18px",
              padding: "22px 26px",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 15px 35px rgba(35, 76, 106, 0.4)",
            },
          },
        }}
      />
      <div className="bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex md:flex-row flex-col justify-between md:items-center mb-6">
              <div>
                <h1 className="bg-clip-text bg-gradient-to-r from-white via-[#D2C1B6] to-[#F5F0EB] mb-2 font-bold text-transparent text-3xl md:text-4xl">
                  Manage Events
                </h1>
                <p className="text-[#F5F0EB]/70">
                  Monitor and manage all platform events
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchEvents}
                className="bg-gradient-to-r from-[#234C6A]/30 hover:from-[#234C6A]/40 to-[#96A78D]/30 hover:to-[#96A78D]/40 mt-4 md:mt-0 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
              >
                <span className="mr-2 text-xl">🔄</span>
                Refresh Data
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="gap-4 grid grid-cols-2 md:grid-cols-5 mb-8"
            >
              {[
                {
                  value: stats.total,
                  label: "Total Events",
                  emoji: "📊",
                  color: "from-[#234C6A]/20 to-[#2E5A7A]/20",
                },
                {
                  value: stats.open,
                  label: "Open",
                  emoji: "🚀",
                  color: "from-[#96A78D]/20 to-[#7E9175]/20",
                },
                {
                  value: stats.completed,
                  label: "Completed",
                  emoji: "✅",
                  color: "from-[#234C6A]/20 to-[#96A78D]/20",
                },
                {
                  value: stats.cancelled,
                  label: "Cancelled",
                  emoji: "❌",
                  color: "from-[#9C6A50]/20 to-[#D2C1B6]/20",
                },
                {
                  value: formatCurrency(stats.totalRevenue),
                  label: "Total Revenue",
                  emoji: "💰",
                  color: "from-[#D2C1B6]/20 to-[#F5F0EB]/20",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl hover:scale-[1.02] transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                    >
                      <span className="text-white text-xl">{stat.emoji}</span>
                    </div>
                  </div>
                  <div className="mb-1 font-bold text-white text-2xl">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm mb-8 p-6 border border-white/10 rounded-2xl"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex md:flex-row flex-col gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <span className="top-1/2 left-3 absolute text-[#F5F0EB]/50 -translate-y-1/2 transform">
                        🔍
                      </span>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search events by title or description..."
                        className="bg-white/5 py-3 pr-4 pl-10 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-full text-white placeholder-white/50"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white/5 px-4 py-3 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-full md:w-48 text-white appearance-none"
                    >
                      <option value="all" className="bg-[#234C6A]">
                        All Status
                      </option>
                      <option value="open" className="bg-[#234C6A]">
                        Open
                      </option>
                      <option value="full" className="bg-[#234C6A]">
                        Full
                      </option>
                      <option value="cancelled" className="bg-[#234C6A]">
                        Cancelled
                      </option>
                      <option value="completed" className="bg-[#234C6A]">
                        Completed
                      </option>
                    </select>
                    <span className="top-1/2 right-3 absolute text-[#F5F0EB]/50 -translate-y-1/2 transform">
                      ▼
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white/5 px-4 py-3 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-full md:w-48 text-white appearance-none"
                    >
                      <option value="all" className="bg-[#234C6A]">
                        All Categories
                      </option>
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-[#234C6A]"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                    <span className="top-1/2 right-3 absolute text-[#F5F0EB]/50 -translate-y-1/2 transform">
                      ▼
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-[#234C6A]/30 hover:from-[#234C6A]/40 to-[#96A78D]/30 hover:to-[#96A78D]/40 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                  >
                    <span className="mr-2 text-xl">⚙️</span>
                    Filter Events
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#9C6A50]/20 to-[#D2C1B6]/20 backdrop-blur-sm mb-6 p-4 border border-[#9C6A50]/30 rounded-2xl"
            >
              <div className="flex items-center">
                <span className="mr-3 text-[#D2C1B6] text-xl">⚠️</span>
                <span className="text-white">{error}</span>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="divide-y divide-white/10 min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Event Details
                    </th>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Host Info
                    </th>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <AnimatePresence>
                    {events.map((event) => (
                      <motion.tr
                        key={event._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="group hover:bg-white/5"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="mb-2 font-medium text-white text-sm">
                              {event.title}
                            </div>
                            <div className="flex items-center mb-2 text-[#F5F0EB]/50 text-xs">
                              <span className="mr-2">📍</span>
                              {event.location}
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="bg-gradient-to-r from-[#234C6A]/20 to-[#96A78D]/20 px-3 py-1 border border-white/10 rounded-full text-[#D2C1B6] text-xs">
                                {event.category}
                              </span>
                              <span className="text-white text-xs">
                                {event.joiningFee === 0
                                  ? "Free"
                                  : formatCurrency(event.joiningFee)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-white">
                              {event.host?.name || "Unknown Host"}
                            </div>
                            <div className="mb-2 text-[#F5F0EB]/50 text-xs">
                              {event.host?.email || "No email available"}
                            </div>
                            {event.host?._id !== "unknown" && (
                              <Link
                                href={`/profile/${event.host?._id || "#"}`}
                                className="text-[#96A78D] hover:text-[#D2C1B6] text-xs transition-colors"
                              >
                                <span className="flex items-center gap-1">
                                  👤 View Profile
                                </span>
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-white">
                              {formatDate(event.date)}
                            </div>
                            <div className="text-[#F5F0EB]/50">
                              {formatTime(event.time)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2">
                            <div>{getStatusBadge(event.status)}</div>
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setShowActions(
                                    showActions === event._id ? null : event._id
                                  )
                                }
                                className="flex items-center gap-1 text-[#96A78D] hover:text-[#D2C1B6] text-xs transition-colors"
                              >
                                <span>⚙️</span>
                                Manage Status
                              </button>

                              <AnimatePresence>
                                {showActions === event._id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="z-50 absolute bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] shadow-2xl mt-2 border border-white/20 rounded-xl w-40 overflow-hidden"
                                  >
                                    {[
                                      "open",
                                      "full",
                                      "cancelled",
                                      "completed",
                                    ].map((status) => (
                                      <button
                                        key={status}
                                        onClick={() =>
                                          handleStatusChange(event._id, status)
                                        }
                                        className="block hover:bg-white/10 px-4 py-3 border-white/10 border-b last:border-b-0 w-full text-white text-sm text-left transition-colors"
                                      >
                                        <span className="flex items-center gap-2">
                                          {status === "open" && "🟢"}
                                          {status === "full" && "🔴"}
                                          {status === "cancelled" && "⚫"}
                                          {status === "completed" && "✅"}
                                          Set as{" "}
                                          {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                        </span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm">
                            <span className="mr-3 text-[#F5F0EB]/50">👥</span>
                            <div>
                              <div className="font-medium text-white">
                                {event.currentParticipants} /{" "}
                                {event.maxParticipants}
                              </div>
                              <div className="text-[#F5F0EB]/50 text-xs">
                                {Math.round(
                                  (event.currentParticipants /
                                    event.maxParticipants) *
                                    100
                                )}
                                % filled
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-sm">
                          <div className="flex space-x-3">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                href={`/events/${event._id}`}
                                className="text-[#96A78D] hover:text-[#D2C1B6] transition-colors"
                                title="View Event Details"
                              >
                                <span className="text-xl">👁️</span>
                              </Link>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                href={`/events/edit/${event._id}`}
                                className="text-[#96A78D] hover:text-[#D2C1B6] transition-colors"
                                title="Edit Event"
                              >
                                <span className="text-xl">✏️</span>
                              </Link>
                            </motion.div>

                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className="text-[#9C6A50] hover:text-[#D2C1B6] transition-colors"
                                title="Delete Event"
                              >
                                <span className="text-xl">🗑️</span>
                              </button>
                            </motion.div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-white/10 border-t">
                <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                  <div className="text-[#F5F0EB]/70 text-sm">
                    Page {page} of {totalPages} • {events.length} events shown
                  </div>
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 disabled:opacity-50 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 disabled:opacity-50 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all disabled:cursor-not-allowed"
                    >
                      Next →
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {events.length === 0 && !loading && (
              <div className="py-16 text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-br from-white/5 to-white/[0.02] mb-6 p-6 border border-white/10 rounded-2xl">
                  <span className="text-[#F5F0EB]/50 text-4xl">📅</span>
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">
                  No events found
                </h3>
                <p className="mb-6 text-[#F5F0EB]/70">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setPage(1);
                    fetchEvents();
                  }}
                  className="bg-gradient-to-r from-[#234C6A]/30 hover:from-[#234C6A]/40 to-[#96A78D]/30 hover:to-[#96A78D]/40 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                >
                  <span className="mr-2 text-xl">🔄</span>
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
