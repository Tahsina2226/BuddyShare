import React from "react";

interface GuideStep {
  id: number;
  title: string;
  description: string;
  emoji: string;
  details: string[];
}

const FirstTimeUserGuide = () => {
  const steps: GuideStep[] = [
    {
      id: 1,
      title: "Complete Your Profile",
      description:
        "Get personalized recommendations tailored to your interests",
      emoji: "👤",
      details: [
        "Add your interests",
        "Upload profile photo",
        "Set preferences",
        "Enable notifications",
      ],
    },
    {
      id: 2,
      title: "Discover Activities",
      description: "Browse events that match your passions and schedule",
      emoji: "🔍",
      details: [
        "Use smart filters",
        "Save favorites",
        "View locations",
        "Check availability",
      ],
    },
    {
      id: 3,
      title: "Join Your First Event",
      description: "Simple, secure booking with just a few clicks",
      emoji: "🎯",
      details: [
        "Select time slot",
        "Secure payment",
        "Confirm booking",
        "Get reminders",
      ],
    },
    {
      id: 4,
      title: "Share Your Experience",
      description: "Help others find amazing experiences",
      emoji: "⭐",
      details: [
        "Leave reviews",
        "Rate hosts",
        "Share photos",
        "Invite friends",
      ],
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0EB]/20 via-transparent to-[#F5F0EB]/10 pointer-events-none">
        <div className="top-0 left-1/4 absolute bg-[#234C6A]/5 blur-3xl rounded-full w-80 h-80"></div>
        <div className="right-1/4 bottom-0 absolute bg-[#96A78D]/5 blur-3xl rounded-full w-80 h-80"></div>
      </div>

      <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#234C6A]/10 to-[#96A78D]/10 backdrop-blur-sm mb-6 px-6 py-3 border border-[#D2C1B6]/20 rounded-full">
            <span className="text-lg">🚀</span>
            <span className="font-semibold text-[#234C6A] text-sm uppercase tracking-wide">
              Get Started Guide
            </span>
          </div>

          <h2 className="mb-6 font-bold text-gray-900 text-4xl md:text-5xl lg:text-6xl tracking-tight">
            Your Journey to{" "}
            <span className="bg-clip-text bg-gradient-to-r from-[#234C6A] via-[#2E5A7A] to-[#96A78D] text-transparent">
              Amazing Experiences
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-[#2E5A7A] text-lg md:text-xl leading-relaxed">
            Follow these simple steps to unlock a world of social adventures,
            meaningful connections, and unforgettable memories with our
            community.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative mb-20">
          {/* Desktop Connection Line */}
          <div className="hidden lg:block top-1/2 right-0 left-0 absolute bg-gradient-to-r from-[#234C6A]/20 via-[#D2C1B6]/20 to-[#96A78D]/20 rounded-full h-1 -translate-y-1/2">
            <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] via-[#D2C1B6] to-[#96A78D] rounded-full w-full h-full"></div>

            {/* Animated Progress Dots */}
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="top-1/2 absolute bg-white shadow-lg border-[#234C6A] border-2 rounded-full w-4 h-4 -translate-y-1/2 transform"
                style={{ left: `${index * 33.33 + 12.5}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#234C6A] to-[#96A78D] opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Steps Grid */}
          <div className="relative gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="group relative">
                {/* Step Card */}
                <div className="relative bg-white/80 shadow-xl hover:shadow-2xl backdrop-blur-sm p-8 border border-[#D2C1B6]/20 rounded-2xl h-full overflow-hidden transition-all hover:-translate-y-2 duration-500">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#234C6A]/5 via-transparent to-[#96A78D]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Step Header */}
                  <div className="relative mb-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative">
                        {/* Step Number */}
                        <div className="z-10 relative flex justify-center items-center bg-gradient-to-br from-[#234C6A] to-[#96A78D] shadow-lg rounded-xl w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                          <span className="font-bold text-white text-xl">
                            {step.id}
                          </span>
                        </div>

                        {/* Pulse Animation */}
                        <div className="absolute inset-0 border-[#234C6A]/30 border-2 rounded-xl w-12 h-12 animate-pulse"></div>
                      </div>

                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {step.emoji}
                      </span>
                    </div>

                    <h3 className="mb-3 font-bold text-[#234C6A] text-xl md:text-2xl leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-[#2E5A7A] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="relative space-y-3 mb-8">
                    {step.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="group/item flex items-center gap-3"
                      >
                        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-[#234C6A]/10 to-[#96A78D]/10 rounded-lg w-6 h-6 group-hover/item:scale-110 transition-transform duration-200">
                          <span className="font-bold text-[#234C6A] text-xs">
                            ✓
                          </span>
                        </div>
                        <span className="font-medium text-gray-700 group-hover/item:text-[#234C6A] text-sm transition-colors duration-200">
                          {detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="relative">
                    <button className="group/btn bg-gradient-to-r from-[#234C6A]/10 hover:from-[#234C6A]/20 to-[#96A78D]/10 hover:to-[#96A78D]/20 px-4 py-3 rounded-xl w-full font-medium text-[#234C6A] text-sm transition-all duration-300">
                      <span className="flex justify-center items-center gap-2">
                        {index === steps.length - 1
                          ? "Get Started"
                          : "Next Step"}
                        <span className="transition-transform group-hover/btn:translate-x-1">
                          →
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* Mobile Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden top-1/2 -right-4 absolute bg-gradient-to-r from-[#234C6A]/30 to-[#96A78D]/30 w-8 h-0.5"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Banner */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-white to-[#F5F0EB]/50 backdrop-blur-sm p-8 border border-[#D2C1B6]/30 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            <div className="relative gap-6 grid grid-cols-2 md:grid-cols-4">
              {[
                { value: "3 min", label: "Average Setup Time", emoji: "⚡" },
                { value: "95%", label: "User Satisfaction", emoji: "😊" },
                { value: "1-Click", label: "Event Booking", emoji: "🎫" },
                { value: "24/7", label: "Support Available", emoji: "🛡️" },
              ].map((stat, idx) => (
                <div key={idx} className="group text-center">
                  <div className="inline-flex justify-center items-center bg-gradient-to-br from-[#234C6A]/10 to-[#96A78D]/10 mb-4 rounded-xl w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl">{stat.emoji}</span>
                  </div>
                  <div className="mb-2 font-bold text-[#234C6A] text-2xl md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-[#2E5A7A] text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="relative mx-auto max-w-2xl">
            <div className="mb-8">
              <h3 className="mb-4 font-bold text-[#234C6A] text-2xl md:text-3xl">
                Ready to Begin Your Adventure?
              </h3>
              <p className="text-[#2E5A7A]">
                Join thousands who have found friendship, adventure, and
                unforgettable experiences
              </p>
            </div>

            <div className="flex sm:flex-row flex-col justify-center gap-4">
              <button className="group relative bg-gradient-to-r from-[#234C6A] via-[#2E5A7A] to-[#96A78D] hover:shadow-2xl px-8 py-4 rounded-xl overflow-hidden font-semibold text-white transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#234C6A] to-[#96A78D] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
                <span className="z-10 relative flex justify-center items-center gap-3">
                  <span>Create Your First Event</span>
                  <span className="transition-transform group-hover:translate-x-2">
                    ✨
                  </span>
                </span>
              </button>

              <button className="group bg-white hover:bg-[#F5F0EB] px-8 py-4 border border-[#D2C1B6] hover:border-[#B8A79C] rounded-xl font-semibold text-[#234C6A] transition-all duration-300">
                <span className="flex justify-center items-center gap-3">
                  <span>Find Activities</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-8 text-[#2E5A7A] text-sm">
              <p className="flex justify-center items-center gap-2">
                <span>✅</span>
                No credit card required • Free to join • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeUserGuide;
