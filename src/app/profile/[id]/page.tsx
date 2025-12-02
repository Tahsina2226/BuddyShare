'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types/profile';
import { Event } from '@/types/event';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Mail, 
  Users, 
  Award, 
  Edit2, 
  Share2,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import Link from 'next/link';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hosted' | 'joined'>('hosted');
  const [stats, setStats] = useState({
    hostedEvents: 0,
    joinedEvents: 0,
    upcomingEvents: 0
  });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfile();
    fetchEvents();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      // Fetch hosted events
      const hostedResponse = await fetch(`http://localhost:5000/api/events/host/${id}`);
      const hostedData = await hostedResponse.json();
      
      // Fetch joined events if it's the current user's profile
      let joinedEvents: Event[] = [];
      if (isOwnProfile) {
        const joinedResponse = await fetch('http://localhost:5000/api/events/joined/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const joinedData = await joinedResponse.json();
        joinedEvents = joinedData.data?.events || [];
      }

      setEvents(activeTab === 'hosted' ? hostedData.data?.events || [] : joinedEvents);
      
      // Calculate stats
      const hostedEvents = hostedData.data?.events || [];
      const upcomingEvents = hostedEvents.filter((e: Event) => 
        new Date(e.date) > new Date() && e.status === 'open'
      ).length;

      setStats({
        hostedEvents: hostedEvents.length,
        joinedEvents: joinedEvents.length,
        upcomingEvents
      });
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab, id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-blue-600 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="py-12 text-center">
            <XCircle className="mx-auto mb-4 w-16 h-16 text-red-500" />
            <h2 className="mb-2 font-bold text-gray-900 text-2xl">Profile Not Found</h2>
            <p className="text-gray-600">The user profile you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-7xl">
        {/* Profile Header */}
        <div className="bg-white shadow-lg mb-8 rounded-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-48"></div>
          
          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="-top-16 left-8 absolute">
              <div className="bg-white border-4 border-white rounded-full w-32 h-32 overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-blue-100 w-full h-full">
                    <span className="font-bold text-blue-600 text-4xl">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end mb-4 pt-6">
              {isOwnProfile ? (
                <Link
                  href="/profile/edit"
                  className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
                >
                  <Edit2 className="mr-2 w-4 h-4" />
                  Edit Profile
                </Link>
              ) : (
                <button className="flex items-center hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg transition">
                  <Share2 className="mr-2 w-4 h-4" />
                  Share Profile
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="mt-12">
              <div className="flex md:flex-row flex-col justify-between md:items-center mb-6">
                <div>
                  <h1 className="mb-2 font-bold text-gray-900 text-3xl">{profile.name}</h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-2 w-4 h-4" />
                      {profile.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Mail className="mr-2 w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-2 w-4 h-4" />
                      Joined {formatDate(profile.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="mt-4 md:mt-0">
                  <span className={`px-4 py-2 rounded-full font-medium ${
                    profile.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : profile.role === 'host'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center mb-6">
                {profile.isVerified ? (
                  <span className="inline-flex items-center bg-green-100 px-3 py-1 rounded-full text-green-800">
                    <CheckCircle className="mr-1 w-4 h-4" />
                    Verified User
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-800">
                    Not Verified
                  </span>
                )}
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">About</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings */}
              {profile.rating && profile.role === 'host' && (
                <div className="mb-6">
                  <h3 className="mb-2 font-semibold text-gray-900 text-lg">Host Rating</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="fill-current w-5 h-5 text-yellow-500" />
                      <span className="ml-2 font-bold text-2xl">{profile.rating}</span>
                    </div>
                    <span className="ml-3 text-gray-600">
                      ({profile.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-8">
          <div className="bg-white shadow p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-blue-100 mr-4 p-3 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-2xl">{stats.hostedEvents}</div>
                <div className="text-gray-600">Hosted Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-green-100 mr-4 p-3 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-2xl">{stats.joinedEvents}</div>
                <div className="text-gray-600">Joined Events</div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow p-6 rounded-xl">
            <div className="flex items-center">
              <div className="bg-purple-100 mr-4 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-2xl">{stats.upcomingEvents}</div>
                <div className="text-gray-600">Upcoming Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-white shadow-lg p-6 rounded-xl">
          {/* Tabs */}
          <div className="mb-6 border-gray-200 border-b">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('hosted')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'hosted'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Hosted Events
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveTab('joined')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'joined'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Joined Events
                </button>
              )}
            </nav>
          </div>

          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} showHost={false} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">📅</div>
              <h3 className="mb-2 font-bold text-gray-900 text-xl">
                No {activeTab === 'hosted' ? 'Hosted' : 'Joined'} Events
              </h3>
              <p className="mb-6 text-gray-600">
                {activeTab === 'hosted'
                  ? 'This user has not hosted any events yet.'
                  : 'You have not joined any events yet.'}
              </p>
              {isOwnProfile && activeTab === 'hosted' && (
                <Link
                  href="/events/create"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                >
                  Create Your First Event
                </Link>
              )}
              {isOwnProfile && activeTab === 'joined' && (
                <Link
                  href="/events"
                  className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white transition"
                >
                  Browse Events
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}