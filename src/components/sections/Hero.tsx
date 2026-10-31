"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, Star, MessageSquare } from "lucide-react";
import { InteractiveGrid } from "@/components/ui/InteractiveGrid";

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Interactive RiT Grid Animation */}
      <InteractiveGrid />

      {/* Central Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center pointer-events-none">
        <div className="relative z-10 max-w-4xl mx-auto pointer-events-auto">
          <div className="absolute inset-0 -z-10 bg-white/95 blur-[80px] rounded-full scale-[1.3] pointer-events-none"></div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Top Pill Badge */}
            <motion.div variants={itemVariants} className="mb-6 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-dark text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em] bg-white/80 backdrop-blur-xs rounded-full border border-gray-200/60 shadow-2xs">
                <span className="font-semibold text-brand-orange">100% Placement Support</span>
                <span className="text-brand-muted hidden sm:inline">&bull; Best Training in Software Testing</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[48px] md:text-[64px] font-black leading-[1.1] tracking-tight text-brand-dark pointer-events-auto select-none"
            >
              Master Software Testing &amp; Secure Your{" "}
              <span className="text-brand-blue relative inline-block whitespace-nowrap">
                Dream IT Job
                {/* Decorative subtle underline stroke */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-brand-blue/35 pointer-events-none"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl text-[16px] md:text-[18px] font-normal leading-[1.7] text-brand-muted pointer-events-auto select-none"
            >
              The Software Industry needs guardians of Quality. Your QA career starts here. Learn from QA experts and enhance your expertise at your own
              pace.
            </motion.p>

            {/* Call-to-Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto pointer-events-auto"
            >
              {/* Primary Pill Button */}
              <Link
                href="/courses"
                className="relative overflow-hidden group flex items-center justify-between gap-4 rounded-full pl-8 pr-2 py-2 bg-brand-orange border border-brand-orange shadow-lg shadow-brand-orange/30 hover:shadow-xl hover:shadow-brand-orange/40 active:scale-[0.98] transition-all duration-300 w-full sm:w-auto cursor-pointer"
              >
                {/* Expanding Hover Background */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.3,1,0.8,1)] group-hover:scale-[25] z-0 pointer-events-none" />

                {/* Button Text */}
                <span className="relative z-10 font-semibold text-base text-white group-hover:text-brand-orange transition-colors duration-300 whitespace-nowrap">
                  Explore Courses
                </span>

                {/* Icon Container */}
                <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full">
                  <ArrowRight className="w-4 h-4 text-brand-orange transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>

              {/* Secondary Outline Pill Button */}
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/80 backdrop-blur-xs border-2 border-brand-dark/85 text-brand-dark font-semibold text-base hover:bg-brand-dark hover:text-white active:scale-[0.98] transition-all duration-200 group shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 transition-colors group-hover:text-white" />
                <span>Contact Us</span>
              </Link>
            </motion.div>

            {/* Trust Metrics Sub-bar */}
            <motion.div
              variants={itemVariants}
              className="mt-10 pt-6 border-t border-brand-dark/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[15px] md:text-[16px] font-normal text-brand-muted pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Real-time Live Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1-on-1 Mock Interviews</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-brand-dark">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="ml-1 font-semibold">5/5</span>
                <span className="text-brand-muted font-normal">(100+ Reviews)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
