"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const validateForm = () => {
    if (!email || !password) {
      showError("Please fill in all required fields");
      return false;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const loadingToast = showLoading("Signing you in...");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Clean up NextAuth error messages
        let errorMessage = result.error;

        if (errorMessage.includes("CredentialsSignin")) {
          errorMessage = "Invalid email or password";
        } else if (
          errorMessage.includes("fetch failed") ||
          errorMessage.includes("Network")
        ) {
          errorMessage =
            "Cannot connect to server. Please check your connection or try again later.";
        } else if (errorMessage.includes("Email and password are required")) {
          errorMessage = "Please enter both email and password";
        }

        throw new Error(errorMessage);
      }

      if (result?.ok && !result?.error) {
        toast.dismiss(loadingToast);
        showSuccess("Login successful! Redirecting...");

        // Redirect to home page
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.dismiss(loadingToast);

      let errorMessage = err.message;
      if (err.message.includes("Server connection failed")) {
        errorMessage =
          "Cannot connect to the server. Please make sure the backend is running.";
      }

      showError(
        errorMessage || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
        showSuccess("Google login successful! Redirecting...");
        window.location.href = result.url;
      } else {
        throw new Error("Google login failed");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      toast.dismiss(loadingToast);

      let errorMessage = err.message;
      if (err.message.includes("OAuthAccountNotLinked")) {
        errorMessage =
          "This email is already registered with another method. Please use your email/password to login.";
      } else if (err.message.includes("OAuthCallback")) {
        errorMessage = "Google authentication failed. Please try again.";
      }

      showError(
        errorMessage || "Google login failed. Please try again."
      );
      setLoading(false);
    }
  };

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
        <div className="slide-in-from-top-5 text-center animate-in duration-500 fade-in">
          <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm mx-auto mb-4 border border-white/30 rounded-full w-16 h-16 animate-in duration-500 delay-100 fade-in">
            <FiLock className="text-white text-2xl" />
          </div>
          <h2 className="drop-shadow-sm font-bold text-white text-3xl tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-white/90 text-sm">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-white hover:text-white/90 underline hover:tracking-wider transition-all duration-200"
            >
              Get started
            </Link>
          </p>
        </div>

        <div className="slide-in-from-bottom-5 bg-white/10 shadow-2xl backdrop-blur-md p-8 border border-white/20 rounded-2xl animate-in duration-500 fade-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="group relative">
                <label
                  htmlFor="email"
                  className="block mb-1 font-medium text-white text-sm"
                >
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white text-lg transition-colors -translate-y-1/2 duration-200 transform" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block bg-white/10 focus:bg-white/15 backdrop-blur-sm py-3 pr-4 pl-10 border border-white/30 hover:border-white/50 focus:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="password"
                  className="block mb-1 font-medium text-white text-sm"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="top-1/2 left-3 absolute text-white/70 group-focus-within:text-white text-lg transition-colors -translate-y-1/2 duration-200 transform" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block bg-white/10 focus:bg-white/15 backdrop-blur-sm py-3 pr-12 pl-10 border border-white/30 hover:border-white/50 focus:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="top-1/2 right-3 absolute text-white/70 hover:text-white transition-colors -translate-y-1/2 duration-200 transform"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="bg-white/10 backdrop-blur-sm border-white/30 hover:border-white/50 rounded focus:ring-white/50 w-4 h-4 text-[#234C6A] transition-colors duration-200 cursor-pointer"
                  disabled={loading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-white/90 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="font-medium text-white hover:text-white/90 underline hover:tracking-wider transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center items-center bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 disabled:opacity-50 shadow-lg hover:shadow-xl backdrop-blur-sm px-6 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 w-full overflow-hidden font-semibold text-white text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 transform"
            >
              <span className="z-10 relative">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in to your account"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
            </button>
          </form>

          <div className="flex items-center my-6 animate-in duration-500 delay-300 fade-in">
            <div className="flex-grow border-white/30 border-t"></div>
            <span className="mx-4 font-medium text-white/70 text-sm">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow border-white/30 border-t"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="group relative flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm px-6 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 w-full overflow-hidden font-medium text-white text-sm hover:scale-[1.02] active:scale-[0.98] transition-all animate-in duration-200 duration-500 delay-400 transform fade-in"
          >
            <FcGoogle size={20} />
            <span className="z-10 relative">
              {loading ? "Connecting..." : "Sign in with Google"}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
          </button>
        </div>

        <div className="text-white/70 text-xs text-center animate-in duration-500 delay-500 fade-in">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="text-white hover:text-white/90 underline hover:tracking-wider transition-colors duration-200"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-white hover:text-white/90 underline hover:tracking-wider transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}