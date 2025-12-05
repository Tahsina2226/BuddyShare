'use client'

import { useState, useEffect, useCallback } from 'react';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import { Event, EventFilters as EventFiltersType, EventSearchResponse } from '@/types/event';
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Users, 
  TrendingUp, 
  Filter, 
  Search, 
  X,
  Star,
  Sparkles,
  Compass,
  Heart,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Zap,
  Clock,
  Tag,
  Sliders,
  Eye,
  CalendarDays,
  TrendingDown,
  ArrowRight,
  Bell,
  Layers,
  Settings,
  Filter as FilterIcon,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  BarChart3,
  DollarSign,
  Map,
  CalendarRange,
  TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFiltersType>({
    page: 1,
    limit: 12,
    status: 'open'
  });
  const [availableFilters, setAvailableFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
    eventTypes: [] as string[]
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(`${key}[]`, v));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const response = await fetch(`http://localhost:5000/api/search/events?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EventSearchResponse = await response.json();
      
      if (data.success) {
        setEvents(data.data.events);
        setPagination(data.data.pagination);
        setAvailableFilters({
          categories: data.data.filters.categories || [],
          locations: data.data.filters.locations || [],
          eventTypes: data.data.filters.eventTypes || []
        });
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (newFilters: EventFiltersType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      status: 'open'
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    const { page, limit, status, ...filterFields } = filters;
    
    Object.values(filterFields).forEach(value => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          count += value.length;
        } else {
          count++;
        }
      }
    });
    return count;
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const freeEvents = events.filter(e => e.joiningFee === 0).length;
    const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
    const popularEvents = events.filter(e => e.currentParticipants >= e.maxParticipants * 0.8).length;

    return { totalEvents, freeEvents, upcomingEvents, popularEvents };
  };

  const stats = getEventStats();
  const activeFilterCount = getActiveFilterCount();

  if (error) {
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
              Unable to Load Events
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => fetchEvents()}
              className="group inline-flex relative items-center gap-3 bg-white/10 hover:bg-white/20 hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/20 rounded-xl font-semibold text-white text-lg transition-all duration-300"
            >
              <Loader2 className="opacity-0 group-hover:opacity-100 w-5 h-5 transition-opacity animate-spin" />
              <span>Retry Loading</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d] min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/30 via-[#D2C1B6]/20 to-[#96A78D]/30 backdrop-blur-xl" />
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-8 px-6 py-3 border border-white/20 rounded-full">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="font-medium text-white text-sm">Discover amazing experiences</span>
            </div>
            <h1 className="mb-6 font-bold text-5xl lg:text-6xl tracking-tight">
              <span className="block bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 text-transparent">
                Find Events That
              </span>
              <span className="block bg-clip-text bg-gradient-to-r from-[#D2C1B6] via-[#96A78D] to-[#D2C1B6] mt-2 text-transparent">
                Spark Joy
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-white/70 text-lg lg:text-xl leading-relaxed">
              Connect with like-minded people through thousands of curated events
            </p>
            
            {/* Main Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-3xl"
            >
              <div className="relative bg-white/10 shadow-2xl backdrop-blur-lg p-2 border border-white/20 rounded-2xl">
                <div className="flex items-center">
                  <div className="flex flex-1 items-center">
                    <Search className="ml-4 w-6 h-6 text-white/50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleFilterChange({ ...filters, search: e.target.value, page: 1 });
                      }}
                      placeholder="Search events, categories, locations..."
                      className="bg-transparent px-4 py-5 focus:outline-none w-full text-white text-lg placeholder-white/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 border border-white/20 rounded-xl text-white transition-colors"
                    >
                      <Sliders className="w-5 h-5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards - Redesigned */}
      <div className="mx-auto -mt-8 mb-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div 
          className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            {
              label: 'Total Events',
              value: pagination.total.toLocaleString(),
              icon: CalendarDays,
              trend: '+12%',
              color: 'from-[#234C6A] to-[#1a3d57]'
            },
            {
              label: 'Upcoming',
              value: stats.upcomingEvents,
              icon: TrendingUp,
              trend: '+24%',
              color: 'from-[#D2C1B6] to-[#c4b1a6]'
            },
            {
              label: 'Free Events',
              value: stats.freeEvents,
              icon: Heart,
              trend: '+8%',
              color: 'from-[#96A78D] to-[#889c7e]'
            },
            {
              label: 'Popular Now',
              value: stats.popularEvents,
              icon: Star,
              trend: '+32%',
              color: 'from-[#234C6A] to-[#D2C1B6]'
            }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group relative bg-white/5 backdrop-blur-sm p-6 border border-white/20 hover:border-white/30 rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="mb-2 font-medium text-white/60 text-sm">{stat.label}</p>
                    <p className="font-bold text-white text-3xl">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">{stat.trend}</span>
                      <span className="text-white/40 text-sm">from last week</span>
                    </div>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="lg:gap-8 lg:grid lg:grid-cols-12">
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="top-8 sticky space-y-8">
              {/* Filter Header */}
              <div className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                      <FilterIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-2xl">Refine Results</h2>
                      <p className="mt-1 text-white/70 text-sm">Narrow down your search</p>
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/20 rounded-xl font-medium text-white text-sm transition-all"
                    >
                      <X className="w-4 h-4" />
                      Clear all
                    </button>
                  )}
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="bg-white/5 mb-8 p-4 border border-white/10 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-white/60" />
                        <span className="font-medium text-white/60 text-sm">Active filters ({activeFilterCount})</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value || key === 'page' || key === 'limit' || key === 'status') return null;
                        
                        if (Array.isArray(value)) {
                          return value.map((v, i) => (
                            <span
                              key={`${key}-${v}`}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 shadow-sm backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full font-medium text-white text-sm"
                            >
                              <span className="text-white/60 text-xs">{key}:</span>
                              {v}
                              <button
                                onClick={() => {
                                  const newArray = value.filter((_, idx) => idx !== i);
                                  handleFilterChange({ ...filters, [key]: newArray.length ? newArray : undefined });
                                }}
                                className="ml-1 hover:text-white/60 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ));
                        }
                        
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-white/15 to-white/5 shadow-sm backdrop-blur-sm px-4 py-2 border border-white/20 rounded-full font-medium text-white text-sm"
                          >
                            <span className="text-white/60 text-xs">{key}:</span>
                            {value}
                            <button
                              onClick={() => handleFilterChange({ ...filters, [key]: undefined })}
                              className="ml-1 hover:text-white/60 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* EventFilters Component */}
                <EventFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableFilters={availableFilters}
                  events={events}
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-[#234C6A]/50 to-[#152a3d]/40 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-xl">Event Insights</h3>
                </div>
                <div className="space-y-6">
                  {[
                    { 
                      label: 'Average Price', 
                      value: '$25', 
                      icon: DollarSign,
                      change: '+5%',
                      trend: 'up'
                    },
                    { 
                      label: 'Avg Participants', 
                      value: '48', 
                      icon: Users,
                      change: '+12%',
                      trend: 'up'
                    },
                    { 
                      label: 'Duration', 
                      value: '3.5h', 
                      icon: Clock,
                      change: '-2%',
                      trend: 'down'
                    },
                    { 
                      label: 'User Rating', 
                      value: '4.8/5', 
                      icon: Star,
                      change: '+0.3',
                      trend: 'up'
                    }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-3 border-white/10 last:border-0 border-b">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-xl">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="block font-medium text-white">{item.label}</span>
                          <span className="block text-white/60 text-sm">Across all events</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-white text-2xl">{item.value}</span>
                        <span className={`text-sm ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden z-50 fixed inset-0"
                >
                  <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                    onClick={() => setMobileFiltersOpen(false)} 
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                    className="right-0 absolute inset-y-0 w-full max-w-md"
                  >
                    <div className="flex flex-col bg-gradient-to-b from-[#234C6A] to-[#152a3d] shadow-2xl border-white/20 border-l-2 h-full">
                      <div className="bg-gradient-to-r from-[#234C6A]/50 to-[#152a3d]/50 p-6 border-white/10 border-b">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] p-3 rounded-xl">
                              <FilterIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h2 className="font-bold text-white text-2xl">Refine Results</h2>
                              <p className="text-white/70 text-sm">Narrow down your search</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="hover:bg-white/10 p-2 rounded-xl transition-colors"
                          >
                            <X className="w-6 h-6 text-white/60" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto">
                        <EventFilters
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          availableFilters={availableFilters}
                          events={events}
                          isMobile={true}
                          onClose={() => setMobileFiltersOpen(false)}
                        />
                      </div>
                      <div className="bg-gradient-to-r from-[#234C6A]/50 to-[#152a3d]/50 p-6 border-white/10 border-t">
                        <div className="flex gap-4">
                          <button
                            onClick={clearFilters}
                            className="flex-1 bg-white/10 hover:bg-white/20 px-6 py-4 border-2 border-white/20 rounded-xl font-bold text-white transition-colors"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="flex-1 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] shadow-lg px-6 py-4 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Header Controls */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="font-bold text-white text-2xl">Featured Events</h2>
                    <span className="bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] shadow-lg px-3 py-1 rounded-full font-medium text-white text-sm">
                      New
                    </span>
                  </div>
                  <p className="text-white/70">
                    Discover {pagination.total.toLocaleString()} amazing events
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center bg-white/10 backdrop-blur-sm p-1 border-2 border-white/20 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`rounded-lg p-3 transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-white/20 text-white shadow-sm' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`rounded-lg p-3 transition-all ${
                        viewMode === 'list' 
                          ? 'bg-white/20 text-white shadow-sm' 
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-5 py-3 border-2 border-white/20 rounded-xl font-bold text-white transition-colors"
                  >
                    <Sliders className="w-5 h-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-white/20 px-2.5 py-1 rounded-full font-bold text-white text-xs">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-center items-center py-32"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                  <Loader2 className="relative w-16 h-16 text-white animate-spin" />
                </div>
                <p className="mb-2 font-bold text-white text-2xl">Finding Perfect Events</p>
                <p className="text-white/60">We're curating the best experiences for you</p>
              </motion.div>
            )}

            {/* Events Grid/List */}
            {!loading && events.length > 0 && (
              <>
                <motion.div 
                  className={`mb-10 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {events.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <EventCard event={event} layout={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="bg-white/10 shadow-xl backdrop-blur-sm p-6 border-2 border-white/20 rounded-2xl">
                      <div className="flex sm:flex-row flex-col justify-between items-center gap-6">
                        <div className="text-white/60 text-sm">
                          Showing <span className="font-bold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> -{' '}
                          <span className="font-bold text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                          <span className="font-bold text-white">{pagination.total.toLocaleString()}</span> events
                        </div>
                        
                        <nav className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 shadow-lg backdrop-blur-sm px-5 py-3 border-2 border-white/20 rounded-xl font-bold text-white text-sm transition-all disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>

                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                              let pageNum;
                              if (pagination.pages <= 5) {
                                pageNum = i + 1;
                              } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                              } else if (pagination.page >= pagination.pages - 2) {
                                pageNum = pagination.pages - 4 + i;
                              } else {
                                pageNum = pagination.page - 2 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => handlePageChange(pageNum)}
                                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold transition-all backdrop-blur-sm shadow-lg ${
                                    pagination.page === pageNum
                                      ? 'bg-white/30 text-white border-2 border-white/30'
                                      : 'border-2 border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            
                            {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                              <>
                                <span className="px-2 text-white/40">...</span>
                                <button
                                  onClick={() => handlePageChange(pagination.pages)}
                                  className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm border-2 border-white/20 rounded-xl w-12 h-12 font-bold text-white/80 text-sm transition-all"
                                >
                                  {pagination.pages}
                                </button>
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 shadow-lg backdrop-blur-sm px-5 py-3 border-2 border-white/20 rounded-xl font-bold text-white text-sm transition-all disabled:cursor-not-allowed"
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && events.length === 0 && (
              <motion.div 
                className="bg-white/10 shadow-2xl backdrop-blur-sm p-12 border-2 border-white/20 rounded-2xl text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mx-auto max-w-md">
                  <div className="inline-flex justify-center items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 blur-xl rounded-full"></div>
                      <div className="relative bg-white/10 backdrop-blur-sm p-8 border border-white/20 rounded-2xl">
                        <Compass className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-4 font-bold text-white text-2xl">
                    No Events Found
                  </h3>
                  <p className="mb-8 text-white/70 leading-relaxed">
                    We couldn't find any events matching your current filters. Try adjusting your search criteria or explore trending categories below.
                  </p>
                  <div className="flex sm:flex-row flex-col justify-center gap-4">
                    <button
                      onClick={clearFilters}
                      className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white text-base transition-colors"
                    >
                      <Sparkles className="w-5 h-5" />
                      View All Events
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] shadow-lg px-6 py-3 rounded-xl font-bold text-white text-base hover:scale-[1.02] transition-all"
                    >
                      <Filter className="w-5 h-5" />
                      Adjust Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Categories Section */}
            {availableFilters.categories.length > 0 && !loading && events.length > 0 && (
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-bold text-white text-2xl">Browse Categories</h2>
                      <p className="mt-2 text-white/70">Find events by interest</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 font-medium text-white/80 hover:text-white text-sm"
                    >
                      View all <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                  {availableFilters.categories.slice(0, 12).map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFilterChange({ ...filters, category, page: 1 })}
                      className={`group relative overflow-hidden rounded-xl border-2 backdrop-blur-sm p-4 transition-all duration-300 shadow-lg ${
                        filters.category === category
                          ? 'border-white/30 bg-gradient-to-br from-white/20 to-white/10'
                          : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-3 text-3xl transition-transform duration-300 group-hover:scale-110 ${
                          filters.category === category ? 'text-white' : 'text-white/60 group-hover:text-white'
                        }`}>
                          {category === 'Music' && '🎵'}
                          {category === 'Sports' && '⚽'}
                          {category === 'Food' && '🍕'}
                          {category === 'Tech' && '💻'}
                          {category === 'Art' && '🎨'}
                          {category === 'Education' && '📚'}
                          {category === 'Games' && '🎮'}
                          {category === 'Travel' && '✈️'}
                          {category === 'Business' && '💼'}
                          {category === 'Health' && '💪'}
                          {category === 'Fashion' && '👗'}
                          {!['Music', 'Sports', 'Food', 'Tech', 'Art', 'Education', 'Games', 'Travel', 'Business', 'Health', 'Fashion'].includes(category) && '🎪'}
                        </div>
                        <span className={`text-sm font-bold ${
                          filters.category === category ? 'text-white' : 'text-white/80'
                        }`}>
                          {category}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Newsletter CTA */}
        {!loading && events.length > 0 && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative bg-gradient-to-r from-[#234C6A]/80 via-[#D2C1B6]/60 to-[#96A78D]/80 shadow-2xl backdrop-blur-xl border-2 border-white/25 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
              <div className="relative px-8 py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-white/10 shadow-lg backdrop-blur-sm mb-6 px-6 py-3 border-2 border-white/20 rounded-full">
                    <Bell className="w-5 h-5 text-white" />
                    <span className="font-bold text-white text-sm">Stay Updated</span>
                  </div>
                  <h3 className="mb-4 font-bold text-white text-3xl">
                    Never Miss Out
                  </h3>
                  <p className="mb-8 text-white/70 text-lg leading-relaxed">
                    Get personalized event recommendations and early access to popular events
                  </p>
                  <div className="flex sm:flex-row flex-col gap-4 mx-auto max-w-md">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-white/10 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                    />
                    <button className="bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-8 py-3 border-2 border-white/20 rounded-xl font-bold text-white hover:scale-[1.02] transition-all duration-300">
                      Subscribe
                    </button>
                  </div>
                  <p className="mt-4 text-white/50 text-sm">
                    Join 10,000+ subscribers. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}