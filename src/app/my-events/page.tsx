// backend/routes/events.js (নতুন রাউট যোগ করুন)

router.get('/my-events', auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        page = 1,
        limit = 12,
        status = 'all', // 'upcoming', 'past', 'all'
        search = ''
      } = req.query;
  
      const skip = (page - 1) * limit;
  
      // Find all events where user is a participant
      const participations = await Participation.find({ userId })
        .populate('eventId')
        .sort({ createdAt: -1 });
  
      // Extract events from participations
      let events = participations.map(p => p.eventId).filter(Boolean);
  
      // Apply status filter
      const now = new Date();
      if (status === 'upcoming') {
        events = events.filter(event => new Date(event.date) > now);
      } else if (status === 'past') {
        events = events.filter(event => new Date(event.date) <= now);
      }
  
      // Apply search filter
      if (search) {
        events = events.filter(event => 
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase()) ||
          event.category.toLowerCase().includes(search.toLowerCase())
        );
      }
  
      const total = events.length;
      const paginatedEvents = events.slice(skip, skip + parseInt(limit));
  
      res.json({
        success: true,
        data: {
          events: paginatedEvents,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      console.error('Error fetching user events:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }); });

      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      const response = await fetch(`http://localhost:5000/api/events/my-events?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setEvents(data.data.events);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch your events');
      }
    } catch (err) {
      console.error('Error fetching your events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load your events');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, activeTab, searchQuery]);

  useEffect(() => {
    fetchMyEvents();
  }, [fetchMyEvents]);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPagination(prev => ({ ...prev, page }));
  };

  const handleTabChange = (tab: 'upcoming' | 'past' | 'all') => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getEventStats = () => {
    const now = new Date();
    const upcomingEvents = events.filter(e => new Date(e.date) > now).length;
    const pastEvents = events.filter(e => new Date(e.date) <= now).length;
    const totalSpent = events.reduce((sum, event) => sum + (event.joiningFee || 0), 0);
    const favoriteCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostFrequentCategory = Object.entries(favoriteCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    return { upcomingEvents, pastEvents, totalSpent, mostFrequentCategory };
  };

  const stats = getEventStats();

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
              Unable to Load Your Events
            </h1>
            <p className="mb-8 text-white/70 text-lg leading-relaxed">
              {error.includes('login') ? (
                <>
                  Please login to view your events.
                  <br />
                  <a href="/login" className="text-[#D2C1B6] hover:text-[#96A78D] underline mt-2 inline-block">
                    Go to Login Page
                  </a>
                </>
              ) : error}
            </p>
            <button
              onClick={() => fetchMyEvents()}
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A]/30 via-[#D2C1B6]/20 to-[#96A78D]/30 backdrop-blur-xl" />
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-8 px-6 py-3 border border-white/20 rounded-full">
              <Ticket className="w-5 h-5 text-white" />
              <span className="font-medium text-white text-sm">Your Event Journey</span>
            </div>
            <h1 className="mb-6 font-bold text-5xl lg:text-6xl tracking-tight">
              <span className="block bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/80 text-transparent">
                My Events
              </span>
              <span className="block bg-clip-text bg-gradient-to-r from-[#D2C1B6] via-[#96A78D] to-[#D2C1B6] mt-2 text-transparent">
                Your Participation History
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-white/70 text-lg lg:text-xl leading-relaxed">
              Track all events you've participated in and discover your next adventure
            </p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-2xl"
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
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      placeholder="Search your events..."
                      className="bg-transparent px-4 py-5 focus:outline-none w-full text-white text-lg placeholder-white/50"
                    />
                    {searchQuery && (
                      <button
                        onClick={clearSearch}
                        className="mr-2 hover:text-white/60 transition-colors"
                      >
                        <X className="w-5 h-5 text-white/50" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
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
              value: pagination.total,
              icon: CalendarCheck,
              color: 'from-[#234C6A] to-[#1a3d57]',
              description: 'All your participations'
            },
            {
              label: 'Upcoming',
              value: stats.upcomingEvents,
              icon: TrendingUp,
              color: 'from-[#D2C1B6] to-[#c4b1a6]',
              description: 'Events to attend'
            },
            {
              label: 'Money Spent',
              value: `$${stats.totalSpent}`,
              icon: Award,
              color: 'from-[#96A78D] to-[#889c7e]',
              description: 'Total joining fees'
            },
            {
              label: 'Favorite Category',
              value: stats.mostFrequentCategory,
              icon: Star,
              color: 'from-[#234C6A] to-[#D2C1B6]',
              description: 'Most participated'
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
                    <p className="mt-2 text-white/40 text-sm">{stat.description}</p>
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
          {/* Sidebar - Tabs */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="top-8 sticky space-y-8">
              {/* Tabs Navigation */}
              <div className="bg-gradient-to-br from-[#234C6A]/50 via-[#1a3d57]/40 to-[#152a3d]/30 shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gradient-to-br from-[#234C6A] to-[#D2C1B6] shadow-lg p-3 rounded-xl">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-2xl">Filter Events</h2>
                    <p className="mt-1 text-white/70 text-sm">View by status</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'upcoming', label: 'Upcoming Events', icon: Calendar, count: stats.upcomingEvents },
                    { id: 'past', label: 'Past Events', icon: History, count: stats.pastEvents },
                    { id: 'all', label: 'All Events', icon: Ticket, count: pagination.total }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as any)}
                      className={`w-full flex justify-between items-center p-4 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-white/20 to-white/10 border-2 border-white/30'
                          : 'bg-white/5 hover:bg-white/10 border-2 border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                        }`}>
                          <tab.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-white text-lg">{tab.label}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        activeTab === tab.id
                          ? 'bg-white/30 text-white'
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="mb-4 font-semibold text-white text-lg">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Events This Month</span>
                      <span className="font-bold text-white">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Free Events</span>
                      <span className="font-bold text-white">
                        {events.filter(e => e.joiningFee === 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Active Communities</span>
                      <span className="font-bold text-white">5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Box */}
              <div className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] shadow-2xl backdrop-blur-xl p-8 border-2 border-white/25 rounded-2xl">
                <h3 className="mb-4 font-bold text-white text-xl">Explore More</h3>
                <p className="mb-6 text-white/90 text-sm">
                  Discover new events and expand your social circle
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center gap-2 w-full justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 border-2 border-white/30 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02]"
                >
                  <ExternalLink className="w-5 h-5" />
                  Browse All Events
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Header Controls */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-bold text-white text-2xl">
                      {activeTab === 'upcoming' ? 'Upcoming Events' : 
                       activeTab === 'past' ? 'Past Events' : 'All Your Events'}
                    </h2>
                    <span className="bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] shadow-lg px-3 py-1 rounded-full font-medium text-white text-sm">
                      {pagination.total} Events
                    </span>
                  </div>
                  <p className="text-white/70">
                    {activeTab === 'upcoming' ? 'Events you are going to attend' : 
                     activeTab === 'past' ? 'Events you have attended' : 
                     'All events you have participated in'}
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
                </div>
              </div>
            </motion.div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-8">
              <div className="flex space-x-1 bg-white/10 backdrop-blur-sm p-1 border-2 border-white/20 rounded-xl">
                {[
                  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
                  { id: 'past', label: 'Past', icon: History },
                  { id: 'all', label: 'All', icon: Ticket }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-white/20 to-white/10 text-white'
                        : 'text-white/50 hover:text-white/80'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-semibold text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

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
                <p className="mb-2 font-bold text-white text-2xl">Loading Your Events</p>
                <p className="text-white/60">Fetching your participation history...</p>
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
                      <EventCard 
                        event={event} 
                        layout={viewMode}
                        showParticipantStatus={true}
                      />
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
                        {activeTab === 'upcoming' ? (
                          <Calendar className="w-16 h-16 text-white" />
                        ) : activeTab === 'past' ? (
                          <History className="w-16 h-16 text-white" />
                        ) : (
                          <Ticket className="w-16 h-16 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-4 font-bold text-white text-2xl">
                    {activeTab === 'upcoming' ? 'No Upcoming Events' : 
                     activeTab === 'past' ? 'No Past Events' : 'No Events Yet'}
                  </h3>
                  <p className="mb-8 text-white/70 leading-relaxed">
                    {activeTab === 'upcoming' 
                      ? "You haven't registered for any upcoming events. Explore events and start your journey!"
                      : activeTab === 'past'
                      ? "You haven't attended any events yet. Join some events to build your history!"
                      : "You haven't participated in any events yet. Start exploring now!"}
                  </p>
                  <div className="flex sm:flex-row flex-col justify-center gap-4">
                    <a
                      href="/events"
                      className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#D2C1B6] shadow-lg px-6 py-3 rounded-xl font-bold text-white text-base hover:scale-[1.02] transition-all"
                    >
                      <Zap className="w-5 h-5" />
                      Explore Events
                    </a>
                    <button
                      onClick={() => handleTabChange('all')}
                      className="inline-flex justify-center items-center gap-2 bg-white/10 hover:bg-white/20 shadow-lg backdrop-blur-sm px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-white text-base transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                      View All Tabs
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Activity Summary */}
            {!loading && events.length > 0 && (
              <motion.div 
                className="mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-gradient-to-r from-[#234C6A]/80 via-[#D2C1B6]/60 to-[#96A78D]/80 shadow-2xl backdrop-blur-xl border-2 border-white/25 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="font-bold text-white text-2xl">Your Event Journey</h3>
                      <p className="mt-2 text-white/70">Highlights from your participation</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#D2C1B6]/20 p-3 rounded-lg">
                          <Users className="w-6 h-6 text-[#D2C1B6]" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xl">
                            {events.reduce((sum, e) => sum + e.currentParticipants, 0).toLocaleString()}
                          </p>
                          <p className="text-white/60 text-sm">People Met</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm">
                        Across all events you've attended
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#96A78D]/20 p-3 rounded-lg">
                          <MapPin className="w-6 h-6 text-[#96A78D]" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xl">
                            {[...new Set(events.map(e => e.location))].length}
                          </p>
                          <p className="text-white/60 text-sm">Cities Visited</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm">
                        Different locations explored
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/20 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#234C6A]/20 p-3 rounded-lg">
                          <Clock className="w-6 h-6 text-[#234C6A]" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-xl">
                            {events.length * 3}
                          </p>
                          <p className="text-white/60 text-sm">Hours Invested</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-sm">
                        In personal growth & networking
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}