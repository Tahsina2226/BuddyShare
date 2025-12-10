'use client'

import { useState, useEffect, useRef } from 'react';
import { 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { PaymentFormProps } from '@/types/payment';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Loader2, 
  CheckCircle, 
  XCircle,
  Shield,
  Sparkles,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import API from '@/utils/api';

export default function PaymentForm({ 
  eventId, 
  eventTitle, 
  amount, 
  onSuccess, 
  onCancel 
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!stripe || !eventId || initializedRef.current || clientSecret) return;

    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to continue with payment');
          setLoading(false);
          return;
        }

        const response = await API.post('/payments/create-intent', { 
          eventId,
          amount 
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setClientSecret(response.data.data.clientSecret);
          setIsInitialized(true);
          initializedRef.current = true;
        } else {
          setError(response.data.message || 'Failed to create payment intent');
        }
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Failed to initialize payment');
        }
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [stripe, eventId, amount, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card information is not complete');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please login again.');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await API.post('/payments/confirm', { 
          paymentIntentId: paymentIntent.id,
          eventId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (confirmResponse.data.success) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        } else {
          setError(confirmResponse.data.message || 'Payment confirmation failed');
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('An error occurred during payment');
      }
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#FFFFFF',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: '#D2C1B6',
      },
    },
    hidePostalCode: true,
  };

  if (loading && !clientSecret && !isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center py-12">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
          <Loader2 className="relative w-16 h-16 text-white animate-spin" />
        </div>
        <p className="mb-2 font-bold text-white text-xl">Preparing Payment</p>
        <p className="text-white/60">Initializing secure payment gateway</p>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 text-center"
      >
        <div className="inline-flex justify-center items-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#96A78D] to-[#889c7e] opacity-30 blur-xl rounded-full"></div>
            <div className="relative bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-6 rounded-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
        <h3 className="mb-3 font-bold text-white text-2xl">Payment Successful!</h3>
        <p className="mb-6 text-white/70">You have successfully joined the event</p>
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          <Loader2 className="w-4 h-4 text-white animate-spin" />
          <span className="text-white/60 text-sm">Redirecting...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl mb-8 p-8 border-2 border-white/25 rounded-2xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xl">Event Registration</h3>
            <p className="text-white/60">Complete your event registration</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 border-2 border-white/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Event</p>
                <p className="text-white/60 text-sm">{eventTitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 border-2 border-white/20 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] p-3 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Amount</p>
                <p className="text-white/60 text-sm">Total payment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-white text-3xl">${amount.toFixed(2)}</p>
              <p className="text-white/60 text-sm">USD</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-white/20 border-t-2">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Shield className="w-4 h-4 text-[#96A78D]" />
            <span>100% secure payment • SSL encrypted</span>
          </div>
        </div>
      </motion.div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">Payment Details</h3>
              <p className="text-white/60">Enter your card information</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 border-2 border-white/20 rounded-xl">
            <CardElement options={cardElementOptions} />
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-white/60 text-sm">
            <Shield className="w-4 h-4 text-[#96A78D]" />
            <span>Your payment is secure and encrypted</span>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-r from-[#D2C1B6]/10 to-[#c4b1a6]/5 backdrop-blur-sm p-4 border-2 border-white/20 rounded-xl"
          >
            <div className="flex items-start">
              <XCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-[#D2C1B6]" />
              <span className="text-white">{error}</span>
            </div>
          </motion.div>
        )}

        <div className="flex sm:flex-row flex-col gap-4">
          <button
            type="submit"
            disabled={!stripe || loading || !clientSecret}
            className="group relative flex flex-1 justify-center items-center gap-3 bg-gradient-to-r from-[#234C6A] hover:from-[#D2C1B6] to-[#D2C1B6] hover:to-[#234C6A] disabled:opacity-50 shadow-lg backdrop-blur-sm px-8 py-4 border-2 border-white/20 rounded-xl overflow-hidden font-bold text-white hover:scale-[1.02] transition-all disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                <span>Pay ${amount.toFixed(2)}</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="group inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-4 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Shield className="w-4 h-4 text-[#96A78D]" />
            <span className="text-white/60 text-sm">Payments are 100% secure and encrypted</span>
          </div>
        </div>
      </motion.form>
    </div>
  );
}