"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { PaymentHistory } from "@/types/payment";
import {
  DollarSign,
  Receipt,
  CheckCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Info,
  AlertCircle,
  User,
  Building,
  Eye,
  Download,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import API from "@/utils/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function PaymentHistoryComponent() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  const isAdmin = user?.role === "admin";
  const isHost = user?.role === "host";
  const isRegularUser = user?.role === "user";

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/payments/succeeded`;

      if (isAdmin) {
        url = `/admin/payments/succeeded`;
      } else if (isHost) {
        url = `/host/payments/succeeded`;
      }

      const response = await API.get(url);

      if (response.data.success) {
        const allPayments = response.data.data.payments || [];
        setPayments(allPayments);
      } else {
        setError(response.data.message || "Failed to load payment history");
      }
    } catch (err: any) {
      console.error("Error fetching payments:", err);
      setError(err.response?.data?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const exportPayments = async () => {
    try {
      const headers = [
        "ID",
        "Date",
        "Amount",
        "Status",
        "User",
        "Event",
        "Payment Method",
      ];
      const csvData = payments.map((p) => [
        p._id,
        new Date(p.createdAt).toLocaleDateString(),
        `$${p.amount}`,
        p.status,
        typeof p.user === "object" ? p.user.name : "N/A",
        p.event?.title || "N/A",
        p.paymentMethod || "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `successful_payments_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Successful payments exported successfully");
    } catch (error) {
      toast.error("Failed to export payments");
    }
  };

  const getStatusIcon = (status: string) => {
    return (
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateStats = () => {
    const succeededPayments = payments.filter(
      (p) =>
        p.status.toLowerCase() === "succeeded" ||
        p.status.toLowerCase() === "completed"
    );

    const totalRevenue = succeededPayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return {
      succeeded: succeededPayments.length,
      total: payments.length,
      totalRevenue,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
          <div className="relative flex justify-center items-center w-16 h-16">
            <div className="border-4 border-white/30 border-t-white rounded-full w-12 h-12 animate-spin"></div>
          </div>
        </div>
        <p className="mb-2 font-bold text-white text-xl">
          Loading Successful Payments
        </p>
        <p className="text-white/60">
          Fetching your successful payment history
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex justify-center items-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
          </div>
        </div>
        <h3 className="mb-3 font-bold text-white text-xl">Failed to Load</h3>
        <p className="mb-6 text-white/60">{error}</p>
        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-3 rounded-xl ${
                isAdmin
                  ? "bg-gradient-to-br from-purple-500 to-pink-600"
                  : isHost
                  ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                  : "bg-gradient-to-br from-emerald-500 to-green-600"
              }`}
            >
              {isAdmin ? (
                <Building className="w-6 h-6 text-white" />
              ) : isHost ? (
                <Users className="w-6 h-6 text-white" />
              ) : (
                <CreditCard className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-white text-2xl">
                {isAdmin
                  ? "All Successful Payments"
                  : isHost
                  ? "My Event Successful Payments"
                  : "Successful Payment History"}
              </h2>
              <p className="text-white/60">
                Total: {stats.total} successful payments •{" "}
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col items-start lg:items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPayments}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={exportPayments}
              className="inline-flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm px-4 py-2 border-2 border-blue-500/30 rounded-xl font-bold text-blue-400 transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm mb-6 p-6 border-2 border-green-500/20 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-bold text-white text-2xl">
              {stats.succeeded}
            </div>
            <div className="text-white/60 text-sm">Successful Payments</div>
          </div>
          <div className="bg-green-500/20 p-3 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="mt-3 text-green-400 text-sm">
          Total: {formatCurrency(stats.totalRevenue)}
        </div>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/20 rounded-2xl">
                <AlertCircle className="w-12 h-12 text-white/40" />
              </div>
            </div>
            <h3 className="mb-3 font-bold text-white text-xl">
              No Successful Payments Found
            </h3>
            <p className="mb-6 text-white/60">
              {isAdmin
                ? "No successful payments found"
                : isHost
                ? "No successful payments for your events"
                : "You don't have any successful payments yet"}
            </p>
            {!isAdmin && (
              <Link
                href="/events"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#D2C1B6] to-[#D2C1B6] hover:to-[#234C6A] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                {isHost ? "Create Event" : "Browse Events"}
              </Link>
            )}
          </div>
        ) : (
          payments.map((payment, index) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl p-6 border-2 border-white/20 hover:border-white/30 rounded-2xl transition-all"
            >
              <div className="flex lg:flex-row flex-col justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {getStatusIcon(payment.status)}
                    <span
                      className={`px-4 py-2 border-2 border-white/20 rounded-full font-bold text-sm ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      SUCCESSFUL
                    </span>

                    {isAdmin && payment.user && (
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                        <User className="w-4 h-4 text-white/60" />
                        <span className="text-white text-sm">
                          {typeof payment.user === "object"
                            ? payment.user.name
                            : "User"}
                        </span>
                      </div>
                    )}

                    {payment.event && (
                      <Link
                        href={`/events/${payment.event._id}`}
                        className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-full transition-colors"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">
                          {payment.event.title}
                        </span>
                      </Link>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="mb-1 font-bold text-white text-lg">
                      {payment.event?.title ||
                        `Payment ${payment._id.slice(-8)}`}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-white/60 text-sm">
                      <span>ID: {payment._id.slice(-8)}</span>
                      <span>•</span>
                      <span>{formatDate(payment.createdAt)}</span>
                      {payment.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="capitalize">
                            {payment.paymentMethod}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <span>{formatCurrency(payment.amount)}</span>
                    </div>

                    {payment.receiptUrl && (
                      <a
                        href={payment.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition-colors"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Receipt</span>
                      </a>
                    )}

                    {isAdmin && payment.stripePaymentIntentId && (
                      <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-lg">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-xs">
                          {payment.stripePaymentIntentId.slice(-12)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="text-right">
                    <div className="font-bold text-white text-3xl">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-white/60 text-sm">
                      Paid Successfully
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {payments.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl mt-8 p-6 border-2 border-white/20 rounded-2xl"
        >
          <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  isAdmin
                    ? "bg-gradient-to-br from-purple-500 to-pink-600"
                    : isHost
                    ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                    : "bg-gradient-to-br from-green-500 to-emerald-600"
                }`}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">
                  {isAdmin
                    ? "Total Revenue"
                    : isHost
                    ? "Event Earnings"
                    : "Payment Summary"}
                </h3>
                <p className="text-white/60">
                  Showing only successful payments
                </p>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <div className="font-bold text-white text-4xl">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-white/60 text-sm">
                {payments.length} successful payment
                {payments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
