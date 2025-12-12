'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Crown, CheckCircle, Clock, AlertCircle, ArrowRight,
  Users, Calendar, DollarSign, Shield, Star, Zap
} from 'lucide-react';
import Link from 'next/link';

interface HostStatus {
  isHost: boolean;
  currentRole: string;
  hostRequest: {
    requested: boolean;
    status: string;
    requestedAt: string;
    reason?: string;
  } | null;
}

export default function BecomeHostPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [hostStatus, setHostStatus] = useState<HostStatus | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchHostStatus();
  }, []);

  const fetchHostStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/host/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setHostStatus(data.data);
      }
    } catch (err) {
      console.error('Error fetching host status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please tell us why you want to become a host');
      return;
    }

    try {
      setRequesting(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/host/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        fetchHostStatus();
      } else {
        setError(data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request');
    } finally {
      setRequesting(false);
    }
  };

  const getStatusDisplay = () => {
    if (!hostStatus) return null;

    if (hostStatus.isHost) {
      return (
        <div className="bg-green-50 mb-6 p-6 border border-green-200 rounded-xl">
          <div className="flex items-center">
            <CheckCircle className="mr-4 w-8 h-8 text-green-600" />
            <div>
              <h3 className="mb-1 font-bold text-green-800 text-xl">
                You are already a Host! 🎉
              </h3>
              <p className="text-green-700">
                You can now create and manage events.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="/events/create"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium text-white transition"
            >
              Create Your First Event
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      );
    }

    if (hostStatus.hostRequest) {
      if (hostStatus.hostRequest.status === 'pending') {
        return (
          <div className="bg-yellow-50 mb-6 p-6 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <Clock className="mr-4 w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="mb-1 font-bold text-yellow-800 text-xl">
                  Request Pending Review ⏳
                </h3>
                <p className="text-yellow-700">
                  Your host request is under review by our admin team.
                </p>
                <p className="mt-2 text-yellow-600 text-sm">
                  Requested on: {new Date(hostStatus.hostRequest.requestedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-blue-600 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-12 min-h-screen">
      <div className="mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex justify-center items-center bg-gradient-to-r from-purple-600 to-blue-600 mb-6 rounded-full w-20 h-20">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-4 font-bold text-gray-900 text-4xl">
            Become a Host on EventBuddy
          </h1>
          <p className="mx-auto max-w-2xl text-gray-600 text-xl">
            Share your passions, create amazing experiences, and earn money by hosting events
          </p>
        </div>

        {/* Status Display */}
        {getStatusDisplay()}

        {/* If already host or pending, don't show the form */}
        {hostStatus?.isHost || hostStatus?.hostRequest?.status === 'pending' ? null : (
          <>
            {/* Benefits Section */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <div className="bg-white shadow-lg p-6 border border-gray-100 rounded-xl">
                <div className="flex justify-center items-center bg-blue-100 mb-4 rounded-lg w-12 h-12">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900 text-lg">Earn Money</h3>
                <p className="text-gray-600">
                  Set your own prices and earn from event fees. Get paid securely through our platform.
                </p>
              </div>

              <div className="bg-white shadow-lg p-6 border border-gray-100 rounded-xl">
                <div className="flex justify-center items-center bg-green-100 mb-4 rounded-lg w-12 h-12">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900 text-lg">Build Community</h3>
                <p className="text-gray-600">
                  Connect with like-minded people and build a community around your interests.
                </p>
              </div>

              <div className="bg-white shadow-lg p-6 border border-gray-100 rounded-xl">
                <div className="flex justify-center items-center bg-purple-100 mb-4 rounded-lg w-12 h-12">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-2 font-bold text-gray-900 text-lg">Gain Recognition</h3>
                <p className="text-gray-600">
                  Build your reputation as a host with reviews and ratings from participants.
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 mb-8 p-8 rounded-xl">
              <h2 className="mb-6 font-bold text-gray-900 text-2xl">Host Requirements</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                  <span>Be at least 18 years old</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                  <span>Have a verified email address</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                  <span>Provide accurate event information</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-green-500" />
                  <span>Agree to our Host Terms and Conditions</span>
                </li>
              </ul>
            </div>

            {/* Request Form */}
            <div className="bg-white shadow-lg p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <Shield className="mr-3 w-8 h-8 text-blue-600" />
                <h2 className="font-bold text-gray-900 text-2xl">Apply to Become a Host</h2>
              </div>

              {error && (
                <div className="bg-red-50 mb-6 p-4 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="mr-2 w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {success ? (
                <div className="py-8 text-center">
                  <div className="flex justify-center items-center bg-green-100 mx-auto mb-4 rounded-full w-16 h-16">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900 text-xl">
                    Request Submitted Successfully! 🎉
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Your host request has been submitted. Our admin team will review it within 24-48 hours.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest}>
                  <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                      Why do you want to become a host? *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Tell us about your interests, experience, and what kind of events you'd like to host..."
                      rows={4}
                      className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                      required
                    />
                    <p className="mt-2 text-gray-500 text-sm">
                      This helps us understand your motivation and approve your request faster.
                    </p>
                  </div>

                  <div className="flex sm:flex-row flex-col gap-4">
                    <button
                      type="submit"
                      disabled={requesting}
                      className="flex flex-1 justify-center items-center bg-gradient-to-r from-purple-600 hover:from-purple-700 to-blue-600 hover:to-blue-700 disabled:opacity-50 px-6 py-3 rounded-lg font-medium text-white transition disabled:cursor-not-allowed"
                    >
                      {requesting ? (
                        <>
                          <div className="mr-2 border-white border-b-2 rounded-full w-4 h-4 animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 w-4 h-4" />
                          Submit Host Request
                        </>
                      )}
                    </button>
                    
                    <Link
                      href="/dashboard"
                      className="hover:bg-gray-50 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 text-center transition"
                    >
                      Cancel
                    </Link>
                  </div>

                  <p className="mt-4 text-gray-500 text-sm text-center">
                    By submitting, you agree to our{' '}
                    <Link href="/terms/host" className="text-blue-600 hover:text-blue-700">
                      Host Terms and Conditions
                    </Link>
                  </p>
                </form>
              )}
            </div>

            {/* Success Stories */}
            <div className="mt-12">
              <h2 className="mb-6 font-bold text-gray-900 text-2xl text-center">
                Meet Our Successful Hosts
              </h2>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                <div className="bg-white shadow p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center bg-yellow-100 mr-4 rounded-full w-12 h-12">
                      <span className="font-bold text-yellow-600">S</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Sarah Chen</h4>
                      <p className="text-gray-600 text-sm">Yoga & Wellness Host</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "I've hosted over 50 yoga sessions and earned $2,500+ while building an amazing community!"
                  </p>
                </div>
                
                <div className="bg-white shadow p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="flex justify-center items-center bg-blue-100 mr-4 rounded-full w-12 h-12">
                      <span className="font-bold text-blue-600">M</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Mike Rodriguez</h4>
                      <p className="text-gray-600 text-sm">Board Games Host</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "From casual meetups to tournament nights, hosting games has been incredibly rewarding!"
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}