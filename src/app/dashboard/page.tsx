"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardData } from "@/types/dashboard";
import EventCard from "@/components/events/EventCard";
import PaymentHistoryComponent from "@/App/payment/PaymentHistory";
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
    "overview" | "events" | "analytics" | "payments" | "hosting"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");

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

        const notificationsResponse = await fetch(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let notifications = [];
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          notifications = notificationsData.data || [];
        }

        let paymentStats = {
          totalSpent: 0,
          succeededPayments: 0,
          allPayments: [] as any[],
          succeededPaymentsList: [] as any[],
        };

        try {
          const paymentsResponse = await fetch(
            "http://localhost:5000/api/payments/history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (paymentsResponse.ok) {
            const paymentsData = await paymentsResponse.json();
            const allPayments = paymentsData.data?.payments || [];

            const succeededPayments = allPayments.filter(
              (p: any) => p.status === "succeeded" || p.status === "completed"
            );

            paymentStats.totalSpent = succeededPayments.reduce(
              (sum: number, p: any) => sum + p.amount,
              0
            );

            paymentStats.succeededPayments = succeededPayments.length;
            paymentStats.allPayments = allPayments;
            paymentStats.succeededPaymentsList = succeededPayments;
          }
        } catch (paymentError) {
          console.warn("Could not fetch payment history:", paymentError);
        }

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

        const avgSpending =
          paymentStats.succeededPayments > 0
            ? paymentStats.totalSpent / paymentStats.succeededPayments
            : 0;

        const hostEarnings = paymentStats.succeededPaymentsList
          .filter((p: any) => p.event?.host === user?.id)
          .reduce((sum: number, p: any) => sum + p.amount, 0);

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
          totalSpent: paymentStats.totalSpent,
          hostEarnings: hostEarnings,
          avgSpending: avgSpending,
          averageRating: parseFloat(averageRating.toFixed(1)),
          totalReviews: reviewsFromEvents.length,
          activeHostedEvents: activeHostedEvents.length,
          completedHostedEvents: completedHostedEvents.length,
          conversionRate: conversionRate,
          engagementRate: engagementRate,
          notifications: notifications.length,
          succeededPayments: paymentStats.succeededPayments,
          pendingPayments: paymentStats.allPayments.filter(
            (p: any) => p.status === "pending" || p.status === "processing"
          ).length,
          failedPayments: paymentStats.allPayments.filter(
            (p: any) => p.status === "failed" || p.status === "canceled"
          ).length,
        };

        const chartData = generateChartData(
          joinedEvents,
          hostedEvents,
          paymentStats.succeededPaymentsList,
          timeRange
        );

        setDashboardData({
          stats,
          upcomingEvents: upcomingEvents.slice(0, 3),
          recentEvents: joinedEvents.slice(0, 5),
          hostedEvents: hostedEvents.slice(0, 3),
          activeHostedEvents: activeHostedEvents.slice(0, 3),
          pastEvents: pastEvents.slice(0, 3),
          notifications: notifications.slice(0, 5),
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

      const dayPayments = succeededPayments.filter((payment: any) => {
        const paymentDate = new Date(payment.createdAt);
        return paymentDate.toDateString() === date.toDateString();
      });

      const revenue = dayPayments.reduce((sum: number, payment: any) => {
        return sum + payment.amount;
      }, 0);

      revenueData.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          ...(range === "year" && { month: "short" }),
        }),
        revenue,
      });
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

    const paymentActivity = succeededPayments
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((payment: any) => ({
        date: new Date(payment.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        title:
          payment.event?.title ||
          `Payment ${payment._id?.slice(-8) || payment.id?.slice(-8) || "N/A"}`,
        type: payment.event?.host === user?.id ? "hosted" : "joined",
        amount: payment.amount,
        status: payment.status,
      }));

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
                    placeholder="Search events, payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 backdrop-blur-sm py-2 pr-4 pl-10 border border-white/10 focus:border-[#96A78D]/50 rounded-xl focus:outline-none w-64 text-white placeholder-[#F5F0EB]/50"
                  />
                </div>

                <button className="relative bg-white/5 hover:bg-white/10 backdrop-blur-sm p-2 rounded-lg transition-all">
                  <FiBell className="text-[#F5F0EB]" />
                  {dashboardData.stats.notifications > 0 && (
                    <span className="-top-1 -right-1 absolute flex justify-center items-center bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] rounded-full w-5 h-5 font-medium text-white text-xs">
                      {dashboardData.stats.notifications}
                    </span>
                  )}
                </button>

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
            </div>
          </div>

          <motion.div
            className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {[
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
                label: "Total Spent",
                value: formatCurrency(dashboardData.stats.totalSpent),
                icon: FiDollarSign,
                gradient: "from-[#D2C1B6] to-[#B8A79C]",
                change:
                  dashboardData.stats.succeededPayments > 0
                    ? `${dashboardData.stats.succeededPayments} payments`
                    : "No payments yet",
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
                      label: "Successful Payments",
                      value: `${dashboardData.stats.succeededPayments}`,
                      icon: FiCreditCard,
                      gradient: "from-[#234C6A] to-[#96A78D]",
                      change:
                        dashboardData.stats.succeededPayments > 0
                          ? "All completed"
                          : "No payments yet",
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
                      ...(isHostOrAdmin
                        ? [
                            { id: "hosting", label: "Hosting", icon: FiTarget },
                            {
                              id: "analytics",
                              label: "Analytics",
                              icon: FiBarChart2,
                            },
                          ]
                        : []),
                      { id: "payments", label: "Payments", icon: FiDollarSign },
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
                      {isHostOrAdmin &&
                        dashboardData.stats.hostEarnings > 0 && (
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
                                  {
                                    dashboardData.stats.completedHostedEvents
                                  }{" "}
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

                  {activeTab === "analytics" && isHostOrAdmin && (
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
                            label: "Total Revenue",
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

                  {activeTab === "hosting" && isHostOrAdmin && (
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

                  {activeTab === "payments" && (
                    <div>
                      <PaymentHistoryComponent />
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
                  <button
                    onClick={handleLogout}
                    className="flex justify-between items-center bg-gradient-to-r from-[#9C6A50]/10 hover:from-[#9C6A50]/20 to-[#D2C1B6]/10 hover:to-[#D2C1B6]/20 p-3 rounded-lg w-full text-[#D2C1B6] transition-all"
                  >
                    <span>Logout</span>
                    <FiLogOut />
                  </button>
                </div>
              </div>

              {dashboardData.notifications &&
                dashboardData.notifications.length > 0 && (
                  <div className="bg-gradient-to-b from-white/5 to-white/[0.02] shadow-xl backdrop-blur-sm p-6 border border-white/10 rounded-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-white">Notifications</h3>
                      <FiBell className="text-white/50" />
                    </div>
                    <div className="space-y-4">
                      {dashboardData.notifications
                        .slice(0, 3)
                        .map((notification: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-[#234C6A]/20 p-2 rounded-lg">
                                <FiBell className="text-[#96A78D]" />
                              </div>
                              <div className="flex-1">
                                <div className="text-white text-sm">
                                  {notification.message}
                                </div>
                                <div className="mt-1 text-white/40 text-xs">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Link
                      href="/notifications"
                      className="block mt-4 text-[#D2C1B6] hover:text-[#F5F0EB] text-sm text-center"
                    >
                      View all notifications
                    </Link>
                  </div>
                )}

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
                  Ready to host your own event?
                </h3>
                <p className="text-white/70">
                  Share your passion and connect with like-minded people.
                </p>
              </div>
              <div className="flex gap-4">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
