'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardData } from '@/types/dashboard';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  TrendingUp, 
  Clock,
  AlertCircle,
  Plus,
  ExternalLink,
  Sparkles,
  Target,
  Trophy,
  Zap
} from 'lucide-react';
import EventCard from '@/components/events/EventCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'events'>('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [joinedResponse, hostedResponse] = await Promise.all([
          fetch('http://localhost:5000/api/events/joined/events', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/events/my/events', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        const joinedData = await joinedResponse.json();
        const hostedData = await hostedResponse.json();

        const joinedEvents = joinedData.data?.events || [];
        const hostedEvents = hostedData.data?.events || [];
        
        const upcomingEvents = joinedEvents.filter((event: any) => {
          const eventDate = new Date(event.date);
          const today = new Date();
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(today.getDate() + 30);
          return eventDate > today && eventDate <= thirtyDaysFromNow && event.status === 'open';
        });

        const stats = {
          hostedEvents: hostedEvents.length,
          joinedEvents: joinedEvents.length,
          upcomingEvents: upcomingEvents.length,
          totalSpent: joinedEvents.reduce((sum: number, event: any) => sum + event.joiningFee, 0),
          ...(user?.role === 'host' && {
            averageRating: 4.5,
            totalReviews: 12
          })
        };

        setDashboardData({
          stats,
          upcomingEvents: upcomingEvents.slice(0, 3),
          recentEvents: joinedEvents.slice(0, 3),
          hostedEvents: hostedEvents.slice(0, 3)
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gradient-to-b from-[#234C6A]/10 via-[#D2C1B6]/10 to-[#96A78D]/10 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-cyan-400 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-3 text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8 min-h-screen">
        <div className="mx-auto px-4 max-w-7xl">
          <div className="py-12 text-center">
            <div className="inline-flex justify-center items-center bg-gradient-to-r from-red-500/20 to-rose-500/20 mb-4 border border-red-500/30 rounded-full w-16 h-16">
              <AlertCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-2 font-bold text-transparent text-2xl">Error Loading Dashboard</h2>
            <p className="mb-6 text-white/70">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl px-6 py-3 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] py-8 min-h-screen">
      <div className="mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-4 px-4 py-2 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="font-medium text-white text-sm">Welcome back!</span>
          </motion.div>
          <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-2 font-bold text-transparent text-3xl">Dashboard</h1>
          <p className="text-white/70">Welcome back, {user?.name}! Here's what's happening.</p>
        </div>

        <motion.div 
          className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[
            {
              label: 'Upcoming Events',
              value: dashboardData.stats.upcomingEvents,
              icon: Calendar,
              gradient: 'from-blue-500/20 to-cyan-500/20',
              border: 'border-blue-500/30',
              iconColor: 'text-blue-400'
            },
            {
              label: 'Total Joined',
              value: dashboardData.stats.joinedEvents,
              icon: Users,
              gradient: 'from-emerald-500/20 to-green-500/20',
              border: 'border-emerald-500/30',
              iconColor: 'text-emerald-400'
            },
            {
              label: 'Total Spent',
              value: formatCurrency(dashboardData.stats.totalSpent),
              icon: DollarSign,
              gradient: 'from-purple-500/20 to-violet-500/20',
              border: 'border-purple-500/30',
              iconColor: 'text-purple-400'
            },
            {
              label: user?.role === 'host' ? 'Host Rating' : 'Member Since',
              value: user?.role === 'host' ? dashboardData.stats.averageRating || '0.0' : 'Now',
              icon: user?.role === 'host' ? Star : Target,
              gradient: 'from-amber-500/20 to-yellow-500/20',
              border: 'border-amber-500/30',
              iconColor: 'text-amber-400'
            }
          ].map((stat, index) => (
            <div 
              key={stat.label} 
              className={`rounded-xl border ${stat.border} bg-gradient-to-r ${stat.gradient} p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="flex items-center">
                <div className="bg-white/10 backdrop-blur-sm mr-4 p-3 rounded-lg">
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <div className="font-bold text-white text-2xl">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="bg-white/10 backdrop-blur-sm mb-6 border border-white/20 rounded-xl">
          <div className="border-white/10 border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-4 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'events'
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-white/50 hover:text-white hover:border-white/30'
                }`}
              >
                My Events
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-white text-xl">Upcoming Events</h2>
                    <Link
                      href="/events"
                      className="flex items-center font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      View All
                      <ExternalLink className="ml-1 w-4 h-4" />
                    </Link>
                  </div>

                  {dashboardData.upcomingEvents.length > 0 ? (
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {dashboardData.upcomingEvents.map((event) => (
                        <EventCard key={event._id} event={event as any} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="inline-flex justify-center items-center bg-white/10 mb-4 rounded-full w-12 h-12">
                        <Clock className="w-6 h-6 text-white/60" />
                      </div>
                      <h3 className="mb-2 font-bold text-white text-lg">No Upcoming Events</h3>
                      <p className="mb-4 text-white/70">You don't have any upcoming events.</p>
                      <Link
                        href="/events"
                        className="inline-block bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-6 py-2 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
                      >
                        Browse Events
                      </Link>
                    </div>
                  )}
                </div>

                <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                  <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
                    <h3 className="mb-4 font-bold text-white">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/events/create"
                        className="flex items-center bg-white/5 hover:bg-white/10 p-3 border border-white/20 rounded-lg transition-all"
                      >
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 mr-3 p-2 rounded-lg">
                          <Plus className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Create New Event</div>
                          <div className="text-white/60 text-sm">Host your own event</div>
                        </div>
                      </Link>
                      <Link
                        href="/events"
                        className="flex items-center bg-white/5 hover:bg-white/10 p-3 border border-white/20 rounded-lg transition-all"
                      >
                        <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 mr-3 p-2 rounded-lg">
                          <Zap className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="font-medium text-white">Explore Events</div>
                          <div className="text-white/60 text-sm">Find events to join</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
                    <h3 className="mb-4 font-bold text-white">Recent Activity</h3>
                    <div className="space-y-4">
                      {dashboardData.recentEvents.map((event, index) => (
                        <Link
                          key={event._id}
                          href={`/events/${event._id}`}
                          className="flex items-center hover:bg-white/5 p-3 border border-white/10 hover:border-white/20 rounded-lg transition-all"
                        >
                          <div className="flex justify-center items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mr-3 rounded-lg w-10 h-10">
                            <Calendar className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white">{event.title}</div>
                            <div className="text-white/60 text-sm">{event.location}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-white text-sm">
                              ${event.joiningFee === 0 ? 'Free' : event.joiningFee.toFixed(2)}
                            </div>
                            <div className="text-white/50 text-xs">
                              {new Date(event.date).toLocaleDateString('short')}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-8">
                {user?.role === 'host' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="font-bold text-white text-xl">Events You're Hosting</h2>
                      <Link
                        href="/events/create"
                        className="inline-flex items-center bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-4 py-2 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
                      >
                        <Plus className="mr-2 w-4 h-4" />
                        Create New Event
                      </Link>
                    </div>

                    {dashboardData.hostedEvents.length > 0 ? (
                      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {dashboardData.hostedEvents.map((event) => (
                          <EventCard key={event._id} event={event as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="inline-flex justify-center items-center bg-white/10 mb-4 rounded-full w-12 h-12">
                          <Calendar className="w-6 h-6 text-white/60" />
                        </div>
                        <h3 className="mb-2 font-bold text-white text-lg">No Hosted Events</h3>
                        <p className="mb-4 text-white/70">You haven't hosted any events yet.</p>
                        <Link
                          href="/events/create"
                          className="inline-block bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-6 py-2 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
                        >
                          Create Your First Event
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-white text-xl">Events You've Joined</h2>
                    <Link
                      href="/events"
                      className="font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      Browse More Events
                    </Link>
                  </div>

                  {dashboardData.recentEvents.length > 0 ? (
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {dashboardData.recentEvents.map((event) => (
                        <EventCard key={event._id} event={event as any} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="inline-flex justify-center items-center bg-white/10 mb-4 rounded-full w-12 h-12">
                        <Users className="w-6 h-6 text-white/60" />
                      </div>
                      <h3 className="mb-2 font-bold text-white text-lg">No Joined Events</h3>
                      <p className="mb-4 text-white/70">You haven't joined any events yet.</p>
                      <Link
                        href="/events"
                        className="inline-block bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 px-6 py-2 border border-white/30 hover:border-white/50 rounded-xl text-white transition-all"
                      >
                        Explore Events
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {user?.role === 'host' && dashboardData.stats.totalReviews && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm mb-8 p-6 border border-cyan-500/30 rounded-xl text-white">
            <div className="flex md:flex-row flex-col justify-between md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-xl">Host Performance</h3>
                </div>
                <p className="text-white/70">Your events are getting great feedback!</p>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <div className="mr-8 text-center">
                  <div className="font-bold text-3xl">{dashboardData.stats.averageRating}</div>
                  <div className="text-white/60 text-sm">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-3xl">{dashboardData.stats.totalReviews}</div>
                  <div className="text-white/60 text-sm">Total Reviews</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <motion.div 
          className="gap-6 grid grid-cols-1 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            {
              title: 'Edit Profile',
              description: 'Update your personal information and preferences',
              href: '/profile/edit',
              gradient: 'from-blue-500/20 to-cyan-500/20',
              border: 'border-blue-500/30'
            },
            {
              title: 'Create Event',
              description: 'Host your own event and connect with people',
              href: '/events/create',
              gradient: 'from-emerald-500/20 to-green-500/20',
              border: 'border-emerald-500/30'
            },
            {
              title: 'Browse Events',
              description: 'Discover amazing events happening around you',
              href: '/events',
              gradient: 'from-purple-500/20 to-violet-500/20',
              border: 'border-purple-500/30'
            }
          ].map((link, index) => (
            <Link
              key={link.title}
              href={link.href}
              className={`p-6 rounded-xl border ${link.border} bg-gradient-to-r ${link.gradient} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
              <h3 className="mb-2 font-bold text-white">{link.title}</h3>
              <p className="text-white/70 text-sm">{link.description}</p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}