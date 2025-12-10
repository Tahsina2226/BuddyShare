"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
  stats?: {
    value: string;
    label: string;
  };
}

const WhyChooseOurPlatform: React.FC = () => {
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);

  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Safe & Verified Community",
      description:
        "Advanced ID verification and secure payment systems ensure your safety at every step.",
      icon: "🛡️",
      color: "from-[#234C6A] to-[#96A78D]",
      gradient: "bg-gradient-to-br from-[#234C6A] to-[#96A78D]",
      features: [
        "Biometric ID Verification",
        "Secure Payment Gateway",
        "Background Checks",
        "24/7 Safety Support",
      ],
      stats: { value: "99.8%", label: "Safety Rating" },
    },
    {
      id: 2,
      title: "No More Lonely Outings",
      description:
        "Always find company for any activity. From coffee dates to weekend adventures.",
      icon: "👥",
      color: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      gradient: "bg-gradient-to-br from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      features: [
        "Instant Matchmaking",
        "Group Activities",
        "Interest-based Groups",
        "Daily Meetups",
      ],
      stats: { value: "10K+", label: "Active Users" },
    },
    {
      id: 3,
      title: "Effortless Event Hosting",
      description:
        "Powerful yet simple tools to organize events. Manage everything from one dashboard.",
      icon: "📅",
      color: "from-[#D2C1B6] to-[#9C6A50]",
      gradient: "bg-gradient-to-br from-[#D2C1B6] to-[#9C6A50]",
      features: [
        "One-click Setup",
        "Smart Scheduling",
        "Automated Reminders",
        "RSVP Management",
      ],
      stats: { value: "5K+", label: "Events Hosted" },
    },
    {
      id: 4,
      title: "Genuine Connections",
      description:
        "Build meaningful friendships that last beyond the event. Quality over quantity.",
      icon: "🤝",
      color: "from-[#96A78D] to-[#234C6A]",
      gradient: "bg-gradient-to-br from-[#96A78D] to-[#234C6A]",
      features: [
        "Personality Matching",
        "Shared Interests",
        "Post-event Connections",
        "Friend Groups",
      ],
      stats: { value: "85%", label: "Friendships Formed" },
    },
    {
      id: 5,
      title: "Flexible Participation",
      description:
        "Join events or host your own. Full control over your social calendar.",
      icon: "🔄",
      color: "from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
      gradient: "bg-gradient-to-br from-[#234C6A] via-[#D2C1B6] to-[#96A78D]",
      features: [
        "Join as Guest",
        "Host Events",
        "Private Events",
        "Public Activities",
      ],
      stats: { value: "Flexible", label: "Participation" },
    },
    {
      id: 6,
      title: "Community Trust System",
      description:
        "Transparent ratings and reviews ensure quality experiences for everyone.",
      icon: "⭐",
      color: "from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      gradient: "bg-gradient-to-br from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      features: [
        "Verified Reviews",
        "Host Ratings",
        "User Feedback",
        "Quality Assurance",
      ],
      stats: { value: "4.9/5", label: "Average Rating" },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-[#F5F0EB]/50 to-white px-4 sm:px-6 lg:px-8 py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="-top-40 -right-40 absolute bg-[#234C6A]/5 blur-3xl rounded-full w-96 h-96"></div>
        <div className="-bottom-40 -left-40 absolute bg-[#96A78D]/5 blur-3xl rounded-full w-96 h-96"></div>
        <div className="top-1/3 left-1/4 absolute bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 blur-3xl rounded-full w-64 h-64"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 mb-6 px-4 py-2 rounded-full">
            <span>🏆</span>
            <span className="font-semibold text-[#234C6A] text-sm">
              Why We Stand Out
            </span>
          </div>

          <h2 className="mb-6 font-bold text-gray-900 text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Experience Social Events{" "}
            <span className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] text-transparent">
              Redefined
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-[#2E5A7A] text-lg md:text-xl leading-relaxed">
            We've built more than a platform—we've created a community where
            every event is safe, every connection is meaningful, and every
            experience is unforgettable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-[#F5F0EB] to-white/50 backdrop-blur-sm p-6 border border-[#D2C1B6]/50 rounded-2xl">
            <div className="gap-6 grid grid-cols-2 md:grid-cols-4">
              {[
                {
                  value: "50K+",
                  label: "Happy Members",
                  icon: "👥",
                  color: "text-[#234C6A]",
                },
                {
                  value: "15K+",
                  label: "Successful Events",
                  icon: "📅",
                  color: "text-[#2E5A7A]",
                },
                {
                  value: "98%",
                  label: "Safety Satisfaction",
                  icon: "🛡️",
                  color: "text-[#96A78D]",
                },
                {
                  value: "4.9★",
                  label: "Platform Rating",
                  icon: "⭐",
                  color: "text-[#9C6A50]",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex justify-center items-center bg-white shadow-sm mb-3 rounded-xl w-12 h-12">
                    <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
                  </div>
                  <div className="font-bold text-gray-900 text-2xl md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="gap-8 grid grid-cols-1 lg:grid-cols-2"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setHoveredBenefit(benefit.id)}
              onMouseLeave={() => setHoveredBenefit(null)}
              className="group relative"
            >
              <div className="relative bg-white/80 shadow-gray-200/50 shadow-lg hover:shadow-gray-300/50 hover:shadow-xl backdrop-blur-sm p-8 border border-gray-200/50 rounded-2xl h-full overflow-hidden transition-all duration-300">
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 rounded-2xl`}
                ></div>

                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl`}
                ></div>

                <div className="relative flex items-start gap-6 mb-6">
                  <div className="relative">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${benefit.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-xl">{benefit.icon}</span>
                    </div>

                    {hoveredBenefit === benefit.id && (
                      <motion.div
                        className="absolute inset-0 opacity-30 border-2 border-transparent border-t-[#234C6A] rounded-2xl w-14 h-14"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="mb-2 font-bold text-gray-900 group-hover:text-[#234C6A] text-xl transition-colors">
                        {benefit.title}
                      </h3>

                      {benefit.stats && (
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-2xl">
                            {benefit.stats.value}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {benefit.stats.label}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-[#2E5A7A] text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="gap-3 grid grid-cols-2">
                    {benefit.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br ${benefit.color} bg-opacity-10`}
                        >
                          <span className="text-xs">✓</span>
                        </div>
                        <span className="font-medium text-gray-700 text-sm">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="relative bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6 h-px">
                  <motion.div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${benefit.color}`}
                    initial={{ width: "0%" }}
                    animate={
                      hoveredBenefit === benefit.id
                        ? { width: "100%" }
                        : { width: "0%" }
                    }
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <motion.button
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent group/learn`}
                >
                  <span>Learn more about this feature</span>
                  <span className="transition-transform group-hover/learn:translate-x-1">
                    →
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-[#234C6A] to-[#2E5A7A] p-8 md:p-12 rounded-2xl overflow-hidden text-white">
            <div className="relative">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: "30px 30px",
                  }}
                ></div>
              </div>

              <div className="relative items-center gap-8 grid grid-cols-1 lg:grid-cols-2">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm mb-6 px-4 py-2 rounded-full">
                    <span>⚡</span>
                    <span className="font-medium text-[#D2C1B6] text-sm">
                      Trust & Security
                    </span>
                  </div>

                  <h3 className="mb-4 font-bold text-3xl md:text-4xl">
                    Built on Trust, Powered by Community
                  </h3>

                  <p className="mb-8 text-[#F5F0EB] text-lg">
                    Our platform's success is measured by the authentic
                    connections and safe experiences we facilitate every day.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center gap-2 bg-white hover:bg-[#F5F0EB] px-6 py-3 rounded-xl font-semibold text-[#234C6A] transition-colors duration-300">
                      <span>Join Our Community</span>
                      <span>✨</span>
                    </button>

                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 border border-white/20 rounded-xl font-semibold text-white transition-colors duration-300">
                      Learn About Safety
                    </button>
                  </div>
                </div>

                <div className="gap-6 grid grid-cols-2">
                  {[
                    { value: "Zero", label: "Security Breaches", icon: "🛡️" },
                    { value: "24/7", label: "Safety Monitoring", icon: "📈" },
                    { value: "10M+", label: "Secure Transactions", icon: "⭐" },
                    { value: "Instant", label: "Verification", icon: "✓" },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm p-4 border border-white/10 rounded-xl text-center"
                    >
                      <span className="block opacity-80 mx-auto mb-3 text-2xl">
                        {metric.icon}
                      </span>
                      <div className="mb-1 font-bold text-white text-2xl">
                        {metric.value}
                      </div>
                      <div className="text-[#F5F0EB] text-sm">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex justify-center items-center bg-gradient-to-br from-[#234C6A]/10 to-[#96A78D]/10 mx-auto mb-6 rounded-2xl w-16 h-16">
            <span className="text-2xl">✨</span>
          </div>

          <h3 className="mb-6 font-bold text-gray-900 text-2xl md:text-3xl">
            Ready to Transform Your Social Life?
          </h3>

          <p className="mx-auto mb-8 max-w-2xl text-[#2E5A7A]">
            Join thousands who have found friendship, adventure, and
            unforgettable experiences through our platform.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="group flex items-center gap-3 bg-gradient-to-r from-[#234C6A] to-[#96A78D] hover:shadow-xl px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300">
              <span>Create Event</span>
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
            </button>

            <button className="flex items-center gap-3 bg-white hover:bg-[#F5F0EB] px-8 py-4 border border-[#D2C1B6] hover:border-[#B8A79C] rounded-xl font-semibold text-[#234C6A] transition-all duration-300">
              <span>Find Activities</span>
              <span className="text-[#9C6A50]">📅</span>
            </button>
          </div>

          <div className="mt-6 text-[#2E5A7A] text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseOurPlatform;
