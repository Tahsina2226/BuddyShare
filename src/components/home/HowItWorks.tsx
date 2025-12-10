"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventCategory {
  id: number;
  name: string;
  icon: string;
  eventCount: number;
  color: string;
  gradient: string;
  description: string;
  trending: boolean;
  featuredEvent?: {
    title: string;
    date: string;
    location: string;
    attendees: number;
    rating: number;
  };
}

const PopularEventCategories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const categories: EventCategory[] = [
    {
      id: 1,
      name: "Music & Concerts",
      icon: "🎵",
      eventCount: 142,
      color: "bg-gradient-to-br from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      gradient: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      description:
        "Live concerts, festivals, DJ sets, and musical performances across all genres. Experience the energy of live music.",
      trending: true,
      featuredEvent: {
        title: "Summer Beats Festival 2024",
        date: "July 15-17, 2024",
        location: "Central Park, NYC",
        attendees: 5000,
        rating: 4.8,
      },
    },
    {
      id: 2,
      name: "Outdoor & Adventure",
      icon: "⛰️",
      eventCount: 89,
      color: "bg-gradient-to-br from-[#234C6A] to-[#96A78D]",
      gradient: "from-[#234C6A] to-[#96A78D]",
      description:
        "Hiking, camping, kayaking, and adventure sports for outdoor enthusiasts. Connect with nature.",
      trending: false,
      featuredEvent: {
        title: "Sunrise Mountain Hike",
        date: "August 8, 2024",
        location: "Rocky Mountains",
        attendees: 150,
        rating: 4.9,
      },
    },
    {
      id: 3,
      name: "Gaming & Esports",
      icon: "🎮",
      eventCount: 67,
      color: "bg-gradient-to-br from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      gradient: "from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      description:
        "Video game tournaments, board game nights, and gaming conventions. Compete and connect.",
      trending: true,
      featuredEvent: {
        title: "Esports Championship Finals",
        date: "September 5, 2024",
        location: "Convention Center",
        attendees: 3000,
        rating: 4.7,
      },
    },
    {
      id: 4,
      name: "Food & Dining",
      icon: "🍽️",
      eventCount: 124,
      color: "bg-gradient-to-br from-[#96A78D] via-[#7E9175] to-[#234C6A]",
      gradient: "from-[#96A78D] via-[#7E9175] to-[#234C6A]",
      description:
        "Food festivals, cooking classes, wine tastings, and culinary experiences. Taste the extraordinary.",
      trending: false,
      featuredEvent: {
        title: "International Food Festival",
        date: "July 30, 2024",
        location: "Food Hall District",
        attendees: 2000,
        rating: 4.6,
      },
    },
    {
      id: 5,
      name: "Arts & Culture",
      icon: "🎨",
      eventCount: 93,
      color: "bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
      gradient: "from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
      description:
        "Art exhibitions, theater performances, museum tours, and cultural festivals. Immerse in creativity.",
      trending: true,
      featuredEvent: {
        title: "Modern Art Exhibition",
        date: "August 22-30, 2024",
        location: "Downtown Gallery",
        attendees: 800,
        rating: 4.8,
      },
    },
    {
      id: 6,
      name: "Sports & Fitness",
      icon: "⚽",
      eventCount: 156,
      color: "bg-gradient-to-br from-[#D2C1B6] to-[#9C6A50]",
      gradient: "from-[#D2C1B6] to-[#9C6A50]",
      description:
        "Sports tournaments, fitness classes, marathons, and wellness workshops. Stay active and healthy.",
      trending: false,
      featuredEvent: {
        title: "City Marathon 2024",
        date: "October 10, 2024",
        location: "City Center",
        attendees: 10000,
        rating: 4.9,
      },
    },
    {
      id: 7,
      name: "Tech & Innovation",
      icon: "💻",
      eventCount: 112,
      color: "bg-gradient-to-br from-[#234C6A] to-[#2E5A7A]",
      gradient: "from-[#234C6A] to-[#2E5A7A]",
      description:
        "Tech conferences, coding workshops, seminars, and networking events. Shape the future.",
      trending: true,
      featuredEvent: {
        title: "Tech Innovators Summit",
        date: "November 5-7, 2024",
        location: "Tech Hub",
        attendees: 2500,
        rating: 4.7,
      },
    },
    {
      id: 8,
      name: "Social & Networking",
      icon: "👥",
      eventCount: 78,
      color: "bg-gradient-to-br from-[#96A78D] to-[#234C6A]",
      gradient: "from-[#96A78D] to-[#234C6A]",
      description:
        "Meetups, networking events, social mixers, and community gatherings. Expand your network.",
      trending: false,
      featuredEvent: {
        title: "Founders Networking Night",
        date: "August 18, 2024",
        location: "Business Center",
        attendees: 300,
        rating: 4.5,
      },
    },
  ];

  const handleCategoryClick = (category: EventCategory) => {
    setSelectedCategory(category);
  };

  const handleBrowseClick = (category: EventCategory, e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <section className="relative bg-gradient-to-b from-[#F5F0EB] via-white to-[#F5F0EB] px-4 sm:px-6 lg:px-8 py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute bg-[#234C6A]/10 blur-3xl rounded-full w-80 h-80"></div>
        <div className="-bottom-40 -left-40 absolute bg-[#96A78D]/10 blur-3xl rounded-full w-80 h-80"></div>
        <div className="top-1/2 left-1/2 absolute bg-gradient-to-r from-[#234C6A]/5 to-[#96A78D]/5 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2 transform"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 mb-6 px-4 py-2 rounded-full">
            <span className="text-lg">✨</span>
            <span className="font-medium text-[#234C6A] text-sm">
              Explore by Interest
            </span>
          </div>

          <h2 className="mb-6 font-bold text-gray-900 text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Discover{" "}
            <span className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] text-transparent">
              Event Categories
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-[#234C6A] text-lg md:text-xl leading-relaxed">
            Curated collections of events tailored to your passions. From
            intimate gatherings to grand festivals, find experiences that
            resonate with you.
          </p>
        </motion.div>

        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleCategoryClick(category)}
                className="group relative"
              >
                <div className="relative bg-white/80 shadow-gray-200/50 shadow-lg hover:shadow-gray-300/50 hover:shadow-xl backdrop-blur-sm p-6 border border-gray-200/50 rounded-2xl h-full overflow-hidden transition-all duration-300 cursor-pointer">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>

                  {category.trending && (
                    <div className="top-4 right-4 absolute flex items-center gap-1 bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] px-3 py-1 rounded-full font-semibold text-white text-xs">
                      <span className="text-sm">✨</span>
                      Trending
                    </div>
                  )}

                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${category.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl">{category.icon}</span>
                    </div>

                    <div className="absolute inset-0 group-hover:opacity-30 border-2 border-transparent group-hover:border-current rounded-2xl w-16 h-16 transition-all animate-pulse duration-500"></div>
                  </div>

                  <h3 className="mb-3 font-bold text-gray-900 group-hover:text-[#234C6A] text-xl transition-colors">
                    {category.name}
                  </h3>

                  <p className="mb-6 text-gray-500 group-hover:text-[#2E5A7A] text-sm line-clamp-2 transition-colors">
                    {category.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-gray-100 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#96A78D] rounded-full w-2 h-2"></div>
                        <span className="font-semibold text-gray-900 text-sm">
                          {category.eventCount}
                        </span>
                        <span className="text-gray-500 text-xs">events</span>
                      </div>

                      {category.featuredEvent && (
                        <div className="flex items-center gap-1">
                          <span className="text-[#9C6A50]">⭐</span>
                          <span className="font-medium text-gray-700 text-xs">
                            {category.featuredEvent.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      onClick={(e) => handleBrowseClick(category, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 bg-gradient-to-r ${category.gradient} text-white font-semibold rounded-lg flex items-center gap-2 hover:shadow-lg transition-all duration-300 text-sm`}
                    >
                      <span>Find Activities</span>
                      <motion.div
                        animate={
                          hoveredCategory === category.id ? { x: 3 } : { x: 0 }
                        }
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                      >
                        <span>→</span>
                      </motion.div>
                    </motion.button>
                  </div>

                  <motion.div
                    className="right-0 bottom-0 left-0 absolute bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 h-0.5"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {selectedCategory ? (
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <div
                className={`relative bg-gradient-to-br from-white to-[#F5F0EB]/50 backdrop-blur-sm shadow-2xl border border-[#D2C1B6]/30 rounded-3xl p-8 overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-[0.02]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                      backgroundSize: "50px 50px",
                    }}
                  ></div>
                </div>

                <div className="relative flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${selectedCategory.color} text-white shadow-lg`}
                    >
                      <span className="text-2xl">{selectedCategory.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-2xl">
                          {selectedCategory.name}
                        </h3>
                        {selectedCategory.trending && (
                          <span className="bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] px-3 py-1 rounded-full font-semibold text-white text-xs">
                            Trending Now
                          </span>
                        )}
                      </div>
                      <p className="max-w-2xl text-[#2E5A7A]">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/50 px-4 py-2 border border-gray-200 rounded-xl text-center">
                      <div className="font-bold text-gray-900 text-2xl">
                        {selectedCategory.eventCount}
                      </div>
                      <div className="text-gray-600 text-sm">Events</div>
                    </div>
                  </div>
                </div>

                {selectedCategory.featuredEvent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative bg-gradient-to-r from-white to-[#F5F0EB]/50 mb-8 p-6 border border-[#D2C1B6]/50 rounded-2xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="mb-1 font-semibold text-gray-900 text-lg">
                          Featured Event
                        </h4>
                        <p className="text-[#2E5A7A] text-sm">
                          Most popular in this category
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#9C6A50]">⭐</span>
                        <span className="font-bold text-gray-900">
                          {selectedCategory.featuredEvent.rating}/5
                        </span>
                      </div>
                    </div>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                      <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                        <span>📅</span>
                        <div>
                          <div className="text-gray-500 text-xs">Date</div>
                          <div className="font-medium text-gray-900">
                            {selectedCategory.featuredEvent.date}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                        <span>📍</span>
                        <div>
                          <div className="text-gray-500 text-xs">Location</div>
                          <div className="font-medium text-gray-900">
                            {selectedCategory.featuredEvent.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl">
                        <span>👥</span>
                        <div>
                          <div className="text-gray-500 text-xs">Attendees</div>
                          <div className="font-medium text-gray-900">
                            {selectedCategory.featuredEvent.attendees.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="relative flex flex-wrap justify-between items-center gap-4 pt-6 border-gray-200/50 border-t">
                  <div className="text-[#2E5A7A]">
                    Ready to explore{" "}
                    <span className="font-semibold text-[#234C6A]">
                      {selectedCategory.eventCount}
                    </span>{" "}
                    amazing events?
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="group flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#2E5A7A] hover:shadow-lg px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300">
                      Find Activities
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="bg-white hover:bg-[#F5F0EB] px-6 py-3 border border-[#D2C1B6] rounded-xl font-semibold text-[#234C6A] transition-all duration-300"
                    >
                      Back to Categories
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-[#F5F0EB] to-white/50 backdrop-blur-sm p-8 border border-[#D2C1B6]/50 rounded-2xl text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-br from-[#234C6A]/10 to-[#96A78D]/10 mb-6 rounded-2xl w-16 h-16">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="mb-3 font-semibold text-[#234C6A] text-xl">
                  Select a Category to Begin
                </h3>
                <p className="mx-auto max-w-md text-[#2E5A7A]">
                  Click on any category above to explore featured events, view
                  statistics, and discover trending experiences in that
                  category.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h3 className="mb-6 font-bold text-[#234C6A] text-2xl">
            Can't find what you're looking for?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="group flex items-center gap-3 bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-xl px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300">
              <span>Browse All Categories</span>
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
            </button>

            <button className="flex items-center gap-3 bg-white hover:bg-[#F5F0EB] px-8 py-4 border border-[#D2C1B6] hover:border-[#B8A79C] rounded-xl font-semibold text-[#234C6A] transition-all duration-300">
              <span>View Trending Events</span>
              <span className="text-[#9C6A50]">✨</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularEventCategories;
