"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

interface HostRequestUser {
  _id: string;
  name: string;
  email: string;
  location: string;
  interests: string[];
  bio?: string;
  avatar?: string;
  profileImage?: string;
  averageRating: number;
  totalReviews: number;
  eventsHosted: number;
  isVerified: boolean;
  isGoogleUser: boolean;
  hostRequest: {
    requested: boolean;
    requestedAt: string;
    status: string;
    reason: string;
  };
  createdAt: string;
}

export default function HostRequestsPage() {
  const { user, loading: authLoading, isAuthenticated, initialized } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<HostRequestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<HostRequestUser | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState<string>("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!initialized || authLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      showWarningAlert('Please login to access this page.');
      router.push('/auth/login');
      return;
    }

    if (user.role !== "admin") {
      showWarningAlert('Admin access required.');
      router.push('/dashboard');
      return;
    }

    fetchHostRequests();
  }, [user, isAuthenticated, authLoading, initialized, router]);

  const showSuccessAlert = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, rgba(150, 167, 141, 0.9), rgba(35, 76, 106, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(210, 193, 182, 0.3)',
        color: '#F5F0EB',
        borderRadius: '16px',
        padding: '20px 24px',
        fontSize: '15px',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      icon: '👤',
      iconTheme: {
        primary: '#F5F0EB',
        secondary: '#234C6A',
      },
    });
  };

  const showErrorAlert = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, rgba(156, 106, 80, 0.9), rgba(210, 193, 182, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(210, 193, 182, 0.3)',
        color: '#F5F0EB',
        borderRadius: '16px',
        padding: '20px 24px',
        fontSize: '15px',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      icon: '⚠️',
      iconTheme: {
        primary: '#F5F0EB',
        secondary: '#9C6A50',
      },
    });
  };

  const showWarningAlert = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, rgba(210, 193, 182, 0.9), rgba(156, 106, 80, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245, 240, 235, 0.3)',
        color: '#234C6A',
        borderRadius: '16px',
        padding: '20px 24px',
        fontSize: '15px',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      icon: '🔥',
      iconTheme: {
        primary: '#234C6A',
        secondary: '#D2C1B6',
      },
    });
  };

  const showConfirmationAlert = (message: string, onConfirm: () => void) => {
    toast.custom((t) => (
      <div className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } bg-gradient-to-br from-[#234C6A] to-[#2E5A7A] backdrop-blur-xl border border-[#96A78D]/30 rounded-2xl p-6 shadow-2xl max-w-md`}>
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-gradient-to-br from-[#96A78D]/30 to-[#234C6A]/30 p-3 rounded-xl">
            <span className="text-2xl">🤔</span>
          </div>
          <div className="flex-1 ml-4">
            <h3 className="mb-2 font-semibold text-white text-lg">Confirmation</h3>
            <p className="mb-4 text-[#F5F0EB]/80">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/20 rounded-xl text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  toast.dismiss(t.id);
                }}
                className="bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] hover:opacity-90 px-4 py-2 rounded-xl font-medium text-white transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const showLoadingAlert = () => {
    return toast.loading('Processing...', {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, rgba(35, 76, 106, 0.9), rgba(46, 90, 122, 0.9))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(210, 193, 182, 0.3)',
        color: '#F5F0EB',
        borderRadius: '16px',
        padding: '20px 24px',
        fontSize: '15px',
        fontWeight: '500',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
    });
  };

  const fetchHostRequests = async () => {
    try {
      setLoading(true);
      const loadingToast = showLoadingAlert();

      const token = localStorage.getItem("token");
      if (!token) {
        toast.dismiss(loadingToast);
        showErrorAlert('Authentication token not found. Please login again.');
        router.push('/auth/login');
        return;
      }

      const response = await fetch("http://localhost:5000/api/host/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.dismiss(loadingToast);
        showErrorAlert('Session expired. Please login again.');
        router.push('/auth/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setRequests(data.data.requests || []);
        toast.dismiss(loadingToast);
        showSuccessAlert(`Loaded ${data.data.requests?.length || 0} host requests successfully!`);
      } else {
        setError(data.message || "Failed to load host requests");
        toast.dismiss(loadingToast);
        showErrorAlert(data.message || "Failed to load host requests");
      }
    } catch (err) {
      console.error("Error fetching host requests:", err);
      setError("Failed to load host requests");
      toast.dismiss(loadingToast);
      showErrorAlert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    showConfirmationAlert("Are you sure you want to approve this host request?", async () => {
      try {
        setProcessing(userId);
        const loadingToast = showLoadingAlert();

        const token = localStorage.getItem("token");
        if (!token) {
          toast.dismiss(loadingToast);
          showErrorAlert('Authentication token not found. Please login again.');
          router.push('/auth/login');
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/host/approve/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          toast.dismiss(loadingToast);
          showErrorAlert('Session expired. Please login again.');
          router.push('/auth/login');
          return;
        }

        const data = await response.json();

        if (data.success) {
          setRequests(requests.filter((req) => req._id !== userId));
          toast.dismiss(loadingToast);
          showSuccessAlert("Host request approved successfully! 🎉");
        } else {
          toast.dismiss(loadingToast);
          showErrorAlert(data.message || "Failed to approve request");
        }
      } catch (err) {
        console.error("Error approving request:", err);
        toast.dismiss(loadingToast);
        showErrorAlert("Failed to approve request");
      } finally {
        setProcessing(null);
      }
    });
  };

  const handleReject = async (userId: string, reason: string) => {
    if (!reason.trim()) {
      showErrorAlert("Please provide a rejection reason");
      return;
    }

    showConfirmationAlert("Are you sure you want to reject this host request?", async () => {
      try {
        setProcessing(userId);
        const loadingToast = showLoadingAlert();

        const token = localStorage.getItem("token");
        if (!token) {
          toast.dismiss(loadingToast);
          showErrorAlert('Authentication token not found. Please login again.');
          router.push('/auth/login');
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/host/reject/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rejectionReason: reason }),
          }
        );

        if (response.status === 401) {
          toast.dismiss(loadingToast);
          showErrorAlert('Session expired. Please login again.');
          router.push('/auth/login');
          return;
        }

        const data = await response.json();

        if (data.success) {
          setRequests(requests.filter((req) => req._id !== userId));
          setShowRejectModal(false);
          setRejectReason("");
          setSelectedRequest(null);
          toast.dismiss(loadingToast);
          showSuccessAlert("Host request rejected successfully! ❌");
        } else {
          toast.dismiss(loadingToast);
          showErrorAlert(data.message || "Failed to reject request");
        }
      } catch (err) {
        console.error("Error rejecting request:", err);
        toast.dismiss(loadingToast);
        showErrorAlert("Failed to reject request");
      } finally {
        setProcessing(null);
      }
    });
  };

  const openRejectModal = (request: HostRequestUser) => {
    setSelectedRequest(request);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-gradient-to-r from-[#D2C1B6]/20 to-[#9C6A50]/20 text-[#D2C1B6] border border-[#9C6A50]/30',
      approved: 'bg-gradient-to-r from-[#96A78D]/20 to-[#234C6A]/20 text-[#96A78D] border border-[#96A78D]/30',
      rejected: 'bg-gradient-to-r from-[#9C6A50]/20 to-[#D2C1B6]/20 text-[#9C6A50] border border-[#9C6A50]/30'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {status === 'pending' && '⏳'}
        {status === 'approved' && '✅'}
        {status === 'rejected' && '❌'}
        <span className="ml-2 capitalize">{status}</span>
      </span>
    );
  };

  const filteredRequests = requests.filter((request) => {
    if (filter !== "all" && request.hostRequest.status !== filter) {
      return false;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.name.toLowerCase().includes(searchLower) ||
        request.email.toLowerCase().includes(searchLower) ||
        request.location.toLowerCase().includes(searchLower) ||
        request.hostRequest.reason.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.hostRequest.status === "pending").length,
    approved: requests.filter((r) => r.hostRequest.status === "approved")
      .length,
    rejected: requests.filter((r) => r.hostRequest.status === "rejected")
      .length,
  };

  if (!initialized || authLoading) {
    return (
      <>
        <Toaster />
        <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="border-[#D2C1B6]/30 border-4 border-t-[#D2C1B6] rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-[#D2C1B6]/20 rounded-full w-8 h-8"></div>
              </div>
            </div>
            <p className="mt-6 text-[#F5F0EB] animate-pulse">Checking authentication...</p>
          </div>
        </div>
      </>
    );
  }

  if (loading && requests.length === 0) {
    return (
      <>
        <Toaster />
        <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="border-[#D2C1B6]/30 border-4 border-t-[#D2C1B6] rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-[#D2C1B6]/20 rounded-full w-8 h-8"></div>
              </div>
            </div>
            <p className="mt-6 text-[#F5F0EB] animate-pulse">Loading host requests...</p>
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
              background: 'linear-gradient(135deg, rgba(150, 167, 141, 0.95), rgba(35, 76, 106, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(210, 193, 182, 0.4)',
              color: '#F5F0EB',
              borderRadius: '18px',
              padding: '22px 26px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 15px 35px rgba(35, 76, 106, 0.4)',
            },
            iconTheme: {
              primary: '#F5F0EB',
              secondary: '#234C6A',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, rgba(156, 106, 80, 0.95), rgba(210, 193, 182, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(210, 193, 182, 0.4)',
              color: '#F5F0EB',
              borderRadius: '18px',
              padding: '22px 26px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 15px 35px rgba(156, 106, 80, 0.4)',
            },
            iconTheme: {
              primary: '#F5F0EB',
              secondary: '#9C6A50',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, rgba(35, 76, 106, 0.95), rgba(46, 90, 122, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(210, 193, 182, 0.4)',
              color: '#F5F0EB',
              borderRadius: '18px',
              padding: '22px 26px',
              fontSize: '16px',
              fontWeight: '500',
              boxShadow: '0 15px 35px rgba(35, 76, 106, 0.4)',
            },
          },
        }}
      />

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] shadow-2xl rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#9C6A50]/30 to-[#D2C1B6]/30 p-3 rounded-xl">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-bold text-white text-lg">
                  Reject Host Request
                </h3>
              </div>

              <div className="mb-6">
                <p className="mb-2 text-[#F5F0EB]">
                  You are about to reject{" "}
                  <span className="font-semibold">
                    {selectedRequest.name}'s
                  </span>{" "}
                  host request.
                </p>
                <p className="mb-4 text-[#F5F0EB]/70 text-sm">
                  Please provide a reason for rejection. This will be shared
                  with the user.
                </p>

                <div className="bg-white/5 mb-4 p-3 border border-white/10 rounded-xl">
                  <p className="mb-1 text-[#D2C1B6] text-sm">
                    User's application reason:
                  </p>
                  <p className="text-white text-sm italic">
                    "{selectedRequest.hostRequest.reason}"
                  </p>
                </div>

                <label className="block mb-2 font-medium text-[#D2C1B6] text-sm">
                  Rejection Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why the request is being rejected..."
                  rows={4}
                  className="bg-white/5 px-4 py-3 border border-white/10 focus:border-[#9C6A50] rounded-xl focus:outline-none focus:ring-[#9C6A50] focus:ring-2 w-full text-white placeholder-white/50"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleReject(selectedRequest._id, rejectReason)
                  }
                  disabled={
                    !rejectReason.trim() || processing === selectedRequest._id
                  }
                  className="flex-1 bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] hover:opacity-90 disabled:opacity-50 px-4 py-2 rounded-xl font-medium text-white transition-all disabled:cursor-not-allowed"
                >
                  {processing === selectedRequest._id
                    ? "⏳ Rejecting..."
                    : "❌ Reject Request"}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRequest(null);
                    setRejectReason("");
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/20 rounded-xl font-medium text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-[#234C6A] to-[#2E5A7A] py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex md:flex-row flex-col justify-between md:items-center mb-6">
              <div>
                <h1 className="bg-clip-text bg-gradient-to-r from-white via-[#D2C1B6] to-[#F5F0EB] mb-2 font-bold text-transparent text-3xl md:text-4xl">
                  Host Requests Management
                </h1>
                <p className="text-[#F5F0EB]/70">
                  Review and manage host applications
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={fetchHostRequests}
                  className="bg-gradient-to-r from-[#234C6A]/30 hover:from-[#234C6A]/40 to-[#96A78D]/30 hover:to-[#96A78D]/40 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                >
                  <span className="mr-2 text-xl">🔄</span>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="gap-6 grid grid-cols-1 md:grid-cols-4 mb-8">
            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-gradient-to-br from-[#234C6A]/20 to-[#2E5A7A]/20 p-3 rounded-xl">
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
              <div className="mb-1 font-bold text-white text-2xl">{stats.total}</div>
              <div className="text-white/70 text-sm">Total Requests</div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-gradient-to-br from-[#D2C1B6]/20 to-[#9C6A50]/20 p-3 rounded-xl">
                  <span className="text-white text-xl">⏳</span>
                </div>
              </div>
              <div className="mb-1 font-bold text-white text-2xl">{stats.pending}</div>
              <div className="text-white/70 text-sm">Pending Review</div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-gradient-to-br from-[#96A78D]/20 to-[#234C6A]/20 p-3 rounded-xl">
                  <span className="text-white text-xl">✅</span>
                </div>
              </div>
              <div className="mb-1 font-bold text-white text-2xl">{stats.approved}</div>
              <div className="text-white/70 text-sm">Approved</div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl hover:scale-[1.02] transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-gradient-to-br from-[#9C6A50]/20 to-[#D2C1B6]/20 p-3 rounded-xl">
                  <span className="text-white text-xl">❌</span>
                </div>
              </div>
              <div className="mb-1 font-bold text-white text-2xl">{stats.rejected}</div>
              <div className="text-white/70 text-sm">Rejected</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm mb-6 p-6 border border-white/10 rounded-2xl">
            <div className="flex md:flex-row flex-col gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="top-1/2 left-3 absolute text-[#F5F0EB]/50 -translate-y-1/2 transform">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, email, location, or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 py-3 pr-4 pl-10 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-full text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-3 ${
                      filter === "all"
                        ? "bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 text-white"
                        : "text-[#F5F0EB]/70 hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-3 ${
                      filter === "pending"
                        ? "bg-gradient-to-r from-[#D2C1B6]/30 to-[#9C6A50]/30 text-white"
                        : "text-[#F5F0EB]/70 hover:text-white"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter("approved")}
                    className={`px-4 py-3 ${
                      filter === "approved"
                        ? "bg-gradient-to-r from-[#96A78D]/30 to-[#234C6A]/30 text-white"
                        : "text-[#F5F0EB]/70 hover:text-white"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilter("rejected")}
                    className={`px-4 py-3 ${
                      filter === "rejected"
                        ? "bg-gradient-to-r from-[#9C6A50]/30 to-[#D2C1B6]/30 text-white"
                        : "text-[#F5F0EB]/70 hover:text-white"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="py-16 text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-br from-white/5 to-white/[0.02] mb-6 p-6 border border-white/10 rounded-2xl">
                  <span className="text-[#F5F0EB]/50 text-4xl">👥</span>
                </div>
                <h3 className="mb-3 font-medium text-white text-xl">
                  {searchTerm || filter !== "all"
                    ? "No matching requests"
                    : "No Pending Requests"}
                </h3>
                <p className="mb-6 text-[#F5F0EB]/70">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter"
                    : "All host requests have been processed."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="divide-y divide-white/10 min-w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                          Applicant
                        </th>
                        <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                          Request Details
                        </th>
                        <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                          Status & Date
                        </th>
                        <th className="px-6 py-4 font-medium text-[#D2C1B6] text-xs text-left uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentRequests.map((req) => (
                        <tr key={req._id} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-[#234C6A]/30 to-[#96A78D]/30 rounded-full w-10 h-10">
                                {req.avatar || req.profileImage ? (
                                  <img
                                    src={req.avatar || req.profileImage}
                                    alt={req.name}
                                    className="border-2 border-white/20 rounded-full w-10 h-10"
                                  />
                                ) : (
                                  <span className="font-medium text-white">
                                    {req.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-white text-sm">
                                  {req.name}
                                </div>
                                <div className="text-[#F5F0EB]/70 text-sm">
                                  {req.email}
                                </div>
                                <div className="flex items-center text-[#F5F0EB]/50 text-xs">
                                  <span className="mr-1">📍</span>
                                  {req.location}
                                </div>
                                <div className="flex items-center mt-1 text-[#F5F0EB]/50 text-xs">
                                  <span className="mr-1">⭐</span>
                                  {req.averageRating.toFixed(1)} (
                                  {req.totalReviews} reviews)
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="mb-2">
                                <span className="font-medium text-white text-sm">
                                  Reason:
                                </span>
                                <p className="mt-1 text-[#F5F0EB]/70 text-sm line-clamp-2">
                                  {req.hostRequest.reason}
                                </p>
                              </div>
                              {req.interests && req.interests.length > 0 && (
                                <div>
                                  <span className="font-medium text-white text-sm">
                                    Interests:
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {req.interests
                                      .slice(0, 3)
                                      .map((interest, idx) => (
                                        <span
                                          key={idx}
                                          className="bg-white/10 px-2 py-1 border border-white/20 rounded-full text-[#F5F0EB] text-xs"
                                        >
                                          {interest}
                                        </span>
                                      ))}
                                    {req.interests.length > 3 && (
                                      <span className="bg-white/10 px-2 py-1 border border-white/20 rounded-full text-[#F5F0EB] text-xs">
                                        +{req.interests.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center">
                                {getStatusBadge(req.hostRequest.status)}
                              </div>
                              <div className="mt-2 text-sm">
                                <div className="flex items-center text-white">
                                  <span className="mr-2">📅</span>
                                  {formatDate(req.hostRequest.requestedAt)}
                                </div>
                                <div className="mt-1 text-[#F5F0EB]/50 text-xs">
                                  Member since: {formatDate(req.createdAt)}
                                </div>
                                {req.isVerified && (
                                  <div className="inline-flex items-center bg-gradient-to-r from-[#96A78D]/20 to-[#234C6A]/20 mt-1 px-2 py-1 border border-[#96A78D]/30 rounded-full text-[#96A78D] text-xs">
                                    <span className="mr-1">✅</span>
                                    Verified
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-3">
                              <Link
                                href={`/admin/users/${req._id}`}
                                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[#96A78D] hover:text-[#D2C1B6] transition-colors"
                                title="View Profile"
                              >
                                <span className="text-xl">👁️</span>
                              </Link>

                              <Link
                                href={`mailto:${req.email}`}
                                className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-[#96A78D] hover:text-[#D2C1B6] transition-colors"
                                title="Send Email"
                              >
                                <span className="text-xl">📧</span>
                              </Link>

                              {req.hostRequest.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(req._id)}
                                    disabled={processing === req._id}
                                    className="bg-white/5 hover:bg-white/10 disabled:opacity-50 p-2 rounded-lg text-[#96A78D] hover:text-[#D2C1B6] transition-colors"
                                    title="Approve"
                                  >
                                    <span className="text-xl">✅</span>
                                  </button>

                                  <button
                                    onClick={() => openRejectModal(req)}
                                    disabled={processing === req._id}
                                    className="bg-white/5 hover:bg-white/10 disabled:opacity-50 p-2 rounded-lg text-[#9C6A50] hover:text-[#D2C1B6] transition-colors"
                                    title="Reject"
                                  >
                                    <span className="text-xl">❌</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-white/10 border-t">
                    <div className="flex md:flex-row flex-col justify-between items-center gap-4">
                      <div className="text-[#F5F0EB]/70 text-sm">
                        Showing{" "}
                        <span className="font-medium">{startIndex + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(endIndex, filteredRequests.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {filteredRequests.length}
                        </span>{" "}
                        requests
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 disabled:opacity-50 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                                    currentPage === pageNum
                                      ? "bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 text-white border border-[#96A78D]/50"
                                      : "bg-white/5 border border-white/10 text-[#F5F0EB] hover:bg-white/10"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}
                        </div>
                        
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 disabled:opacity-50 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}