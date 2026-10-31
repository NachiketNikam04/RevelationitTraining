"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function CTA() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate values relative to center (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth damping on parallax layers
  const springConfig1 = { stiffness: 120, damping: 18 };
  const springConfig2 = { stiffness: 90, damping: 22 };
  const springConfig3 = { stiffness: 70, damping: 26 };

  // Parallax shifts in opposite direction of mouse
  const letterQX = useSpring(useTransform(mouseX, [-0.5, 0.5], [40, -40]), springConfig1);
  const letterQY = useSpring(useTransform(mouseY, [-0.5, 0.5], [40, -40]), springConfig1);

  const letterAX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), springConfig2);
  const letterAY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-35, 35]), springConfig2);

  const shapeX = useSpring(useTransform(mouseX, [-0.5, 0.5], [50, -50]), springConfig3);
  const shapeY = useSpring(useTransform(mouseY, [-0.5, 0.5], [50, -50]), springConfig3);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section id="contact" className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 bg-transparent relative">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-[2.5rem] overflow-hidden py-12 md:py-16 px-6 md:px-12 min-h-[420px] lg:min-h-[460px] flex items-center bg-gradient-to-br from-[#1E3A8A] via-brand-blue to-[#0fa8d6] shadow-2xl shadow-brand-blue/30 select-none group"
      >
        {/* Ambient subtle glow flares */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/15 blur-3xl rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#1E3A8A]/30 blur-2xl rounded-full pointer-events-none -z-0" />

        {/* Parallax Layer 1: Giant Letter "Q" */}
        <motion.div
          style={{ x: letterAX, y: letterAY }}
          className="absolute right-32 sm:right-56 lg:right-64 -bottom-4 text-[200px] sm:text-[260px] lg:text-[300px] font-heading font-black text-white/10 select-none pointer-events-none leading-none z-0"
        >
          R
        </motion.div>

        {/* Parallax Layer 2: Letter "i" (Middle) */}
        <motion.div
          style={{ x: shapeX, y: shapeY }}
          className="absolute right-20 sm:right-32 lg:right-40 top-1/2 -translate-y-1/2 text-[220px] sm:text-[280px] lg:text-[340px] font-heading font-black text-white/10 select-none pointer-events-none leading-none z-0 hidden md:block"
        >
          i
        </motion.div>

        {/* Parallax Layer 3: Letter "T" (Right) */}
        <motion.div
          style={{ x: letterQX, y: letterQY }}
          className="absolute -right-4 -top-8 text-[220px] sm:text-[280px] lg:text-[340px] font-heading font-black text-white/10 select-none pointer-events-none leading-none z-0"
        >
          T
        </motion.div>

        {/* Content (Left Aligned, z-index 10) */}
        <div className="relative z-10 max-w-xl">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            <span>REVELATION IT TRAINING AND PLACEMENT</span>
          </div>

          {/* Title */}
          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-white mt-6 max-w-xl tracking-tight">
            Let&apos;s launch your IT career today.
          </h2>

          {/* Subtitle */}
          <p className="text-white/90 mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] max-w-lg">
            Master software testing, build real projects, and secure your dream
            job.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            {/* Primary Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-dark text-white font-semibold text-sm sm:text-base hover:bg-black transition-all duration-200 shadow-xl shadow-black/20 hover:scale-105 active:scale-95 group/btn"
            >
              <span>Start learning</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </Link>

            {/* Secondary Button */}
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-full text-white font-semibold text-sm sm:text-base hover:text-white/80 transition-colors group/sec"
            >
              <span>View courses</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/sec:translate-x-0.5 group-hover/sec:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}