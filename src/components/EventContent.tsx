"use client";

import { EventDetails } from "@/types/eventDetails";
import {
  Calendar,
  Clock,
  MapPin,
  Map,
  MessageSquare,
  Tag,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface EventContentProps {
  event: EventDetails;
}

export function EventContent({ event }: EventContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 lg:col-span-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] shadow-2xl backdrop-blur-xl border-2 border-white/20 rounded-2xl h-64 md:h-96 overflow-hidden"
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <div className="opacity-50 text-9xl">
              {event.eventType === "concert" && "🎵"}
              {event.eventType === "hiking" && "🥾"}
              {event.eventType === "sports" && "⚽"}
              {event.eventType === "games" && "🎮"}
              {event.eventType === "tech" && "💻"}
              {event.eventType === "art" && "🎨"}
              {![
                "concert",
                "hiking",
                "sports",
                "games",
                "tech",
                "art",
              ].includes(event.eventType) && "🎪"}
            </div>
          </div>
        )}
      </motion.div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] shadow-lg p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white text-xl">
              Event Schedule
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Date</p>
                  <p className="font-bold text-white">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Time</p>
                  <p className="font-bold text-white">{event.time}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Duration</p>
                  <p className="font-bold text-white">
                    {event.duration || "3 hours"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white text-xl">
              Location Details
            </h3>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 p-4 border border-white/10 rounded-xl">
              <p className="mb-1 font-bold text-white text-lg">
                {event.location}
              </p>
              <p className="text-white/60">{event.address}</p>
            </div>

            <div className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Venue Type</p>
                  <p className="font-bold text-white">Outdoor Event</p>
                </div>
              </div>
              <button className="text-[#96A78D] hover:text-[#889c7e] transition-colors">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-white text-2xl">
            About This Event
          </h3>
        </div>

        <div className="bg-white/5 p-6 border border-white/10 rounded-xl">
          <p className="text-white/80 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {event.tags.length > 0 && (
          <div className="mt-8">
            <h4 className="mb-4 font-bold text-white text-lg">
              Event Tags
            </h4>
            <div className="flex flex-wrap gap-3">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-full font-medium text-white"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}