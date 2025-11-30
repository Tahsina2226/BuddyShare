'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
    } catch (error) {
      console.error('Google login failed:', error)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="space-y-8 w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm mx-auto mb-4 border border-white/30 rounded-full w-16 h-16">
            <FiLock className="text-white text-xl" />
          </div>
          <h2 className="drop-shadow-sm font-bold text-white text-3xl tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-white/90 text-sm">
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-semibold text-white hover:text-white/90 underline transition-colors duration-200">
              Get started
            </Link>
          </p>
        </div>

        <div className="bg-white/10 shadow-2xl backdrop-blur-md p-8 border border-white/20 rounded-2xl">
      
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block mb-1 font-medium text-white text-sm">
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="top-1/2 left-3 absolute text-white/70 text-lg -translate-y-1/2 transform" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block bg-white/10 backdrop-blur-sm py-3 pr-4 pl-10 border border-white/30 focus:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block mb-1 font-medium text-white text-sm">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="top-1/2 left-3 absolute text-white/70 text-lg -translate-y-1/2 transform" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="block bg-white/10 backdrop-blur-sm py-3 pr-12 pl-10 border border-white/30 focus:border-white/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all duration-200 placeholder-white/60"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="top-1/2 right-3 absolute text-white/70 hover:text-white transition-colors -translate-y-1/2 duration-200 transform"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
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
                  className="bg-white/10 backdrop-blur-sm border-white/30 rounded focus:ring-white/50 w-4 h-4 text-[#234C6A]"
                />
                <label htmlFor="remember-me" className="ml-2 text-white/90">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="font-medium text-white hover:text-white/90 underline transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex justify-center items-center bg-white/20 hover:bg-white/30 disabled:opacity-50 shadow-lg hover:shadow-xl backdrop-blur-sm px-6 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 w-full font-semibold text-white text-sm transition-all duration-200"
            >
              {loading ? (
                <div className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin" />
              ) : (
                'Sign in to your account'
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-white/30 border-t"></div>
            <span className="mx-4 font-medium text-white/70 text-sm">OR CONTINUE WITH</span>
            <div className="flex-grow border-white/30 border-t"></div>
          </div>

          {/* Google  */}
          <button
            onClick={handleGoogleLogin}
            className="flex justify-center items-center gap-3 bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm px-6 py-3 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 w-full font-medium text-white text-sm transition-all duration-200"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>
        </div>

        <div className="text-white/70 text-xs text-center">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-white hover:text-white/90 underline transition-colors duration-200">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-white hover:text-white/90 underline transition-colors duration-200">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}