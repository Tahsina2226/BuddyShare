"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  MapPin, 
  Calendar, 
  Users, 
  Shield,
  Sparkles,
  TrendingUp,
  Star,
  DollarSign
} from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const eventSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
      title: "Weekend Mountain Hike",
      category: "Outdoor Adventure",
      participants: 8,
      maxParticipants: 12,
      location: "Blue Mountains",
      date: "Tomorrow · 8:00 AM",
      price: "$15",
      rating: 4.8,
      color: "from-emerald-500/20 to-teal-500/20",
      type: "hiking",
      host: {
        name: "Adventure Club",
        verified: true
      }
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1492684223066-e9e9f4f7c7c1?w=800&auto=format&fit=crop",
      title: "Indie Concert Night",
      category: "Music & Concerts",
      participants: 45,
      maxParticipants: 60,
      location: "Downtown Arena",
      date: "Saturday · 7:00 PM",
      price: "$25",
      rating: 4.9,
      color: "from-purple-500/20 to-pink-500/20",
      type: "music",
      host: {
        name: "Music Lovers Group",
        verified: true
      }
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1519677100203-4f3c1f0f8c7f?w=800&auto=format&fit=crop",
      title: "Food Festival Tour",
      category: "Food & Drink",
      participants: 32,
      maxParticipants: 50,
      location: "Central Park",
      date: "Sunday · 12:00 PM",
      price: "$20",
      rating: 4.7,
      color: "from-amber-500/20 to-orange-500/20",
      type: "food",
      host: {
        name: "Foodie Collective",
        verified: true
      }
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
      title: "Beach Volleyball Tournament",
      category: "Sports & Games",
      participants: 16,
      maxParticipants: 20,
      location: "Sunset Beach",
      date: "Friday · 4:00 PM",
      price: "$10",
      rating: 4.6,
      color: "from-[#234C6A]/20 to-[#96A78D]/20",
      type: "sports",
      host: {
        name: "Sports Community",
        verified: true
      }
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&auto=format&fit=crop",
      title: "Board Game Marathon",
      category: "Gaming",
      participants: 6,
      maxParticipants: 8,
      location: "Game Cafe Downtown",
      date: "Tonight · 6:00 PM",
      price: "$5",
      rating: 4.9,
      color: "from-violet-500/20 to-indigo-500/20",
      type: "gaming",
      host: {
        name: "Game Night Host",
        verified: true
      }
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop",
      title: "Tech Meetup & Networking",
      category: "Tech & Networking",
      participants: 85,
      maxParticipants: 100,
      location: "Tech Hub Center",
      date: "Wednesday · 6:30 PM",
      price: "Free",
      rating: 4.8,
      color: "from-[#D2C1B6]/20 to-[#96A78D]/20",
      type: "tech",
      host: {
        name: "Tech Community",
        verified: true
      }
    }
  ];

  const platformStats = [
    { 
      number: "500+", 
      label: "Monthly Events", 
      description: "Active listings",
      icon: Calendar,
      color: "text-[#234C6A] bg-[#234C6A]/10"
    },
    { 
      number: "10K+", 
      label: "Active Members", 
      description: "Community members",
      icon: Users,
      color: "text-[#96A78D] bg-[#96A78D]/10"
    },
    { 
      number: "50+", 
      label: "Cities", 
      description: "Worldwide",
      icon: MapPin,
      color: "text-[#D2C1B6] bg-[#D2C1B6]/10"
    },
    { 
      number: "100%", 
      label: "Secure", 
      description: "Verified hosts",
      icon: Shield,
      color: "text-[#9C6A50] bg-[#9C6A50]/10"
    }
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, eventSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventSlides.length) % eventSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToEvents = () => router.push('/events');
  const goToRegister = () => router.push('/register');
  const goToHostSignup = () => router.push('/host/signup');
  const goToHowItWorks = () => router.push('/how-it-works');

  return (
    <div className="space-y-20">
      <section className="relative flex justify-center items-center bg-gradient-to-br from-[#F5F0EB] via-white to-[#F5F0EB] min-h-[90vh] overflow-hidden">
        <div className="z-0 absolute inset-0">
          <div className="top-20 left-10 absolute bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 opacity-40 blur-3xl rounded-full w-96 h-96 animate-pulse mix-blend-multiply"></div>
          <div className="right-10 bottom-20 absolute bg-gradient-to-r from-[#D2C1B6]/10 to-[#9C6A50]/10 opacity-40 blur-3xl rounded-full w-96 h-96 animate-pulse delay-1000 mix-blend-multiply"></div>
          <div className="top-1/2 left-1/2 absolute bg-gradient-to-r from-[#96A78D]/10 to-[#234C6A]/10 opacity-30 blur-3xl rounded-full w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 transform"></div>
        </div>

        <div className="z-1 absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"></div>

        <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl container">
          <div className="items-center gap-16 grid lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:text-left text-center"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 backdrop-blur-sm mb-8 px-4 py-3 border border-[#234C6A]/20 rounded-full text-[#234C6A]"
              >
                <div className="flex justify-center items-center bg-white shadow-sm mr-3 rounded-full w-8 h-8">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">
                  Join {eventSlides[currentSlide].participants}+ people going to {eventSlides[currentSlide].title}
                </span>
                <div className="flex ml-2">
                  <Sparkles className="w-4 h-4" />
                  <Sparkles className="ml-1 w-4 h-4" />
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight"
              >
                <span className="block text-gray-900">Never Miss Out on</span>
                <span className="block bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] mt-3 text-transparent">
                  Events You Love
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mx-auto lg:mx-0 mb-10 max-w-2xl text-gray-600 text-lg leading-relaxed"
              >
                Connect with like-minded people for concerts, hikes, games, and meetups. 
                Whether you're looking for company or want to host activities, our platform makes 
                real-world social connections easy and secure.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex sm:flex-row flex-col gap-4 mb-12"
              >
                <button
                  onClick={goToEvents}
                  className="group inline-flex justify-center items-center bg-gradient-to-r from-[#234C6A] hover:from-[#1E3D57] to-[#96A78D] hover:to-[#7E9175] shadow-lg hover:shadow-xl px-8 py-4 rounded-full font-semibold text-white text-base whitespace-nowrap active:scale-95 transition-all duration-300"
                >
                  Explore Events
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button
                  onClick={goToHostSignup}
                  className="group inline-flex justify-center items-center hover:bg-[#F5F0EB] hover:shadow-md px-8 py-4 border border-[#D2C1B6] hover:border-[#B8A79C] rounded-full font-semibold text-[#234C6A] text-base whitespace-nowrap active:scale-95 transition-all duration-300"
                >
                  Become a Host
                </button>

                <button
                  onClick={goToHowItWorks}
                  className="group inline-flex justify-center items-center bg-[#234C6A] hover:bg-[#1E3D57] shadow-lg hover:shadow-xl sm:ml-4 px-8 py-4 rounded-full font-semibold text-white text-base whitespace-nowrap active:scale-95 transition-all duration-300"
                >
                  How It Works
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="gap-6 grid grid-cols-2 sm:grid-cols-4 max-w-2xl"
              >
                {platformStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="group text-center">
                      <div className="flex justify-center items-center mb-3">
                        <div className={`flex justify-center items-center p-3 mr-3 rounded-xl shadow-sm ${stat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="font-bold text-gray-900 text-3xl">{stat.number}</div>
                      </div>
                      <div className="font-semibold text-gray-700">{stat.label}</div>
                      <div className="mt-1 text-gray-500 text-sm">{stat.description}</div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-white shadow-2xl border border-[#D2C1B6]/20 rounded-3xl overflow-hidden">
                <div className="relative h-[480px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${eventSlides[currentSlide].image})` }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${eventSlides[currentSlide].color}`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>
                      </div>

                      <div className="right-0 bottom-0 left-0 absolute p-8 text-white">
                        <div className="flex justify-between items-center mb-4">
                          <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-sm">
                            {eventSlides[currentSlide].category}
                          </span>
                          <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                            <Users className="mr-2 w-4 h-4" />
                            <span>{eventSlides[currentSlide].participants}/{eventSlides[currentSlide].maxParticipants}</span>
                          </div>
                        </div>
                        
                        <h3 className="mb-3 font-bold text-3xl">
                          {eventSlides[currentSlide].title}
                        </h3>
                        
                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-4">
                            <div className="flex justify-center items-center bg-white/20 backdrop-blur-sm mr-3 rounded-full w-10 h-10">
                              <span className="text-lg">👤</span>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{eventSlides[currentSlide].host.name}</span>
                                {eventSlides[currentSlide].host.verified && (
                                  <Shield className="ml-2 w-4 h-4 text-[#96A78D]" />
                                )}
                              </div>
                              <div className="flex items-center text-gray-300 text-sm">
                                <Star className="fill-current mr-1 w-4 h-4" />
                                <span>{eventSlides[currentSlide].rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="gap-4 grid grid-cols-2">
                          <div className="flex items-center">
                            <MapPin className="mr-3 w-5 h-5 text-gray-300" />
                            <div>
                              <div className="text-gray-300 text-sm">Location</div>
                              <div className="font-medium">{eventSlides[currentSlide].location}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="mr-3 w-5 h-5 text-gray-300" />
                            <div>
                              <div className="text-gray-300 text-sm">Date & Time</div>
                              <div className="font-medium">{eventSlides[currentSlide].date}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-3 w-5 h-5 text-gray-300" />
                            <div>
                              <div className="text-gray-300 text-sm">Spots Left</div>
                              <div className="font-medium">
                                {eventSlides[currentSlide].maxParticipants - eventSlides[currentSlide].participants} remaining
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="mr-3 w-5 h-5 text-gray-300" />
                            <div>
                              <div className="text-gray-300 text-sm">Price</div>
                              <div className="font-medium">{eventSlides[currentSlide].price}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="top-4 right-4 absolute flex space-x-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="flex justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 text-white transition-all"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bottom-4 left-1/2 absolute -translate-x-1/2 transform">
                  <div className="flex space-x-2">
                    {eventSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-white w-8 h-2' 
                            : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="top-1/2 -right-4 -left-4 absolute flex justify-between items-center -translate-y-1/2 transform">
                <button
                  onClick={prevSlide}
                  className="flex justify-center items-center bg-white shadow-lg hover:shadow-xl rounded-full w-12 h-12 text-gray-700 hover:scale-110 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="flex justify-center items-center bg-white shadow-lg hover:shadow-xl rounded-full w-12 h-12 text-gray-700 hover:scale-110 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/events/${eventSlides[currentSlide].id}`)}
                className="right-8 bottom-8 absolute bg-gradient-to-r from-[#234C6A] hover:from-[#1E3D57] to-[#96A78D] hover:to-[#7E9175] shadow-lg hover:shadow-xl px-6 py-3 rounded-full font-semibold text-white transition-all"
              >
                Join Event
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;