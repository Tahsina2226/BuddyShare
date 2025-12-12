"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardData } from "@/types/dashboard";
import EventCard from "@/components/events/EventCard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  StatsChart,
  RevenueChart,
  EventTypeChart,
  ActivityTimeline,
  ComparisonChart,
} from "@/components/charts/DashboardChart";
import toast, { Toaster } from "react-hot-toast";
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiShare2,
  FiStar,
  FiMapPin,
  FiActivity,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiGrid,
  FiPieChart,
  FiBarChart2,
  FiTarget,
  FiAward,
  FiGlobe,
  FiDatabase,
  FiLayers,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [chartData, setChartData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "analytics" | "hosting" | "admin"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalHosts: 0,
    totalAdmins: 0,
    verifiedUsers: 0,
    bannedUsers: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token") || "";

        const joinedResponse = await fetch(
          "http://localhost:5000/api/events/joined/events",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!joinedResponse.ok) {
          throw new Error("Failed to fetch joined events");
        }

        const joinedData = await joinedResponse.json();
        const joinedEvents = joinedData.data?.events || [];

        let hostedEvents = [];
        if (user?.role === "host" || user?.role === "admin") {
          const hostedResponse = await fetch(
            "http://localhost:5000/api/events/my/events",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (hostedResponse.ok) {
            const hostedData = await hostedResponse.json();
            hostedEvents = hostedData.data?.events || [];
          }
        }

        let adminStatsData = { 
          totalUsers: 0, 
          totalEvents: 0,
          totalHosts: 0,
          totalAdmins: 0,
          verifiedUsers: 0,
          bannedUsers: 0,
        };
        
        if (user?.role === "admin") {
          try {
            const usersResponse = await fetch(
              "http://localhost:5000/api/users",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (usersResponse.ok) {
              const usersData = await usersResponse.json();
              if (usersData.success) {
                const allUsers = usersData.data?.users || [];
                adminStatsData.totalUsers = allUsers.length;
                adminStatsData.totalHosts = allUsers.filter((u: any) => u.role === 'host').length;
                adminStatsData.totalAdmins = allUsers.filter((u: any) => u.role === 'admin').length;
                adminStatsData.verifiedUsers = allUsers.filter((u: any) => u.isVerified).length;
                adminStatsData.bannedUsers = allUsers.filter((u: any) => u.isBanned).length;
              }
            }

            const allEventsResponse = await fetch(
              "http://localhost:5000/api/events",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (allEventsResponse.ok) {
              const allEventsData = await allEventsResponse.json();
              if (allEventsData.success) {
                adminStatsData.totalEvents = allEventsData.data?.events?.length || 0;
              }
            }
          } catch (adminError) {
            console.warn("Could not fetch admin stats:", adminError);
          }
        }

        setAdminStats(adminStatsData);

        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const upcomingEvents = joinedEvents.filter((event: any) => {
          const eventDate = new Date(event.date);
          return (
            eventDate > today &&
            eventDate <= thirtyDaysFromNow &&
            event.status === "open"
          );
        });

        const pastEvents = joinedEvents.filter((event: any) => {
          const eventDate = new Date(event.date);
          return eventDate < today;
        });

        const activeHostedEvents = hostedEvents.filter(
          (event: any) => event.status === "open"
        );

        const completedHostedEvents = hostedEvents.filter(
          (event: any) => event.status === "completed"
        );

        const hostEarnings = 0;

        const reviewsFromEvents = hostedEvents.flatMap(
          (event: any) => event.reviews || []
        );
        const averageRating =
          reviewsFromEvents.length > 0
            ? reviewsFromEvents.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              ) / reviewsFromEvents.length
            : 0;

        const conversionRate =
          hostedEvents.length > 0
            ? Math.round(
                (activeHostedEvents.length / hostedEvents.length) * 100
              )
            : 0;

        const engagementRate =
          joinedEvents.length > 0
            ? Math.round((upcomingEvents.length / joinedEvents.length) * 100)
            : 0;

        const stats = {
          hostedEvents: hostedEvents.length,
          joinedEvents: joinedEvents.length,
          upcomingEvents: upcomingEvents.length,
          pastEvents: pastEvents.length,
          hostEarnings: hostEarnings,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: reviewsFromEvents.length,
          activeHostedEvents: activeHostedEvents.length,
          completedHostedEvents: completedHostedEvents.length,
          conversionRate: conversionRate,
          engagementRate: engagementRate,
          totalUsers: adminStatsData.totalUsers,
          totalEvents: adminStatsData.totalEvents,
          totalHosts: adminStatsData.totalHosts,
          totalAdmins: adminStatsData.totalAdmins,
          verifiedUsers: adminStatsData.verifiedUsers,
          bannedUsers: adminStatsData.bannedUsers,
        };

        const chartData = generateChartData(
          joinedEvents,
          hostedEvents,
          [],
          timeRange
        );

        setDashboardData({
          stats,
          upcomingEvents: upcomingEvents.slice(0, 3),
          recentEvents: joinedEvents.slice(0, 5),
          hostedEvents: hostedEvents.slice(0, 3),
          activeHostedEvents: activeHostedEvents.slice(0, 3),
          pastEvents: pastEvents.slice(0, 3),
        });

        setChartData(chartData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");

        toast.error(
          <div className="flex items-center gap-3">
            <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
              <FiAlertCircle className="text-[#9C6A50] text-xl" />
            </div>
            <div>
              <p className="font-medium text-[#F5F0EB]">Dashboard Error</p>
              <p className="text-[#D2C1B6]/70 text-sm">
                Could not load dashboard data
              </p>
            </div>
          </div>,
          {
            duration: 4000,
            position: "top-right",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, timeRange]);

  const generateChartData = (
    joinedEvents: any[],
    hostedEvents: any[],
    succeededPayments: any[],
    range: string
  ) => {
    let days = 7;
    if (range === "month") days = 30;
    if (range === "year") days = 365;

    const revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const revenueDataPoint = {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          ...(range === "year" && { month: "short" }),
        }),
        revenue: 0,
      };

      revenueData.push(revenueDataPoint);
    }

    const typeDistribution = hostedEvents.reduce((acc: any[], event: any) => {
      const category = event.category || "Other";
      const existingType = acc.find((item) => item.type === category);

      if (existingType) {
        existingType.count += 1;
      } else {
        acc.push({ type: category, count: 1 });
      }

      return acc;
    }, []);

    const paymentActivity = [];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const labels = months.slice(
      Math.max(0, currentMonth - 6),
      currentMonth + 1
    );

    const joinedByMonth = new Array(labels.length).fill(0);
    const hostedByMonth = new Array(labels.length).fill(0);

    joinedEvents.forEach((event: any) => {
      const eventDate = new Date(event.date);
      const monthIndex = months[eventDate.getMonth()];
      const labelIndex = labels.indexOf(monthIndex);
      if (labelIndex !== -1) {
        joinedByMonth[labelIndex] += 1;
      }
    });

    hostedEvents.forEach((event: any) => {
      const eventDate = new Date(event.date);
      const monthIndex = months[eventDate.getMonth()];
      const labelIndex = labels.indexOf(monthIndex);
      if (labelIndex !== -1) {
        hostedByMonth[labelIndex] += 1;
      }
    });

    const statsComparison = {
      labels,
      datasets: [
        {
          label: "Events Joined",
          data: joinedByMonth,
          borderColor: "#234C6A",
          backgroundColor: "rgba(35, 76, 106, 0.1)",
          tension: 0.4,
        },
        {
          label: "Events Hosted",
          data: hostedByMonth,
          borderColor: "#96A78D",
          backgroundColor: "rgba(150, 167, 141, 0.1)",
          tension: 0.4,
        },
      ],
    };

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyActivityData = new Array(7).fill(0);

    const allEvents = [...joinedEvents, ...hostedEvents];
    allEvents.forEach((event: any) => {
      const eventDate = new Date(event.date);
      const dayOfWeek = eventDate.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weeklyActivityData[adjustedDay] += 1;
    });

    const weeklyActivity = {
      labels: daysOfWeek,
      datasets: [
        {
          label: "Activity",
          data: weeklyActivityData,
          backgroundColor: "rgba(35, 76, 106, 0.8)",
          borderColor: "#234C6A",
          borderWidth: 1,
        },
      ],
    };

    return {
      revenueData,
      typeDistribution,
      activityData: paymentActivity,
      statsComparison,
      weeklyActivity,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";

    toast.success(
      <div className="flex items-center gap-3">
        <div className="bg-[#96A78D]/20 p-2 rounded-lg">
          <FiCheckCircle className="text-[#96A78D] text-xl" />
        </div>
        <div>
          <p className="font-medium text-[#F5F0EB]">Logged out successfully</p>
          <p className="text-[#D2C1B6]/70 text-sm">Redirecting to login page</p>
        </div>
      </div>,
      {
        duration: 2000,
        position: "top-right",
      }
    );
  };

  const exportData = () => {
    toast.success(
      <div className="flex items-center gap-3">
        <div className="bg-[#96A78D]/20 p-2 rounded-lg">
          <FiDownload className="text-[#96A78D] text-xl" />
        </div>
        <div>
          <p className="font-medium text-[#F5F0EB]">Data exported</p>
          <p className="text-[#D2C1B6]/70 text-sm">
            Dashboard data downloaded successfully
          </p>
        </div>
      </div>,
      {
        duration: 3000,
        position: "top-right",
      }
    );
  };

  const shareDashboard = () => {
    if (navigator.share) {
      navigator.share({
        title: "My EventBuddy Dashboard",
        text: "Check out my EventBuddy dashboard!",
        url: window.location.href,
      });
    } else {
      toast.success(
        <div className="flex items-center gap-3">
          <div className="bg-[#96A78D]/20 p-2 rounded-lg">
            <FiShare2 className="text-[#96A78D] text-xl" />
          </div>
          <div>
            <p className="font-medium text-[#F5F0EB]">Link copied</p>
            <p className="text-[#D2C1B6]/70 text-sm">
              Dashboard link copied to clipboard
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          position: "top-right",
        }
      );
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      
      if (data.success) {
        setAdminStats(prev => {
          const updatedStats = { ...prev };
          if (newRole === 'host') {
            updatedStats.totalHosts += 1;
          } else if (newRole === 'admin') {
            updatedStats.totalAdmins += 1;
          }
          return updatedStats;
        });

        toast.success(
          <div className="flex items-center gap-3">
            <div className="bg-[#96A78D]/20 p-2 rounded-lg">
              <FiCheckCircle className="text-[#96A78D] text-xl" />
            </div>
            <div>
              <p className="font-medium text-[#F5F0EB]">Role Updated</p>
              <p className="text-[#D2C1B6]/70 text-sm">
                User role changed to {newRole}
              </p>
            </div>
          </div>,
          {
            duration: 3000,
            position: "top-right",
          }
        );
      } else {
        throw new Error(data.message || 'Failed to update role');
      }
    } catch (err: any) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
            <FiAlertCircle className="text-[#9C6A50] text-xl" />
          </div>
          <div>
            <p className="font-medium text-[#F5F0EB]">Update Failed</p>
            <p className="text-[#D2C1B6]/70 text-sm">
              {err.message || 'Failed to update user role'}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };

  const handleBanToggle = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/ban`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ banned: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setAdminStats(prev => ({
          ...prev,
          bannedUsers: currentStatus ? prev.bannedUsers - 1 : prev.bannedUsers + 1
        }));

        toast.success(
          <div className="flex items-center gap-3">
            <div className={`${currentStatus ? 'bg-[#96A78D]' : 'bg-[#9C6A50]'}/20 p-2 rounded-lg`}>
              <FiCheckCircle className={`${currentStatus ? 'text-[#96A78D]' : 'text-[#9C6A50]'} text-xl`} />
            </div>
            <div>
              <p className="font-medium text-[#F5F0EB]">
                User {currentStatus ? 'Unbanned' : 'Banned'}
              </p>
              <p className="text-[#D2C1B6]/70 text-sm">
                {currentStatus ? 'User can now access the platform' : 'User access has been restricted'}
              </p>
            </div>
          </div>,
          {
            duration: 3000,
            position: "top-right",
          }
        );
      } else {
        throw new Error(data.message || 'Failed to update user status');
      }
    } catch (err: any) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
            <FiAlertCircle className="text-[#9C6A50] text-xl" />
          </div>
          <div>
            <p className="font-medium text-[#F5F0EB]">Action Failed</p>
            <p className="text-[#D2C1B6]/70 text-sm">
              {err.message || 'Failed to update user status'}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };

  const handleVerifyToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token") || "";
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verified: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setAdminStats(prev => ({
          ...prev,
          verifiedUsers: currentStatus ? prev.verifiedUsers - 1 : prev.verifiedUsers + 1
        }));

        toast.success(
          <div className="flex items-center gap-3">
            <div className={`${!currentStatus ? 'bg-[#96A78D]' : 'bg-[#D2C1B6]'}/20 p-2 rounded-lg`}>
              <FiCheckCircle className={`${!currentStatus ? 'text-[#96A78D]' : 'text-[#D2C1B6]'} text-xl`} />
            </div>
            <div>
              <p className="font-medium text-[#F5F0EB]">
                User {!currentStatus ? 'Verified' : 'Unverified'}
              </p>
              <p className="text-[#D2C1B6]/70 text-sm">
                {!currentStatus ? 'User verification completed' : 'User verification removed'}
              </p>
            </div>
          </div>,
          {
            duration: 3000,
            position: "top-right",
          }
        );
      } else {
        throw new Error(data.message || 'Failed to update verification');
      }
    } catch (err: any) {
      toast.error(
        <div className="flex items-center gap-3">
          <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
            <FiAlertCircle className="text-[#9C6A50] text-xl" />
          </div>
          <div>
            <p className="font-medium text-[#F5F0EB]">Action Failed</p>
            <p className="text-[#D2C1B6]/70 text-sm">
              {err.message || 'Failed to update verification'}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };

  if (loading) {
    return (
      <>
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(35, 76, 106, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#F5F0EB",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A] via-[#2E5A7A] to-[#96A78D] min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="border-[#D2C1B6]/30 border-4 border-t-[#D2C1B6] rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] rounded-full w-8 h-8 animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-[#F5F0EB] animate-pulse">
              Loading your dashboard...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(35, 76, 106, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#F5F0EB",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="bg-gradient-to-b from-[#234C6A] via-[#2E5A7A] to-[#96A78D] py-8 min-h-screen">
          <div className="mx-auto px-4 max-w-7xl">
            <div className="py-12 text-center">
              <div className="inline-flex justify-center items-center bg-gradient-to-r from-[#9C6A50]/20 to-[#D2C1B6]/20 mb-4 border border-[#9C6A50]/30 rounded-full w-16 h-16">
                <FiAlertCircle className="text-[#9C6A50] text-2xl" />
              </div>
              <h2 className="bg-clip-text bg-gradient-to-r from-[#F5F0EB] via-[#D2C1B6] to-[#9C6A50] mb-2 font-bold text-transparent text-2xl">
                Error Loading Dashboard
              </h2>
              <p className="mb-6 text-[#F5F0EB]/80">{error}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 hover:from-[#234C6A]/30 to-[#96A78D]/20 hover:to-[#96A78D]/30 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#96A78D] transition-all"
                >
                  <FiRefreshCw />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 px-6 py-3 border border-white/30 rounded-xl text-white transition-all"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!dashboardData || !chartData) {
    return null;
  }

  const isHostOrAdmin = user?.role === "host" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const citiesVisited = new Set(
    dashboardData.recentEvents
      .map((event: any) => event.location)
      .filter(Boolean)
  ).size;
  const activeStreak = "14 days";

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "rgba(35, 76, 106, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "#F5F0EB",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      />
      <div className="bg-gradient-to-b from-[#234C6A] via-[#2E5A7A] to-[#96A78D] min-h-screen">
        <div className="backdrop-blur-md border-[#F5F0EB]/10 border-b">
          <div className="mx-auto px-4 py-6 max-w-7xl">
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-lg p-2 rounded-xl">
                    <FiGrid className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="bg-clip-text bg-gradient-to-r from-white via-[#D2C1B6] to-[#F5F0EB] font-bold text-transparent text-3xl">
                      Dashboard
                    </h1>
                    <p className="mt-1 text-[#F5F0EB]/80">
                      Welcome back,{" "}
                      <span className="font-medium text-[#D2C1B6]">
                        {user?.name}
                      </span>
                      {isAdmin && " (Administrator)"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:block relative">
                  <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-[#F5F0EB]/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 backdrop-blur-sm py-2 pr-4 pl-10 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-64 text-white placeholder-[#F5F0EB]/50"
                  />
                </div>

                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl transition-all"
                >
                  <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#96A78D] rounded-full w-8 h-8">
                    <span className="font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-white">{user?.name}</div>
                    <div className="text-[#F5F0EB]/60 text-xs">
                      {user?.email}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 py-8 max-w-7xl">
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-8">
            <div className="inline-flex bg-white/5 backdrop-blur-sm p-1 rounded-lg">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? "bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 text-[#D2C1B6]"
                      : "text-[#F5F0EB]/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/10 rounded-xl text-white transition-all"
              >
                <FiDownload />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={shareDashboard}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-4 py-2 border border-white/10 rounded-xl text-white transition-all"
              >
                <FiShare2 />
                <span className="hidden sm:inline">Share</span>
              </button>
              {isHostOrAdmin && (
                <Link
                  href="/events/create"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/30 hover:from-[#234C6A]/40 to-[#96A78D]/30 hover:to-[#96A78D]/40 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                >
                  <FiPlus />
                  <span className="hidden sm:inline">Create Event</span>
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#9C6A50]/30 hover:from-[#9C6A50]/40 to-[#D2C1B6]/30 hover:to-[#D2C1B6]/40 px-4 py-2 border border-[#D2C1B6]/50 rounded-xl text-[#F5F0EB] transition-all"
                >
                  <FiUsers />
                  <span className="hidden sm:inline">Manage Users</span>
                </Link>
              )}
            </div>
          </div>

          <motion.div
            className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {isAdmin && [
              {
                label: "Total Users",
                value: adminStats.totalUsers.toString(),
                icon: FiUsers,
                gradient: "from-[#9C6A50] to-[#B88C75]",
                change: `${adminStats.verifiedUsers} verified`,
              },
              {
                label: "Total Events",
                value: adminStats.totalEvents.toString(),
                icon: FiLayers,
                gradient: "from-[#234C6A] to-[#2E5A7A]",
                change: `${adminStats.totalHosts} hosts`,
              },
              {
                label: "Hosts",
                value: adminStats.totalHosts.toString(),
                icon: FiTarget,
                gradient: "from-[#96A78D] to-[#7E9175]",
                change: `${adminStats.totalAdmins} admins`,
              },
              {
                label: "Banned Users",
                value: adminStats.bannedUsers.toString(),
                icon: FiUserX,
                gradient: "from-[#D2C1B6] to-[#B8A79C]",
                change: `${adminStats.verifiedUsers} verified`,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] shadow-lg backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}/20 shadow-md`}
                    >
                      <stat.icon className="text-white text-xl" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-white/70 text-xs">
                      {stat.change}
                    </div>
                  </div>
                  <div className="mb-1 font-bold text-white text-3xl">
                    {stat.value}
                  </div>
                  <div className="mb-4 text-white/70 text-sm">{stat.label}</div>
                </div>
                <div
                  className={`absolute -bottom-8 -right-8 bg-gradient-to-br ${stat.gradient} opacity-10 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-300`}
                ></div>
              </motion.div>
            ))}

            {!isAdmin && [
              {
                label: "Upcoming Events",
                value: dashboardData.stats.upcomingEvents.toString(),
                icon: FiCalendar,
                gradient: "from-[#234C6A] to-[#2E5A7A]",
                change:
                  dashboardData.stats.upcomingEvents > 0
                    ? `${dashboardData.stats.upcomingEvents} upcoming`
                    : "No upcoming events",
              },
              {
                label: "Total Joined",
                value: dashboardData.stats.joinedEvents.toString(),
                icon: FiUsers,
                gradient: "from-[#96A78D] to-[#7E9175]",
                change:
                  dashboardData.stats.joinedEvents > 0
                    ? `${dashboardData.stats.pastEvents} past events`
                    : "Start joining",
              },
              {
                label: "Active Events",
                value: dashboardData.stats.activeHostedEvents.toString(),
                icon: FiActivity,
                gradient: "from-[#D2C1B6] to-[#B8A79C]",
                change:
                  dashboardData.stats.activeHostedEvents > 0
                    ? `${dashboardData.stats.activeHostedEvents} active`
                    : "No active events",
              },
              ...(isHostOrAdmin
                ? [
                    {
                      label: "Host Earnings",
                      value: formatCurrency(dashboardData.stats.hostEarnings),
                      icon: FiTrendingUp,
                      gradient: "from-[#9C6A50] to-[#B88C75]",
                      change: `${dashboardData.stats.completedHostedEvents} completed`,
                    },
                  ]
                : [
                    {
                      label: "Total Reviews",
                      value: dashboardData.stats.totalReviews.toString(),
                      icon: FiStar,
                      gradient: "from-[#234C6A] to-[#96A78D]",
                      change:
                        dashboardData.stats.totalReviews > 0
                          ? "Reviews received"
                          : "No reviews yet",
                    },
                  ]),
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] shadow-lg backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}/20 shadow-md`}
                    >
                      <stat.icon className="text-white text-xl" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full text-white/70 text-xs">
                      {stat.change}
                    </div>
                  </div>
                  <div className="mb-1 font-bold text-white text-3xl">
                    {stat.value}
                  </div>
                  <div className="mb-4 text-white/70 text-sm">{stat.label}</div>
                </div>
                <div
                  className={`absolute -bottom-8 -right-8 bg-gradient-to-br ${stat.gradient} opacity-10 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-300`}
                ></div>
              </motion.div>
            ))}
          </motion.div>

          <div className="gap-8 grid lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] shadow-xl backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="border-white/10 border-b">
                  <div className="flex overflow-x-auto">
                    {[
                      { id: "overview", label: "Overview", icon: FiGrid },
                      { id: "events", label: "My Events", icon: FiCalendar },
                      ...(isHostOrAdmin && !isAdmin
                        ? [
                            { id: "hosting", label: "Hosting", icon: FiTarget },
                            {
                              id: "analytics",
                              label: "Analytics",
                              icon: FiBarChart2,
                            },
                          ]
                        : []),
                      ...(isAdmin
                        ? [
                            {
                              id: "admin",
                              label: "Admin",
                              icon: FiDatabase,
                            },
                          ]
                        : []),
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                          activeTab === tab.id
                            ? "border-[#96A78D] text-[#D2C1B6] bg-gradient-to-r from-[#234C6A]/20 to-[#96A78D]/20"
                            : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <tab.icon />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {isAdmin && (
                        <div className="bg-gradient-to-r from-[#9C6A50]/10 to-[#D2C1B6]/10 shadow-xl backdrop-blur-sm p-6 border border-[#9C6A50]/20 rounded-2xl">
                          <h3 className="mb-4 font-bold text-white text-lg">
                            Platform Overview
                          </h3>
                          <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                            <div className="text-center">
                              <div className="mb-2 font-bold text-white text-2xl">
                                {adminStats.totalUsers}
                              </div>
                              <div className="text-white/70 text-sm">
                                Total Users
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mb-2 font-bold text-white text-2xl">
                                {adminStats.totalEvents}
                              </div>
                              <div className="text-white/70 text-sm">
                                Total Events
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mb-2 font-bold text-white text-2xl">
                                {adminStats.verifiedUsers}
                              </div>
                              <div className="text-white/70 text-sm">
                                Verified Users
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="mb-2 font-bold text-white text-2xl">
                                {adminStats.bannedUsers}
                              </div>
                              <div className="text-white/70 text-sm">
                                Banned Users
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex gap-4">
                            <Link
                              href="/admin/users"
                              className="flex-1 text-center bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg px-4 py-2 rounded-xl font-medium text-white transition-all"
                            >
                              Manage Users
                            </Link>
                            <Link
                              href="/admin/events"
                              className="flex-1 text-center bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/20 rounded-xl text-white transition-all"
                            >
                              Manage Events
                            </Link>
                          </div>
                        </div>
                      )}

                      {isHostOrAdmin && dashboardData.stats.hostEarnings > 0 && (
                        <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                              <h3 className="mb-1 font-bold text-white text-lg">
                                Revenue Overview
                              </h3>
                              <p className="text-white/60 text-sm">
                                {timeRange.charAt(0).toUpperCase() +
                                  timeRange.slice(1)}
                                ly earnings
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-white text-2xl">
                                {formatCurrency(
                                  dashboardData.stats.hostEarnings
                                )}
                              </div>
                              <div className="flex items-center text-[#96A78D] text-sm">
                                <FiTrendingUp className="mr-1" />
                                From{" "}
                                {dashboardData.stats.completedHostedEvents}{" "}
                                events
                              </div>
                            </div>
                          </div>
                          <div className="h-64">
                            <RevenueChart data={chartData.revenueData} />
                          </div>
                        </div>
                      )}

                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {isHostOrAdmin &&
                          chartData.typeDistribution.length > 0 && (
                            <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                              <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-white">
                                  Event Types
                                </h3>
                                <FiPieChart className="text-white/50" />
                              </div>
                              <div className="h-64">
                                <EventTypeChart
                                  data={chartData.typeDistribution}
                                />
                              </div>
                            </div>
                          )}

                        <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">
                              Activity Timeline
                            </h3>
                            <FiActivity className="text-white/50" />
                          </div>
                          <div className="h-64 overflow-y-auto">
                            <ActivityTimeline data={chartData.activityData} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                        <h3 className="mb-6 font-bold text-white">
                          Quick Stats
                        </h3>
                        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                          {[
                            {
                              label: "Avg. Rating",
                              value: dashboardData.stats.averageRating || "N/A",
                              icon: FiStar,
                              color: "text-[#D2C1B6]",
                            },
                            {
                              label: "Total Reviews",
                              value: dashboardData.stats.totalReviews,
                              icon: FiActivity,
                              color: "text-[#96A78D]",
                            },
                            {
                              label: "Cities Visited",
                              value: citiesVisited,
                              icon: FiMapPin,
                              color: "text-[#234C6A]",
                            },
                            {
                              label: "Active Streak",
                              value: activeStreak,
                              icon: FiAward,
                              color: "text-[#9C6A50]",
                            },
                          ].map((stat, index) => (
                            <div key={stat.label} className="group text-center">
                              <div
                                className={`inline-flex justify-center items-center ${stat.color}/20 mb-2 p-3 rounded-xl group-hover:scale-110 transition-transform`}
                              >
                                <stat.icon
                                  className={`text-xl ${stat.color}`}
                                />
                              </div>
                              <div className="mb-1 font-bold text-white text-2xl">
                                {stat.value}
                              </div>
                              <div className="text-white/60 text-sm">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "admin" && isAdmin && (
                    <div className="space-y-8">
                      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                        <div className="bg-gradient-to-r from-[#9C6A50]/10 to-[#D2C1B6]/10 shadow-xl backdrop-blur-sm p-6 border border-[#9C6A50]/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#9C6A50]/20 p-3 rounded-xl">
                              <FiUsers className="text-[#D2C1B6] text-xl" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-2xl">
                                {adminStats.totalUsers}
                              </div>
                              <div className="text-white/70 text-sm">
                                Total Users
                              </div>
                            </div>
                          </div>
                          <div className="text-white/70 text-sm">
                            <div className="flex justify-between py-1">
                              <span>Hosts:</span>
                              <span className="font-medium">{adminStats.totalHosts}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Admins:</span>
                              <span className="font-medium">{adminStats.totalAdmins}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Verified:</span>
                              <span className="font-medium">{adminStats.verifiedUsers}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 shadow-xl backdrop-blur-sm p-6 border border-[#96A78D]/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#234C6A]/20 p-3 rounded-xl">
                              <FiLayers className="text-[#96A78D] text-xl" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-2xl">
                                {adminStats.totalEvents}
                              </div>
                              <div className="text-white/70 text-sm">
                                Total Events
                              </div>
                            </div>
                          </div>
                          <div className="text-white/70 text-sm">
                            <div className="flex justify-between py-1">
                              <span>Active Events:</span>
                              <span className="font-medium">{dashboardData.stats.activeHostedEvents}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Completed Events:</span>
                              <span className="font-medium">{dashboardData.stats.completedHostedEvents}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#D2C1B6]/10 to-white/10 shadow-xl backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#D2C1B6]/20 p-3 rounded-xl">
                              <FiActivity className="text-white text-xl" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-2xl">
                                {adminStats.bannedUsers}
                              </div>
                              <div className="text-white/70 text-sm">
                                Banned Users
                              </div>
                            </div>
                          </div>
                          <div className="text-white/70 text-sm">
                            <div className="flex justify-between py-1">
                              <span>User Activity:</span>
                              <span className="font-medium">{dashboardData.stats.joinedEvents}</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Upcoming Events:</span>
                              <span className="font-medium">{dashboardData.stats.upcomingEvents}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                          <h4 className="mb-4 font-bold text-white">
                            User Management
                          </h4>
                          <div className="space-y-3">
                            <Link
                              href="/admin/users"
                              className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-[#234C6A]/20 p-2 rounded-lg">
                                  <FiUsers className="text-[#96A78D]" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">All Users</div>
                                  <div className="text-white/60 text-sm">
                                    View and manage all platform users
                                  </div>
                                </div>
                              </div>
                              <FiGlobe className="text-white/50" />
                            </Link>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleRoleChange("sample-id", "host")}
                                className="flex-1 text-center bg-[#96A78D]/20 hover:bg-[#96A78D]/30 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                              >
                                Promote to Host
                              </button>
                              <button
                                onClick={() => handleVerifyToggle("sample-id", false)}
                                className="flex-1 text-center bg-[#D2C1B6]/20 hover:bg-[#D2C1B6]/30 py-2 border border-[#D2C1B6]/50 rounded-xl text-white transition-all"
                              >
                                Verify User
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                          <h4 className="mb-4 font-bold text-white">
                            Event Management
                          </h4>
                          <div className="space-y-3">
                            <Link
                              href="/admin/events"
                              className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
                                  <FiCalendar className="text-[#D2C1B6]" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">All Events</div>
                                  <div className="text-white/60 text-sm">
                                    Monitor and manage all platform events
                                  </div>
                                </div>
                              </div>
                              <FiGlobe className="text-white/50" />
                            </Link>
                            <Link
                              href="/admin/reports"
                              className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="bg-[#234C6A]/20 p-2 rounded-lg">
                                  <FiBarChart2 className="text-[#96A78D]" />
                                </div>
                                <div>
                                  <div className="font-medium text-white">Reports</div>
                                  <div className="text-white/60 text-sm">
                                    View platform analytics and reports
                                  </div>
                                </div>
                              </div>
                              <FiGlobe className="text-white/50" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "events" && (
                    <div className="space-y-8">
                      <div>
                        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
                          <h2 className="font-bold text-white text-xl">
                            Events You've Joined
                          </h2>
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <FiSearch className="top-1/2 left-3 absolute text-white/50 -translate-y-1/2 transform" />
                              <input
                                type="text"
                                placeholder="Search events..."
                                className="bg-white/5 backdrop-blur-sm py-2 pr-4 pl-10 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none text-white placeholder-white/50"
                              />
                            </div>
                            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm p-2 border border-white/10 rounded-lg">
                              <FiFilter className="text-white" />
                            </button>
                          </div>
                        </div>
                        {dashboardData.recentEvents.length > 0 ? (
                          <div className="space-y-4">
                            {dashboardData.recentEvents.map((event) => (
                              <Link
                                key={event._id}
                                href={`/events/${event._id}`}
                                className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm p-4 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                              >
                                <div className="flex-shrink-0">
                                  <div className="flex justify-center items-center bg-gradient-to-br from-[#234C6A]/20 to-[#96A78D]/20 rounded-lg w-12 h-12">
                                    <FiCalendar className="text-[#D2C1B6] text-xl" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <div className="font-medium text-white truncate">
                                      {event.title}
                                    </div>
                                    <div className="font-medium text-[#D2C1B6] text-sm">
                                      {event.joiningFee === 0
                                        ? "Free"
                                        : formatCurrency(event.joiningFee)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-white/60 text-sm">
                                    <span>{formatDate(event.date)}</span>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                    <span>•</span>
                                    <span
                                      className={`capitalize px-2 py-1 rounded-full text-xs ${
                                        event.status === "open"
                                          ? "bg-[#96A78D]/20 text-[#96A78D]"
                                          : event.status === "completed"
                                          ? "bg-[#9C6A50]/20 text-[#9C6A50]"
                                          : "bg-[#9C6A50]/20 text-[#D2C1B6]"
                                      }`}
                                    >
                                      {event.status}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <div className="inline-flex justify-center items-center bg-white/5 mb-4 p-4 rounded-2xl">
                              <FiCalendar className="text-white/40 text-2xl" />
                            </div>
                            <h3 className="mb-2 font-bold text-white">
                              No Events Joined
                            </h3>
                            <p className="mb-6 text-white/60">
                              Start exploring and join your first event!
                            </p>
                            <Link
                              href="/events"
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 hover:from-[#234C6A]/30 to-[#96A78D]/20 hover:to-[#96A78D]/30 px-6 py-3 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] transition-all"
                            >
                              <FiGlobe />
                              Find Activities
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "hosting" && isHostOrAdmin && !isAdmin && (
                    <div className="space-y-8">
                      <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                        <h3 className="mb-6 font-bold text-white">
                          Hosting Performance
                        </h3>
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-4">
                          {[
                            {
                              label: "Active Events",
                              value: dashboardData.stats.activeHostedEvents,
                              icon: FiActivity,
                              color: "text-[#9C6A50]",
                            },
                            {
                              label: "Completed",
                              value: dashboardData.stats.completedHostedEvents,
                              icon: FiCheckCircle,
                              color: "text-[#96A78D]",
                            },
                            {
                              label: "Total Reviews",
                              value: dashboardData.stats.totalReviews,
                              icon: FiStar,
                              color: "text-[#D2C1B6]",
                            },
                            {
                              label: "Avg. Rating",
                              value: dashboardData.stats.averageRating || "N/A",
                              icon: FiAward,
                              color: "text-[#234C6A]",
                            },
                          ].map((stat, index) => (
                            <div key={stat.label} className="text-center">
                              <div
                                className={`inline-flex justify-center items-center ${stat.color}/20 mb-2 p-3 rounded-xl`}
                              >
                                <stat.icon
                                  className={`text-xl ${stat.color}`}
                                />
                              </div>
                              <div className="mb-1 font-bold text-white text-2xl">
                                {stat.value}
                              </div>
                              <div className="text-white/60 text-sm">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="font-bold text-white text-xl">
                            Active Events You're Hosting
                          </h2>
                          <Link
                            href="/events/create"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 hover:from-[#234C6A]/30 to-[#96A78D]/20 hover:to-[#96A78D]/30 px-4 py-2 border border-[#96A78D]/50 rounded-xl text-[#D2C1B6] text-sm"
                          >
                            <FiPlus />
                            New Event
                          </Link>
                        </div>

                        {dashboardData.activeHostedEvents?.length > 0 ? (
                          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                            {dashboardData.activeHostedEvents.map((event) => (
                              <EventCard key={event._id} event={event as any} />
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <div className="inline-flex justify-center items-center bg-white/5 mb-4 p-4 rounded-2xl">
                              <FiTarget className="text-white/40 text-2xl" />
                            </div>
                            <h3 className="mb-2 font-bold text-white">
                              No Active Events
                            </h3>
                            <p className="mb-6 text-white/60">
                              Create your first event to start hosting!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && isHostOrAdmin && !isAdmin && (
                    <div className="space-y-8">
                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[
                          {
                            label: "Conversion Rate",
                            value: `${dashboardData.stats.conversionRate}%`,
                            icon: FiTrendingUp,
                            color: "text-[#96A78D]",
                          },
                          {
                            label: "Engagement Rate",
                            value: `${dashboardData.stats.engagementRate}%`,
                            icon: FiUsers,
                            color: "text-[#D2C1B6]",
                          },
                          {
                            label: "Avg. Rating",
                            value: dashboardData.stats.averageRating || "N/A",
                            icon: FiStar,
                            color: "text-[#F5F0EB]",
                          },
                          {
                            label: "Event Completion",
                            value: `${dashboardData.stats.completedHostedEvents}/${dashboardData.stats.hostedEvents}`,
                            icon: FiCheckCircle,
                            color: "text-[#96A78D]",
                          },
                          {
                            label: "Active Events",
                            value: dashboardData.stats.activeHostedEvents,
                            icon: FiActivity,
                            color: "text-[#D2C1B6]",
                          },
                          {
                            label: "Host Earnings",
                            value: formatCurrency(
                              dashboardData.stats.hostEarnings
                            ),
                            icon: FiDollarSign,
                            color: "text-[#F5F0EB]",
                          },
                        ].map((metric, index) => (
                          <div
                            key={metric.label}
                            className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                          >
                            <div className="flex justify-between items-center mb-4">
                              <div
                                className={`p-2 rounded-lg ${metric.color}/20`}
                              >
                                <metric.icon
                                  className={`text-xl ${metric.color}`}
                                />
                              </div>
                            </div>
                            <div className="mb-1 font-bold text-white text-2xl">
                              {metric.value}
                            </div>
                            <div className="text-white/60 text-sm">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                        <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
                          <div>
                            <h3 className="font-bold text-white text-lg">
                              Events Comparison
                            </h3>
                            <p className="text-white/60 text-sm">
                              Joined vs Hosted events over time
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-[#234C6A] rounded-full w-3 h-3"></div>
                              <span className="text-white/70 text-sm">
                                Joined
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-[#96A78D] rounded-full w-3 h-3"></div>
                              <span className="text-white/70 text-sm">
                                Hosted
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="h-80">
                          <ComparisonChart
                            labels={chartData.statsComparison.labels}
                            joinedData={
                              chartData.statsComparison.datasets[0].data
                            }
                            hostedData={
                              chartData.statsComparison.datasets[1].data
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] shadow-xl backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-lg rounded-full w-16 h-16">
                    <span className="font-bold text-white text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{user?.name}</div>
                    <div className="text-white/60 text-sm">{user?.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-[#96A78D] rounded-full w-2 h-2 animate-pulse"></div>
                      <span className="text-white/50 text-xs">
                        {user?.role?.charAt(0).toUpperCase() +
                          user?.role?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all"
                  >
                    <span className="text-white">View Profile</span>
                    <FiGlobe className="text-white/50" />
                  </Link>
                  <Link
                    href="/settings"
                    className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all"
                  >
                    <span className="text-white">Settings</span>
                    <FiSettings className="text-white/50" />
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/users"
                      className="flex justify-between items-center bg-[#9C6A50]/10 hover:bg-[#9C6A50]/20 p-3 rounded-lg transition-all"
                    >
                      <span className="text-[#D2C1B6]">Admin Panel</span>
                      <FiDatabase className="text-[#D2C1B6]" />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex justify-between items-center bg-gradient-to-r from-[#9C6A50]/10 hover:from-[#9C6A50]/20 to-[#D2C1B6]/10 hover:to-[#D2C1B6]/20 p-3 rounded-lg w-full text-[#D2C1B6] transition-all"
                  >
                    <span>Logout</span>
                    <FiLogOut />
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#9C6A50]/10 to-[#D2C1B6]/10 shadow-xl backdrop-blur-sm p-6 border border-[#9C6A50]/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#9C6A50]/20 p-2 rounded-lg">
                    <FiHelpCircle className="text-[#D2C1B6] text-xl" />
                  </div>
                  <h3 className="font-bold text-white">Need Help?</h3>
                </div>
                <p className="mb-4 text-white/80 text-sm">
                  Having trouble with your dashboard or events? Our support team
                  is here to help.
                </p>
                <Link
                  href="/help"
                  className="inline-flex justify-center items-center gap-2 bg-[#9C6A50]/20 hover:bg-[#9C6A50]/30 py-2 border border-[#9C6A50]/30 rounded-xl w-full text-[#D2C1B6] text-center transition-all"
                >
                  <FiHelpCircle />
                  Get Help
                </Link>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#234C6A]/10 via-[#96A78D]/10 to-[#D2C1B6]/10 shadow-xl backdrop-blur-sm mt-8 p-6 border border-[#96A78D]/20 rounded-2xl"
          >
            <div className="flex md:flex-row flex-col justify-between items-center gap-6">
              <div>
                <h3 className="mb-2 font-bold text-white text-lg">
                  {isAdmin 
                    ? "Platform Management Tools"
                    : isHostOrAdmin
                    ? "Ready to host your own event?"
                    : "Ready to join your next adventure?"
                  }
                </h3>
                <p className="text-white/70">
                  {isAdmin
                    ? "Access comprehensive tools to manage users, events, and platform analytics."
                    : isHostOrAdmin
                    ? "Share your passion and connect with like-minded people."
                    : "Discover amazing events and connect with people who share your interests."
                  }
                </p>
              </div>
              <div className="flex gap-4">
                {isAdmin ? (
                  <>
                    <Link
                      href="/admin/users"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg px-6 py-3 rounded-xl font-medium text-white transition-all"
                    >
                      <FiUsers />
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/events"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl text-white transition-all"
                    >
                      Manage Events
                    </Link>
                  </>
                ) : isHostOrAdmin ? (
                  <>
                    <Link
                      href="/events/create"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg px-6 py-3 rounded-xl font-medium text-white transition-all"
                    >
                      <FiPlus />
                      Create Event
                    </Link>
                    <Link
                      href="/learn-hosting"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl text-white transition-all"
                    >
                      Learn More
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg px-6 py-3 rounded-xl font-medium text-white transition-all"
                    >
                      <FiGlobe />
                      Find Events
                    </Link>
                    <Link
                      href="/how-it-works"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl text-white transition-all"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}