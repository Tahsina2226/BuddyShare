"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  EventFormData,
  EVENT_TYPES,
  EVENT_CATEGORIES,
} from "@/types/eventForm";
import {
  Upload,
  X,
  Plus,
  Tag,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Globe,
  Music,
  Palette,
  Trophy,
  Heart,
  Zap
} from "lucide-react";
import API from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

  const getCurrentUser = () => {
    if (user) {
      return user;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    return null;
  };

  const getCurrentToken = () => {
    if (token) {
      return token;
    }

    const possibleTokenKeys = [
      "token",
      "auth_token",
      "access_token",
      "jwt_token",
      "authToken",
    ];

    for (const key of possibleTokenKeys) {
      const storedToken = localStorage.getItem(key);
      if (storedToken && storedToken.length > 20) {
        return storedToken;
      }
    }

    return null;
  };

  const currentUser = getCurrentUser();
  const currentToken = getCurrentToken();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (currentUser.role !== "host" && currentUser.role !== "admin") {
      return;
    }

    if (currentToken) {
      API.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
    }
  }, [authLoading, currentUser, currentToken, router]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#234C6A]/10 via-[#D2C1B6]/10 to-[#96A78D]/10">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full animate-spin border-b-2 border-cyan-400"></div>
          <p className="text-white/70">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#234C6A]/10 via-[#D2C1B6]/10 to-[#96A78D]/10">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full animate-spin border-b-2 border-cyan-400"></div>
          <p className="text-white/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "host" && currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex justify-center items-center mb-6 w-20 h-20 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">Access Denied</h2>
          <p className="mb-6 text-white/70">
            Only hosts can create events. Please update your account to host role.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 text-white transition-all bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 border border-white/30 hover:border-white/50 rounded-xl"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="px-6 py-3 text-white/80 transition-colors border border-white/20 bg-white/10 hover:bg-white/20 rounded-xl"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Event title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Event description is required");
      return false;
    }
    if (!formData.date) {
      setError("Event date is required");
      return false;
    }
    if (!formData.time) {
      setError("Event time is required");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Location is required");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return false;
    }
    if (formData.maxParticipants < 1 || formData.maxParticipants > 1000) {
      setError("Maximum participants must be between 1 and 1000");
      return false;
    }
    if (formData.joiningFee < 0) {
      setError("Joining fee cannot be negative");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const freshToken = getCurrentToken();

      if (!freshToken) {
        setError("Authentication token not found. Please login again.");
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
        setSuccess(true);
        setTimeout(() => {
          router.push(eventId ? `/events/${eventId}` : "/events");
          router.refresh();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to save event");
      }
    } catch (err: any) {
      console.error("API error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else if (err.response?.status === 403) {
        setError("You do not have permission to create events.");
      } else if (err.response?.status === 400) {
        setError(
          err.response.data.message || "Invalid data. Please check your inputs."
        );
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Please check your connection.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to save event. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{eventId ? "Edit Your Event" : "Create Amazing Event"}</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
            {eventId ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-white/70">
            {eventId
              ? "Update your event details below"
              : "Fill in the details to create an amazing event for others to join"}
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-emerald-500/20">
                <span className="text-emerald-400">✓</span>
              </div>
              <div>
                <p className="font-medium text-white">
                  Event {eventId ? "updated" : "created"} successfully!
                </p>
                <p className="mt-1 text-sm text-white/70">Redirecting...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-red-500/20">
                <span className="text-red-400">✗</span>
              </div>
              <div>
                <p className="font-medium text-white">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="mr-3 p-2 rounded-full bg-white/10">
              <span className="text-cyan-400">👤</span>
            </div>
            <div>
              <p className="font-medium text-white">Creating event as:</p>
              <p className="mt-1 text-sm text-white/80">
                <strong>{currentUser.name || currentUser.email}</strong> (
                {currentUser.role})
              </p>
              <p className="mt-1 text-sm text-white/70">
                {currentToken ? "✓ Token available" : "⚠ No token found"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 md:p-8"
        >
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Basic Information</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Weekend Hiking Trip"
                    className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    maxLength={100}
                  />
                  <p className="mt-1 text-sm text-white/60">
                    Make it catchy and descriptive ({formData.title.length}/100)
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your event in detail..."
                    rows={4}
                    className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                    required
                    maxLength={1000}
                  />
                  <p className="mt-1 text-sm text-white/60">
                    {formData.description.length}/1000 characters
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-green-500/20">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Event Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="bg-[#152a3d] text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {EVENT_CATEGORIES.map((category) => (
                      <option key={category} value={category} className="bg-[#152a3d] text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        <Calendar className="inline mr-1 w-4 h-4" /> Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        <Clock className="inline mr-1 w-4 h-4" /> Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      <MapPin className="inline mr-1 w-4 h-4" /> Location (City/Area) *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Dhaka, Gulshan"
                      className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-white/80">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g., 123 Main Street, Gulshan-1"
                      className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        <Users className="inline mr-1 w-4 h-4" /> Maximum Participants *
                      </label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        min="1"
                        max="1000"
                        className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        required
                      />
                      <p className="mt-1 text-sm text-white/60">
                        How many people can join? (1-1000)
                      </p>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-white/80">
                        <DollarSign className="inline mr-1 w-4 h-4" /> Joining Fee (USD)
                      </label>
                      <input
                        type="number"
                        name="joiningFee"
                        value={formData.joiningFee}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0 for free event"
                        className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <p className="mt-1 text-sm text-white/60">
                        Enter 0 for free events
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-violet-500/20">
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Tags</h2>
              </div>
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag (e.g., beginners-friendly)"
                    className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="button"
                    onClick={handleTagAdd}
                    className="flex items-center px-4 py-3 text-white transition-all bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 border border-white/30 hover:border-white/50 rounded-xl"
                  >
                    <Plus className="mr-1 w-5 h-5" /> Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 hover:text-cyan-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="italic text-white/50">
                      No tags added yet. Add some tags to help people find your event.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-white/10">
                <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20">
                  <Camera className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Event Image</h2>
              </div>
              <div className="p-8 text-center rounded-xl border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition">
                <Upload className="mx-auto mb-4 w-12 h-12 text-white/40" />
                <p className="mb-2 text-white/70">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="mb-4 text-sm text-white/50">
                  Recommended: 1200x600px, max 5MB
                </p>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-white transition-colors border border-white/20 bg-white/10 hover:bg-white/20"
                >
                  Browse Files
                </button>

                <div className="mt-6">
                  <label className="block mb-2 text-sm font-medium text-white/80">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ""}
                    onChange={handleChange}
                    placeholder="https://example.com/event-image.jpg"
                    className="px-4 py-3 w-full rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>

              {formData.image && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-white/80">
                    Preview:
                  </p>
                  <div className="relative w-full h-48 overflow-hidden rounded-xl">
                    <img
                      src={formData.image}
                      alt="Event preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-6 border-t border-white/10 sm:flex-row">
              <button
                type="submit"
                disabled={loading || !currentToken}
                className="flex flex-1 items-center justify-center px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 border border-white/30 hover:border-white/50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    {eventId ? "Updating..." : "Creating..."}
                  </>
                ) : !currentToken ? (
                  "Waiting for authentication..."
                ) : eventId ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 font-medium transition-colors rounded-xl border border-white/20 text-white/80 bg-white/10 hover:bg-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm">
          <p className="text-sm text-white/80">
            💡 <strong>Tips for a great event:</strong> Be specific about what
            participants can expect, choose relevant tags, and set a reasonable
            fee. Great events have clear descriptions and attractive images!
          </p>
        </div>
      </div>
    </div>
  );
}