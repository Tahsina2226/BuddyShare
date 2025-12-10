"use client";

import { useState, useEffect } from "react";
import { PaymentHistory } from "@/types/payment";
import {
  Calendar,
  DollarSign,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Info
} from "lucide-react";
import Link from "next/link";
import API from "@/utils/api";
import { motion } from "framer-motion";

export default function PaymentHistoryComponent() {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventInfo, setEventInfo] = useState<{
    title: string;
    currentParticipants: number;
    maxParticipants: number;
  } | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/payments/history");

      if (response.data.success) {
        setPayments(response.data.data.payments);
        if (response.data.data.payments.length > 0) {
          const latestPayment = response.data.data.payments[0];
          setEventInfo({
            title: latestPayment.event.title,
            currentParticipants: latestPayment.event.currentParticipants || 25,
            maxParticipants: latestPayment.event.maxParticipants || 50
          });
        }
      } else {
        setError(response.data.message || "Failed to load payment history");
      }
    } catch (err: any) {
      console.error("Error fetching payments:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load payment history");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return (
          <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-xl">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        );
      case "failed":
        return (
          <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-xl">
            <XCircle className="w-5 h-5 text-white" />
          </div>
        );
      case "pending":
        return (
          <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] p-2 rounded-xl">
            <Clock className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-white/10 p-2 rounded-xl">
            <Clock className="w-5 h-5 text-white/40" />
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-gradient-to-r from-[#96A78D] to-[#889c7e] text-white";
      case "failed":
        return "bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6] text-white";
      case "pending":
        return "bg-gradient-to-r from-[#234C6A] to-[#1a3d57] text-white";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
          <div className="relative flex justify-center items-center w-16 h-16">
            <div className="border-4 border-white/30 border-t-white rounded-full w-12 h-12 animate-spin"></div>
          </div>
        </div>
        <p className="mb-2 font-bold text-white text-xl">Loading Payments</p>
        <p className="text-white/60">Fetching your payment history</p>
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
              <XCircle className="w-12 h-12 text-[#D2C1B6]" />
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

  if (payments.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex justify-center items-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
              <Receipt className="w-12 h-12 text-white/40" />
            </div>
          </div>
        </div>
        <h3 className="mb-3 font-bold text-white text-xl">No Payment History</h3>
        <p className="mb-6 text-white/60">You haven't made any payments yet.</p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] hover:from-[#D2C1B6] to-[#D2C1B6] hover:to-[#234C6A] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
        >
          <Sparkles className="w-5 h-5" />
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-bold text-white text-2xl">Payment History</h2>
          </div>
          <p className="text-white/60">Track all your event payments</p>
        </div>
        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      <div className="space-y-4">
        {payments.map((payment, index) => (
          <motion.div
            key={payment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl p-6 border-2 border-white/20 hover:border-white/30 rounded-2xl hover:scale-[1.02] transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {getStatusIcon(payment.status)}
                  <span className={`shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-full font-bold text-sm ${getStatusBadge(payment.status)}`}>
                    {payment.status.toUpperCase()}
                  </span>
                </div>

                <Link
                  href={`/events/${payment.event._id}`}
                  className="block mb-3 font-bold text-white hover:text-white/80 text-lg transition-colors"
                >
                  {payment.event.title}
                </Link>

                <div className="flex items-center gap-6 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span>{formatDate(payment.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10 p-2 rounded-lg">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span>${payment.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="text-right">
                  <div className="font-bold text-white text-3xl">
                    ${payment.amount.toFixed(2)}
                  </div>
                  <div className="text-white/60 text-sm">USD</div>
                </div>
                
                {payment.receiptUrl && (
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-xl font-bold text-white text-sm transition-all"
                  >
                    <Receipt className="w-4 h-4" />
                    Receipt
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl mt-8 p-6 border-2 border-white/20 rounded-2xl"
      >
        <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Payment Summary</h3>
              <p className="text-white/60">Total spent on events</p>
            </div>
          </div>
          
          <div className="text-center lg:text-right">
            <div className="font-bold text-white text-4xl">
              ${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
            </div>
            <p className="text-white/60 text-sm">Total across {payments.length} payment{payments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
              <Info className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white text-xl">Event Information</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 border-2 border-white/20 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/60 text-sm">Event</p>
                  <p className="font-bold text-white text-lg">{eventInfo?.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-sm">Spot Availability</p>
                  <p className="font-bold text-white text-lg">
                    {eventInfo?.currentParticipants} / {eventInfo?.maxParticipants}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#D2C1B6]/10 to-[#c4b1a6]/5 backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-3 rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-white text-lg">Refund Policy</h4>
          </div>
          <p className="text-white/60">
            Refunds are available if requested at least 24 hours before the
            event start time. Contact support for refund requests.
          </p>
        </motion.div>
      </div>
    </div>
  );
}