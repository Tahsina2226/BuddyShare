"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: number;
  duration: string;
  category: string;
  tags: string[];
  isSaved: boolean;
  saveCount: number;
  uploadedBy: string;
  uploadedAt: string;
  eventLink: string;
  views: number;
  trendingScore: number;
  colorTheme: string;
  priceRange: string;
  rating: number;
}

type TabType = "most-saved" | "recently-added" | "trending-now" | "premium";
type CategoryType =
  | "all"
  | "music"
  | "art"
  | "food"
  | "wellness"
  | "tech"
  | "charity";
type ViewMode = "grid" | "masonry" | "list";

const ActivityMoodBoard: React.FC = () => {
  const [images, setImages] = useState<EventImage[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop",
      alt: "Summer music festival crowd",
      title: "Summer Beats Festival 2024",
      description:
        "Annual outdoor music festival featuring indie artists and local food trucks",
      date: "2024-07-15",
      location: "Central Park, NYC",
      attendees: 5000,
      duration: "8 hours",
      category: "Music",
      tags: ["festival", "music", "outdoor", "summer"],
      isSaved: true,
      saveCount: 342,
      uploadedBy: "musiclover92",
      uploadedAt: "2024-06-10",
      eventLink: "/events/summer-beats-festival",
      views: 1245,
      trendingScore: 95,
      colorTheme: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      priceRange: "$50-150",
      rating: 4.8,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1492684223066-dd23140edf6d?w=800&auto=format&fit=crop",
      alt: "Art gallery opening night",
      title: "Modern Art Exhibition Opening",
      description:
        "Exclusive preview of contemporary artworks from emerging artists",
      date: "2024-08-22",
      location: "Downtown Gallery",
      attendees: 150,
      duration: "3 hours",
      category: "Art",
      tags: ["art", "exhibition", "opening", "contemporary"],
      isSaved: false,
      saveCount: 189,
      uploadedBy: "artcurator",
      uploadedAt: "2024-06-12",
      eventLink: "/events/modern-art-exhibition",
      views: 856,
      trendingScore: 87,
      colorTheme: "from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      priceRange: "$25-75",
      rating: 4.6,
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
      alt: "Food tasting event setup",
      title: "International Food Tasting",
      description:
        "Culinary journey through global cuisines with renowned chefs",
      date: "2024-07-30",
      location: "Food Hall District",
      attendees: 300,
      duration: "4 hours",
      category: "Food",
      tags: ["food", "tasting", "culinary", "international"],
      isSaved: true,
      saveCount: 267,
      uploadedBy: "foodie_explorer",
      uploadedAt: "2024-06-08",
      eventLink: "/events/international-food-tasting",
      views: 1103,
      trendingScore: 92,
      colorTheme: "from-[#96A78D] via-[#7E9175] to-[#234C6A]",
      priceRange: "$75-200",
      rating: 4.9,
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&auto=format&fit=crop",
      alt: "Yoga retreat in nature",
      title: "Sunrise Yoga Retreat",
      description:
        "Morning yoga session followed by meditation and healthy breakfast",
      date: "2024-07-08",
      location: "Beachfront Resort",
      attendees: 50,
      duration: "2.5 hours",
      category: "Wellness",
      tags: ["yoga", "wellness", "retreat", "morning"],
      isSaved: false,
      saveCount: 156,
      uploadedBy: "yogini_life",
      uploadedAt: "2024-06-15",
      eventLink: "/events/sunrise-yoga-retreat",
      views: 732,
      trendingScore: 78,
      colorTheme: "from-[#234C6A] to-[#96A78D]",
      priceRange: "$30-90",
      rating: 4.7,
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop",
      alt: "Tech conference keynote",
      title: "Tech Innovators Summit",
      description: "Annual conference for tech entrepreneurs and innovators",
      date: "2024-09-05",
      location: "Convention Center",
      attendees: 2000,
      duration: "2 days",
      category: "Tech",
      tags: ["tech", "conference", "innovation", "networking"],
      isSaved: true,
      saveCount: 421,
      uploadedBy: "tech_guru",
      uploadedAt: "2024-06-05",
      eventLink: "/events/tech-innovators-summit",
      views: 1987,
      trendingScore: 98,
      colorTheme: "from-[#D2C1B6] to-[#9C6A50]",
      priceRange: "$299-799",
      rating: 4.8,
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop",
      alt: "Charity gala dinner",
      title: "Charity Gala Night",
      description: "Elegant fundraising event for local community projects",
      date: "2024-08-18",
      location: "Grand Hotel Ballroom",
      attendees: 400,
      duration: "5 hours",
      category: "Charity",
      tags: ["charity", "gala", "fundraising", "elegant"],
      isSaved: false,
      saveCount: 198,
      uploadedBy: "community_hero",
      uploadedAt: "2024-06-11",
      eventLink: "/events/charity-gala-night",
      views: 945,
      trendingScore: 85,
      colorTheme: "from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
      priceRange: "$150-500",
      rating: 4.9,
    },
    {
      id: "7",
      url: "https://images.unsplash.com/photo-1501281667305-0d4eb867d556?w=800&auto=format&fit=crop",
      alt: "Wine tasting event",
      title: "Vineyard Wine Tasting",
      description:
        "Premium wine tasting experience at sunset with vineyard tour",
      date: "2024-08-05",
      location: "Sunset Vineyards",
      attendees: 80,
      duration: "3 hours",
      category: "Food",
      tags: ["wine", "tasting", "vineyard", "premium"],
      isSaved: false,
      saveCount: 123,
      uploadedBy: "wine_connoisseur",
      uploadedAt: "2024-06-14",
      eventLink: "/events/vineyard-wine-tasting",
      views: 621,
      trendingScore: 72,
      colorTheme: "from-[#234C6A] to-[#D2C1B6]",
      priceRange: "$120-250",
      rating: 4.5,
    },
    {
      id: "8",
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
      alt: "Startup pitch competition",
      title: "Startup Pitch Battle",
      description:
        "Exciting pitch competition with venture capitalists and prizes",
      date: "2024-07-25",
      location: "Innovation Hub",
      attendees: 250,
      duration: "5 hours",
      category: "Tech",
      tags: ["startup", "pitch", "competition", "investment"],
      isSaved: true,
      saveCount: 178,
      uploadedBy: "startup_founder",
      uploadedAt: "2024-06-09",
      eventLink: "/events/startup-pitch-battle",
      views: 834,
      trendingScore: 81,
      colorTheme: "from-[#96A78D] to-[#234C6A]",
      priceRange: "Free",
      rating: 4.3,
    },
    {
      id: "9",
      url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
      alt: "Jazz night performance",
      title: "Midnight Jazz Sessions",
      description: "Intimate jazz performances in a speakeasy setting",
      date: "2024-08-30",
      location: "Blue Note Lounge",
      attendees: 120,
      duration: "3 hours",
      category: "Music",
      tags: ["jazz", "live", "night", "premium"],
      isSaved: false,
      saveCount: 234,
      uploadedBy: "jazz_cat",
      uploadedAt: "2024-06-16",
      eventLink: "/events/midnight-jazz-sessions",
      views: 987,
      trendingScore: 88,
      colorTheme: "from-[#D2C1B6] to-[#9C6A50]",
      priceRange: "$40-100",
      rating: 4.7,
    },
    {
      id: "10",
      url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&auto=format&fit=crop",
      alt: "Street food festival",
      title: "Global Street Food Fair",
      description: "Culinary adventure with street food from around the world",
      date: "2024-07-20",
      location: "Downtown Square",
      attendees: 2000,
      duration: "6 hours",
      category: "Food",
      tags: ["street-food", "festival", "international", "casual"],
      isSaved: true,
      saveCount: 312,
      uploadedBy: "food_adventurer",
      uploadedAt: "2024-06-13",
      eventLink: "/events/global-street-food-fair",
      views: 1321,
      trendingScore: 94,
      colorTheme: "from-[#234C6A] via-[#96A78D] to-[#D2C1B6]",
      priceRange: "$10-30",
      rating: 4.4,
    },
  ]);

  const [activeTab, setActiveTab] = useState<TabType>("most-saved");
  const [activeCategory, setActiveCategory] = useState<CategoryType>("all");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("masonry");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(
    new Set(["1", "3", "5", "8", "10"])
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = images.filter((img) => img.isSaved).map((img) => img.id);
    setSavedEvents(new Set(saved));
  }, []);

  const categories = [
    { id: "all", label: "All Events", color: "from-[#234C6A] to-[#96A78D]" },
    {
      id: "music",
      label: "Music",
      color: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
    },
    {
      id: "art",
      label: "Art & Culture",
      color: "from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
    },
    {
      id: "food",
      label: "Food & Drink",
      color: "from-[#96A78D] via-[#7E9175] to-[#234C6A]",
    },
    { id: "wellness", label: "Wellness", color: "from-[#234C6A] to-[#96A78D]" },
    { id: "tech", label: "Tech", color: "from-[#D2C1B6] to-[#9C6A50]" },
    {
      id: "charity",
      label: "Charity",
      color: "from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
    },
  ];

  const allTags = Array.from(new Set(images.flatMap((img) => img.tags)));

  const handleSaveToggle = (id: string) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const newSavedState = !img.isSaved;
          const saveCountChange = newSavedState ? 1 : -1;
          return {
            ...img,
            isSaved: newSavedState,
            saveCount: Math.max(0, img.saveCount + saveCountChange),
          };
        }
        return img;
      })
    );

    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getFilteredImages = () => {
    let filtered = [...images];

    if (activeCategory !== "all") {
      filtered = filtered.filter(
        (img) => img.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query) ||
          img.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((img) =>
        selectedTags.every((tag) => img.tags.includes(tag))
      );
    }

    switch (activeTab) {
      case "most-saved":
        return filtered.sort((a, b) => b.saveCount - a.saveCount);
      case "recently-added":
        return filtered.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      case "trending-now":
        return filtered.sort((a, b) => b.trendingScore - a.trendingScore);
      case "premium":
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${
              i < Math.floor(rating) ? "text-[#9C6A50]" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 font-medium text-gray-600 text-sm">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const filteredImages = getFilteredImages();

  return (
    <div
      className="bg-gradient-to-br from-[#F5F0EB] via-white to-[#F5F0EB]/50 min-h-screen"
      ref={containerRef}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="top-0 left-1/4 absolute bg-[#234C6A]/5 blur-3xl rounded-full w-96 h-96"></div>
        <div className="right-1/4 bottom-0 absolute bg-[#96A78D]/5 blur-3xl rounded-full w-96 h-96"></div>
        <div className="top-1/2 left-1/2 absolute bg-[#D2C1B6]/5 blur-3xl rounded-full w-96 h-96 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-[#234C6A] via-[#2E5A7A] to-[#96A78D] shadow-2xl mb-12 rounded-3xl overflow-hidden"
        >
          <div className="z-10 relative p-8 md:p-12">
            <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-[#234C6A] to-[#96A78D] p-2 rounded-xl">
                    <span className="text-white">👑</span>
                  </div>
                  <span className="bg-clip-text bg-gradient-to-r from-[#D2C1B6] to-[#F5F0EB] font-bold text-transparent text-sm uppercase tracking-wider">
                    Premium Events Collection
                  </span>
                </div>
                <h1 className="mb-4 font-bold text-white text-4xl md:text-5xl lg:text-6xl">
                  Discover{" "}
                  <span className="bg-clip-text bg-gradient-to-r from-[#D2C1B6] via-[#F5F0EB] to-[#96A78D] text-transparent">
                    Extraordinary
                  </span>{" "}
                  Events
                </h1>
                <p className="max-w-2xl text-[#F5F0EB] text-lg md:text-xl">
                  Curated collection of premium events, experiences, and
                  gatherings from around the world.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <button className="relative bg-gradient-to-r from-[#234C6A] via-[#2E5A7A] to-[#96A78D] hover:shadow-2xl px-8 py-4 rounded-full overflow-hidden font-bold text-white text-lg transition-all duration-300">
                  <span className="z-10 relative flex items-center gap-3">
                    <span>✨</span>
                    Create Event
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#96A78D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                </button>
              </motion.div>
            </div>
          </div>

          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "60px 60px",
              }}
            ></div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
            {[
              {
                value: images.length,
                label: "Total Events",
                gradient: "from-[#234C6A] to-[#96A78D]",
                change: "+12%",
              },
              {
                value: images
                  .reduce((acc, img) => acc + img.saveCount, 0)
                  .toLocaleString(),
                label: "Total Saves",
                gradient: "from-[#D2C1B6] to-[#9C6A50]",
                change: "+24%",
              },
              {
                value: new Set(images.map((img) => img.uploadedBy)).size,
                label: "Active Organizers",
                gradient: "from-[#234C6A] to-[#D2C1B6]",
                change: "+8%",
              },
              {
                value: images
                  .reduce((acc, img) => acc + img.attendees, 0)
                  .toLocaleString(),
                label: "Total Attendees",
                gradient: "from-[#96A78D] to-[#234C6A]",
                change: "+32%",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/80 shadow-lg hover:shadow-xl backdrop-blur-sm p-6 border border-gray-200/50 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`bg-gradient-to-br ${stat.gradient} p-2 rounded-lg`}
                      >
                        <span className="text-white">
                          {index === 0
                            ? "📅"
                            : index === 1
                            ? "❤️"
                            : index === 2
                            ? "👥"
                            : "🏆"}
                        </span>
                      </div>
                      <span className="font-semibold text-[#96A78D] text-sm">
                        {stat.change}
                      </span>
                    </div>
                    <div className="font-bold text-gray-900 text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                </div>
                <div
                  className={`absolute -right-8 -bottom-8 bg-gradient-to-br ${stat.gradient} opacity-5 w-24 h-24 rounded-full group-hover:scale-125 transition-transform duration-300`}
                ></div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="top-4 z-50 sticky mb-8"
        >
          <div className="bg-white/80 shadow-xl backdrop-blur-lg p-6 border border-gray-200/50 rounded-2xl">
            <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6">
              <div className="flex-1 w-full">
                <div className="relative">
                  <span className="top-1/2 left-4 absolute text-gray-400 -translate-y-1/2 transform">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search events, categories, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-50/50 py-3 pr-4 pl-12 border border-gray-200/50 focus:border-[#234C6A] rounded-xl focus:outline-none focus:ring-[#234C6A]/20 focus:ring-2 w-full transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="top-1/2 right-4 absolute text-gray-400 hover:text-gray-600 -translate-y-1/2 transform"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-xl">
                  {[
                    { mode: "grid", emoji: "▦" },
                    { mode: "masonry", emoji: "▤" },
                    { mode: "list", emoji: "☰" },
                  ].map(({ mode, emoji }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as ViewMode)}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === mode
                          ? "bg-white shadow-md text-[#234C6A]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-lg px-4 py-3 rounded-xl font-medium text-white transition-all"
                >
                  <span>⚙️</span>
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-gradient-to-r from-[#234C6A] to-[#96A78D] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex md:flex-row flex-col justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="flex items-center gap-3 font-bold text-gray-900 text-2xl">
              <span>⚡</span>
              Browse Categories
            </h2>
            <div className="text-gray-500 text-sm">
              <span className="font-semibold text-[#234C6A]">
                {filteredImages.length}
              </span>{" "}
              events found
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id as CategoryType)}
                className={`
                  group relative flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-300
                  ${
                    activeCategory === category.id
                      ? "text-white shadow-xl"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                  }
                `}
                style={
                  activeCategory === category.id
                    ? {
                        backgroundImage: `linear-gradient(135deg, ${category.color})`,
                      }
                    : {}
                }
              >
                <span
                  className={`transition-transform group-hover:scale-110 ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {category.id === "all"
                    ? "✨"
                    : category.id === "music"
                    ? "🎵"
                    : category.id === "art"
                    ? "🎨"
                    : category.id === "food"
                    ? "🍴"
                    : category.id === "wellness"
                    ? "💖"
                    : category.id === "tech"
                    ? "💻"
                    : "🤝"}
                </span>
                <span>{category.label}</span>
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="-z-10 absolute inset-0 rounded-xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${category.color})`,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3">
            {[
              {
                id: "most-saved",
                label: "Most Saved",
                emoji: "❤️",
                gradient: "from-[#234C6A] to-[#96A78D]",
              },
              {
                id: "trending-now",
                label: "Trending Now",
                emoji: "🔥",
                gradient: "from-[#D2C1B6] to-[#9C6A50]",
              },
              {
                id: "recently-added",
                label: "Recently Added",
                emoji: "🕐",
                gradient: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
              },
              {
                id: "premium",
                label: "Premium",
                emoji: "👑",
                gradient: "from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
              },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  group relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "text-white shadow-xl"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl"
                  }
                `}
                style={
                  activeTab === tab.id
                    ? {
                        backgroundImage: `linear-gradient(135deg, ${tab.gradient})`,
                      }
                    : {}
                }
              >
                <span>{tab.emoji}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="-z-10 absolute inset-0 rounded-xl"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${tab.gradient})`,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${activeCategory}-${activeTab}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              ${
                viewMode === "masonry"
                  ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
                  : ""
              }
              ${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : ""
              }
              ${viewMode === "list" ? "space-y-4" : ""}
              ${viewMode === "masonry" ? "gap-6 space-y-6" : ""}
            `}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`
                  group relative break-inside-avoid
                  ${viewMode === "masonry" ? "mb-6" : ""}
                `}
              >
                <div
                  className="relative bg-white shadow-xl hover:shadow-2xl rounded-2xl overflow-hidden transition-all hover:-translate-y-2 duration-500 transform"
                  onMouseEnter={() => setHoveredImage(image.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  {image.rating >= 4.8 && (
                    <div className="top-4 left-4 z-20 absolute flex items-center gap-1 bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] px-3 py-1.5 rounded-full font-bold text-white text-xs">
                      <span>👑</span>
                      Premium
                    </div>
                  )}

                  {image.trendingScore >= 90 && (
                    <div className="top-4 right-4 z-20 absolute flex items-center gap-1 bg-gradient-to-r from-[#234C6A] to-[#96A78D] px-3 py-1.5 rounded-full font-bold text-white text-xs">
                      <span>🔥</span>
                      Trending
                    </div>
                  )}

                  <div className="relative aspect-[4/3] overflow-hidden">
                    <motion.img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div
                      className={`
                      absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent
                      transition-all duration-500 flex flex-col justify-end p-6
                      ${hoveredImage === image.id ? "opacity-100" : "opacity-0"}
                    `}
                    >
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={
                          hoveredImage === image.id ? { y: 0, opacity: 1 } : {}
                        }
                        transition={{ delay: 0.1 }}
                        className="space-y-3 text-white"
                      >
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {image.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-3">
                          {image.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-white text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    <div className="right-0 bottom-0 left-0 absolute p-6">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="mb-2 font-bold text-white text-xl leading-tight">
                            {image.title}
                          </h3>
                          <div className="flex items-center gap-3 text-white/90 text-sm">
                            <span className="flex items-center gap-1">
                              <span>📅</span>
                              {formatDate(image.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>📍</span>
                              {image.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`bg-gradient-to-r ${image.colorTheme} p-1 rounded-md`}
                          >
                            <span className="px-2 py-0.5 font-bold text-white text-xs">
                              {image.category}
                            </span>
                          </div>
                          {renderStars(image.rating)}
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <span className="flex items-center gap-1">
                            <span>👥</span>
                            {image.attendees.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <span>🕐</span>
                            {image.duration}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {image.priceRange}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-gray-100 border-t">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveToggle(image.id)}
                          className="group/save relative"
                        >
                          <div className="absolute inset-0 bg-[#9C6A50]/20 opacity-0 group-hover/save:opacity-100 blur-md rounded-full transition-opacity"></div>
                          <span
                            className={`text-xl ${
                              image.isSaved
                                ? "text-[#9C6A50]"
                                : "text-gray-400 group-hover/save:text-[#9C6A50]"
                            }`}
                          >
                            {image.isSaved ? "❤️" : "🤍"}
                          </span>
                        </button>
                        <span className="font-medium text-gray-700 text-sm">
                          {image.saveCount} saves
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-lg px-4 py-2 rounded-lg font-medium text-white text-sm transition-all">
                          <span>🔗</span>
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center"
          >
            <div className="inline-block bg-gradient-to-br from-gray-100 to-white shadow-xl p-8 rounded-3xl">
              <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A] to-[#96A78D] mx-auto mb-6 rounded-full w-20 h-20">
                <span className="text-white text-2xl">🔍</span>
              </div>
              <h3 className="mb-3 font-bold text-gray-900 text-2xl">
                No events found
              </h3>
              <p className="mb-6 text-gray-600">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags([]);
                  setActiveCategory("all");
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-lg px-6 py-3 rounded-xl font-medium text-white transition-all"
              >
                <span>✕</span>
                Clear all filters
              </button>
            </div>
          </motion.div>
        )}

        {filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <button className="group inline-flex relative items-center gap-3 bg-gradient-to-r from-[#234C6A] to-[#2E5A7A] hover:shadow-2xl px-8 py-4 rounded-full font-bold text-white text-lg transition-all hover:-translate-y-1 duration-300">
              <span>Find Activities</span>
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#2E5A7A] opacity-0 group-hover:opacity-100 blur-xl rounded-full transition-opacity duration-300"></div>
            </button>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-20"
        >
          <div className="relative bg-gradient-to-br from-[#234C6A] via-[#2E5A7A] to-[#96A78D] shadow-2xl rounded-3xl overflow-hidden">
            <div className="z-10 relative p-12 md:p-16">
              <div className="items-center gap-12 grid lg:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-[#9C6A50] to-[#D2C1B6] p-2 rounded-xl">
                      <span className="text-white">🎓</span>
                    </div>
                    <span className="bg-clip-text bg-gradient-to-r from-[#D2C1B6] to-[#F5F0EB] font-bold text-transparent text-sm uppercase tracking-wider">
                      Premium Experience
                    </span>
                  </div>
                  <h2 className="mb-6 font-bold text-white text-4xl md:text-5xl">
                    Elevate Your{" "}
                    <span className="bg-clip-text bg-gradient-to-r from-[#D2C1B6] via-[#F5F0EB] to-[#96A78D] text-transparent">
                      Event Experience
                    </span>
                  </h2>
                  <p className="mb-8 text-[#F5F0EB] text-lg leading-relaxed">
                    Get exclusive access to premium events, VIP experiences, and
                    personalized recommendations tailored to your interests.
                  </p>
                  <div className="flex sm:flex-row flex-col gap-4">
                    <button className="group relative bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-2xl px-8 py-4 rounded-full overflow-hidden font-bold text-white text-lg transition-all duration-300">
                      <span className="z-10 relative flex items-center gap-3">
                        <span>👑</span>
                        Create Event
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#96A78D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                    </button>
                    <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full font-medium text-white transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="gap-4 grid grid-cols-2">
                  {[
                    "Exclusive Access",
                    "VIP Experiences",
                    "Personalized Curation",
                    "Priority Booking",
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm p-6 border border-white/10 rounded-2xl transition-all duration-300"
                    >
                      <div className="flex justify-center items-center bg-gradient-to-r from-[#234C6A]/20 to-[#96A78D]/20 mb-4 rounded-lg w-12 h-12">
                        <span className="text-[#D2C1B6] text-lg">⭐</span>
                      </div>
                      <h4 className="mb-2 font-semibold text-white">
                        {feature}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Access premium features and exclusive benefits
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="top-0 right-0 absolute bg-gradient-to-br from-[#9C6A50]/10 to-[#D2C1B6]/10 blur-3xl rounded-full w-64 h-64"></div>
            <div className="bottom-0 left-0 absolute bg-gradient-to-tr from-[#234C6A]/10 to-[#96A78D]/10 blur-3xl rounded-full w-64 h-64"></div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ActivityMoodBoard;