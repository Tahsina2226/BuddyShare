"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DashboardData } from "@/types/dashboard";
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Sparkles,
  Target,
  Trophy,
  Zap,
  CreditCard,
  Settings,
  Heart,
  Activity,
  Package,
  CheckCircle,
  BarChart3,
  Eye,
  Bell,
  MessageSquare,
  MapPin,
  Filter,
  Search,
  Download,
  Share2,
  HelpCircle,
} from "lucide-react";
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

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [activeTab, setActiveTab] = useState<
    "overview" | "events" | "analytics" | "payments" | "hosting"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem("token") || "";
        
        // Fetch joined events
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

        // Fetch notifications
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

        // Fetch payment history
        let paymentStats = {
          totalSpent: 0,
          succeededPayments: 0,
          pendingPayments: 0,
          failedPayments: 0,
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
            const payments = paymentsData.data?.payments || [];
            
            paymentStats.totalSpent = payments
              .filter((p: any) => p.status === 'succeeded')
              .reduce((sum: number, p: any) => sum + p.amount, 0);
            
            paymentStats.succeededPayments = payments.filter((p: any) => p.status === 'succeeded').length;
            paymentStats.pendingPayments = payments.filter((p: any) => p.status === 'pending').length;
            paymentStats.failedPayments = payments.filter((p: any) => p.status === 'failed').length;
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

        const totalSpent = joinedEvents.reduce(
          (sum: number, event: any) => sum + (event.joiningFee || 0),
          0
        );

        const hostEarnings = hostedEvents.reduce(
          (sum: number, event: any) =>
            sum + (event.joiningFee || 0) * (event.participants?.length || 0),
          0
        );

        const avgSpending = joinedEvents.length > 0 
          ? totalSpent / joinedEvents.length 
          : 0;

        const stats = {
          hostedEvents: hostedEvents.length,
          joinedEvents: joinedEvents.length,
          upcomingEvents: upcomingEvents.length,
          pastEvents: pastEvents.length,
          totalSpent: paymentStats.totalSpent || totalSpent,
          hostEarnings,
          avgSpending,
          averageRating: 4.7,
          totalReviews: 24,
          activeHostedEvents: activeHostedEvents.length,
          completedHostedEvents: completedHostedEvents.length,
          conversionRate: 65,
          engagementRate: 42,
          notifications: notifications.length,
          succeededPayments: paymentStats.succeededPayments,
          pendingPayments: paymentStats.pendingPayments,
          failedPayments: paymentStats.failedPayments,
        };

        const chartData = generateChartData(
          joinedEvents,
          hostedEvents,
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
            <div className="bg-red-500/20 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="font-medium">Dashboard Error</p>
              <p className="text-gray-400 text-sm">
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

  const generateChartData = (joinedEvents: any[], hostedEvents: any[], range: string) => {
    let days = 7;
    if (range === "month") days = 30;
    if (range === "year") days = 365;

    const revenueData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayEvents = hostedEvents.filter((event: any) => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
      
      const revenue = dayEvents.reduce((sum: number, event: any) => {
        return sum + (event.joiningFee || 0) * (event.participants?.length || 0);
      }, 0);
      
      revenueData.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          ...(range === 'year' && { month: 'short' })
        }),
        revenue,
      });
    }

    const eventTypes = ["Sports", "Music", "Food", "Tech", "Art", "Gaming", "Travel"];
    const typeDistribution = eventTypes.map(type => {
      const count = hostedEvents.filter((event: any) => 
        event.category?.toLowerCase() === type.toLowerCase()
      ).length;
      return { type, count };
    }).filter(item => item.count > 0);

    const allEvents = [...joinedEvents, ...hostedEvents]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    const activityData = allEvents.map((event: any) => ({
      date: new Date(event.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      title: event.title,
      type: joinedEvents.includes(event) ? "joined" : "hosted",
      amount: event.joiningFee || 0,
    }));

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const statsComparison = {
      labels,
      datasets: [
        {
          label: "Events Joined",
          data: [3, 5, 2, 8, 4, 6, 7],
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          tension: 0.4,
        },
        {
          label: "Events Hosted",
          data: [1, 2, 1, 3, 2, 4, 3],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
      ],
    };

    const weeklyActivity = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Activity",
          data: [12, 19, 8, 15, 22, 18, 25],
          backgroundColor: "rgba(14, 165, 233, 0.8)",
          borderColor: "#0ea5e9",
          borderWidth: 1,
        },
      ],
    };

    return {
      revenueData,
      typeDistribution,
      activityData,
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
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-medium">Logged out successfully</p>
          <p className="text-gray-400 text-sm">
            Redirecting to login page
          </p>
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
        <div className="bg-emerald-500/20 p-2 rounded-lg">
          <Download className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="font-medium">Data exported</p>
          <p className="text-gray-400 text-sm">
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
        title: "My EventHub Dashboard",
        text: "Check out my EventHub dashboard!",
        url: window.location.href,
      });
    } else {
      toast.success(
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <Share2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">Link copied</p>
            <p className="text-gray-400 text-sm">
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
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full"></div>
              </div>
            </div>
            <p className="mt-6 text-white/70 animate-pulse">
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
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "12px",
              padding: "16px",
            },
          }}
        />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-8">
          <div className="mx-auto px-4 max-w-7xl">
            <div className="py-12 text-center">
              <div className="inline-flex justify-center items-center bg-gradient-to-r from-red-500/20 to-rose-500/20 mb-4 border border-red-500/30 rounded-full w-16 h-16">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-2 font-bold text-transparent text-2xl">
                Error Loading Dashboard
              </h2>
              <p className="mb-6 text-white/70">{error}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 px-6 py-3 border border-cyan-500/50 rounded-xl text-cyan-400 transition-all"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 px-6 py-3 border border-white/30 rounded-xl text-white transition-all"
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

  return (
    <>
      <Toaster
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
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="border-b border-white/10">
          <div className="mx-auto px-4 max-w-7xl py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-200 font-bold text-transparent text-3xl">
                      Dashboard
                    </h1>
                    <p className="text-white/70 mt-1">
                      Welcome back, <span className="text-cyan-300">{user?.name}</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-white/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events, payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50 w-64"
                  />
                </div>

                <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <Bell className="w-5 h-5 text-white" />
                  {dashboardData.stats.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dashboardData.stats.notifications}
                    </span>
                  )}
                </button>

                <Link
                  href={`/profile/${user?.id}`}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-white">{user?.name}</div>
                    <div className="text-white/50 text-xs">{user?.email}</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="inline-flex bg-white/5 rounded-lg p-1">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    timeRange === range
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
              <button
                onClick={shareDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              {isHostOrAdmin && (
                <Link
                  href="/events/create"
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-xl text-cyan-400 transition-all"
                >
                  <Plus className="w-4 h-4" />
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
                icon: Calendar,
                gradient: "from-cyan-500 to-blue-500",
                change: dashboardData.stats.upcomingEvents > 0 ? "+2 this week" : "No upcoming events",
                chartData: [3, 5, 2, 8, 4, 6, 7],
              },
              {
                label: "Total Joined",
                value: dashboardData.stats.joinedEvents.toString(),
                icon: Users,
                gradient: "from-emerald-500 to-green-500",
                change: dashboardData.stats.joinedEvents > 0 ? "+12% growth" : "Start joining",
                chartData: [2, 4, 6, 8, 10, 12, 14],
              },
              {
                label: "Total Spent",
                value: formatCurrency(dashboardData.stats.totalSpent),
                icon: DollarSign,
                gradient: "from-purple-500 to-violet-500",
                change: dashboardData.stats.joinedEvents > 0 ? `Avg: ${formatCurrency(dashboardData.stats.avgSpending)}` : "No spending yet",
                chartData: [50, 100, 75, 120, 90, 150, 200],
              },
              ...(isHostOrAdmin
                ? [
                    {
                      label: "Host Earnings",
                      value: formatCurrency(dashboardData.stats.hostEarnings),
                      icon: TrendingUp,
                      gradient: "from-amber-500 to-yellow-500",
                      change: "+12% this month",
                      chartData: [200, 300, 400, 350, 500, 600, 700],
                    },
                  ]
                : [
                    {
                      label: "Successful Payments",
                      value: `${dashboardData.stats.succeededPayments}`,
                      icon: CreditCard,
                      gradient: "from-emerald-500 to-green-500",
                      change: dashboardData.stats.pendingPayments > 0 
                        ? `${dashboardData.stats.pendingPayments} pending` 
                        : "All clear",
                      chartData: [dashboardData.stats.succeededPayments, dashboardData.stats.pendingPayments, dashboardData.stats.failedPayments],
                    },
                  ]),
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
              >
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient}/20`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                      {stat.change}
                    </div>
                  </div>
                  <div className="font-bold text-white text-3xl mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm mb-4">{stat.label}</div>
                  <div className="h-16">
                    <StatsChart data={stat.chartData} color={stat.gradient} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="gap-8 grid lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="border-b border-white/10">
                  <div className="flex overflow-x-auto">
                    {[
                      { id: "overview", label: "Overview", icon: Activity },
                      { id: "events", label: "My Events", icon: Calendar },
                      ...(isHostOrAdmin
                        ? [
                            { id: "hosting", label: "Hosting", icon: Package },
                            { id: "analytics", label: "Analytics", icon: BarChart3 },
                          ]
                        : []),
                      { id: "payments", label: "Payments", icon: CreditCard },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                          activeTab === tab.id
                            ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                            : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      {isHostOrAdmin && (
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                              <h3 className="font-bold text-white text-lg mb-1">
                                Revenue Overview
                              </h3>
                              <p className="text-white/60 text-sm">
                                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}ly earnings
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-white text-2xl">
                                {formatCurrency(dashboardData.stats.hostEarnings)}
                              </div>
                              <div className="flex items-center text-emerald-400 text-sm">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +12.5% from last {timeRange}
                              </div>
                            </div>
                          </div>
                          <div className="h-64">
                            <RevenueChart data={chartData.revenueData} />
                          </div>
                        </div>
                      )}

                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {isHostOrAdmin && (
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                              <h3 className="font-bold text-white">Event Types</h3>
                              <Filter className="w-4 h-4 text-white/50" />
                            </div>
                            <div className="h-64">
                              <EventTypeChart data={chartData.typeDistribution} />
                            </div>
                          </div>
                        )}

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Activity Timeline</h3>
                            <Clock className="w-4 h-4 text-white/50" />
                          </div>
                          <div className="h-64 overflow-y-auto">
                            <ActivityTimeline data={chartData.activityData} />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h3 className="font-bold text-white mb-6">Quick Stats</h3>
                        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                          {[
                            { label: "Avg. Rating", value: dashboardData.stats.averageRating, icon: Star },
                            { label: "Total Reviews", value: dashboardData.stats.totalReviews, icon: MessageSquare },
                            { label: "Cities Visited", value: "8", icon: MapPin },
                            { label: "Active Streak", value: "14 days", icon: Zap },
                          ].map((stat, index) => (
                            <div key={stat.label} className="text-center">
                              <div className="font-bold text-white text-2xl mb-1">
                                {stat.value}
                              </div>
                              <div className="text-white/60 text-sm">{stat.label}</div>
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
                            icon: TrendingUp,
                            change: "+5.2%",
                            color: "text-emerald-400",
                          },
                          {
                            label: "Engagement Rate",
                            value: `${dashboardData.stats.engagementRate}%`,
                            icon: Users,
                            change: "+3.8%",
                            color: "text-cyan-400",
                          },
                          {
                            label: "Avg. Rating",
                            value: dashboardData.stats.averageRating,
                            icon: Star,
                            change: "+0.3",
                            color: "text-amber-400",
                          },
                          {
                            label: "Event Completion",
                            value: "92%",
                            icon: CheckCircle,
                            change: "+4%",
                            color: "text-green-400",
                          },
                          {
                            label: "Response Time",
                            value: "2.4h",
                            icon: Clock,
                            change: "-0.5h",
                            color: "text-blue-400",
                          },
                          {
                            label: "Satisfaction",
                            value: "94%",
                            icon: Heart,
                            change: "+2%",
                            color: "text-rose-400",
                          },
                        ].map((metric, index) => (
                          <div
                            key={metric.label}
                            className="bg-white/5 rounded-xl p-6 border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className={`p-2 rounded-lg ${metric.color}/20`}>
                                <metric.icon className={`w-5 h-5 ${metric.color}`} />
                              </div>
                              <span className={`text-sm ${
                                metric.change.startsWith("+") 
                                  ? "text-emerald-400" 
                                  : metric.change.startsWith("-")
                                  ? "text-rose-400"
                                  : "text-amber-400"
                              }`}>
                                {metric.change}
                              </span>
                            </div>
                            <div className="font-bold text-white text-2xl mb-1">
                              {metric.value}
                            </div>
                            <div className="text-white/60 text-sm">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
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
                              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                              <span className="text-white/70 text-sm">Joined</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                              <span className="text-white/70 text-sm">Hosted</span>
                            </div>
                          </div>
                        </div>
                        <div className="h-80">
                          <ComparisonChart
                            labels={chartData.statsComparison.labels}
                            joinedData={chartData.statsComparison.datasets[0].data}
                            hostedData={chartData.statsComparison.datasets[1].data}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "events" && (
                    <div className="space-y-8">
                      <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                          <h2 className="font-bold text-white text-xl">
                            Events You've Joined
                          </h2>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Search events..."
                              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500/50"
                            />
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
                              <Filter className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        {dashboardData.recentEvents.length > 0 ? (
                          <div className="space-y-4">
                            {dashboardData.recentEvents.map((event) => (
                              <Link
                                key={event._id}
                                href={`/events/${event._id}`}
                                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
                              >
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-cyan-400" />
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="font-medium text-white truncate">
                                      {event.title}
                                    </div>
                                    <div className="text-sm font-medium text-cyan-400">
                                      {event.joiningFee === 0
                                        ? "Free"
                                        : formatCurrency(event.joiningFee)}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-white/60">
                                    <span>{formatDate(event.date)}</span>
                                    <span>•</span>
                                    <span>{event.location}</span>
                                    <span>•</span>
                                    <span className={`capitalize px-2 py-1 rounded-full text-xs ${
                                      event.status === 'open' 
                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                        : event.status === 'completed'
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : 'bg-rose-500/20 text-rose-400'
                                    }`}>
                                      {event.status}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <div className="inline-flex justify-center items-center mb-4 p-4 bg-white/5 rounded-2xl">
                              <Heart className="w-8 h-8 text-white/40" />
                            </div>
                            <h3 className="mb-2 font-bold text-white">
                              No Events Joined
                            </h3>
                            <p className="mb-6 text-white/60">
                              Start exploring and join your first event!
                            </p>
                            <Link
                              href="/events"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 rounded-xl text-cyan-400 transition-all"
                            >
                              <Zap className="w-4 h-4" />
                              Find Events
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "hosting" && isHostOrAdmin && (
                    <div className="space-y-8">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h3 className="font-bold text-white mb-6">Hosting Performance</h3>
                        <div className="gap-6 grid grid-cols-1 md:grid-cols-4">
                          <div className="text-center">
                            <div className="font-bold text-white text-3xl mb-2">
                              {dashboardData.stats.activeHostedEvents}
                            </div>
                            <div className="text-white/60">Active Events</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-white text-3xl mb-2">
                              {dashboardData.stats.completedHostedEvents}
                            </div>
                            <div className="text-white/60">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-white text-3xl mb-2">
                              {dashboardData.stats.totalReviews}
                            </div>
                            <div className="text-white/60">Total Reviews</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-white text-3xl mb-2">
                              {dashboardData.stats.averageRating}
                            </div>
                            <div className="text-white/60">Avg. Rating</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="font-bold text-white text-xl">
                            Active Events You're Hosting
                          </h2>
                          <Link
                            href="/events/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/50 rounded-xl text-cyan-400 text-sm"
                          >
                            <Plus className="w-4 h-4" />
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
                            <div className="inline-flex justify-center items-center mb-4 p-4 bg-white/5 rounded-2xl">
                              <Package className="w-8 h-8 text-white/40" />
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
                      <PaymentHistoryComponent userId={user?.id} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-white">{user?.name}</div>
                    <div className="text-white/60 text-sm">{user?.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-white/50">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    href={`/profile/${user?.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className="text-white">View Profile</span>
                    <ExternalLink className="w-4 h-4 text-white/50" />
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className="text-white">Settings</span>
                    <Settings className="w-4 h-4 text-white/50" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full p-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                  >
                    <span>Logout</span>
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {dashboardData.notifications && dashboardData.notifications.length > 0 && (
                <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white">Notifications</h3>
                    <Bell className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="space-y-4">
                    {dashboardData.notifications.slice(0, 3).map((notification: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-cyan-500/20">
                            <Bell className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-sm">{notification.message}</div>
                            <div className="text-white/40 text-xs mt-1">
                              {new Date(notification.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/notifications"
                    className="block text-center mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    View all notifications
                  </Link>
                </div>
              )}

              <div className="bg-gradient-to-b from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <HelpCircle className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-white">Need Help?</h3>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Having trouble with your dashboard or events? Our support team is here to help.
                </p>
                <Link
                  href="/help"
                  className="inline-block w-full text-center py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-amber-400 transition-all"
                >
                  Get Help
                </Link>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="font-bold text-white text-lg mb-2">
                  Ready to host your own event?
                </h3>
                <p className="text-white/70">
                  Share your passion and connect with like-minded people.
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/events/create"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-medium transition-all"
                >
                  Create Event
                </Link>
                <Link
                  href="/learn-hosting"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all"
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