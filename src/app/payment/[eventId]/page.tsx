"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../PaymentForm";
import { useAuth } from "@/context/AuthContext";
import { 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle,
  Shield,
  CreditCard,
  Lock,
  Info,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  HelpCircle,
  Check,
  X,
  Eye,
  EyeOff,
  AlertTriangle,
  Copy,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import API from "@/utils/api";

interface EventInfo {
  id: string;
  title: string;
  joiningFee: number;
  status: string;
  maxParticipants: number;
  currentParticipants: number;
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51PLBGsKqQzYzDf4j5uIJwE07WmWt5HQI4ZtEaW2Lwq8Jq5z3Yv4N3M7o8E4R7V9LrPw3Hv6jJtR6i"
);

const DEMO_CARDS = [
  { type: "visa", number: "4242 4242 4242 4242", cvc: "123", exp: "12/34" },
  { type: "mastercard", number: "5555 5555 5555 4444", cvc: "123", exp: "12/34" },
  { type: "amex", number: "3782 822463 10005", cvc: "1234", exp: "12/34" },
];

export default function PaymentPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [showCardGuide, setShowCardGuide] = useState(false);
  const [showCvcGuide, setShowCvcGuide] = useState(false);
  const [showDemoCard, setShowDemoCard] = useState(false);
  const [selectedDemoCard, setSelectedDemoCard] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEventInfo = async () => {
      try {
        if (!user) {
          router.push(`/login?redirect=/payment/${eventId}`);
          return;
        }

        const response = await API.get(`/events/${eventId}`);

        if (!response.data.success) {
          throw new Error(response.data.message || "Event not found");
        }

        const event = response.data.data.event;

        if (event.joiningFee === 0) {
          setError(
            'This event is free. Please use the "Join for Free" button instead.'
          );
          return;
        }

        if (event.status !== "open") {
          setError(`Event is ${event.status}. Cannot join at this time.`);
          return;
        }

        if (event.currentParticipants >= event.maxParticipants) {
          setError("Event is full. Cannot join at this time.");
          return;
        }

        const isParticipant = event.participants.some(
          (p: any) => p._id === user.id
        );
        if (isParticipant) {
          setError("You have already joined this event.");
          return;
        }

        if (event.host._id === user.id) {
          setError("Host cannot join their own event.");
          return;
        }

        setEventInfo({
          id: event._id,
          title: event.title,
          joiningFee: event.joiningFee,
          status: event.status,
          maxParticipants: event.maxParticipants,
          currentParticipants: event.currentParticipants,
        });
      } catch (err: any) {
        console.error("Error fetching event:", err);

        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError("Failed to load event information");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventInfo();
  }, [eventId, user, router]);

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      router.push(`/events/${eventId}`);
    }, 3000);
  };

  const handlePaymentCancel = () => {
    router.push(`/events/${eventId}`);
  };

  const handleCopyDemoCard = (cardNumber: string) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectDemoCard = (index: number) => {
    setSelectedDemoCard(selectedDemoCard === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-[#234C6A] via-[#1a3d57] to-[#152a3d] p-8 min-h-screen">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#234C6A]/20 to-[#D2C1B6]/20 blur-xl rounded-full animate-pulse"></div>
          <div className="relative bg-white/5 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 text-white animate-spin" />
                <Sparkles className="-top-2 -right-2 absolute w-6 h-6 text-[#D2C1B6] animate-pulse" />
              </div>
              <h3 className="mb-2 font-bold text-white text-xl">Processing</h3>
              <p className="text-white/60">Checking event details and permissions...</p>
              <div className="bg-white/10 mt-6 rounded-full w-48 h-1 overflow-hidden">
                <div className="bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#234C6A] via-[#1a3d57] to-[#152a3d] p-4 md:p-8 min-h-screen">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <Link
              href={`/events/${eventId}`}
              className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 border-2 border-white/20 rounded-xl text-white/60 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Event
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D2C1B6]/10 to-[#c4b1a6]/10 blur-xl rounded-2xl"></div>
            <div className="relative bg-white/5 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl">
              <div className="text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-br from-[#D2C1B6]/20 to-[#c4b1a6]/20 mb-6 p-4 rounded-2xl">
                  <AlertCircle className="w-12 h-12 text-[#D2C1B6]" />
                </div>
                <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 mb-4 font-bold text-transparent text-3xl">
                  Unable to Process Payment
                </h2>
                <div className="bg-white/5 backdrop-blur-sm mb-8 p-6 border-2 border-white/20 rounded-xl">
                  <p className="text-white text-lg">{error}</p>
                </div>
                <Link
                  href={`/events/${eventId}`}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 px-8 py-4 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Return to Event
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentCompleted) {
    return (
      <div className="bg-gradient-to-br from-[#234C6A] via-[#1a3d57] to-[#152a3d] p-4 md:p-8 min-h-screen">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#96A78D]/20 to-[#889c7e]/20 blur-xl rounded-2xl animate-pulse"></div>
            <div className="relative bg-white/5 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/20 rounded-2xl">
              <div className="text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-br from-[#96A78D] to-[#889c7e] mb-6 p-4 rounded-2xl">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
                
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/10 mb-4 px-4 py-2 border-2 border-white/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-[#96A78D]" />
                    <span className="font-bold text-[#96A78D] text-sm">Payment Successful</span>
                  </div>
                  <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 mb-4 font-bold text-transparent text-3xl">
                    You're In!
                  </h2>
                  <p className="mb-2 text-white text-xl">
                    Welcome to "{eventInfo?.title}"
                  </p>
                  <p className="text-white/60">Your spot has been confirmed</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm mb-8 p-6 border-2 border-white/20 rounded-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Event</span>
                      <span className="font-bold text-white">{eventInfo?.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Amount Paid</span>
                      <span className="font-bold text-[#96A78D] text-2xl">
                        ${eventInfo?.joiningFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Confirmation</span>
                      <span className="font-bold text-[#96A78D]">#{Date.now().toString().slice(-8)}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
                  <div className="relative bg-gradient-to-r from-white/10 to-white/5 mb-6 p-4 border-2 border-white/20 rounded-xl">
                    <p className="text-white/60 text-sm">
                      Redirecting to event page in 3 seconds...
                    </p>
                  </div>
                </div>

                <Link
                  href={`/events/${eventId}`}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#234C6A] hover:from-[#D2C1B6] to-[#D2C1B6] hover:to-[#234C6A] px-8 py-4 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Go to Event Dashboard
                  <ArrowLeft className="w-5 h-5 rotate-180 transition-transform group-hover:translate-x-1 transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#234C6A] via-[#1a3d57] to-[#152a3d] p-4 md:p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-8">
            <div>
              <Link
                href={`/events/${eventId}`}
                className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 mb-4 px-4 py-2 border-2 border-white/20 rounded-xl text-white/60 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Event
              </Link>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-2 rounded-xl">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 font-bold text-transparent text-3xl md:text-4xl">
                  Complete Payment
                </h1>
              </div>
              <p className="text-white/60">Secure checkout for event registration</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-xl">
              <Lock className="w-4 h-4 text-[#96A78D]" />
              <span className="font-bold text-white text-sm">SSL Secured</span>
            </div>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#234C6A]/10 to-[#D2C1B6]/10 blur-xl rounded-2xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-6 md:p-8 border-2 border-white/20 rounded-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-bold text-white text-2xl">Payment Details</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] border-2 border-white/20 rounded-full w-8 h-8"></div>
                      <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] border-2 border-white/20 rounded-full w-8 h-8"></div>
                    </div>
                    <span className="font-bold text-white/60 text-sm">Powered by Stripe</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#234C6A]/10 to-[#D2C1B6]/10 mb-8 p-5 border-2 border-white/20 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-2 rounded-lg">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white">Card Information Guide</h3>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={() => setShowDemoCard(!showDemoCard)}
                        className="text-[#D2C1B6] hover:text-[#c4b1a6] text-sm transition-colors"
                      >
                        {showDemoCard ? 'Hide Demo' : 'Show Demo Cards'}
                      </button>
                      <button
                        onClick={() => setShowCardGuide(!showCardGuide)}
                        className="text-[#D2C1B6] hover:text-[#c4b1a6] text-sm transition-colors"
                      >
                        {showCardGuide ? 'Hide Guide' : 'Show Guide'}
                      </button>
                    </div>
                  </div>
                  
                  {showDemoCard && (
                    <div className="bg-white/5 mb-6 p-4 border-2 border-white/20 rounded-xl animate-fadeIn">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-gradient-to-br from-[#D2C1B6]/20 to-[#c4b1a6]/20 p-1.5 rounded-md">
                          <Sparkles className="w-4 h-4 text-[#D2C1B6]" />
                        </div>
                        <h4 className="font-bold text-white">Test Card Numbers</h4>
                        <span className="bg-[#D2C1B6]/20 ml-auto px-2 py-1 border-2 border-white/20 rounded text-[#D2C1B6] text-xs">
                          For Testing Only
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {DEMO_CARDS.map((card, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                              selectedDemoCard === index 
                                ? 'bg-gradient-to-r from-[#234C6A]/20 to-[#D2C1B6]/20 border-white/30' 
                                : 'bg-white/5 hover:bg-white/10 border-white/20'
                            }`}
                            onClick={() => handleSelectDemoCard(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 flex items-center justify-center rounded border-2 ${
                                selectedDemoCard === index 
                                  ? 'bg-[#234C6A] border-white/30' 
                                  : 'border-white/30'
                              }`}>
                                {selectedDemoCard === index && (
                                  <CheckSquare className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 border-2 border-white/20 rounded text-xs font-bold ${
                                      card.type === 'visa' 
                                        ? 'bg-gradient-to-r from-[#234C6A] to-[#1a3d57]' 
                                        : card.type === 'mastercard' 
                                        ? 'bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6]'
                                        : 'bg-gradient-to-r from-[#234C6A] to-[#D2C1B6]'
                                    }`}>
                                      <span className="text-white">{card.type.toUpperCase()}</span>
                                    </div>
                                    <span className="text-white/60 text-sm">
                                      {card.type === 'amex' ? '15 digits' : '16 digits'}
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyDemoCard(card.number);
                                    }}
                                    className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 border-2 border-white/20 rounded-lg text-white text-sm transition-all"
                                  >
                                    {copied ? (
                                      <>
                                        <CheckSquare className="w-3 h-3 text-[#96A78D]" />
                                        <span className="text-[#96A78D]">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                      <p className="mb-1 text-white/60 text-xs">Card Number</p>
                                      <div className="flex items-center gap-2 font-mono">
                                        <div className="bg-white/10 px-3 py-1.5 border-2 border-white/20 rounded-lg text-white">
                                          {card.number}
                                        </div>
                                        <div className="text-white/60 text-xs">
                                          (Spaces optional)
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <p className="mb-1 text-white/60 text-xs">Expiry</p>
                                      <div className="bg-white/10 px-3 py-1.5 border-2 border-white/20 rounded-lg font-mono text-white">
                                        {card.exp}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-white/60 text-xs">CVC</p>
                                      <div className="bg-white/10 px-3 py-1.5 border-2 border-white/20 rounded-lg font-mono text-white">
                                        {card.cvc}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className="mb-1 text-white/60 text-xs">Test Result</p>
                                      <div className="text-xs">
                                        <span className="text-[#96A78D]">✓ Success</span>
                                        <span className="mx-2 text-white/60">•</span>
                                        <span className="text-[#D2C1B6]">$0.00 charged</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {selectedDemoCard === index && (
                              <div className="mt-4 pt-4 border-white/20 border-t-2 animate-fadeIn">
                                <div className="flex items-center gap-2 text-white text-sm">
                                  <Info className="w-4 h-4 text-[#D2C1B6]" />
                                  <span>Use this card for testing. No real charges will be made.</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-white/20 border-t-2">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="flex-shrink-0 w-5 h-5 text-[#D2C1B6]" />
                          <div>
                            <p className="text-white/60 text-sm">
                              <span className="font-bold text-white">Important:</span> These are test card numbers provided by Stripe for development. 
                              They will not process real payments. Use your actual card for real transactions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showCardGuide && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="bg-white/5 p-4 border-2 border-white/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="w-4 h-4 text-[#D2C1B6]" />
                            <h4 className="font-bold text-white">Card Number</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <Check className="w-3 h-3 text-[#96A78D]" />
                              </div>
                              <p className="text-white/60 text-sm">16-digit number on front of card</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <Check className="w-3 h-3 text-[#96A78D]" />
                              </div>
                              <p className="text-white/60 text-sm">No spaces or dashes needed</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <X className="w-3 h-3 text-[#D2C1B6]" />
                              </div>
                              <p className="text-white/60 text-sm">Don't include expiration date</p>
                            </div>
                            {!showDemoCard && (
                              <button
                                onClick={() => setShowDemoCard(true)}
                                className="flex items-center gap-1 mt-2 text-[#D2C1B6] hover:text-[#c4b1a6] text-sm"
                              >
                                <Sparkles className="w-3 h-3" />
                                See example card numbers
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 border-2 border-white/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-[#96A78D]" />
                            <h4 className="font-bold text-white">Expiry Date</h4>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <Check className="w-3 h-3 text-[#96A78D]" />
                              </div>
                              <p className="text-white/60 text-sm">MM/YY format (month/year)</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <Check className="w-3 h-3 text-[#96A78D]" />
                              </div>
                              <p className="text-white/60 text-sm">Find on front of card</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <AlertTriangle className="w-3 h-3 text-[#D2C1B6]" />
                              </div>
                              <p className="text-white/60 text-sm">Must be in the future</p>
                            </div>
                            <div className="bg-[#D2C1B6]/10 mt-2 p-2 border-2 border-white/20 rounded">
                              <p className="text-[#D2C1B6] text-xs">
                                Example: 05/27 means May 2027
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 border-2 border-white/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4 text-[#96A78D]" />
                            <h4 className="font-bold text-white">CVC / CVV</h4>
                            <button
                              onClick={() => setShowCvcGuide(!showCvcGuide)}
                              className="ml-auto text-white/60 hover:text-white"
                            >
                              {showCvcGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex justify-center items-center w-6 h-6">
                                <Check className="w-3 h-3 text-[#96A78D]" />
                              </div>
                              <p className="text-white/60 text-sm">3 or 4-digit security code</p>
                            </div>
                            {showCvcGuide && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="flex justify-center items-center w-6 h-6">
                                    <Info className="w-3 h-3 text-[#D2C1B6]" />
                                  </div>
                                  <p className="text-white/60 text-sm">Visa/Mastercard: Back of card</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex justify-center items-center w-6 h-6">
                                    <Info className="w-3 h-3 text-[#D2C1B6]" />
                                  </div>
                                  <p className="text-white/60 text-sm">American Express: Front of card</p>
                                </div>
                                <div className="mt-2">
                                  <div className="relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#96A78D]/10 to-[#889c7e]/10 blur-sm rounded-lg"></div>
                                    <div className="relative bg-white/5 p-3 border-2 border-white/20 rounded-lg">
                                      <div className="flex items-center gap-2">
                                        <Lock className="w-3 h-3 text-[#96A78D]" />
                                        <span className="font-bold text-[#96A78D] text-sm">Security Note:</span>
                                      </div>
                                      <p className="mt-1 text-white/60 text-xs">
                                        Never share your CVC with anyone. It's only for online transactions.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 border-2 border-white/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-[#96A78D]" />
                            <h4 className="font-bold text-white">Supported Cards</h4>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 to-[#1a3d57]/20 px-3 py-1.5 border-2 border-white/20 rounded-lg">
                              <div className="bg-gradient-to-r from-[#234C6A] to-[#1a3d57] rounded-sm w-6 h-4"></div>
                              <span className="font-bold text-white">Visa</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#D2C1B6]/20 to-[#c4b1a6]/20 px-3 py-1.5 border-2 border-white/20 rounded-lg">
                              <div className="bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6] rounded-sm w-6 h-4"></div>
                              <span className="font-bold text-white">Mastercard</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/20 to-[#D2C1B6]/20 px-3 py-1.5 border-2 border-white/20 rounded-lg">
                              <div className="bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] rounded-sm w-6 h-4"></div>
                              <span className="font-bold text-white">Amex</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-white/60 text-xs">
                              We also accept most major debit cards with these logos.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-white/20 border-t-2">
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-2 rounded-lg">
                            <Info className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">
                              <span className="font-bold text-white">Pro Tip:</span> Your card information is encrypted and never stored on our servers.
                              All transactions are processed securely by Stripe. Look for the lock icon 🔒 in your browser's address bar.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {stripePromise ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      eventId={eventId as string}
                      eventTitle={eventInfo?.title || ""}
                      amount={eventInfo?.joiningFee || 0}
                      onSuccess={handlePaymentSuccess}
                      onCancel={handlePaymentCancel}
                    />
                  </Elements>
                ) : (
                  <div className="py-12 text-center">
                    <div className="inline-flex justify-center items-center bg-white/10 mb-6 p-4 border-2 border-white/20 rounded-2xl">
                      <AlertCircle className="w-12 h-12 text-[#D2C1B6]" />
                    </div>
                    <h3 className="mb-3 font-bold text-white text-2xl">Payment System Unavailable</h3>
                    <p className="mb-8 text-white/60">We're experiencing technical difficulties. Please try again later.</p>
                    <button
                      onClick={handlePaymentCancel}
                      className="bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 px-8 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                    >
                      Return to Event
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 border-2 border-white/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] p-2 rounded-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">End-to-End Encryption</h3>
                </div>
                <p className="text-white/60 text-sm">Military-grade encryption for all transactions</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 border-2 border-white/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">PCI DSS Compliant</h3>
                </div>
                <p className="text-white/60 text-sm">Highest level of payment security</p>
              </div>
              
              <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 border-2 border-white/20 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-2 rounded-lg">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white">No Card Storage</h3>
                </div>
                <p className="text-white/60 text-sm">We never store your payment details</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 p-6 border-2 border-white/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white">Troubleshooting Common Issues</h3>
              </div>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-white/10 border-2 border-white/20 rounded-full w-6 h-6">
                      <span className="font-bold text-white text-xs">1</span>
                    </div>
                    <div>
                      <h4 className="mb-1 font-bold text-white">Card Declined</h4>
                      <p className="text-white/60 text-sm">
                        Check card details, expiry date, and available balance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-white/10 border-2 border-white/20 rounded-full w-6 h-6">
                      <span className="font-bold text-white text-xs">2</span>
                    </div>
                    <div>
                      <h4 className="mb-1 font-bold text-white">Invalid CVC</h4>
                      <p className="text-white/60 text-sm">
                        Ensure you're entering the correct 3-4 digit security code
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-white/10 border-2 border-white/20 rounded-full w-6 h-6">
                      <span className="font-bold text-white text-xs">3</span>
                    </div>
                    <div>
                      <h4 className="mb-1 font-bold text-white">Expired Card</h4>
                      <p className="text-white/60 text-sm">
                        Check card expiry date and use a valid card
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-white/10 border-2 border-white/20 rounded-full w-6 h-6">
                      <span className="font-bold text-white text-xs">4</span>
                    </div>
                    <div>
                      <h4 className="mb-1 font-bold text-white">Network Error</h4>
                      <p className="text-white/60 text-sm">
                        Refresh page or check internet connection
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 blur-xl rounded-2xl"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-white/2 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl">
                <h3 className="mb-6 pb-4 border-white/20 border-b-2 font-bold text-white text-xl">Order Summary</h3>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 border-2 border-white/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/60">Event Registration</span>
                    </div>
                    <span className="font-bold text-white">${eventInfo?.joiningFee.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 border-2 border-white/20 rounded-lg">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/60">Service Fee</span>
                    </div>
                    <span className="font-bold text-white">$0.00</span>
                  </div>
                  
                  <div className="pt-5 border-white/20 border-t-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">Subtotal</span>
                      <span className="font-bold text-white">${eventInfo?.joiningFee.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-5 border-white/20 border-t-2">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-bold text-[#96A78D]">
                        ${eventInfo?.joiningFee.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-2 text-white/60 text-sm">All prices in USD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 p-6 border-2 border-white/20 rounded-2xl">
              <h3 className="mb-6 font-bold text-white text-xl">Event Information</h3>
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-white/60 text-sm">EVENT</p>
                  <p className="font-bold text-white text-lg truncate">{eventInfo?.title}</p>
                </div>
                
                <div className="gap-4 grid grid-cols-2">
                  <div className="bg-white/5 p-4 border-2 border-white/20 rounded-xl">
                    <p className="mb-1 text-white/60 text-sm">AVAILABILITY</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#96A78D]" />
                      <span className="font-bold text-white">
                        {eventInfo?.maxParticipants - (eventInfo?.currentParticipants || 0)} spots left
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 p-4 border-2 border-white/20 rounded-xl">
                    <p className="mb-1 text-white/60 text-sm">PRICE</p>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-[#D2C1B6]" />
                      <span className="font-bold text-white">
                        ${eventInfo?.joiningFee.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]"></div>
                  <div className="relative bg-gradient-to-r from-white/10 to-white/5 p-4 border-2 border-white/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Info className="w-5 h-5 text-[#D2C1B6]" />
                      <p className="text-white/60 text-sm">
                        {eventInfo?.maxParticipants - (eventInfo?.currentParticipants || 0) <= 5 
                          ? `Only ${eventInfo?.maxParticipants - (eventInfo?.currentParticipants || 0)} spots remaining!` 
                          : "Secure your spot now"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 border-2 border-white/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] p-2 rounded-lg">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-white">Refund Policy</h4>
                  <p className="text-white/60 text-sm">
                    Full refunds available up to 24 hours before the event starts. 
                    Contact support for assistance with cancellations.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/2 p-5 border-2 border-white/20 rounded-xl">
              <p className="mb-3 text-white/60 text-xs uppercase tracking-wider">Trusted & Secured By</p>
              <div className="flex justify-between items-center">
                <div className="bg-white/10 px-3 py-2 border-2 border-white/20 rounded-lg">
                  <span className="font-bold text-white">🔒 STRIPE</span>
                </div>
                <div className="bg-white/10 px-3 py-2 border-2 border-white/20 rounded-lg">
                  <span className="font-bold text-white">🛡️ PCI DSS</span>
                </div>
                <div className="bg-white/10 px-3 py-2 border-2 border-white/20 rounded-lg">
                  <span className="font-bold text-white">SSL</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#234C6A]/10 to-[#96A78D]/10 p-5 border-2 border-white/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Need Help?</h4>
                  <p className="text-white/60 text-sm">Contact support for payment issues</p>
                </div>
              </div>
              <button className="bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 px-4 py-2 border-2 border-white/20 rounded-lg w-full font-bold text-white text-sm transition-all">
                Get Support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            By completing your payment, you agree to our{" "}
            <a href="#" className="text-[#D2C1B6] hover:text-[#c4b1a6] transition-colors">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-[#D2C1B6] hover:text-[#c4b1a6] transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}