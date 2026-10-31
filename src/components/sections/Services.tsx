"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";

export interface ServiceItem {
  number: string;
  subLabel: string;
  title: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    number: "01.",
    subLabel: "Core Curriculum",
    title: "Training and Placement on QA",
    description:
      "Comprehensive Manual and Automation testing curriculum backed by our 100% placement assurance.",
  },
  {
    number: "02.",
    subLabel: "Interview Prep",
    title: "Live Interview Support",
    description:
      "Real time technical assistance and rigorous mock interviews to help you confidently clear any Technical, Managerial or HR round.",
  },
  {
    number: "03.",
    subLabel: "Career Branding",
    title: "Resume Building",
    description:
      "Craft a professional, ATS friendly resume tailored to highlight your software testing skills and attract top recruiters from IT Companies.",
  },
  {
    number: "04.",
    subLabel: "Post Offer Support",
    title: "Real Job Support",
    description:
      "Get on job assistance and practical project guidance from experienced industry experts once you land your role.",
  },
];

export function Services() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll specifically on the Outer Wrapper during pinning
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Map scroll progress (0 to 1) across the 300vh pinned duration to 4 indices (0, 1, 2, 3)
    const step = Math.min(Math.max(Math.floor(latest * 4), 0), 3);
    if (step !== activeIndex) {
      setActiveIndex(step);
    }
  });

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      {/* Sticky Inner Viewport Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-brand-bg overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-brand-blue/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (col-span-4 / col-span-5) */}
            <div className="lg:col-span-4 xl:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
                <span>OUR EXPERTISE</span>
              </div>

              <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
                Our Core <span className="text-brand-blue">Services</span>
              </h2>

              <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] leading-relaxed">
                We don&apos;t just teach. We listen, train, and build careers
                that actually move the needle.
              </p>

              {/* Interactive Scroll Step Indicators */}
              <div className="mt-8 flex items-center gap-3">
                {services.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Go to service ${idx + 1}`}
                    className="group flex items-center gap-2 text-xs font-semibold transition-all p-1"
                  >
                    <span
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? "w-8 bg-brand-dark"
                          : "w-2.5 bg-brand-dark/20 group-hover:bg-brand-dark/40"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-brand-muted font-mono ml-2">
                  0{activeIndex + 1} / 04
                </span>
              </div>
            </div>

            {/* Right Column (col-span-8 / col-span-7): 2x2 Grid */}
            <div className="lg:col-span-8 xl:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                {services.map((service, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={service.title}
                      onClick={() => setActiveIndex(index)}
                      className={`relative rounded-2xl min-h-[220px] sm:min-h-[240px] p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "shadow-2xl shadow-brand-dark/25"
                          : "bg-white/80 border border-brand-dark/8 shadow-xs hover:border-brand-dark/20 hover:bg-white"
                      }`}
                    >
                      {/* The Moving Black Highlight Card */}
                      {isActive && (
                        <motion.div
                          layoutId="activeServiceHighlight"
                          className="absolute inset-0 bg-brand-dark rounded-2xl z-0"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}

                      {/* Card Content (Relative z-10 above highlight) */}
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Top Header: Number and Sub-label */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-mono text-sm sm:text-base font-bold transition-colors duration-300 ${
                              isActive ? "text-brand-orange" : "text-brand-muted"
                            }`}
                          >
                            {service.number}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[12px] font-bold uppercase tracking-wide transition-colors duration-300 ${
                                isActive ? "text-gray-300" : "text-brand-muted/70"
                              }`}
                            >
                              {service.subLabel}
                            </span>
                            <ArrowUpRight
                              className={`w-3.5 h-3.5 transition-colors duration-300 ${
                                isActive ? "text-brand-orange" : "text-brand-dark/30"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3
                            className={`text-[22px] font-bold leading-[1.3] mb-2 mt-6 sm:mt-8 tracking-tight transition-colors duration-300 ${
                              isActive ? "text-white" : "text-brand-dark"
                            }`}
                          >
                            {service.title}
                          </h3>

                          <p
                            className={`text-[15px] md:text-[16px] font-normal leading-[1.6] mt-2 transition-colors duration-300 ${
                              isActive ? "text-gray-300" : "text-brand-muted"
                            }`}
                          >
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}