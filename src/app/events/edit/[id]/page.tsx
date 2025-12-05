"use client";

import { useAuth } from "@/context/AuthContext";
import CreateEventForm from "@/components/events/CreateEventForm";
import { Loader2, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EventData {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  date: string;
  time: string;
  location: string;
  address: string;
  maxParticipants: number;
  joiningFee: number;
  category: string;
  tags: string[];
  image?: string;
}

export default function EditEventPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();

        if (data.success) {
          // Check if user is the host or admin
          if (user?.role !== "admin" && data.data.event.host._id !== user?.id) {
            setError("You are not authorized to edit this event");
            return;
          }

          // Format date for input
          const event = data.data.event;
          const formattedDate = new Date(event.date)
            .toISOString()
            .split("T")[0];

          setEventData({
            ...event,
            date: formattedDate,
          });
        } else {
          throw new Error("Failed to load event data");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchEventData();
    }
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
            <h2 className="mb-2 font-bold text-gray-900 text-2xl">Error</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/events")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 w-16 h-16 text-gray-400" />
            <h2 className="mb-2 font-bold text-gray-900 text-2xl">
              Event Not Found
            </h2>
            <p className="mb-6 text-gray-600">
              The event you are trying to edit does not exist.
            </p>
            <button
              onClick={() => router.push("/events")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-7xl">
        <CreateEventForm initialData={eventData} eventId={id as string} />
      </div>
    </div>
  );
}
