"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCalendar } from "react-icons/fi";
import { Role } from "@/types/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as Role,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, registerWithGoogle } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;
    setLoading(true);
    try {
      await register(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    await registerWithGoogle();
  };

  // Replace this with your actual logic to allow only 1 admin
  const isAdminAvailable = true; // change to false once admin exists

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <h2 className="drop-shadow-sm font-bold text-white text-3xl tracking-tight">
            Join our community
          </h2>
          <p className="mt-3 text-white/90 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-white hover:text-white/90 underline">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="space-y-6 bg-white/10 shadow-2xl backdrop-blur-md p-8 border border-white/20 rounded-2xl" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="name" className="block mb-1 font-medium text-white text-sm">Full Name</label>
              <FiUser className="top-1/2 left-3 absolute text-white/70 -translate-y-1/2" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your full name"
                className="block bg-white/10 py-3 pl-10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white placeholder-white/60"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="email" className="block mb-1 font-medium text-white text-sm">Email</label>
              <FiMail className="top-1/2 left-3 absolute text-white/70 -translate-y-1/2" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="block bg-white/10 py-3 pl-10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white placeholder-white/60"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <label htmlFor="role" className="block mb-1 font-medium text-white text-sm">I want to</label>
              <FiCalendar className="top-1/2 left-3 absolute text-white/70 -translate-y-1/2" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block bg-white/10 py-3 pl-10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white"
              >
                <option value="user" className="text-gray-900">Join events as participant</option>
                <option value="host" className="text-gray-900">Create events as host</option>
                {isAdminAvailable && <option value="admin" className="text-gray-900">Register as Admin</option>}
              </select>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-1 font-medium text-white text-sm">Password</label>
              <FiLock className="top-1/2 left-3 absolute text-white/70 -translate-y-1/2" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                className="block bg-white/10 py-3 pr-12 pl-10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white placeholder-white/60"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" className="top-1/2 right-3 absolute text-white/70 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block mb-1 font-medium text-white text-sm">Confirm Password</label>
              <FiLock className="top-1/2 left-3 absolute text-white/70 -translate-y-1/2" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm password"
                className="block bg-white/10 py-3 pr-12 pl-10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white placeholder-white/60"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" className="top-1/2 right-3 absolute text-white/70 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full font-semibold text-white transition-all duration-200">
            {loading ? "Creating account..." : "Create your account"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-white/30 border-t"></div>
          <span className="mx-4 text-white/70 text-sm">OR CONTINUE WITH</span>
          <div className="flex-grow border-white/30 border-t"></div>
        </div>

        <button onClick={handleGoogleRegister} className="flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full font-medium text-white transition-all duration-200">
          <FcGoogle size={20} />
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
