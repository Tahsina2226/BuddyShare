'use client'

import { useState, useEffect, useCallback } from 'react';
import EventCard from '@/components/events/EventCard';
import EventFiltersComponent from '@/components/events/EventFilters';
import { Event, EventFilters, EventSearchResponse } from '@/types/event';
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
  Eye,
  Gift,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({
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

  const handleFilterChange = (newFilters: EventFilters) => {
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
  };

  const getActiveFilterCount = () => {
    let count = 0;
    const { page, limit, ...filterFields } = filters;
    
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
      <div className="bg-gradient-to-b from-[#234C6A]/10 via-[#D2C1B6]/10 to-[#96A78D]/10 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-24 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex justify-center items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 blur-xl rounded-full"></div>
                <div className="relative bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm p-6 border border-red-500/30 rounded-2xl">
                  <AlertCircle className="w-12 h-12 text-red-400" />
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
              className="group inline-flex relative items-center gap-3 bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm px-8 py-4 border border-white/30 hover:border-white/50 rounded-xl font-semibold text-white text-lg transition-all hover:-translate-y-0.5 duration-300"
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#234C6A]/90 via-[#D2C1B6]/50 to-[#96A78D]/90 backdrop-blur-lg">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-6 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm">Discover amazing experiences</span>
            </div>
            <h1 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-5xl tracking-tight">
              Find Your Next Adventure
            </h1>
            <p className="mx-auto max-w-2xl text-white/70 text-lg leading-relaxed">
              Explore thousands of curated events, connect with like-minded people, and create unforgettable memories
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto -mt-6 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Quick Stats */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
            <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: 'Total Events',
                  value: stats.totalEvents,
                  icon: Calendar,
                  gradient: 'from-blue-500/20 to-cyan-500/20',
                  border: 'border-blue-500/30',
                  iconColor: 'text-blue-400'
                },
                {
                  label: 'Upcoming',
                  value: stats.upcomingEvents,
                  icon: TrendingUp,
                  gradient: 'from-emerald-500/20 to-green-500/20',
                  border: 'border-emerald-500/30',
                  iconColor: 'text-emerald-400'
                },
                {
                  label: 'Free Events',
                  value: stats.freeEvents,
                  icon: Gift,
                  gradient: 'from-rose-500/20 to-pink-500/20',
                  border: 'border-rose-500/30',
                  iconColor: 'text-rose-400'
                },
                {
                  label: 'Popular Now',
                  value: stats.popularEvents,
                  icon: Star,
                  gradient: 'from-amber-500/20 to-yellow-500/20',
                  border: 'border-amber-500/30',
                  iconColor: 'text-amber-400'
                }
              ].map((stat) => (
                <motion.div 
                  key={stat.label} 
                  whileHover={{ scale: 1.02 }}
                  className={`relative group rounded-xl border ${stat.border} bg-gradient-to-r ${stat.gradient} p-5 backdrop-blur-sm transition-all duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white/70 text-sm">{stat.label}</p>
                      <p className="mt-2 font-bold text-white text-2xl">{stat.value}</p>
                    </div>
                    <div className="relative">
                      <div className={`bg-white/10 p-3 rounded-lg backdrop-blur-sm`}>
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="bg-white/20 rounded-full w-full h-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${stat.gradient.replace('/20', '/60')}`}
                        style={{ width: `${(stat.value / Math.max(stats.totalEvents, 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:flex lg:gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block flex-shrink-0 lg:w-80">
            <div className="top-8 sticky">
              <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-bold text-white text-xl">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto font-medium text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {activeFilterCount > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-white/60 text-sm">Active filters ({activeFilterCount})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value || key === 'page' || key === 'limit') return null;
                        
                        if (Array.isArray(value)) {
                          return value.map((v, i) => (
                            <span
                              key={`${key}-${v}`}
                              className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium text-white text-sm"
                            >
                              {v}
                              <button
                                onClick={() => {
                                  const newArray = value.filter((_, idx) => idx !== i);
                                  handleFilterChange({ ...filters, [key]: newArray.length ? newArray : undefined });
                                }}
                                className="ml-1 hover:text-cyan-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ));
                        }
                        
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium text-white text-sm"
                          >
                            {value}
                            <button
                              onClick={() => handleFilterChange({ ...filters, [key]: undefined })}
                              className="ml-1 hover:text-cyan-300"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <EventFiltersComponent
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableFilters={availableFilters}
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters Overlay */}
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
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={() => setMobileFiltersOpen(false)} 
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="right-0 absolute inset-y-0 w-full max-w-md"
                  >
                    <div className="flex flex-col bg-gradient-to-b from-[#234C6A] to-[#152a3d] shadow-2xl h-full">
                      <div className="p-6 border-white/10 border-b">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-white" />
                            <h2 className="font-bold text-white text-xl">Filters</h2>
                          </div>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5 text-white/60" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto">
                        <EventFiltersComponent
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          availableFilters={availableFilters}
                        />
                      </div>
                      <div className="bg-white/5 p-6 border-white/10 border-t">
                        <div className="flex gap-3">
                          <button
                            onClick={clearFilters}
                            className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-3 border border-white/20 rounded-xl font-medium text-white/80 transition-colors"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="flex-1 bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl px-4 py-3 border border-white/30 hover:border-white/50 rounded-xl font-medium text-white transition-all"
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

          {/* Main Events Section */}
          <div className="flex-1">
            {/* Header with Search and Controls */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-2xl">
                <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 font-bold text-transparent text-2xl">
                        {pagination.total.toLocaleString()} Events
                      </h2>
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-white text-sm">
                        {pagination.total > 0 ? `${Math.ceil(pagination.total / 1000)}k+` : '0'}
                      </span>
                    </div>
                    <p className="text-white/70">
                      {events.length > 0 ? (
                        <>Discover amazing events that match your interests</>
                      ) : (
                        'No events found matching your criteria'
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 lg:flex-none lg:w-72">
                      <Search className="top-1/2 left-4 absolute w-5 h-5 text-white/50 -translate-y-1/2 transform" />
                      <input
                        type="text"
                        placeholder="Search events, categories, locations..."
                        className="bg-white/10 py-3 pr-4 pl-12 border border-white/20 focus:border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 w-full text-white transition-all placeholder-white/50"
                        onChange={(e) => handleFilterChange({ ...filters, search: e.target.value, page: 1 })}
                      />
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="hidden sm:flex items-center bg-white/10 backdrop-blur-sm p-1 rounded-xl">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'grid' 
                            ? 'bg-white/20 shadow-sm text-white' 
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'list' 
                            ? 'bg-white/20 shadow-sm text-white' 
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <List className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Mobile Filters Button */}
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="lg:hidden inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-3 border border-white/20 rounded-xl font-medium text-white transition-colors"
                    >
                      <Filter className="w-5 h-5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-0.5 rounded-full text-white text-xs">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col justify-center items-center py-24"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl rounded-full"></div>
                  <Loader2 className="relative w-16 h-16 text-cyan-400 animate-spin" />
                </div>
                <p className="mt-8 font-bold text-white text-xl">Loading Events</p>
                <p className="mt-2 text-white/60">We're finding the best experiences for you</p>
                <div className="bg-white/20 mt-6 rounded-full w-48 h-1 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full"
                    animate={{ 
                      x: ['0%', '100%', '0%'],
                      width: ['20%', '50%', '20%']
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Events Grid/List */}
            {!loading && events.length > 0 && (
              <>
                <motion.div 
                  className={`mb-10 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}`}
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
                    className="bg-white/10 backdrop-blur-sm mb-8 p-6 border border-white/20 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
                      <div className="text-white/60">
                        Showing <span className="font-semibold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> -{' '}
                        <span className="font-semibold text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-semibold text-white">{pagination.total.toLocaleString()}</span> results
                      </div>
                      
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 backdrop-blur-sm px-4 py-2.5 border border-white/20 rounded-xl font-medium text-white text-sm transition-all disabled:cursor-not-allowed"
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
                                className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all rounded-lg backdrop-blur-sm ${
                                  pagination.page === pageNum
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                                    : 'border border-white/20 text-white/80 bg-white/10 hover:bg-white/20'
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
                                className="inline-flex justify-center items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg w-10 h-10 font-medium text-white/80 text-sm transition-all"
                              >
                                {pagination.pages}
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 backdrop-blur-sm px-4 py-2.5 border border-white/20 rounded-xl font-medium text-white text-sm transition-all disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </nav>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && events.length === 0 && (
              <motion.div 
                className="bg-white/10 backdrop-blur-sm p-12 border border-white/20 rounded-2xl text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mx-auto max-w-md">
                  <div className="inline-flex justify-center items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl rounded-full"></div>
                      <div className="relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm p-8 border border-white/20 rounded-2xl">
                        <Compass className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-2xl">
                    No Events Found
                  </h3>
                  <p className="mb-8 text-white/70 leading-relaxed">
                    We couldn't find any events matching your current filters. Try adjusting your search criteria or explore trending categories below.
                  </p>
                  <div className="flex sm:flex-row flex-col justify-center gap-4">
                    <button
                      onClick={clearFilters}
                      className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-white/20 hover:from-white/30 to-white/10 hover:to-white/20 shadow-lg hover:shadow-xl backdrop-blur-sm px-6 py-3 border border-white/30 hover:border-white/50 rounded-xl font-medium text-white text-base transition-all hover:-translate-y-0.5 duration-300"
                    >
                      <Sparkles className="w-5 h-5" />
                      View All Events
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 border border-white/20 rounded-xl font-medium text-white text-base transition-colors"
                    >
                      <Filter className="w-5 h-5" />
                      Adjust Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Popular Categories */}
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
                      <h2 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 font-bold text-transparent text-2xl">Popular Categories</h2>
                      <p className="mt-2 text-white/70">Explore events by category</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="font-medium text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      View all
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
                      className={`group relative p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm ${
                        filters.category === category
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-inner'
                          : 'bg-white/10 border-white/20 hover:border-cyan-500/50 hover:bg-white/15'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`mb-3 text-3xl transition-transform duration-300 group-hover:scale-110 ${
                          filters.category === category ? 'text-cyan-400' : 'text-white/60 group-hover:text-cyan-300'
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
                        <span className={`text-sm font-medium ${
                          filters.category === category ? 'text-cyan-300' : 'text-white/80'
                        }`}>
                          {category}
                        </span>
                        <div className={`mt-2 h-1 w-6 rounded-full transition-all duration-300 ${
                          filters.category === category 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
                            : 'bg-transparent group-hover:bg-cyan-500/50'
                        }`} />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        {!loading && events.length > 0 && (
          <motion.div 
            className="bg-gradient-to-r from-[#234C6A]/90 via-[#D2C1B6]/50 to-[#96A78D]/90 shadow-xl backdrop-blur-lg mt-16 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="px-8 py-12 text-center">
              <div className="mx-auto max-w-2xl">
                <h3 className="bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70 mb-4 font-bold text-transparent text-3xl">
                  Never Miss an Event
                </h3>
                <p className="mb-8 text-white/70 text-lg leading-relaxed">
                  Subscribe to get personalized event recommendations and updates
                </p>
                <div className="flex sm:flex-row flex-col gap-4 mx-auto max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 backdrop-blur-sm px-6 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                  />
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-3 border border-white/30 rounded-xl font-semibold text-white hover:scale-[1.02] transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 