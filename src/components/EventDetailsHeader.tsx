EventDetailsHeader.tsx

import { EventDetails } from "@/types/eventDetails";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Heart,
  Share2,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EventDetailsHeaderProps {
  event: EventDetails;
  onLike: () => void;
  onShare: () => void;
  onRemindMe: () => void;
}

export function EventDetailsHeader({
  event,
  onLike,
  onShare,
  onRemindMe,
}: EventDetailsHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; icon: React.ReactNode }
    > = {
      open: {
        bg: "bg-gradient-to-r from-[#96A78D] to-[#889c7e]",
        text: "text-white",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      full: {
        bg: "bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6]",
        text: "text-white",
        icon: <XCircle className="w-4 h-4" />,
      },
      cancelled: {
        bg: "bg-gradient-to-r from-white/20 to-white/10",
        text: "text-white/80",
        icon: <XCircle className="w-4 h-4" />,
      },
      completed: {
        bg: "bg-gradient-to-r from-[#234C6A] to-[#1a3d57]",
        text: "text-white",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    };

    const config = statusConfig[event.status] || statusConfig.open;

    return (
      <span
        className={`inline-flex items-center gap-2 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/30 rounded-full font-bold text-sm ${config.bg} ${config.text}`}
      >
        {config.icon}
        {event.status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="mb-8">
      <Link
        href="/events"
        className="group inline-flex items-center gap-2 mb-6 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="font-medium">Back to Events</span>
      </Link>

      <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {getStatusBadge()}
            <span className="bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6] shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/30 rounded-full font-bold text-white text-sm">
              {event.category}
            </span>
          </div>
          <h1 className="mb-2 font-bold text-white text-4xl lg:text-5xl tracking-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLike}
            className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl transition-all"
          >
            <Heart className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onShare}
            className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl transition-all"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={onRemindMe}
            className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}