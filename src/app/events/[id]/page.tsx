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
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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

  // Fetch event details
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
        // Free event - join directly
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
        // Paid event - redirect to payment
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
        bg: 'bg-green-100', 
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />
      },
      full: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4" />
      },
      cancelled: { 
        bg: 'bg-gray-100', 
        text: 'text-gray-800',
        icon: <XCircle className="w-4 h-4" />
      },
      completed: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800',
        icon: <CheckCircle className="w-4 h-4" />
      }
    };

    const config = statusConfig[event.status] || statusConfig.open;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        <span className="ml-1">{event.status.toUpperCase()}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="py-12 text-center">
            <AlertCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
            <h2 className="mb-2 font-bold text-gray-900 text-2xl">Event Not Found</h2>
            <p className="mb-6 text-gray-600">{error || 'The event you are looking for does not exist.'}</p>
            <Link
              href="/events"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Events
          </Link>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2">
            {/* Event Header */}
            <div className="bg-white shadow-lg mb-6 p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge()}
                    <span className="bg-purple-100 px-3 py-1 rounded-full font-medium text-purple-800 text-sm">
                      {event.category}
                    </span>
                  </div>
                  <h1 className="mb-2 font-bold text-gray-900 text-3xl">{event.title}</h1>
                </div>
                <div className="flex space-x-2">
                  <button className="hover:bg-gray-100 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="hover:bg-gray-100 p-2 rounded-lg">
                    <Share2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Event Image */}
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 mb-6 rounded-lg h-64 md:h-80 overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full">
                    <div className="text-8xl">
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

              {/* Event Info Grid */}
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-3 w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-gray-500 text-sm">Date</div>
                      <div className="font-medium">{formatDate(event.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="mr-3 w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-gray-500 text-sm">Time</div>
                      <div className="font-medium">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="mr-3 w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-gray-500 text-sm">Joining Fee</div>
                      <div className={`font-bold ${event.joiningFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {event.joiningFee === 0 ? 'FREE' : `$${event.joiningFee.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="mr-3 w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-gray-500 text-sm">Location</div>
                      <div className="font-medium">{event.location}</div>
                      <div className="text-gray-600 text-sm">{event.address}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="mr-3 w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-gray-500 text-sm">Participants</div>
                      <div className="font-medium">
                        {event.currentParticipants} / {event.maxParticipants}
                        <span className="ml-2 text-gray-600 text-sm">
                          ({Math.round((event.currentParticipants / event.maxParticipants) * 100)}% filled)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="mb-8">
                <h3 className="mb-4 font-bold text-gray-900 text-xl">Description</h3>
                <div className="max-w-none prose">
                  <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                </div>
              </div>

              {/* Event Tags */}
              {event.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 font-bold text-gray-900 text-xl">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-800"
                      >
                        <Tag className="mr-1 w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Host Info */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="top-6 sticky bg-white shadow-lg p-6 rounded-xl">
              <h3 className="mb-4 font-bold text-gray-900 text-xl">Join This Event</h3>
              
              {/* Join Status Info */}
              {canJoinInfo && !canJoinInfo.canJoin && canJoinInfo.reasons.length > 0 && (
                <div className="bg-red-50 mb-4 p-3 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-red-500" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800">Cannot join because:</p>
                      <ul className="mt-1 text-red-700 list-disc list-inside">
                        {canJoinInfo.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {isUserHost() ? (
                  <div className="py-4 text-center">
                    <p className="mb-2 text-gray-600">You are the host of this event</p>
                    <Link
                      href={`/events/edit/${event._id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg w-full font-medium text-white transition"
                    >
                      Manage Event
                    </Link>
                  </div>
                ) : isUserParticipant() ? (
                  <>
                    <button
                      onClick={handleLeaveEvent}
                      disabled={leaving}
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-3 rounded-lg w-full font-medium text-white transition disabled:cursor-not-allowed"
                    >
                      {leaving ? 'Leaving...' : 'Leave Event'}
                    </button>
                    <p className="font-medium text-green-600 text-center">
                      ✓ You are attending this event
                    </p>
                  </>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    disabled={joining || (canJoinInfo && !canJoinInfo.canJoin)}
                    className={`w-full px-4 py-3 rounded-lg transition font-medium ${
                      event.joiningFee === 0
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {joining ? 'Processing...' : event.joiningFee === 0 ? 'Join for Free' : 'Join Event'}
                  </button>
                )}

                {event.joiningFee > 0 && !isUserParticipant() && !isUserHost() && (
                  <div className="mt-2 text-gray-600 text-sm text-center">
                    ${event.joiningFee.toFixed(2)} per person
                  </div>
                )}
              </div>

              {/* Event Stats */}
              <div className="mt-6 pt-6 border-t">
                <div className="gap-4 grid grid-cols-2">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-2xl">{event.currentParticipants}</div>
                    <div className="text-gray-600 text-sm">Joined</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-2xl">{event.maxParticipants}</div>
                    <div className="text-gray-600 text-sm">Capacity</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Card */}
            <div className="bg-white shadow-lg p-6 rounded-xl">
              <h3 className="mb-4 font-bold text-gray-900 text-xl">Hosted By</h3>
              <div className="flex items-center mb-4">
                <div className="flex justify-center items-center bg-blue-100 mr-4 rounded-full w-16 h-16">
                  {event.host.avatar ? (
                    <img
                      src={event.host.avatar}
                      alt={event.host.name}
                      className="rounded-full w-16 h-16"
                    />
                  ) : (
                    <span className="font-bold text-blue-600 text-2xl">
                      {event.host.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{event.host.name}</h4>
                  <p className="text-gray-600">Event Host</p>
                  {event.host.rating && (
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="ml-1 font-medium">{event.host.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href={`/profile/${event.host._id}`}
                className="block hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg w-full text-center transition"
              >
                View Profile
              </Link>
            </div>

            {/* Participants Card */}
            <div className="bg-white shadow-lg p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-xl">Participants</h3>
                <button
                  onClick={() => setShowParticipants(!showParticipants)}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {showParticipants ? 'Hide' : 'Show All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {event.participants.slice(0, showParticipants ? undefined : 5).map((participant) => (
                  <div key={participant._id} className="flex items-center">
                    <div className="flex justify-center items-center bg-gray-200 mr-3 rounded-full w-10 h-10">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="rounded-full w-10 h-10"
                        />
                      ) : (
                        <span className="font-medium text-gray-600">
                          {participant.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-gray-600 text-sm">{participant.location}</p>
                    </div>
                  </div>
                ))}

                {event.participants.length === 0 && (
                  <p className="py-4 text-gray-600 text-center">No participants yet</p>
                )}

                {!showParticipants && event.participants.length > 5 && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setShowParticipants(true)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      + {event.participants.length - 5} more
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Host's Other Events */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-2xl">More from {event.host.name}</h2>
            <Link
              href={`/events?hostId=${event.host._id}`}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              View all events
            </Link>
          </div>
          {/* This would typically fetch and display other events by the same host */}
          <div className="bg-white p-6 border border-gray-300 border-dashed rounded-xl text-center">
            <MessageSquare className="mx-auto mb-3 w-12 h-12 text-gray-400" />
            <p className="text-gray-600">Other events by this host will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}