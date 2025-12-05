"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EventFormData } from "@/types/eventForm";
import EventFormDetails from "./EventFormDetails";
import EventImageUploader from "./EventImageUploader";
import { setupToastStyles } from "./EventFormHelpers";
import API from "@/utils/api";
import { Loader2, Rocket, Sparkles, Shield, AlertCircle, CheckCircle, CalendarPlus, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    setupToastStyles();
  }, []);

  const getCurrentUser = () => {
    if (user) return user;
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
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
      toast.error("Please login to create events", {
        style: {
          background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        icon: '🔐',
      });
      router.push("/auth/login");
      return;
    }
    if (currentUser.role !== "host" && currentUser.role !== "admin") {
      toast.error("Only hosts can create events", {
        style: {
          background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        icon: '🚫',
      });
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
        message: "Event title is required",
      },
      {
        condition: !formData.description.trim(),
        message: "Event description is required",
      },
      { condition: !formData.date, message: "Event date is required" },
      { condition: !formData.time, message: "Event time is required" },
      {
        condition: !formData.location.trim(),
        message: "Location is required",
      },
      {
        condition: !formData.address.trim(),
        message: "Address is required",
      },
      {
        condition:
          formData.maxParticipants < 1 || formData.maxParticipants > 1000,
        message: "Maximum participants must be between 1 and 1000",
      },
      {
        condition: formData.joiningFee < 0,
        message: "Joining fee cannot be negative",
      },
      { condition: !formData.category, message: "Category is required" },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        toast.error(validation.message, {
          style: {
            background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          icon: '⚠️',
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitToast = toast.loading(
      eventId ? "Updating your event..." : "Creating your event...",
      {
        style: {
          background: 'linear-gradient(to right, #234C6A, #1a3d57)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      }
    );

    try {
      setLoading(true);

      const freshToken = getCurrentToken();
      if (!freshToken) {
        toast.error("Authentication token not found. Please login again.", {
          id: submitToast,
          style: {
            background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          icon: '🔐',
        });
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
        toast.success(
          eventId ? "Event updated successfully!" : "Event created successfully!",
          {
            id: submitToast,
            style: {
              background: 'linear-gradient(to right, #96A78D, #889c7e)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            icon: eventId ? '✅' : '🎉',
            duration: 3000,
          }
        );

        setTimeout(() => {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-gradient-to-r from-[#96A78D] to-[#889c7e] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white/20`}
            >
              <div className="flex-1 p-4 w-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="font-medium text-white text-sm">
                      {eventId ? "Event Updated!" : "Event Created!"}
                    </p>
                    <p className="mt-1 text-white/90 text-sm">
                      {formData.title}
                    </p>
                    <div className="mt-2 text-white/70 text-xs">
                      <p>📍 {formData.location}</p>
                      <p>📅 {formData.date} at {formData.time}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex border-white/20 border-l">
                <button
                  onClick={() => {
                    router.push(eventId ? `/events/${eventId}` : `/events/${response.data.data?.event?._id || ''}`);
                    toast.dismiss(t.id);
                  }}
                  className="flex justify-center items-center hover:bg-white/10 p-4 border border-transparent rounded-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-white w-full font-medium text-white text-sm"
                >
                  View Event
                </button>
              </div>
            </div>
          ), { duration: 4000 });
        }, 500);

        setTimeout(() => {
          router.push(eventId ? `/events/${eventId}` : `/events/${response.data.data?.event?._id || ''}`);
          router.refresh();
        }, 3000);
      } else {
        toast.error(
          response.data.message || "Failed to save event",
          {
            id: submitToast,
            style: {
              background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
            icon: '❌',
          }
        );
      }
    } catch (err: any) {
      const errorMessages = {
        401: {
          title: "Session Expired",
          message: "Your session has expired. Please login again.",
          icon: "🔓"
        },
        403: {
          title: "Access Denied",
          message: "You do not have permission to create events.",
          icon: "🚫"
        },
        400: {
          title: "Invalid Data",
          message: err.response?.data?.message || "Please check your inputs.",
          icon: "📝"
        },
        500: {
          title: "Server Error",
          message: "Server error. Please try again later.",
          icon: "🛠️"
        },
        Network: {
          title: "Connection Error",
          message: "Cannot connect to server. Please check your connection.",
          icon: "🌐"
        },
        default: {
          title: "Error",
          message: err.response?.data?.message || "Failed to save event. Please try again.",
          icon: "❌"
        }
      };

      const errorType = err.response?.status in errorMessages ? err.response.status : 
                     err.message === "Network Error" ? "Network" : "default";
      const errorInfo = errorMessages[errorType];

      toast.error(errorInfo.message, {
        id: submitToast,
        style: {
          background: 'linear-gradient(to right, #D2C1B6, #c4b1a6)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        icon: errorInfo.icon,
      });

      if (errorType === 401) {
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (updatedData: Partial<EventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  const updateImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
    toast.success("Image uploaded successfully!", {
      style: {
        background: 'linear-gradient(to right, #96A78D, #889c7e)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
      icon: '🖼️',
      duration: 2000,
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      toast.success(`Moving to step ${currentStep + 1}`, {
        style: {
          background: 'linear-gradient(to right, #234C6A, #1a3d57)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        icon: '👉',
        duration: 1500,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (authLoading || !currentUser) {
    return (
      <div className="bg-gradient-to-br from-[#234C6A]/95 via-[#1a3d57] to-[#152a3d] min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(to right, #234C6A, #1a3d57)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="relative mx-auto mb-6">
              <div className="border-4 border-cyan-500/30 border-t-cyan-500 rounded-full w-16 h-16 animate-spin"></div>
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-8 h-8 animate-pulse"></div>
              </div>
            </div>
            <p className="font-medium text-white/70 text-lg">
              {authLoading
                ? "Loading authentication..."
                : "Checking authentication..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role !== "host" && currentUser.role !== "admin") {
    return (
      <div className="bg-gradient-to-br from-[#234C6A]/95 via-[#1a3d57] to-[#152a3d] min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'linear-gradient(to right, #234C6A, #1a3d57)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        <div className="flex justify-center items-center min-h-screen">
          <div className="p-8 max-w-md text-center">
            <div className="inline-flex justify-center items-center bg-gradient-to-r from-red-500/10 to-rose-500/10 mb-6 p-6 border border-red-500/20 rounded-2xl">
              <Shield className="w-16 h-16 text-red-400" />
            </div>
            <h2 className="mb-3 font-bold text-white text-2xl">Access Restricted</h2>
            <p className="mb-6 text-white/70">
              You need host privileges to create events. Please contact an administrator or update your account settings.
            </p>
            <div className="flex sm:flex-row flex-col justify-center gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="bg-gradient-to-r from-[#96A78D] to-[#D2C1B6] hover:opacity-90 px-6 py-3 rounded-xl font-medium text-white hover:scale-[1.02] transition-opacity"
              >
                Go to Profile
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-white/10 hover:bg-white/15 px-6 py-3 border border-white/20 rounded-xl font-medium text-white hover:scale-[1.02] transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#234C6A]/95 via-[#1a3d57] to-[#152a3d] min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(to right, #234C6A, #1a3d57)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      
      <div className="mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-lg ${eventId ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20' : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'}`}>
              {eventId ? (
                <CalendarPlus className="w-6 h-6 text-amber-300" />
              ) : (
                <Sparkles className="w-6 h-6 text-cyan-300" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-white text-3xl">
                {eventId ? "Edit Event" : "Create New Event"}
              </h1>
              <p className="mt-1 text-white/70">
                {eventId
                  ? "Update your event details and settings"
                  : "Craft an unforgettable experience for your community"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-white/70 text-sm">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-white/60 text-sm">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Event Details"}
                {currentStep === 3 && "Media & Finalize"}
              </span>
            </div>
            <div className="bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="gap-6 grid lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm p-5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-[#96A78D]/20 to-[#D2C1B6]/20 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-[#96A78D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Host Information</h3>
                  <p className="text-white/60 text-sm">Event Creator</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Name</span>
                  <span className="font-medium text-white">{currentUser.name || currentUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Role</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${currentUser.role === 'admin' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300' : 'bg-gradient-to-r from-[#96A78D]/20 to-[#D2C1B6]/20 text-[#96A78D]'}`}>
                    {currentUser.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${currentToken ? 'bg-[#96A78D]' : 'bg-amber-500'}`} />
                    <span className="text-white/70 text-sm">
                      {currentToken ? "Authenticated" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-5 border border-white/10 rounded-xl">
              <h3 className="mb-4 font-semibold text-white">Event Creation Steps</h3>
              <div className="space-y-3">
                {[
                  { step: 1, title: "Basic Information", desc: "Title, category, description" },
                  { step: 2, title: "Event Details", desc: "Date, time, location, capacity" },
                  { step: 3, title: "Media & Finalize", desc: "Images, review & submit" },
                ].map(({ step, title, desc }) => (
                  <button
                    key={step}
                    onClick={() => {
                      setCurrentStep(step);
                      toast.success(`Switched to step ${step}`, {
                        style: {
                          background: 'linear-gradient(to right, #234C6A, #1a3d57)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        },
                        icon: '📋',
                        duration: 1500,
                      });
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${currentStep === step ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-white/10 text-white/40'}`}>
                        {currentStep > step ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="font-medium text-sm">{step}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${currentStep === step ? 'text-white' : 'text-white/70'}`}>{title}</p>
                        <p className="text-white/50 text-xs">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#96A78D]/10 to-[#D2C1B6]/10 backdrop-blur-sm p-5 border border-[#96A78D]/20 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="mt-0.5 w-5 h-5 text-[#96A78D]" />
                <div>
                  <h4 className="mb-2 font-semibold text-white">Best Practices</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="bg-[#96A78D] mt-1.5 rounded-full w-1.5 h-1.5" />
                      Use clear, descriptive titles
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-[#96A78D] mt-1.5 rounded-full w-1.5 h-1.5" />
                      Add high-quality images
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-[#96A78D] mt-1.5 rounded-full w-1.5 h-1.5" />
                      Set realistic participant limits
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-[#96A78D] mt-1.5 rounded-full w-1.5 h-1.5" />
                      Include relevant tags for discoverability
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-white text-xl">Basic Information</h2>
                        <p className="text-white/60 text-sm">Start with the essential details</p>
                      </div>
                    </div>
                    <EventFormDetails
                      formData={formData}
                      onFormChange={handleFormChange}
                      compact
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                        <CalendarPlus className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-white text-xl">Event Details</h2>
                        <p className="text-white/60 text-sm">Schedule and logistics</p>
                      </div>
                    </div>
                    <EventFormDetails
                      formData={formData}
                      onFormChange={handleFormChange}
                      compact
                    />
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                        <Upload className="w-5 h-5 text-cyan-300" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-white text-xl">Media & Finalization</h2>
                        <p className="text-white/60 text-sm">Upload images and review</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <EventImageUploader
                        currentImage={formData.image}
                        onImageUploaded={updateImage}
                        onImageRemoved={() => {
                          updateImage("");
                          toast.success("Image removed", {
                            style: {
                              background: 'linear-gradient(to right, #234C6A, #1a3d57)',
                              color: '#fff',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            },
                            icon: '🗑️',
                            duration: 2000,
                          });
                        }}
                      />
                      
                      <div className="bg-white/5 p-5 border border-white/10 rounded-xl">
                        <h3 className="mb-4 font-semibold text-white">Event Summary</h3>
                        <div className="gap-4 grid grid-cols-2">
                          <div>
                            <p className="text-white/60 text-sm">Title</p>
                            <p className="font-medium text-white">{formData.title || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Category</p>
                            <p className="font-medium text-white">{formData.category || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Date</p>
                            <p className="font-medium text-white">{formData.date || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Participants</p>
                            <p className="font-medium text-white">{formData.maxParticipants} max</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-6 border-white/10 border-t">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-white/10 hover:bg-white/15 px-6 py-3 border border-white/20 rounded-xl font-medium text-white/80 hover:text-white text-sm transition-colors"
                    >
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-cyan-500/20 hover:from-cyan-500/30 to-blue-500/20 hover:to-blue-500/30 px-6 py-3 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl font-medium text-white text-sm transition-all"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading || !currentToken}
                      className="group flex items-center gap-2 bg-gradient-to-r from-[#96A78D] hover:from-[#96A78D]/90 to-[#D2C1B6] hover:to-[#D2C1B6]/90 disabled:opacity-50 px-8 py-3 rounded-xl font-medium text-white text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {eventId ? "Updating..." : "Creating..."}
                        </>
                      ) : !currentToken ? (
                        "Waiting for authentication..."
                      ) : eventId ? (
                        <>
                          Update Event
                          <Rocket className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      ) : (
                        <>
                          Create Event
                          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                        </>
                      )}
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      toast.custom((t) => (
                        <div
                          className={`${
                            t.visible ? 'animate-enter' : 'animate-leave'
                          } max-w-md w-full bg-gradient-to-r from-[#234C6A] to-[#1a3d57] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white/20`}
                        >
                          <div className="flex-1 p-4 w-0">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 pt-0.5">
                                <AlertCircle className="w-6 h-6 text-white/70" />
                              </div>
                              <div className="flex-1 ml-3">
                                <p className="font-medium text-white text-sm">
                                  Cancel Event Creation
                                </p>
                                <p className="mt-1 text-white/70 text-sm">
                                  Are you sure you want to cancel? All unsaved changes will be lost.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex border-white/20 border-l">
                            <button
                              onClick={() => {
                                toast.dismiss(t.id);
                                toast.success("Event creation cancelled", {
                                  style: {
                                    background: 'linear-gradient(to right, #234C6A, #1a3d57)',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                  },
                                  icon: '👋',
                                  duration: 2000,
                                });
                                setTimeout(() => router.back(), 500);
                              }}
                              className="flex justify-center items-center hover:bg-white/10 p-4 border border-transparent rounded-none rounded-r-lg w-full font-medium text-white text-sm"
                            >
                              Yes, Cancel
                            </button>
                            <button
                              onClick={() => toast.dismiss(t.id)}
                              className="flex justify-center items-center hover:bg-white/10 p-4 border border-transparent rounded-none rounded-r-lg w-full font-medium text-white/70 hover:text-white text-sm"
                            >
                              Continue Editing
                            </button>
                          </div>
                        </div>
                      ));
                    }}
                    className="bg-white/10 hover:bg-white/15 px-6 py-3 border border-white/20 rounded-xl font-medium text-white/80 hover:text-white text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}