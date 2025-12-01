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
} from "react-icons/fi";
import { Role } from "@/types/auth";
import API from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";

const FancyAlert = ({ type, message }: { type: 'success' | 'error' | 'info' | 'warning', message: string }) => {
  const icons = {
    success: <FiCheckCircle className="text-green-400 text-xl" />,
    error: <FiAlertCircle className="text-red-400 text-xl" />,
    warning: <FiAlertCircle className="text-yellow-400 text-xl" />,
    info: <FiAlertCircle className="text-blue-400 text-xl" />,
  };

  const bgColors = {
    success: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30",
    error: "bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30",
    warning: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  };

  return (
    <div className={`${bgColors[type]} backdrop-blur-lg border px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-top-5 duration-300`}>
      {icons[type]}
      <span className="font-medium text-white">{message}</span>
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
  const [isAdminAvailable, setIsAdminAvailable] = useState(true);
  const router = useRouter();

  const showAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    toast.custom((t) => (
      <FancyAlert type={type} message={message} />
    ), {
      duration: 4000,
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
      showAlert('error', "Please fill in all required fields");
      return false;
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showAlert('error', "Please enter a valid email address");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert('error', "Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      showAlert('error', "Password must be at least 6 characters");
      return false;
    }

    if (formData.role === "admin" && !isAdminAvailable) {
      showAlert('error', "Admin registration is no longer available");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    const loadingToast = toast.loading(
      <div className="flex items-center space-x-3">
        <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
        <span className="text-white">Creating your account...</span>
      </div>,
      {
        position: 'top-center',
        duration: Infinity,
      }
    );

    try {
      const res = await API.post("/auth/register", formData);
      const { token, user } = res.data.data;

      toast.dismiss(loadingToast);
      showAlert('success', "Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);

    } catch (err: any) {
      console.error("Registration error:", err);
      toast.dismiss(loadingToast);
      showAlert('error', 
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    
    const loadingToast = toast.loading(
      <div className="flex items-center space-x-3">
        <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
        <span className="text-white">Connecting to Google...</span>
      </div>,
      {
        position: 'top-center',
        duration: Infinity,
      }
    );

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
        showAlert('success', "Google registration successful! Redirecting...");
        router.push(result.url);
      }
    } catch (err: any) {
      console.error("Google registration error:", err);
      toast.dismiss(loadingToast);
      showAlert('error', 
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
      script.onload = () => {
        console.log("Google API loaded");
        showAlert('info', "Google Sign-In ready!");
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <Toaster 
        toastOptions={{
          className: '',
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
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
                <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 mt-2 p-3 border border-yellow-500/30 rounded-lg animate-in fade-in">
                  <p className="flex items-center space-x-2 text-yellow-300 text-xs">
                    <FiAlertCircle />
                    <span>Only one admin can be created. This option will disappear after admin registration.</span>
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
            className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 disabled:opacity-50 shadow-lg hover:shadow-xl px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed transform"
          >
            {loading ? (
              <span className="flex justify-center items-center space-x-2">
                <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                <span>Creating account...</span>
              </span>
            ) : (
              "Create your account"
            )}
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
          className="flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 shadow-lg hover:shadow-xl px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full font-medium text-white hover:scale-[1.02] active:scale-[0.98] transition-all animate-in duration-200 duration-500 delay-400 disabled:cursor-not-allowed transform fade-in"
        >
          <FcGoogle size={20} />
          {loading ? "Connecting..." : "Sign up with Google"}
        </button>
      </div>
    </div>
  );
}