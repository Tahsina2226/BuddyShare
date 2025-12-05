'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { EventDetails } from '@/types/eventDetails';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag, 
  Share2, 
  Heart,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Star,
  TrendingUp,
  Users as UsersIcon,
  Grid,
  Compass,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [canJoinInfo, setCanJoinInfo] = useState<{canJoin: boolean; reasons: string[]} | null>(null);

  useEffect(() => {
    fetchEventDetails();
    if (user) {
      checkCanJoin();
    }
  }, [id, user]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      
      if (!response.ok) {
        throw new Error('Event not found');
      }
      
      const data = await response.json();
      if (data.success) {
        setEvent(data.data.event);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const checkCanJoin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}/can-join`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCanJoinInfo(data.data);
      }
    } catch (err) {
      console.error('Error checking join status:', err);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setJoining(true);

      if (event?.joiningFee === 0) {
        const response = await fetch(`http://localhost:5000/api/payments/free-join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ eventId: id })
        });

        const data = await response.json();
        
        if (data.success) {
          alert('Successfully joined the event!');
          fetchEventDetails();
          checkCanJoin();
        } else {
          alert(data.message || 'Failed to join event');
        }
      } else {
        router.push(`/payment/${id}`);
      }
    } catch (err) {
      console.error('Error joining event:', err);
      alert('Failed to join event');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user || !confirm('Are you sure you want to leave this event?')) {
      return;
    }

    try {
      setLeaving(true);
      const response = await fetch(`http://localhost:5000/api/events/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Successfully left the event');
        fetchEventDetails();
        checkCanJoin();
      } else {
        alert(data.message || 'Failed to leave event');
      }
    } catch (err) {
      console.error('Error leaving event:', err);
      alert('Failed to leave event');
    } finally {
      setLeaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUserParticipant = () => {
    if (!user || !event) return false;
    return event.participants.some(p => p._id === user.id);
  };

  const isUserHost = () => {
    if (!user || !event) return false;
    return event.host._id === user.id;
  };

  const getStatusBadge = () => {
    if (!event) return null;

    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      open: { 
        bg: 'bg-gradient-to-r from-[#96A78D] to-[#889c7e]', 
        text: 'text-white',
        icon: <CheckCircle className="w-4 h-4" />
      },
      full: { 
        bg: 'bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6]', 
        text: 'text-white',
        icon: <XCircle className="w-4 h-4" />
      },
      cancelled: { 
        bg: 'bg-gradient-to-r from-white/20 to-white/10', 
        text: 'text-white/80',
        icon: <XCircle className="w-4 h-4" />
      },
      completed: { 
        bg: 'bg-gradient-to-r from-[#234C6A] to-[#1a3d57]', 
        text: 'text-white',
        icon: <CheckCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[event.status] || statusConfig.open;

    return (
      <span className={`inline-flex items-center gap-2 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/30 rounded-full font-bold text-sm ${config.bg} ${config.text}`}>
        {config.icon}
        {event.status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <Loader2 className="relative w-16 h-16 text-white animate-spin" />
          </div>
          <p className="mb-2 font-bold text-white text-2xl">Loading Event Details</p>
          <p className="text-white/60">We're preparing the perfect experience for you</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex justify-center items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-4xl tracking-tight">
              Event Not Found
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              {error || 'The event you are looking for does not exist.'}
            </p>
            <Link
              href="/events"
              className="group inline-flex relative items-center gap-3 bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/20 rounded-xl font-bold text-white text-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Events</span>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/30 via-[#D2C1B6]/20 to-[#96A78D]/30 backdrop-blur-xl" />
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <Link
                href="/events"
                className="group inline-flex items-center gap-2 mb-4 text-white/60 hover:text-white text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events</span>
              </Link>
              <h1 className="font-bold text-4xl lg:text-5xl tracking-tight">
                <span className="block bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 text-transparent">
                  {event.title}
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-4">
                {getStatusBadge()}
                <span className="bg-gradient-to-r from-[#D2C1B6] to-[#c4b1a6] shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/30 rounded-full font-bold text-white text-sm">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl transition-all">
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm p-3 border-2 border-white/20 rounded-xl transition-all">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white/5 shadow-2xl backdrop-blur-xl mb-8 border-2 border-white/20 rounded-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="mb-6 font-bold text-white text-2xl">Event Overview</h2>
                <div className="relative bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D] mb-8 rounded-xl h-64 overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full">
                      <div className="opacity-50 text-9xl">
                        {event.eventType === 'concert' && '🎵'}
                        {event.eventType === 'hiking' && '🥾'}
                        {event.eventType === 'sports' && '⚽'}
                        {event.eventType === 'games' && '🎮'}
                        {event.eventType === 'tech' && '💻'}
                        {event.eventType === 'art' && '🎨'}
                        {!['concert', 'hiking', 'sports', 'games', 'tech', 'art'].includes(event.eventType) && '🎪'}
                      </div>
                    </div>
                  )}
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center bg-white/5 p-4 rounded-xl">
                      <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] shadow-lg mr-4 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Date</div>
                        <div className="font-bold text-white">{formatDate(event.date)}</div>
                      </div>
                    </div>

                    <div className="flex items-center bg-white/5 p-4 rounded-xl">
                      <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg mr-4 p-3 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Time</div>
                        <div className="font-bold text-white">{event.time}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center bg-white/5 p-4 rounded-xl">
                      <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg mr-4 p-3 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Location</div>
                        <div className="font-bold text-white">{event.location}</div>
                        <div className="text-white/60 text-sm">{event.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center bg-white/5 p-4 rounded-xl">
                      <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg mr-4 p-3 rounded-lg">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Joining Fee</div>
                        <div className={`font-bold text-xl ${event.joiningFee === 0 ? 'text-[#96A78D]' : 'text-white'}`}>
                          {event.joiningFee === 0 ? 'FREE' : `$${event.joiningFee.toFixed(2)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="mb-4 font-bold text-white text-xl">Description</h3>
                  <div className="bg-white/5 p-6 rounded-xl">
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">{event.description}</p>
                  </div>
                </div>

                {event.tags.length > 0 && (
                  <div>
                    <h3 className="mb-4 font-bold text-white text-xl">Tags</h3>
                    <div className="flex flex-wrap gap-3">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-full font-medium text-white"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="top-8 sticky bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">Join Event</h3>
              </div>
              
              {canJoinInfo && !canJoinInfo.canJoin && canJoinInfo.reasons.length > 0 && (
                <div className="bg-gradient-to-r from-white/10 to-white/5 mb-6 p-4 border-2 border-white/20 rounded-xl">
                  <div className="flex items-start">
                    <AlertCircle className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-white/60" />
                    <div className="text-sm">
                      <p className="font-bold text-white">Cannot join because:</p>
                      <ul className="mt-2 text-white/60 list-disc list-inside">
                        {canJoinInfo.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {isUserHost() ? (
                  <div className="py-4 text-center">
                    <p className="mb-4 text-white/60">You are the host of this event</p>
                    <Link
                      href={`/events/edit/${event._id}`}
                      className="inline-block bg-gradient-to-r from-[#234C6A] hover:from-[#1a3d57] to-[#1a3d57] hover:to-[#152a3d] shadow-lg backdrop-blur-sm px-6 py-4 border-2 border-white/20 rounded-xl w-full font-bold text-white hover:scale-[1.02] transition-all"
                    >
                      Manage Event
                    </Link>
                  </div>
                ) : isUserParticipant() ? (
                  <>
                    <button
                      onClick={handleLeaveEvent}
                      disabled={leaving}
                      className="bg-gradient-to-r from-white/10 hover:from-white/20 to-white/5 hover:to-white/10 disabled:opacity-50 shadow-lg backdrop-blur-sm px-6 py-4 border-2 border-white/20 rounded-xl w-full font-bold text-white transition-all disabled:cursor-not-allowed"
                    >
                      {leaving ? 'Leaving...' : 'Leave Event'}
                    </button>
                    <div className="flex justify-center items-center gap-2 text-[#96A78D]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">You are attending</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joining || (canJoinInfo && !canJoinInfo.canJoin)}
                    className={`w-full px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm border-2 border-white/20 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] ${
                      event.joiningFee === 0
                        ? 'bg-gradient-to-r from-[#96A78D] to-[#889c7e] hover:from-[#889c7e] hover:to-[#96A78D] text-white'
                        : 'bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] text-white'
                    }`}
                  >
                    {joining ? 'Processing...' : event.joiningFee === 0 ? 'Join for Free' : 'Join Event'}
                  </button>
                )}

                {event.joiningFee > 0 && !isUserParticipant() && !isUserHost() && (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-full font-bold text-white text-sm">
                      <DollarSign className="w-4 h-4" />
                      ${event.joiningFee.toFixed(2)} per person
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-white/20 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-white/60" />
                    <span className="font-bold text-white">Participants</span>
                  </div>
                  <span className="font-bold text-white">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                </div>
                <div className="relative bg-white/10 rounded-full h-2">
                  <div 
                    className="top-0 left-0 absolute bg-gradient-to-r from-[#234C6A] to-[#96A78D] rounded-full h-full transition-all duration-300"
                    style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-xl">Hosted By</h3>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="relative mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] blur-md rounded-full"></div>
                  <div className="relative flex justify-center items-center bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg rounded-full w-14 h-14">
                    {event.host.avatar ? (
                      <img
                        src={event.host.avatar}
                        alt={event.host.name}
                        className="rounded-full w-14 h-14"
                      />
                    ) : (
                      <span className="font-bold text-white text-xl">
                        {event.host.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{event.host.name}</h4>
                  <p className="text-white/60 text-sm">Event Host</p>
                  {event.host.rating && (
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(event.host.rating || 0) ? 'text-yellow-400' : 'text-white/30'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium text-white text-sm">{event.host.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/profile/${event.host._id}`}
                className="block bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl w-full font-bold text-white text-center transition-all"
              >
                View Profile
              </Link>
            </div>

            <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                    <UsersIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl">Attendees</h3>
                </div>
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="font-bold text-white hover:text-white/80 text-sm"
                >
                  {showParticipants ? 'Hide' : 'Show All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {event.participants.slice(0, showParticipants ? undefined : 5).map((participant) => (
                  <div key={participant._id} className="flex items-center">
                    <div className="relative mr-3">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-md rounded-full"></div>
                      <div className="relative flex justify-center items-center bg-gradient-to-br from-white/10 to-white/5 shadow-lg rounded-full w-10 h-10">
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="rounded-full w-10 h-10"
                          />
                        ) : (
                          <span className="font-bold text-white text-sm">
                            {participant.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{participant.name}</p>
                      <p className="text-white/60 text-xs">{participant.location}</p>
                    </div>
                  </div>
                ))}

                {event.participants.length === 0 && (
                  <div className="py-6 text-center">
                    <div className="inline-flex justify-center items-center mb-3">
                      <div className="bg-gradient-to-br from-white/10 to-white/5 p-3 rounded-xl">
                        <UsersIcon className="w-6 h-6 text-white/40" />
                      </div>
                    </div>
                    <p className="text-white/60 text-sm">No attendees yet</p>
                  </div>
                )}

                {!showParticipants && event.participants.length > 5 && (
                  <div className="pt-3 text-center">
                    <button
                      onClick={() => setShowParticipants(true)}
                      className="inline-flex items-center gap-2 font-bold text-white hover:text-white/80 text-sm"
                    >
                      <span>+ {event.participants.length - 5} more</span>
                      <TrendingUp className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white/5 shadow-2xl backdrop-blur-xl p-6 border-2 border-white/20 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg p-3 rounded-xl">
                    <Grid className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="font-bold text-white text-xl">More from Host</h2>
                </div>
                <p className="text-white/60 text-sm">Other events by {event.host.name}</p>
              </div>
              <Link
                href={`/events?hostId=${event.host._id}`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-xl font-bold text-white text-sm transition-all"
              >
                View all
                <TrendingUp className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-white/5 to-white/2 shadow-lg backdrop-blur-sm p-8 border-2 border-white/20 border-dashed rounded-xl text-center">
              <div className="inline-flex justify-center items-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-4 border border-white/20 rounded-2xl">
                    <Compass className="w-8 h-8 text-white/40" />
                  </div>
                </div>
              </div>
              <h3 className="mb-2 font-bold text-white">More Events Coming Soon</h3>
              <p className="text-white/60 text-sm">Other events by this host will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}