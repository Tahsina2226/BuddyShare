'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types/profile';
import { Event } from '@/types/event';
import { 
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Users,
  Edit2,
  Share2,
  ChevronRight,
  Clock,
  Star,
  CheckCircle,
  Eye,
  BarChart3,
  TrendingUp,
  Target,
  Settings,
  Shield,
  Lock,
  User as UserIcon,
  Sparkles,
  ArrowLeft,
  Users as UsersIcon,
  CalendarDays,
  ArrowUp,
  Tag,
  Bell as BellIcon
} from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import Link from 'next/link';
import API from '@/utils/api';
import { motion } from 'framer-motion';

export default function ProfessionalProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'analytics' | 'settings'>('overview');
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    attendees: 0,
    completionRate: 95,
    rating: 0
  });

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [profileRes, eventsRes] = await Promise.all([
        API.get(`/users/${id}`),
        API.get(`/events/host/${id}`)
      ]);

      if (profileRes.data.success) {
        const userData = profileRes.data.data.user;
        setProfile(userData);
        setStats(prev => ({ ...prev, rating: userData.rating || 0 }));
      }

      const eventsData = eventsRes.data.data?.events || [];
      setEvents(eventsData);
      
      const activeEvents = eventsData.filter((e: Event) => 
        new Date(e.date) > new Date() && e.status === 'open'
      ).length;
      
      const totalAttendees = eventsData.reduce((sum: number, e: Event) => 
        sum + (e.attendees?.length || 0), 0
      );

      setStats(prev => ({
        ...prev,
        totalEvents: eventsData.length,
        activeEvents,
        attendees: totalAttendees
      }));
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.parentElement?.querySelector('.fallback-avatar');
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
        <div className="flex flex-col justify-center items-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
            <div className="relative flex justify-center items-center w-20 h-20">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="mb-2 font-bold text-white text-2xl">Loading Profile</p>
          <p className="text-white/60">Preparing professional profile</p>
        </div>
      </div>
    );
  }

  if (!profile) {
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
                  <Eye className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-4xl tracking-tight">
              Profile Not Found
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              The requested profile could not be found.
            </p>
            <Link
              href="/"
              className="group inline-flex relative items-center gap-3 bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/20 rounded-xl font-bold text-white text-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Dashboard</span>
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
        <div className="relative">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="py-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-4 px-4 py-2 border-2 border-white/20 rounded-full">
                    <UserIcon className="w-4 h-4 text-white" />
                    <span className="font-medium text-white text-sm">Professional Profile</span>
                  </div>
                  <h1 className="font-bold text-3xl lg:text-4xl tracking-tight">
                    <span className="block bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 text-transparent">
                      {profile.name}'s Profile
                    </span>
                  </h1>
                  <p className="mt-2 text-white/70">Expert host & event organizer</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Profile link copied to clipboard!');
                    }}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                  {isOwnProfile && (
                    <Link
                      href="/profile/edit"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                      Edit Profile
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border-2 border-white/20"
            >
              <div className="relative p-8 border-b-2 border-white/20">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] blur-xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] flex items-center justify-center">
                          <span className="font-bold text-white text-5xl">
                            {profile.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="hidden fallback-avatar absolute inset-0 bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] flex items-center justify-center">
                        <span className="font-bold text-white text-5xl">
                          {profile.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    {profile.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#96A78D] to-[#889c7e] p-2 rounded-full shadow-lg border-2 border-white/30">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h2 className="mb-2 font-bold text-2xl bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent">
                    {profile.name}
                  </h2>
                  <p className="text-white/70 mb-4">
                    {profile.title || `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`}
                  </p>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(profile.rating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-white/20 text-white/20'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-3 font-bold text-white">
                      {profile.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span className="mx-3 text-white/30">•</span>
                    <span className="text-white/60 text-sm">
                      {profile.totalReviews || 0} reviews
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 border-b-2 border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#1a3d57] shadow-lg p-3 rounded-xl">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  {profile.location && (
                    <div className="flex items-center">
                      <div className="bg-white/10 backdrop-blur-sm p-3 mr-4 rounded-xl">
                        <MapPin className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-white/80">{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center">
                      <div className="bg-white/10 backdrop-blur-sm p-3 mr-4 rounded-xl">
                        <Mail className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-white/80">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center">
                      <div className="bg-white/10 backdrop-blur-sm p-3 mr-4 rounded-xl">
                        <Phone className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-white/80">{profile.phone}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center">
                      <div className="bg-white/10 backdrop-blur-sm p-3 mr-4 rounded-xl">
                        <Globe className="w-4 h-4 text-white/60" />
                      </div>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80 transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {(profile.linkedin || profile.github || profile.twitter) && (
                <div className="p-8 border-b-2 border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Social Profiles</h3>
                  </div>
                  <div className="flex gap-3">
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl transition-all border-2 border-white/20"
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl transition-all border-2 border-white/20"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-xl transition-all border-2 border-white/20"
                      >
                        <Twitter className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {profile.interests && profile.interests.length > 0 && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-lg">Interests & Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 shadow-lg backdrop-blur-sm px-4 py-2 border-2 border-white/20 rounded-full font-medium text-white"
                      >
                        <Sparkles className="w-3 h-3" />
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg p-3 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg">Activity Stats</h3>
              </div>
              <div className="gap-4 grid grid-cols-2">
                {[
                  { label: 'Total Events', value: stats.totalEvents },
                  { label: 'Upcoming', value: stats.activeEvents },
                  { label: 'Attendees', value: stats.attendees },
                  { label: 'Rating', value: `${stats.completionRate}%` }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-bold text-white text-2xl">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 border-2 border-white/20"
            >
              <nav className="flex space-x-2 p-4">
                {[
                  { id: 'overview', label: 'Overview', icon: Eye },
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  ...(isOwnProfile ? [{ id: 'settings', label: 'Settings', icon: Settings }] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </motion.div>

            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-2xl">About</h3>
                      </div>
                      {isOwnProfile && (
                        <button className="font-bold text-white hover:text-white/80">
                          Edit Bio
                        </button>
                      )}
                    </div>
                    <p className="text-white/80 leading-relaxed whitespace-pre-line">
                      {profile.bio || 'No biography available.'}
                    </p>
                    
                    <div className="mt-8 pt-8 border-t-2 border-white/20">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 mr-4 rounded-xl">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Member Since</p>
                          <p className="font-bold text-white">
                            {formatDate(profile.createdAt || new Date().toISOString())}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-[#D2C1B6] to-[#c4b1a6] shadow-lg p-3 rounded-xl">
                          <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-2xl">Recent Events</h3>
                      </div>
                      <Link
                        href={`/events?host=${id}`}
                        className="font-bold text-white hover:text-white/80"
                      >
                        View all
                      </Link>
                    </div>
                    {events.length > 0 ? (
                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                        {events.slice(0, 4).map((event, index) => (
                          <motion.div
                            key={event._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <EventCard 
                              key={event._id} 
                              event={event} 
                              showHost={false}
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <div className="inline-flex justify-center items-center mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                            <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                              <Calendar className="w-12 h-12 text-white/40" />
                            </div>
                          </div>
                        </div>
                        <h4 className="mb-4 font-bold text-white text-xl">No Events Yet</h4>
                        <p className="mb-6 text-white/60">
                          {isOwnProfile
                            ? 'Create your first event to get started.'
                            : 'This user has not created any events yet.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}

              {activeTab === 'events' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-3 rounded-xl">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-2xl">Events</h3>
                      </div>
                      <p className="text-white/60">
                        Showing {events.length} event{events.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isOwnProfile && (
                      <Link
                        href="/events/create"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                      >
                        <Briefcase className="w-5 h-5" />
                        Create Event
                      </Link>
                    )}
                  </div>
                  {events.length > 0 ? (
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                      {events.map((event, index) => (
                        <motion.div
                          key={event._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <EventCard 
                            key={event._id} 
                            event={event} 
                            showHost={false}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="inline-flex justify-center items-center mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                          <div className="relative bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                            <Calendar className="w-12 h-12 text-white/40" />
                          </div>
                        </div>
                      </div>
                      <h4 className="mb-4 font-bold text-white text-xl">No Events Yet</h4>
                      <p className="mb-6 text-white/60">
                        {isOwnProfile
                          ? 'Create your first event to get started.'
                          : 'This user has not created any events yet.'}
                      </p>
                      {isOwnProfile && (
                        <Link
                          href="/events/create"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] hover:from-[#D2C1B6] hover:to-[#234C6A] shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                        >
                          <Sparkles className="w-5 h-5" />
                          Create Your First Event
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg p-3 rounded-xl">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-2xl">Analytics Dashboard</h3>
                    </div>
                    <span className="text-white/60 text-sm">Last 30 days</span>
                  </div>
                  
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-8">
                    <div className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/20">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-4 mr-4 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Total Engagement</p>
                          <p className="text-3xl font-bold text-white">{stats.attendees}</p>
                          <p className="text-sm text-[#96A78D] mt-2 flex items-center gap-1">
                            <ArrowUp className="w-4 h-4" />
                            12% from last month
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-[#96A78D]/50 via-[#889c7e]/40 to-[#96A78D]/30 backdrop-blur-xl p-8 rounded-2xl border-2 border-white/20">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-[#96A78D] to-[#889c7e] shadow-lg p-4 mr-4 rounded-xl">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Event Completion Rate</p>
                          <p className="text-3xl font-bold text-white">{stats.completionRate}%</p>
                          <p className="text-sm text-[#96A78D] mt-2 flex items-center gap-1">
                            <ArrowUp className="w-4 h-4" />
                            5% from last month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    {[
                      { 
                        label: 'Avg. Attendance', 
                        value: stats.totalEvents > 0 ? Math.round(stats.attendees / stats.totalEvents) : 0, 
                        icon: UsersIcon,
                        color: 'from-[#234C6A] to-[#D2C1B6]'
                      },
                      { 
                        label: 'Host Rating', 
                        value: stats.rating.toFixed(1), 
                        icon: Star,
                        color: 'from-[#D2C1B6] to-[#c4b1a6]'
                      },
                      { 
                        label: 'Active Events', 
                        value: stats.activeEvents, 
                        icon: Clock,
                        color: 'from-[#96A78D] to-[#889c7e]'
                      }
                    ].map((stat, index) => (
                      <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/20">
                        <div className="flex items-center">
                          <div className={`bg-gradient-to-br ${stat.color} shadow-lg p-3 mr-4 rounded-xl`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && isOwnProfile && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white text-2xl">Account Settings</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-white/20 border-b pb-6">
                      <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
                        Profile Settings
                      </h4>
                      <div className="space-y-4">
                        <Link
                          href="/profile/edit"
                          className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 transition-all"
                        >
                          <div className="flex items-center">
                            <div className="bg-white/10 p-3 mr-4 rounded-xl">
                              <UserIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-white">Personal Information</span>
                              <p className="text-sm text-white/60">Update your profile details</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        </Link>
                        
                        <button className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 transition-all">
                          <div className="flex items-center">
                            <div className="bg-white/10 p-3 mr-4 rounded-xl">
                              <BellIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-white">Notifications</span>
                              <p className="text-sm text-white/60">Manage your notification preferences</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        </button>
                        
                        <button className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 transition-all">
                          <div className="flex items-center">
                            <div className="bg-white/10 p-3 mr-4 rounded-xl">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <span className="font-bold text-white">Privacy & Security</span>
                              <p className="text-sm text-white/60">Control your privacy settings</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">
                        Account Management
                      </h4>
                      <div className="space-y-4">
                        <button className="flex items-center justify-between w-full p-4 bg-gradient-to-br from-white/5 to-white/2 hover:from-white/10 hover:to-white/5 backdrop-blur-sm rounded-2xl border-2 border-red-500/20 transition-all">
                          <div className="flex items-center">
                            <div className="bg-red-500/10 p-3 mr-4 rounded-xl">
                              <Lock className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                              <span className="font-bold text-red-400">Deactivate Account</span>
                              <p className="text-sm text-red-400/60">Temporarily disable your account</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-red-400/60" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}