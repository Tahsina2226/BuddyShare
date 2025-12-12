'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Users,
  DollarSign,
  Shield,
  Star,
  Zap,
  Heart,
  MapPin,
  TrendingUp,
  BookOpen,
  RefreshCw,
  Mail,
  Calendar,
  XCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';
import API from '@/utils/api';

type HostRequestStatus = 'pending' | 'approved' | 'rejected';

interface HostRequest {
  requested: boolean;
  status: HostRequestStatus;
  requestedAt?: string | Date;
  approvedAt?: string | Date;
  rejectedAt?: string | Date;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  reason?: string;
}

interface HostStatus {
  isHost: boolean;
  currentRole: string;
  hostRequest: HostRequest | null;
}

type RequestState = 'idle' | 'loading' | 'success' | 'error';

interface HostState {
  loading: boolean;
  hostStatus: HostStatus | null;
  error: string | null;
}

const hostService = {
  async getHostStatus(): Promise<{ success: boolean; data?: HostStatus; message?: string }> {
    try {
      const response = await API.get('/host/status');
      console.log('🎯 Host status API response:', response.data);
      console.log('🎯 hostRequest data:', response.data?.data?.hostRequest);
      console.log('🎯 hostRequest.requested:', response.data?.data?.hostRequest?.requested);
      console.log('🎯 hostRequest.status:', response.data?.data?.hostRequest?.status);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching host status:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch host status'
      };
    }
  },

  async submitHostRequest(reason: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await API.post('/host/request', { reason });
      console.log('✅ Host request submitted:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error submitting host request:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit host request'
      };
    }
  }
};

const SuccessStories = () => (
  <div className="mt-12">
    <div className="mb-8 text-center">
      <h2 className="bg-clip-text bg-gradient-to-r from-[#F5F0EB] via-[#D2C1B6] to-[#9C6A50] mb-2 font-bold text-transparent text-2xl">
        <Heart className="inline mr-3 w-6 h-6 text-[#9C6A50]" />
        Meet Our Successful Hosts
      </h2>
      <p className="mx-auto max-w-2xl text-[#234C6A]/80">
        Join thousands of hosts who are sharing their passions and building communities
      </p>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[
        {
          name: "Sarah Chen",
          location: "San Francisco",
          rating: 4.9,
          quote: "I've hosted over 50 yoga and wellness sessions and earned $2,500+ while building an amazing community of health-conscious individuals!",
          stat: "Host since 2022",
          color: "from-[#F5F0EB] to-[#D2C1B6]",
          textColor: "text-[#9C6A50]"
        },
        {
          name: "Mike Rodriguez",
          location: "New York",
          rating: 4.8,
          quote: "From casual board game meetups to tournament nights, hosting has been incredibly rewarding! I've connected with amazing people and turned my hobby into extra income.",
          stat: "300+ participants hosted",
          color: "from-[#234C6A]/10 to-[#96A78D]/10",
          textColor: "text-[#234C6A]"
        },
        {
          name: "Jamila Patel",
          location: "London",
          rating: 5.0,
          quote: "As a cooking enthusiast, I started hosting small cooking classes. Now I run monthly culinary workshops and have even published my own recipe book through community support!",
          stat: "$4,200+ earned",
          color: "from-[#96A78D]/10 to-[#D2C1B6]/10",
          textColor: "text-[#96A78D]"
        }
      ].map((host, index) => (
        <div key={index} className="bg-gradient-to-br from-[#F5F0EB]/50 to-white shadow-lg hover:shadow-xl p-6 border border-[#D2C1B6]/30 rounded-2xl transition-all hover:-translate-y-1 duration-300">
          <div className="flex items-center mb-4">
            <div className={`flex justify-center items-center bg-gradient-to-r ${host.color} mr-4 rounded-full w-12 h-12 shadow-sm`}>
              <span className={`font-bold ${host.textColor} text-lg`}>{host.name[0]}</span>
            </div>
            <div>
              <h4 className="font-bold text-[#234C6A]">{host.name}</h4>
              <p className="flex items-center text-[#234C6A]/70 text-sm">
                <MapPin className="mr-1 w-3 h-3 text-[#96A78D]" />
                {host.location}
              </p>
              <div className="flex items-center mt-1">
                <Star className="fill-current w-4 h-4 text-[#9C6A50]" />
                <span className="ml-1 text-[#234C6A] text-sm">{host.rating}</span>
              </div>
            </div>
          </div>
          <p className="mb-4 text-[#234C6A]/80 italic">"{host.quote}"</p>
          <div className="flex items-center text-[#96A78D] text-sm">
            <TrendingUp className="mr-1 w-4 h-4" />
            {host.stat}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FAQSection = () => (
  <div className="bg-gradient-to-br from-[#F5F0EB]/50 to-white shadow-sm mt-12 p-8 border border-[#D2C1B6]/30 rounded-2xl">
    <h2 className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] mb-6 font-bold text-transparent text-2xl text-center">
      Frequently Asked Questions
    </h2>
    <div className="space-y-6">
      {[
        {
          q: "How long does approval take?",
          a: "Most applications are reviewed within 24-48 hours. During peak times, it may take up to 72 hours."
        },
        {
          q: "Is there a fee to become a host?",
          a: "No, becoming a host is completely free! We only charge a small service fee on paid events you host."
        },
        {
          q: "Can I host both free and paid events?",
          a: "Yes! You can host both free community events and paid workshops/classes. For paid events, we handle secure payment processing."
        },
        {
          q: "What support do hosts receive?",
          a: "You get access to our host dashboard, marketing tools, participant management features, 24/7 support, and host community forums."
        }
      ].map((faq, index) => (
        <div key={index}>
          <h3 className="mb-2 font-bold text-[#234C6A]">{faq.q}</h3>
          <p className="text-[#234C6A]/80">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
);

const HostBenefits = () => (
  <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-12">
    {[
      {
        icon: DollarSign,
        title: "Earn Money",
        description: "Set your own prices and earn from event fees. Get paid securely through our platform.",
        gradient: "from-[#234C6A] to-[#2E5A7A]",
        iconColor: "text-[#96A78D]"
      },
      {
        icon: Users,
        title: "Build Community",
        description: "Connect with like-minded people and build a community around your interests and passions.",
        gradient: "from-[#96A78D] to-[#7E9175]",
        iconColor: "text-[#F5F0EB]"
      },
      {
        icon: Star,
        title: "Gain Recognition",
        description: "Build your reputation as a host with reviews and ratings from participants.",
        gradient: "from-[#9C6A50] to-[#B88C75]",
        iconColor: "text-[#F5F0EB]"
      }
    ].map((benefit, index) => (
      <div key={index} className="bg-gradient-to-br from-white to-[#F5F0EB]/50 shadow-lg hover:shadow-xl p-6 border border-[#D2C1B6]/30 rounded-2xl transition-all hover:-translate-y-1 duration-300">
        <div className={`flex justify-center items-center bg-gradient-to-r ${benefit.gradient} shadow-md mb-4 rounded-xl w-12 h-12`}>
          <benefit.icon className={`w-6 h-6 ${benefit.iconColor}`} />
        </div>
        <h3 className="mb-2 font-bold text-[#234C6A] text-lg">{benefit.title}</h3>
        <p className="text-[#234C6A]/80">{benefit.description}</p>
      </div>
    ))}
  </div>
);

const HostRequirements = () => (
  <div className="bg-white shadow-lg mb-8 p-8 border border-[#D2C1B6]/30 rounded-2xl">
    <div className="flex items-center mb-6">
      <div className="flex justify-center items-center bg-gradient-to-r from-[#96A78D] to-[#7E9175] shadow-sm mr-4 rounded-lg w-10 h-10">
        <CheckCircle className="w-5 h-5 text-[#F5F0EB]" />
      </div>
      <h2 className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] font-bold text-transparent text-2xl">Host Requirements</h2>
    </div>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
      <div className="space-y-4">
        {[
          "Be at least 18 years old",
          "Have a verified email address",
          "Clear profile picture",
          "Valid government ID (for paid events)"
        ].map((req, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-[#96A78D]" />
            <span className="text-[#234C6A]/90">{req}</span>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {[
          "Provide accurate event information",
          "Good communication skills",
          "Agree to Host Terms and Conditions",
          "Responsive to participant inquiries"
        ].map((req, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-[#96A78D]" />
            <span className="text-[#234C6A]/90">{req}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <div className="bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 mb-8 p-8 rounded-2xl">
    <h2 className="flex items-center mb-6 font-bold text-[#234C6A] text-2xl">
      <BookOpen className="mr-3 w-6 h-6 text-[#234C6A]" />
      How It Works
    </h2>
    <div className="gap-6 grid grid-cols-1 md:grid-cols-4">
      {[
        { number: 1, title: "Apply", description: "Submit your host application" },
        { number: 2, title: "Review", description: "Our team reviews your application" },
        { number: 3, title: "Get Approved", description: "Receive host status approval" },
        { number: 4, title: "Start Hosting", description: "Create and manage your events" }
      ].map((step) => (
        <div key={step.number} className="text-center">
          <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A]/20 to-[#96A78D]/20 mx-auto mb-4 rounded-full w-12 h-12">
            <span className="font-bold text-[#234C6A] text-lg">{step.number}</span>
          </div>
          <h3 className="mb-2 font-bold text-[#234C6A]">{step.title}</h3>
          <p className="text-[#234C6A]/80 text-sm">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
);

interface StatusDisplayProps {
  hostStatus: HostStatus | null;
  setHostStatus: React.Dispatch<React.SetStateAction<HostStatus | null>>;
  fetchHostStatus: () => Promise<void>;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ hostStatus, setHostStatus, fetchHostStatus }) => {
  if (!hostStatus) return null;

  console.log('🔍 StatusDisplay - hostStatus:', hostStatus);
  console.log('🔍 hostRequest:', hostStatus.hostRequest);
  console.log('🔍 hostRequest.requested:', hostStatus.hostRequest?.requested);
  console.log('🔍 hostRequest.status:', hostStatus.hostRequest?.status);

  // Check if user is already a host
  if (hostStatus.isHost) {
    return (
      <div className="bg-gradient-to-r from-[#96A78D]/20 to-[#7E9175]/20 mb-6 p-6 border border-[#96A78D]/30 rounded-xl">
        <div className="flex items-center">
          <CheckCircle className="mr-4 w-8 h-8 text-[#96A78D]" />
          <div>
            <h3 className="mb-1 font-bold text-[#234C6A] text-xl">
              You are already a Host! 🎉
            </h3>
            <p className="text-[#234C6A]/80">
              You can now create and manage events.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/events/create"
            className="inline-flex items-center bg-gradient-to-r from-[#96A78D] hover:from-[#7E9175] to-[#234C6A] hover:to-[#2E5A7A] shadow-lg hover:shadow-xl px-6 py-3 rounded-lg font-medium text-[#F5F0EB] transition-all duration-300"
          >
            Create Your First Event
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has a VALID host request (requested must be true)
  if (hostStatus.hostRequest && hostStatus.hostRequest.requested === true) {
    console.log('🔍 Valid host request found');
    
    if (hostStatus.hostRequest.status === 'pending') {
      const formatDate = (dateValue: any): string => {
        if (!dateValue) {
          return 'Recently';
        }
        
        try {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            
            if (diffHours < 1) return 'Just now';
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            if (diffHours < 48) return 'Yesterday';
            
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }
        
        return 'Recently';
      };

      return (
        <div className="bg-gradient-to-r from-[#F5F0EB]/20 to-[#D2C1B6]/20 mb-6 p-6 border border-[#D2C1B6]/30 rounded-xl">
          <div className="flex items-start">
            <Clock className="flex-shrink-0 mr-4 w-8 h-8 text-[#9C6A50]" />
            <div className="flex-1">
              <h3 className="mb-1 font-bold text-[#9C6A50] text-xl">
                Request Pending Review ⏳
              </h3>
              <p className="text-[#234C6A]/80">
                Your host request is under review by our admin team.
              </p>
              
              {hostStatus.hostRequest.requestedAt && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center text-[#9C6A50] text-sm">
                    <Calendar className="mr-2 w-4 h-4" />
                    <span>Requested: {formatDate(hostStatus.hostRequest.requestedAt)}</span>
                  </div>
                  
                  <div className="flex items-center text-[#9C6A50] text-sm">
                    <Clock className="mr-2 w-4 h-4" />
                    <span>Estimated completion: Within 48 hours</span>
                  </div>
                </div>
              )}
              
              {hostStatus.hostRequest.reason && (
                <div className="bg-[#F5F0EB]/50 mt-4 p-3 rounded-lg">
                  <p className="text-[#9C6A50] text-sm">
                    <span className="font-medium">Your reason:</span> {hostStatus.hostRequest.reason}
                  </p>
                </div>
              )}
              
              <div className="bg-white/50 mt-4 p-3 rounded-lg">
                <div className="flex items-start">
                  <Mail className="mt-0.5 mr-2 w-4 h-4 text-[#9C6A50]" />
                  <p className="text-[#234C6A]/80 text-sm">
                    <strong>What's next?</strong> Our team typically reviews applications within 24-48 hours. 
                    You'll receive an email notification once your application is processed.
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={fetchHostStatus}
                  className="flex items-center bg-[#F5F0EB] hover:bg-[#D2C1B6] shadow-sm hover:shadow px-4 py-2 rounded-lg text-[#9C6A50] text-sm transition-all duration-300"
                >
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Check Status Update
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (hostStatus.hostRequest.status === 'rejected') {
      return (
        <div className="bg-gradient-to-r from-[#F5F0EB]/20 to-[#D2C1B6]/20 mb-6 p-6 border border-[#D2C1B6]/30 rounded-xl">
          <div className="flex items-center">
            <AlertCircle className="mr-4 w-8 h-8 text-[#9C6A50]" />
            <div>
              <h3 className="mb-1 font-bold text-[#234C6A] text-xl">
                Request Rejected
              </h3>
              <p className="text-[#234C6A]/80">
                Your host request was not approved. You can try again with more information.
              </p>
              {hostStatus.hostRequest.rejectionReason && (
                <div className="bg-[#F5F0EB]/50 mt-3 p-3 rounded-lg">
                  <p className="text-[#9C6A50] text-sm">
                    <span className="font-medium">Reason:</span> {hostStatus.hostRequest.rejectionReason}
                  </p>
                </div>
              )}
              <button
                onClick={() => setHostStatus(prev => {
                  if (!prev) return null;
                  return { ...prev, hostRequest: null };
                })}
                className="flex items-center bg-[#F5F0EB] hover:bg-[#D2C1B6] shadow-sm hover:shadow mt-4 px-4 py-2 rounded-lg text-[#9C6A50] transition-all duration-300"
              >
                <XCircle className="mr-2 w-4 h-4" />
                Apply Again
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

interface HostApplicationFormProps {
  reason: string;
  setReason: (reason: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  success: boolean;
  setSuccess: (success: boolean) => void;
  submitState: RequestState;
  setSubmitState: (state: RequestState) => void;
  fetchHostStatus: () => Promise<void>;
}

const HostApplicationForm: React.FC<HostApplicationFormProps> = ({
  reason,
  setReason,
  error,
  setError,
  success,
  setSuccess,
  submitState,
  setSubmitState,
  fetchHostStatus
}) => {
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!reason.trim()) {
      errors.push('Please tell us why you want to become a host');
    }
    
    if (reason.trim().length < 50) {
      errors.push('Please provide more details (at least 50 characters)');
    }
    
    if (reason.trim().length > 1000) {
      errors.push('Reason should be less than 1000 characters');
    }
    
    return errors;
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    try {
      setSubmitState('loading');
      setError(null);
      
      const data = await hostService.submitHostRequest(reason);
      
      if (data.success) {
        setSuccess(true);
        await fetchHostStatus();
        setSubmitState('success');
      } else {
        setError(data.message || 'Failed to submit request');
        setSubmitState('error');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
      setSubmitState('error');
    }
  };

  const eventTypes = ['Workshops', 'Social Gatherings', 'Sports', 'Arts & Culture', 'Food & Drink', 'Tech', 'Outdoor', 'Educational', 'Networking', 'Fitness'];

  if (success) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center items-center bg-gradient-to-r from-[#96A78D]/20 to-[#7E9175]/20 mx-auto mb-4 rounded-full w-16 h-16">
          <CheckCircle className="w-8 h-8 text-[#96A78D]" />
        </div>
        <h3 className="mb-2 font-bold text-[#234C6A] text-xl">
          Request Submitted Successfully! 🎉
        </h3>
        <p className="mx-auto mb-6 max-w-md text-[#234C6A]/80">
          Your host request has been submitted. Our admin team will review it within 24-48 hours.
          You'll receive an email notification once your application is processed.
        </p>
        <div className="flex sm:flex-row flex-col justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg hover:shadow-xl px-6 py-3 rounded-lg font-medium text-[#F5F0EB] transition-all duration-300"
          >
            <ArrowRight className="mr-2 w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center hover:bg-[#F5F0EB] px-6 py-3 border border-[#D2C1B6] rounded-lg text-[#234C6A] transition-all duration-300"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitRequest}>
      <div className="mb-6">
        <label className="block mb-2 font-medium text-[#234C6A] text-sm">
          Why do you want to become a host? *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tell us about:
• Your interests and expertise
• What kind of events you'd like to host
• Your previous experience (if any)
• Your motivation for becoming a host..."
          rows={5}
          className="bg-white/50 px-4 py-3 border border-[#D2C1B6] focus:border-[#96A78D] rounded-lg focus:outline-none focus:ring-[#96A78D]/30 focus:ring-2 w-full transition-all duration-300"
          required
          maxLength={1000}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-[#234C6A]/60 text-sm">
            <AlertCircle className="mr-1 w-4 h-4 text-[#9C6A50]" />
            Minimum 50 characters required
          </div>
          <div className="text-[#234C6A]/60 text-sm">
            {reason.length}/1000
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-[#234C6A] text-sm">
          What types of events are you interested in hosting?
        </label>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setReason(prev => prev + `\n• Interested in ${type} events`)}
              className="bg-[#F5F0EB] hover:bg-[#D2C1B6] shadow-sm hover:shadow px-3 py-1 rounded-full text-[#234C6A] text-sm transition-all duration-300"
              aria-label={`Add ${type} to interests`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-gradient-to-r from-[#F5F0EB]/50 to-white mb-6 p-4 border border-[#D2C1B6] rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="mr-2 w-5 h-5 text-[#9C6A50]" />
            <span className="text-[#9C6A50]">{error}</span>
          </div>
        </div>
      )}

      <div className="flex sm:flex-row flex-col gap-4">
        <button
          type="submit"
          disabled={submitState === 'loading'}
          className="flex flex-1 justify-center items-center bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] disabled:opacity-50 shadow-lg hover:shadow-xl px-6 py-4 rounded-lg font-medium text-[#F5F0EB] transition-all duration-300 disabled:cursor-not-allowed"
        >
          {submitState === 'loading' ? (
            <>
              <div className="mr-2 border-[#F5F0EB] border-b-2 rounded-full w-5 h-5 animate-spin"></div>
              Submitting Application...
            </>
          ) : (
            <>
              <Zap className="mr-2 w-5 h-5" />
              Submit Host Application
            </>
          )}
        </button>
        
        <Link
          href="/dashboard"
          className="hover:bg-[#F5F0EB] px-6 py-4 border border-[#D2C1B6] rounded-lg font-medium text-[#234C6A] text-center transition-all duration-300"
        >
          Cancel
        </Link>
      </div>

      <div className="mt-4 text-[#234C6A]/60 text-sm text-center">
        By submitting, you agree to our{' '}
        <Link href="/terms/host" className="font-medium text-[#96A78D] hover:text-[#7E9175]">
          Host Terms and Conditions
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="font-medium text-[#96A78D] hover:text-[#7E9175]">
          Privacy Policy
        </Link>
      </div>
    </form>
  );
};

export default function BecomeHostPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [state, setState] = useState<HostState>({
    loading: true,
    hostStatus: null,
    error: null
  });
  
  const [reason, setReason] = useState('');
  const [submitState, setSubmitState] = useState<RequestState>('idle');
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchHostStatus = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      
      if (!user) {
        router.push('/login');
        return;
      }

      const data = await hostService.getHostStatus();
      
      if (data.success) {
        console.log('✅ Host status fetched:', data.data);
        setState(prev => ({ ...prev, hostStatus: data.data, error: null }));
      } else {
        console.log('❌ Error fetching host status:', data.message);
        setState(prev => ({ ...prev, error: data.message || 'Failed to fetch host status' }));
      }
    } catch (err) {
      console.error('🚨 Error fetching host status:', err);
      setState(prev => ({ ...prev, error: 'Network error. Please check your connection.' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, router]);

  useEffect(() => {
    fetchHostStatus();
  }, [fetchHostStatus]);

  const statusDisplay = useMemo(() => (
    <StatusDisplay 
      hostStatus={state.hostStatus} 
      setHostStatus={(status) => setState(prev => ({ ...prev, hostStatus: status }))}
      fetchHostStatus={fetchHostStatus}
    />
  ), [state.hostStatus, fetchHostStatus]);

  if (state.loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#F5F0EB] to-white min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-[#96A78D] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-[#234C6A]/80">Loading your host status...</p>
        </div>
      </div>
    );
  }

  console.log('📊 Current state:', {
    hasHostStatus: !!state.hostStatus,
    isHost: state.hostStatus?.isHost,
    hasHostRequest: !!state.hostStatus?.hostRequest,
    hostRequestRequested: state.hostStatus?.hostRequest?.requested,
    hostRequestStatus: state.hostStatus?.hostRequest?.status,
  });

  const shouldShowApplicationForm = !state.hostStatus?.isHost && 
    (!state.hostStatus?.hostRequest || 
     state.hostStatus?.hostRequest?.requested === false || 
     state.hostStatus?.hostRequest?.status === 'rejected');

  console.log('📊 Should show application form?', shouldShowApplicationForm);

  return (
    <div className="bg-gradient-to-b from-[#F5F0EB] to-white py-12 min-h-screen">
      <div className="mx-auto px-4 max-w-6xl">
        <div className="mb-12 text-center">
          <div className="inline-flex justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-lg mb-6 rounded-full w-20 h-20">
            <Award className="w-10 h-10 text-[#F5F0EB]" />
          </div>
          <h1 className="bg-clip-text bg-gradient-to-r from-[#234C6A] via-[#96A78D] to-[#9C6A50] mb-4 font-bold text-transparent text-4xl">
            Become a Host on EventBuddy
          </h1>
          <p className="mx-auto max-w-2xl text-[#234C6A]/80 text-xl">
            Share your passions, create amazing experiences, and earn money by hosting events
          </p>
        </div>

        {state.error && (
          <div className="bg-gradient-to-r from-[#F5F0EB]/50 to-white mb-6 p-6 border border-[#D2C1B6] rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="mr-4 w-8 h-8 text-[#9C6A50]" />
              <div>
                <h3 className="mb-1 font-bold text-[#234C6A] text-xl">
                  Error
                </h3>
                <p className="text-[#234C6A]/80">{state.error}</p>
              </div>
            </div>
          </div>
        )}

        {statusDisplay}

        {shouldShowApplicationForm ? (
          <>
            <div className="mb-8">
              <div className="bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 p-6 rounded-2xl">
                <div className="flex items-start">
                  <Info className="flex-shrink-0 mt-0.5 mr-3 w-6 h-6 text-[#234C6A]" />
                  <div>
                    <h2 className="mb-2 font-bold text-[#234C6A] text-2xl">
                      Ready to Become a Host?
                    </h2>
                    <p className="mb-4 text-[#234C6A]/80">
                      Fill out the application form below to start your journey as an EventBuddy host.
                      Share your passions, create amazing experiences, and build a community!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <HostBenefits />
            <HowItWorks />
            <HostRequirements />

            <div className="bg-gradient-to-br from-white to-[#F5F0EB]/50 shadow-xl p-8 border border-[#D2C1B6]/30 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-sm mr-4 rounded-lg w-10 h-10">
                  <Shield className="w-5 h-5 text-[#F5F0EB]" />
                </div>
                <div>
                  <h2 className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] font-bold text-transparent text-2xl">Apply to Become a Host</h2>
                  <p className="text-[#234C6A]/80">Tell us about yourself and your hosting goals</p>
                </div>
              </div>

              <HostApplicationForm
                reason={reason}
                setReason={setReason}
                error={formError}
                setError={setFormError}
                success={success}
                setSuccess={setSuccess}
                submitState={submitState}
                setSubmitState={setSubmitState}
                fetchHostStatus={fetchHostStatus}
              />
            </div>

            <SuccessStories />
            <FAQSection />
          </>
        ) : !state.hostStatus?.isHost && 
            state.hostStatus?.hostRequest?.requested === true && 
            state.hostStatus?.hostRequest?.status === 'pending' ? (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 p-6 rounded-2xl">
              <h2 className="flex items-center mb-4 font-bold text-[#234C6A] text-2xl">
                <Clock className="mr-3 w-6 h-6 text-[#234C6A]" />
                While You Wait...
              </h2>
              <p className="mb-4 text-[#234C6A]/80">
                Your host request is being reviewed. In the meantime, you can explore events and get inspired!
              </p>
              <div className="flex gap-4">
                <Link
                  href="/events"
                  className="inline-flex items-center bg-gradient-to-r from-[#234C6A] hover:from-[#2E5A7A] to-[#96A78D] hover:to-[#7E9175] shadow-lg hover:shadow-xl px-6 py-3 rounded-lg font-medium text-[#F5F0EB] transition-all duration-300"
                >
                  <ArrowRight className="mr-2 w-4 h-4" />
                  Browse Events
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center hover:bg-[#F5F0EB] px-6 py-3 border border-[#D2C1B6] rounded-lg text-[#234C6A] transition-all duration-300"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}