"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
import { Role } from "@/types/auth";
import API from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

// Custom Toast Component with beautiful animations
const FancyToast = ({ 
  type, 
  message,
  t 
}: { 
  type: 'success' | 'error' | 'info' | 'warning' | 'loading'
  message: string
  t: any
}) => {
  const icons = {
    success: <FiCheckCircle className="text-emerald-400 text-xl" />,
    error: <FiXCircle className="text-rose-400 text-xl" />,
    warning: <FiAlertCircle className="text-amber-400 text-xl" />,
    info: <FiInfo className="text-sky-400 text-xl" />,
    loading: (
      <div className="relative">
        <div className="absolute inset-0 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
        <div className="border border-white/30 rounded-full w-5 h-5"></div>
      </div>
    ),
  };

  const bgColors = {
    success: "bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-emerald-900/90",
    error: "bg-gradient-to-r from-rose-900/90 via-rose-800/80 to-rose-900/90",
    warning: "bg-gradient-to-r from-amber-900/90 via-amber-800/80 to-amber-900/90",
    info: "bg-gradient-to-r from-sky-900/90 via-sky-800/80 to-sky-900/90",
    loading: "bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/90",
  };

  const borderColors = {
    success: "border-l-4 border-emerald-500",
    error: "border-l-4 border-rose-500",
    warning: "border-l-4 border-amber-500",
    info: "border-l-4 border-sky-500",
    loading: "border-l-4 border-gray-500",
  };

  return (
    <div
      className={`
        ${bgColors[type]} 
        ${borderColors[type]}
        backdrop-blur-xl 
        border border-white/10 
        px-6 py-4 
        rounded-xl 
        shadow-2xl 
        shadow-black/30
        flex 
        items-center 
        space-x-3
        transform-gpu
        transition-all
        duration-300
        ${t.visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
      `}
    >
      {icons[type]}
      <span className="font-medium text-white text-sm">{message}</span>
      {type !== 'loading' && (
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-4 text-white/50 hover:text-white transition-colors duration-200"
        >
          <FiXCircle size={16} />
        </button>
      )}
    </div>
  );
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as Role,
    location: "", 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [isAdminAvailable, setIsAdminAvailable] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const hasAdmin = localStorage.getItem("hasRegisteredAdmin");
      return hasAdmin !== "true";
    }
    return true;
  });
  
  const router = useRouter();

  // Toast notification functions
  const showSuccess = (message: string) => {
    toast.custom((t) => (
      <FancyToast type="success" message={message} t={t} />
    ), {
      duration: 4000,
      position: 'top-center',
    });
  };

  const showError = (message: string) => {
    toast.custom((t) => (
      <FancyToast type="error" message={message} t={t} />
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const showWarning = (message: string) => {
    toast.custom((t) => (
      <FancyToast type="warning" message={message} t={t} />
    ), {
      duration: 4000,
      position: 'top-center',
    });
  };

  const showInfo = (message: string) => {
    toast.custom((t) => (
      <FancyToast type="info" message={message} t={t} />
    ), {
      duration: 3000,
      position: 'top-center',
    });
  };

  const showLoading = (message: string) => {
    return toast.custom((t) => (
      <FancyToast type="loading" message={message} t={t} />
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.location) {
      showError("Please fill in all required fields");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError("Please enter a valid email address");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }

    if (formData.role === "admin" && !isAdminAvailable) {
      showError("Admin registration is no longer available");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    const loadingToast = showLoading("Creating your account...");

    try {
      const res = await API.post("/auth/register", formData);
      const { token, user } = res.data.data;

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Save to localStorage if admin registered
      if (formData.role === "admin") {
        localStorage.setItem("hasRegisteredAdmin", "true");
        setIsAdminAvailable(false);
        showSuccess("🎉 Congratulations! You are now the system administrator!");
      } else {
        showSuccess("Account created successfully! Redirecting to login...");
      }

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err: any) {
      toast.dismiss(loadingToast);
      
      // Handle admin already exists error from backend
      if (err.response?.data?.message?.toLowerCase().includes("admin")) {
        localStorage.setItem("hasRegisteredAdmin", "true");
        setIsAdminAvailable(false);
        showError("An admin already exists in the system. Please register as a regular user.");
      } else {
        showError(
          err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    
    const loadingToast = showLoading("Connecting to Google...");

    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        toast.dismiss(loadingToast);
        showSuccess("Google registration successful! Redirecting...");
        router.push(result.url);
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      showError(
        err.message ||
        "Google registration failed. Please try again."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Enhanced Toaster with proper configuration */}
      <Toaster 
        containerStyle={{
          top: 20,
          zIndex: 99999,
        }}
        toastOptions={{
          className: '',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
            maxWidth: '500px',
            width: '100%',
          },
        }}
      />
      
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="slide-in-from-top-5 drop-shadow-sm font-bold text-white text-3xl tracking-tight animate-in duration-500 fade-in">
            Join our community
          </h2>
          <p className="slide-in-from-top-5 mt-3 text-white/90 text-sm animate-in duration-500 delay-100 fade-in">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-white hover:text-white/90 underline hover:tracking-wider transition-all duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form
          className="slide-in-from-bottom-5 space-y-6 bg-white/10 shadow-2xl backdrop-blur-md p-8 border border-white/20 rounded-2xl animate-in duration-500 fade-in"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="group relative">
              <label
                htmlFor="name"
                className="block mb-1 font-medium text-white text-sm"
              >
                Full Name
              </label>
              <FiUser className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                className="block bg-white/10 focus:bg-white/15 py-3 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="group relative">
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-white text-sm"
              >
                Email
              </label>
              <FiMail className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="block bg-white/10 focus:bg-white/15 py-3 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="group relative">
              <label
                htmlFor="location"
                className="block mb-1 font-medium text-white text-sm"
              >
                Location
              </label>
              <FiMapPin className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="Enter your location"
                className="block bg-white/10 focus:bg-white/15 py-3 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="group relative">
              <label
                htmlFor="role"
                className="block mb-1 font-medium text-white text-sm"
              >
                I want to
              </label>
              <FiCalendar className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block bg-white/10 focus:bg-white/15 py-3 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 cursor-pointer"
                disabled={loading}
              >
                <option value="user" className="bg-white text-gray-900">
                  Join events as participant
                </option>
                <option value="host" className="bg-white text-gray-900">
                  Create events as host
                </option>
                {isAdminAvailable && (
                  <option value="admin" className="bg-white text-gray-900">
                    Register as Admin
                  </option>
                )}
              </select>
              {formData.role === "admin" && isAdminAvailable && (
                <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 mt-2 p-3 border border-amber-500/20 rounded-lg animate-in fade-in">
                  <p className="flex items-center space-x-2 text-amber-300 text-xs">
                    <FiAlertCircle />
                    <span>Only one admin can be created. This option will disappear after admin registration.</span>
                  </p>
                </div>
              )}
              {formData.role === "admin" && !isAdminAvailable && (
                <div className="bg-gradient-to-r from-rose-500/10 to-red-500/10 mt-2 p-3 border border-rose-500/20 rounded-lg animate-in fade-in">
                  <p className="flex items-center space-x-2 text-rose-300 text-xs">
                    <FiAlertCircle />
                    <span>Admin registration is no longer available.</span>
                  </p>
                </div>
              )}
            </div>

            <div className="group relative">
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-white text-sm"
              >
                Password
              </label>
              <FiLock className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password (min. 6 characters)"
                className="block bg-white/10 focus:bg-white/15 py-3 pr-12 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="top-1/2 right-3 absolute text-white/70 hover:text-white transition-colors -translate-y-1/2 duration-200"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="group relative">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 font-medium text-white text-sm"
              >
                Confirm Password
              </label>
              <FiLock className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white transition-colors -translate-y-1/2 duration-200" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm password"
                className="block bg-white/10 focus:bg-white/15 py-3 pr-12 pl-10 border border-white/30 hover:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="top-1/2 right-3 absolute text-white/70 hover:text-white transition-colors -translate-y-1/2 duration-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 disabled:opacity-50 shadow-lg hover:shadow-xl px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full overflow-hidden font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed transform"
          >
            <span className="z-10 relative flex justify-center items-center space-x-2">
              {loading ? (
                <>
                  <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create your account"
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
          </button>
        </form>

        <div className="flex items-center my-6 animate-in duration-500 delay-300 fade-in">
          <div className="flex-grow border-white/30 border-t"></div>
          <span className="mx-4 text-white/70 text-sm">OR CONTINUE WITH</span>
          <div className="flex-grow border-white/30 border-t"></div>
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="group relative flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 shadow-lg hover:shadow-xl px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full overflow-hidden font-medium text-white hover:scale-[1.02] active:scale-[0.98] transition-all animate-in duration-200 duration-500 delay-400 disabled:cursor-not-allowed transform fade-in"
        >
          <FcGoogle size={20} />
          <span className="z-10 relative">
            {loading ? "Connecting..." : "Sign up with Google"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
        </button>
      </div>
    </div>
  );
}