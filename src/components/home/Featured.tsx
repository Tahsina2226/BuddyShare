"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Calendar,
  MapPin,
  Shield,
  Star,
  Ticket,
  Heart,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Zap,
  Clock,
  Award,
  Globe,
  Plus,
} from "lucide-react";

interface Step {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  gradient: string;
  previewDetails: {
    title: string;
    subtitle: string;
    tags: string[];
    participants?: { current: number; max: number };
    price?: string;
    hostRating?: number;
  };
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      id: 1,
      icon: <Search className="w-6 h-6" />,
      title: "Find Activities",
      description: "Browse curated local activities matching your interests",
      color: "bg-gradient-to-br from-[#234C6A] to-[#96A78D]",
      gradient: "from-[#234C6A] via-[#2E5A7A] to-[#96A78D]",
      previewDetails: {
        title: "Weekend Hiking Adventure",
        subtitle: "Rocky Mountains • This Saturday • 10:00 AM",
        tags: ["Outdoors", "Hiking", "Nature", "Beginner Friendly"],
        participants: { current: 8, max: 15 },
        price: "Free",
      },
    },
    {
      id: 2,
      icon: <Users className="w-6 h-6" />,
      title: "Connect & Join",
      description: "Connect with hosts and join activities securely",
      color: "bg-gradient-to-br from-[#D2C1B6] to-[#9C6A50]",
      gradient: "from-[#D2C1B6] via-[#D8C8BD] to-[#9C6A50]",
      previewDetails: {
        title: "Alex Morgan",
        subtitle: "Adventure Guide • 150+ Events Hosted",
        tags: ["Verified Host", "Safety Certified", "Top Rated"],
        hostRating: 4.9,
      },
    },
    {
      id: 3,
      icon: <Calendar className="w-6 h-6" />,
      title: "Experience Together",
      description: "Create memorable experiences with like-minded people",
      color: "bg-gradient-to-br from-[#96A78D] to-[#234C6A]",
      gradient: "from-[#96A78D] via-[#7E9175] to-[#234C6A]",
      previewDetails: {
        title: "Event Confirmed!",
        subtitle: "Meeting Spot: Main Trailhead • Safety Guidelines Sent",
        tags: ["Group Chat Active", "Safety Checked", "12 Attending"],
      },
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#F5F0EB] via-white to-[#F5F0EB]/50 px-4 sm:px-6 lg:px-8 py-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="-top-40 -right-40 absolute bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 blur-3xl rounded-full w-80 h-80"></div>
        <div className="-bottom-40 -left-40 absolute bg-gradient-to-r from-[#D2C1B6]/10 to-[#9C6A50]/10 blur-3xl rounded-full w-80 h-80"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="inline-flex items-center gap-3 bg-white/80 shadow-lg backdrop-blur-sm mb-6 px-6 py-3 border border-[#D2C1B6]/20 rounded-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-[#234C6A]" />
                <div className="absolute inset-0 bg-[#234C6A] blur-sm"></div>
              </div>
              <span className="bg-clip-text bg-gradient-to-r from-[#234C6A] to-[#96A78D] font-semibold text-transparent text-sm">
                Join thousands of happy participants
              </span>
            </div>
            <div className="bg-gradient-to-b from-transparent via-[#D2C1B6] to-transparent w-px h-4"></div>
            <div className="flex items-center gap-1 text-[#234C6A] text-xs">
              <Zap className="w-3 h-3 text-[#9C6A50]" />
              <span>4.8/5 average rating</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              type: "spring",
              stiffness: 100,
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-clip-text bg-gradient-to-r from-[#234C6A] via-[#2E5A7A] to-[#96A78D] mb-6 font-bold text-transparent text-5xl md:text-6xl"
          >
            Your Journey to
            <span className="relative">
              <span className="z-10 relative"> Amazing Experiences</span>
              <div className="right-0 bottom-2 left-0 absolute bg-gradient-to-r from-[#234C6A]/20 via-[#D2C1B6]/20 to-[#96A78D]/20 h-3 -rotate-1"></div>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              type: "spring",
              stiffness: 100,
            }}
            viewport={{ once: true, margin: "-50px" }}
            className="mx-auto max-w-3xl text-[#234C6A] text-xl leading-relaxed"
          >
            From discovering exciting local events to building meaningful
            connections, we make socializing around shared interests effortless
            and secure.
          </motion.p>
        </div>

        <div className="relative mb-4">
          <div className="hidden lg:block top-1/2 right-0 left-0 absolute bg-gradient-to-r from-[#234C6A]/20 via-[#D2C1B6]/20 to-[#96A78D]/20 rounded-full h-1.5 -translate-y-1/2">
            <motion.div
              className="top-0 left-0 absolute bg-gradient-to-r from-[#234C6A] via-[#D2C1B6] to-[#96A78D] rounded-full h-full"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              viewport={{ once: true }}
            />

            <motion.div
              className="-top-1.5 absolute bg-gradient-to-br from-[#234C6A] to-[#2E5A7A] shadow-[#234C6A]/30 shadow-lg rounded-full w-4 h-4"
              initial={{ left: "25%" }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(35, 76, 106, 0)",
                  "0 0 0 10px rgba(35, 76, 106, 0.3)",
                  "0 0 0 0 rgba(35, 76, 106, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <motion.div
              className="-top-1.5 absolute bg-gradient-to-br from-[#D2C1B6] to-[#B8A79C] shadow-[#D2C1B6]/30 shadow-lg rounded-full w-4 h-4"
              initial={{ left: "50%" }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(210, 193, 182, 0)",
                  "0 0 0 10px rgba(210, 193, 182, 0.3)",
                  "0 0 0 0 rgba(210, 193, 182, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.3,
              }}
            />
            <motion.div
              className="-top-1.5 absolute bg-gradient-to-br from-[#96A78D] to-[#7E9175] shadow-[#96A78D]/30 shadow-lg rounded-full w-4 h-4"
              initial={{ left: "75%" }}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(150, 167, 141, 0)",
                  "0 0 0 10px rgba(150, 167, 141, 0.3)",
                  "0 0 0 0 rgba(150, 167, 141, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.6,
              }}
            />
          </div>

          <div className="gap-8 lg:gap-8 grid lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative"
              >
                <div className="-top-4 lg:top-1/2 lg:-right-12 left-1/2 lg:left-auto z-20 absolute -translate-x-1/2 lg:-translate-y-1/2 lg:translate-x-0">
                  <div
                    className={`relative ${step.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span className="z-10 relative">{step.id}</span>
                    <div
                      className={`absolute inset-0 ${step.color} rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
                    ></div>
                  </div>
                </div>

                <div className="relative bg-white shadow-2xl hover:shadow-3xl p-8 border border-[#D2C1B6]/20 rounded-3xl h-full overflow-hidden transition-all group-hover:-translate-y-2 duration-500">
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  <div className="top-4 right-4 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Sparkles className="w-5 h-5 text-[#D2C1B6]" />
                  </div>

                  <div className="z-10 relative flex items-start gap-5 mb-8">
                    <div
                      className={`relative ${step.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      {step.icon}
                      <div
                        className={`absolute inset-0 ${step.color} rounded-2xl blur-md opacity-50`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-[#234C6A] text-2xl">
                          {step.title}
                        </h3>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.3 + 0.5 }}
                          className="hidden group-hover:block"
                        >
                          <ArrowRight className="w-5 h-5 text-[#D2C1B6] group-hover:text-[#234C6A] transition-colors duration-300" />
                        </motion.div>
                      </div>
                      <p className="text-[#2E5A7A] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div className="z-10 relative mb-8">
                    <div className="relative bg-gradient-to-br from-white to-[#F5F0EB]/50 backdrop-blur-sm p-6 border-[#F5F0EB] border-2 group-hover:border-[#234C6A]/20 rounded-2xl overflow-hidden transition-all duration-500">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}
                      ></div>

                      <div className="relative space-y-5">
                        <div>
                          <h4 className="mb-2 font-bold text-[#234C6A] text-lg">
                            {step.previewDetails.title}
                          </h4>
                          <p className="flex items-center gap-2 text-[#2E5A7A] text-sm">
                            {step.id === 1 && (
                              <MapPin className="w-4 h-4 text-[#234C6A]" />
                            )}
                            {step.id === 2 && (
                              <Star className="w-4 h-4 text-[#D2C1B6]" />
                            )}
                            {step.id === 3 && (
                              <CheckCircle className="w-4 h-4 text-[#96A78D]" />
                            )}
                            {step.previewDetails.subtitle}
                          </p>
                        </div>

                        <div className="gap-4 grid grid-cols-3 py-3 border-[#F5F0EB] border-y">
                          {step.previewDetails.participants && (
                            <div className="text-center">
                              <div className="flex justify-center items-center gap-2">
                                <Users className="w-4 h-4 text-[#D2C1B6]" />
                                <span className="font-bold text-[#234C6A] text-lg">
                                  {step.previewDetails.participants.current}/
                                  {step.previewDetails.participants.max}
                                </span>
                              </div>
                              <div className="mt-1 text-[#2E5A7A] text-xs">
                                Participants
                              </div>
                            </div>
                          )}

                          {step.previewDetails.hostRating && (
                            <div className="text-center">
                              <div className="flex justify-center items-center gap-2">
                                <Star className="fill-current w-4 h-4 text-[#9C6A50]" />
                                <span className="font-bold text-[#234C6A] text-lg">
                                  {step.previewDetails.hostRating}
                                </span>
                              </div>
                              <div className="mt-1 text-[#2E5A7A] text-xs">
                                Host Rating
                              </div>
                            </div>
                          )}

                          {step.previewDetails.price && (
                            <div className="text-center">
                              <div className="flex justify-center items-center gap-2">
                                <Ticket className="w-4 h-4 text-[#D2C1B6]" />
                                <span className="font-bold text-[#234C6A] text-lg">
                                  {step.previewDetails.price}
                                </span>
                              </div>
                              <div className="mt-1 text-[#2E5A7A] text-xs">
                                Price
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {step.previewDetails.tags.map((tag, idx) => (
                            <motion.span
                              key={idx}
                              initial={{ scale: 0.9, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white shadow-sm px-3 py-1.5 border border-[#F5F0EB] hover:border-[#234C6A]/30 rounded-full font-medium text-[#234C6A] hover:text-[#234C6A] text-xs hover:scale-105 transition-all duration-200"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-[#F5F0EB] border-t">
                    <ul className="space-y-3">
                      {step.id === 1 && (
                        <>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#234C6A] text-sm transition-all duration-200"
                          >
                            <Search className="mr-3 w-4 h-4 text-[#234C6A] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Advanced filtering by interest & location
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#234C6A] text-sm transition-all duration-200"
                          >
                            <Heart className="mr-3 w-4 h-4 text-[#D2C1B6] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Save events for later
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#234C6A] text-sm transition-all duration-200"
                          >
                            <Globe className="mr-3 w-4 h-4 text-[#96A78D] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">Interactive map view</span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                        </>
                      )}
                      {step.id === 2 && (
                        <>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#D2C1B6] text-sm transition-all duration-200"
                          >
                            <Shield className="mr-3 w-4 h-4 text-[#D2C1B6] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Verified host profiles
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#D2C1B6] text-sm transition-all duration-200"
                          >
                            <Ticket className="mr-3 w-4 h-4 text-[#9C6A50] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Secure payment processing
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#D2C1B6] text-sm transition-all duration-200"
                          >
                            <MessageCircle className="mr-3 w-4 h-4 text-[#D2C1B6] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Direct messaging with hosts
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                        </>
                      )}
                      {step.id === 3 && (
                        <>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#96A78D] text-sm transition-all duration-200"
                          >
                            <Award className="mr-3 w-4 h-4 text-[#96A78D] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">
                              Safety-first guidelines
                            </span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#96A78D] text-sm transition-all duration-200"
                          >
                            <Users className="mr-3 w-4 h-4 text-[#96A78D] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">Pre-event group chat</span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                          <motion.li
                            whileHover={{ x: 5 }}
                            className="group/item flex items-center text-[#2E5A7A] hover:text-[#96A78D] text-sm transition-all duration-200"
                          >
                            <Clock className="mr-3 w-4 h-4 text-[#96A78D] group-hover/item:scale-110 transition-transform" />
                            <span className="flex-1">Real-time updates</span>
                            <ChevronRight className="opacity-0 group-hover/item:opacity-100 w-4 h-4 transition-opacity" />
                          </motion.li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;