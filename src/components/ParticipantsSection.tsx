"use client";

import { Participants } from "@/types/eventDetails";
import { Users, MessageSquare, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ParticipantsSectionProps {
  participants: Participants[];
  currentParticipants: number;
}

export function ParticipantsSection({
  participants,
  currentParticipants,
}: ParticipantsSectionProps) {
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">Attendees</h3>
        </div>
        <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full font-bold text-white text-sm">
          {currentParticipants} people
        </span>
      </div>

      <div className="space-y-4">
        {participants
          .slice(0, showParticipants ? undefined : 5)
          .map((participant) => (
            <div
              key={participant._id}
              className="flex justify-between items-center bg-white/5 p-3 border border-white/10 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-md rounded-full"></div>
                  <div className="relative flex justify-center items-center bg-gradient-to-br from-white/10 to-white/5 shadow-lg rounded-full w-12 h-12">
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="rounded-full w-12 h-12"
                      />
                    ) : (
                      <span className="font-bold text-white">
                        {participant.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-white">
                    {participant.name}
                  </p>
                  <p className="text-white/60 text-sm">
                    {participant.location}
                  </p>
                </div>
              </div>
              <button className="text-white/60 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          ))}

        {participants.length === 0 && (
          <div className="py-8 text-center">
            <div className="inline-flex justify-center items-center mb-4">
              <div className="bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl">
                <Users className="w-8 h-8 text-white/40" />
              </div>
            </div>
            <p className="text-white/60">No participants yet</p>
            <p className="mt-1 text-white/40 text-sm">
              Be the first to join!
            </p>
          </div>
        )}

        {!showParticipants && participants.length > 5 && (
          <button
            onClick={() => setShowParticipants(true)}
            className="flex justify-center items-center gap-2 py-3 w-full text-white/70 hover:text-white transition-colors"
          >
            <span>
              Show {participants.length - 5} more attendees
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}