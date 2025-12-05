"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EventFormData } from "@/types/eventForm";
import EventFormDetails from "./EventFormDetails";
import EventImageUploader from "./EventImageUploader";
import { showFancyAlert, setupToastStyles } from "./EventFormHelpers";
import API from "@/utils/api";
import { Loader2, Rocket, Sparkles } from "lucide-react";

interface CreateEventFormProps {
  initialData?: Partial<EventFormData>;
  eventId?: string;
}

export default function CreateEventForm({
  initialData,
  eventId,
}: CreateEventFormProps) {
  const router = useRouter();
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    eventType: initialData?.eventType || "concert",
    date: initialData?.date || "",
    time: initialData?.time || "19:00",
    location: initialData?.location || "",
    address: initialData?.address || "",
    maxParticipants: initialData?.maxParticipants || 10,
    joiningFee: initialData?.joiningFee || 0,
    category: initialData?.category || "Music",
    tags: initialData?.tags || [],
    image: initialData?.image || "",
  });

  useEffect(() => {
    setupToastStyles();
  }, []);

  const getCurrentUser = () => {
    if (user) return user;
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  };

  const getCurrentToken = () => {
    if (token) return token;
    const possibleTokenKeys = [
      "token",
      "auth_token",
      "access_token",
      "jwt_token",
      "authToken",
    ];
    for (const key of possibleTokenKeys) {
      const storedToken = localStorage.getItem(key);
      if (storedToken && storedToken.length > 20) return storedToken;
    }
    return null;
  };

  const currentUser = getCurrentUser();
  const currentToken = getCurrentToken();

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      showFancyAlert("Please login to create events", "warning");
      router.push("/auth/login");
      return;
    }
    if (currentUser.role !== "host" && currentUser.role !== "admin") {
      showFancyAlert("Only hosts can create events", "error");
      return;
    }
    if (currentToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
    }
  }, [authLoading, currentUser, currentToken, router]);

  const validateForm = () => {
    const validations = [
      {
        condition: !formData.title.trim(),
        message: "📝 Event title is required",
      },
      {
        condition: !formData.description.trim(),
        message: "📋 Event description is required",
      },
      { condition: !formData.date, message: "📅 Event date is required" },
      { condition: !formData.time, message: "⏰ Event time is required" },
      {
        condition: !formData.location.trim(),
        message: "📍 Location is required",
      },
      {
        condition: !formData.address.trim(),
        message: "🏠 Address is required",
      },
      {
        condition:
          formData.maxParticipants < 1 || formData.maxParticipants > 1000,
        message: "👥 Maximum participants must be between 1 and 1000",
      },
      {
        condition: formData.joiningFee < 0,
        message: "💰 Joining fee cannot be negative",
      },
      { condition: !formData.category, message: "🏷️ Category is required" },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        showFancyAlert(validation.message, "error");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      showFancyAlert(
        eventId ? "🔄 Updating your event..." : "✨ Creating your event...",
        "info",
        3000
      );

      const freshToken = getCurrentToken();
      if (!freshToken) {
        showFancyAlert(
          "🔐 Authentication token not found. Please login again.",
          "error"
        );
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${freshToken}`;

      const eventData = {
        ...formData,
        hostId: currentUser.id,
        hostName: currentUser.name || currentUser.email,
        hostEmail: currentUser.email,
        createdAt: new Date().toISOString(),
      };

      const url = eventId ? `/events/${eventId}` : "/events";
      const method = eventId ? "put" : "post";

      const response = await API[method](url, eventData);

      if (response.data.success) {
        showFancyAlert(
          eventId
            ? "🎉 Event updated successfully!"
            : "🎊 Event created successfully!",
          "celebrate"
        );

        setTimeout(() => {
          showFancyAlert("🎯 Redirecting to events page...", "success", 1500);
        }, 500);

        setTimeout(() => {
          router.push(eventId ? `/events/${eventId}` : "/events");
          router.refresh();
        }, 2000);
      } else {
        showFancyAlert(
          response.data.message || "❌ Failed to save event",
          "error"
        );
      }
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err: any) => {
    console.error("API error:", err);

    const errorHandlers = {
      401: () => {
        showFancyAlert(
          "🔓 Your session has expired. Please login again.",
          "error"
        );
        setTimeout(() => router.push("/auth/login"), 2000);
      },
      403: () =>
        showFancyAlert(
          "🚫 You do not have permission to create events.",
          "error"
        ),
      400: () =>
        showFancyAlert(
          err.response.data.message ||
            "📝 Invalid data. Please check your inputs.",
          "error"
        ),
      500: () =>
        showFancyAlert("🛠️ Server error. Please try again later.", "error"),
      Network: () =>
        showFancyAlert(
          "🌐 Cannot connect to server. Please check your connection.",
          "error"
        ),
    };

    if (err.response?.status && errorHandlers[err.response.status]) {
      errorHandlers[err.response.status]();
    } else if (err.message === "Network Error") {
      errorHandlers.Network();
    } else {
      showFancyAlert(
        err.response?.data?.message ||
          "❌ Failed to save event. Please try again.",
        "error"
      );
    }
  };

  const handleFormChange = (updatedData: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  const updateImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  if (authLoading || !currentUser) {
    return (
      <LoadingScreen
        message={
          authLoading
            ? "Loading authentication..."
            : "Checking authentication..."
        }
      />
    );
  }

  if (currentUser.role !== "host" && currentUser.role !== "admin") {
    return <AccessDeniedScreen router={router} />;
  }

  return (
    <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-4xl">
        <EventFormHeader eventId={eventId} />

        <UserInfoCard user={currentUser} token={currentToken} />

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-sm p-6 md:p-8 border border-white/20 rounded-xl"
        >
          <EventFormDetails
            formData={formData}
            onFormChange={handleFormChange}
          />

          <EventImageUploader
            currentImage={formData.image}
            onImageUploaded={updateImage}
            onImageRemoved={() => updateImage("")}
          />

          <FormActions
            loading={loading}
            eventId={eventId}
            currentToken={currentToken}
            onCancel={() => {
              showFancyAlert("Event creation cancelled", "info");
              setTimeout(() => router.back(), 500);
            }}
          />
        </form>

        <TipsCard />
      </div>
    </div>
  );
}

const LoadingScreen = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A]/10 via-[#D2C1B6]/10 to-[#96A78D]/10 min-h-screen">
    <div className="text-center">
      <div className="mx-auto mb-4 border-cyan-400 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      <p className="text-white/70">{message}</p>
    </div>
  </div>
);

const AccessDeniedScreen = ({ router }: { router: any }) => (
  <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8 min-h-screen">
    <div className="mx-auto px-4 max-w-4xl text-center">
      <div className="inline-flex justify-center items-center bg-gradient-to-r from-red-500/20 to-rose-500/20 mb-6 border border-red-500/30 rounded-full w-20 h-20">
        <span className="text-2xl">🚫</span>
      </div>
      <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-2xl">
        Access Denied
      </h2>
      <p className="mb-6 text-white/70">
        Only hosts can create events. Please update your account to host role.
      </p>
      <div className="flex sm:flex-row flex-col justify-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-6 py-3 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
        >
          Go to Home
        </button>
        <button
          onClick={() => router.push("/profile")}
          className="bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl text-white/80 transition-colors"
        >
          Go to Profile
        </button>
      </div>
    </div>
  </div>
);

const UserInfoCard = ({ user, token }: { user: any; token: string | null }) => (
  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm mb-6 p-4 border border-cyan-500/30 rounded-xl">
    <div className="flex items-center">
      <div className="bg-gradient-to-br from-cyan-500/30 to-blue-500/30 mr-3 p-2 rounded-full">
        <span className="text-cyan-300">👤</span>
      </div>
      <div>
        <p className="font-medium text-white">Creating event as:</p>
        <p className="mt-1 text-white/80 text-sm">
          <strong>{user.name || user.email}</strong> ({user.role})
        </p>
        <p className="mt-1 text-white/70 text-sm">
          {token ? "✅ Token available" : "⚠ No token found"}
        </p>
      </div>
    </div>
  </div>
);

const FormActions = ({
  loading,
  eventId,
  currentToken,
  onCancel,
}: {
  loading: boolean;
  eventId?: string;
  currentToken: string | null;
  onCancel: () => void;
}) => (
  <div className="flex sm:flex-row flex-col gap-4 pt-6 border-white/10 border-t">
    <button
      type="submit"
      disabled={loading || !currentToken}
      className="group flex flex-1 justify-center items-center bg-gradient-to-r from-cyan-500/20 hover:from-cyan-500/30 to-blue-500/20 hover:to-blue-500/30 disabled:opacity-50 px-6 py-3 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl font-medium text-white transition-all disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 w-5 h-5 animate-spin" />
          {eventId ? "Updating..." : "Creating..."}
        </>
      ) : !currentToken ? (
        "Waiting for authentication..."
      ) : eventId ? (
        <>
          <Rocket className="mr-2 w-5 h-5 group-hover:animate-bounce" />
          Update Event
        </>
      ) : (
        <>
          <Sparkles className="mr-2 w-5 h-5 group-hover:animate-pulse" />
          Create Event
        </>
      )}
    </button>

    <button
      type="button"
      onClick={onCancel}
      className="bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl font-medium text-white/80 transition-colors"
    >
      Cancel
    </button>
  </div>
);

const TipsCard = () => (
  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm mt-6 p-4 border border-cyan-500/30 rounded-xl">
    <div className="flex items-start gap-3">
      <div className="bg-gradient-to-r from-cyan-500/30 to-blue-500/30 p-2 rounded-full">
        <span className="text-cyan-300">💡</span>
      </div>
      <div>
        <p className="mb-1 font-medium text-white">Tips for a great event:</p>
        <p className="text-white/80 text-sm">
          Be specific about what participants can expect, choose relevant tags,
          and set a reasonable fee. Great events have clear descriptions and
          attractive images! Use the drag & drop feature for easy image uploads.
        </p>
      </div>
    </div>
  </div>
);

const EventFormHeader = ({ eventId }: { eventId?: string }) => (
  <div className="mb-8">
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm mb-4 px-4 py-2 border border-cyan-400/30 rounded-full animate-pulse-glow">
      <Sparkles className="w-4 h-4 text-cyan-300" />
      <span className="font-medium text-white text-sm">
        {eventId ? "Edit Your Event" : "Create Amazing Event"}
      </span>
    </div>
    <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-2 font-bold text-transparent text-3xl">
      {eventId ? "Edit Event" : "Create New Event"}
    </h1>
    <p className="text-white/70">
      {eventId
        ? "Update your event details below"
        : "Fill in the details to create an amazing event for others to join"}
    </p>
  </div>
);
