'use client'

import { useAuth } from '@/context/AuthContext';
import CreateEventForm from '@/components/events/CreateEventForm';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateEventPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/events/create');
      } else if (user.role !== 'host' && user.role !== 'admin') {
        router.push('/dashboard');
      }
      setCheckingAuth(false);
    }
  }, [user, authLoading, router]);

  if (checkingAuth || authLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-7xl">
        <CreateEventForm />
      </div>
    </div>
  );
}