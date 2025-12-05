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
  Tag
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
      <div className="min-h-screen bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d]">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="inline-flex justify-center items-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-xl"></div>
                <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
              Unable to Load Events
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-white/70">
              {error}
            </p>
            <button
              onClick={() => fetchEvents()}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:shadow-xl"
            >
              <Loader2 className="w-5 h-5 opacity-0 animate-spin transition-opacity group-hover:opacity-100" />
              <span>Retry Loading</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#234C6A] via-[#1a3d57] to-[#152a3d]">
      <div className="bg-gradient-to-r from-[#234C6A] via-[#D2C1B6] to-[#96A78D] backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Discover amazing experiences</span>
            </div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
              Find Your Next Adventure
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70">
              Explore thousands of curated events, connect with like-minded people, and create unforgettable memories
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 -mt-6">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[
                {
                  label: 'Total Events',
                  value: stats.totalEvents,
                  icon: Calendar,
                  iconColor: 'text-white'
                },
                {
                  label: 'Upcoming',
                  value: stats.upcomingEvents,
                  icon: TrendingUp,
                  iconColor: 'text-white'
                },
                {
                  label: 'Free Events',
                  value: stats.freeEvents,
                  icon: Heart,
                  iconColor: 'text-white'
                },
                {
                  label: 'Popular Now',
                  value: stats.popularEvents,
                  icon: Star,
                  iconColor: 'text-white'
                }
              ].map((stat) => (
                <motion.div 
                  key={stat.label} 
                  whileHover={{ scale: 1.02 }}
                  className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white/70">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="relative">
                      <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="lg:flex lg:gap-8">
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Filters</h2>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="ml-auto text-sm font-medium text-white/80 hover:text-white"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {activeFilterCount > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white/60">Active filters ({activeFilterCount})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (!value || key === 'page' || key === 'limit') return null;
                        
                        if (Array.isArray(value)) {
                          return value.map((v, i) => (
                            <span
                              key={`${key}-${v}`}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                            >
                              {v}
                              <button
                                onClick={() => {
                                  const newArray = value.filter((_, idx) => idx !== i);
                                  handleFilterChange({ ...filters, [key]: newArray.length ? newArray : undefined });
                                }}
                                className="ml-1 hover:text-white/60"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ));
                        }
                        
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                          >
                            {value}
                            <button
                              onClick={() => handleFilterChange({ ...filters, [key]: undefined })}
                              className="ml-1 hover:text-white/60"
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

          <AnimatePresence>
            {mobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 lg:hidden"
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
                    className="absolute inset-y-0 right-0 w-full max-w-md"
                  >
                    <div className="flex h-full flex-col bg-gradient-to-b from-[#234C6A] to-[#152a3d] shadow-2xl">
                      <div className="border-b border-white/10 p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-white" />
                            <h2 className="text-xl font-bold text-white">Filters</h2>
                          </div>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="rounded-lg p-2 transition-colors hover:bg-white/10"
                          >
                            <X className="w-5 h-5 text-white/60" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <EventFiltersComponent
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          availableFilters={availableFilters}
                        />
                      </div>
                      <div className="border-t border-white/10 bg-white/5 p-6">
                        <div className="flex gap-3">
                          <button
                            onClick={clearFilters}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-medium text-white/80 transition-colors hover:bg-white/20"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setMobileFiltersOpen(false)}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-medium text-white transition-colors hover:bg-white/20"
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

          <div className="flex-1">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                        {pagination.total.toLocaleString()} Events
                      </h2>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
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
                    <div className="relative flex-1 lg:flex-none lg:w-72">
                      <Search className="absolute left-4 top-1/2 w-5 h-5 -translate-y-1/2 transform text-white/50" />
                      <input
                        type="text"
                        placeholder="Search events, categories, locations..."
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-white placeholder-white/50 transition-all hover:border-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        onChange={(e) => handleFilterChange({ ...filters, search: e.target.value, page: 1 })}
                      />
                    </div>
                    
                    <div className="hidden sm:flex items-center rounded-xl bg-white/10 p-1 backdrop-blur-sm">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`rounded-lg p-2 transition-all ${
                          viewMode === 'grid' 
                            ? 'bg-white/20 text-white shadow-sm' 
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`rounded-lg p-2 transition-all ${
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
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-medium text-white transition-colors hover:bg-white/20 backdrop-blur-sm lg:hidden"
                    >
                      <Filter className="w-5 h-5" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-xl"></div>
                  <Loader2 className="relative w-16 h-16 animate-spin text-white" />
                </div>
                <p className="mt-8 text-xl font-bold text-white">Loading Events</p>
                <p className="mt-2 text-white/60">We're finding the best experiences for you</p>
              </motion.div>
            )}

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

                {pagination.pages > 1 && (
                  <motion.div 
                    className="mb-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                      <div className="text-white/60">
                        Showing <span className="font-semibold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> -{' '}
                        <span className="font-semibold text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                        <span className="font-semibold text-white">{pagination.total.toLocaleString()}</span> results
                      </div>
                      
                      <nav className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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
                                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all backdrop-blur-sm ${
                                  pagination.page === pageNum
                                    ? 'bg-white/30 text-white shadow-md'
                                    : 'border border-white/20 bg-white/10 text-white/80 hover:bg-white/20'
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
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-sm font-medium text-white/80 transition-all hover:bg-white/20 backdrop-blur-sm"
                              >
                                {pagination.pages}
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
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

            {!loading && events.length === 0 && (
              <motion.div 
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="mx-auto max-w-md">
                  <div className="inline-flex justify-center items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5 blur-xl"></div>
                      <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8">
                        <Compass className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                    No Events Found
                  </h3>
                  <p className="mb-8 leading-relaxed text-white/70">
                    We couldn't find any events matching your current filters. Try adjusting your search criteria or explore trending categories below.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Sparkles className="w-5 h-5" />
                      View All Events
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Filter className="w-5 h-5" />
                      Adjust Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {availableFilters.categories.length > 0 && !loading && events.length > 0 && (
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">Popular Categories</h2>
                      <p className="mt-2 text-white/70">Explore events by category</p>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium text-white/80 hover:text-white"
                    >
                      View all
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {availableFilters.categories.slice(0, 12).map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFilterChange({ ...filters, category, page: 1 })}
                      className={`group relative rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 ${
                        filters.category === category
                          ? 'border-white/30 bg-white/10'
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
                        <span className={`text-sm font-medium ${
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

        {!loading && events.length > 0 && (
          <motion.div 
            className="mt-16 overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-[#234C6A] via-[#D2C1B6] to-[#96A78D] backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="px-8 py-12 text-center">
              <div className="mx-auto max-w-2xl">
                <h3 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                  Never Miss an Event
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-white/70">
                  Subscribe to get personalized event recommendations and updates
                </p>
                <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-[1.02]">
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