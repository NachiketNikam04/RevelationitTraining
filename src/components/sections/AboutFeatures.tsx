"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export function AboutFeatures() {
  const qualityPills = [
    "Online Training",
    "Doubt Clear Session",
    "Live Interview and Job Support",
  ];

  const legacyFeatures = [
    {
      title: "Learn Anywhere",
      emoji: "🌍",
    },
    {
      title: "Expert Instructors",
      emoji: "👨‍🏫",
    },
    {
      title: "Recorded session access",
      emoji: "📹",
    },
    {
      title: "Job ready training.",
      emoji: "💼",
    },
  ];

  return (
    <section className="bg-brand-bg py-12 md:py-16 space-y-16 md:space-y-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* Block 1: "Quality Training" (Image Left, Text Right) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Visual (Slide in from Left) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-brand-dark/5 group">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80"
                alt="Interactive hybrid classroom training session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Decorative ambient glow */}
            <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-brand-blue/10 blur-3xl rounded-full pointer-events-none -z-10" />
          </motion.div>

          {/* Right: Content (Slide in from Right) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <span className="text-brand-orange uppercase tracking-[0.2em] text-[13px] md:text-[14px] font-bold mb-4 block">
              TRAINING EXCELLENCE
            </span>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark mb-4 tracking-tight">
              Providing the Best <span className="text-brand-blue">Quality</span> IT Training
            </h2>

            <p className="text-brand-muted mb-8 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              We are committed to empowering individuals with the skills needed
              to thrive in today&apos;s dynamic tech world. Whether launching
              your career or upgrading your QA skills, we tailor our programs to
              your needs.
            </p>

            {/* Feature Stack (The Pill List with left border accent) */}
            <div className="flex flex-col gap-4">
              {qualityPills.map((pill) => (
                <div
                  key={pill}
                  className="bg-white shadow-xs border border-gray-100 border-l-4 border-l-brand-blue rounded-r-full rounded-l-md px-6 py-4 flex items-center gap-4 transition-transform duration-300 hover:translate-x-2"
                >
                  <div className="text-brand-orange bg-brand-orange/10 p-1.5 rounded-full flex-shrink-0">
                    <Check className="w-4 h-4 text-brand-orange" strokeWidth={2.5} />
                  </div>
                  <span className="text-brand-dark font-bold text-[15px] md:text-[16px]">
                    {pill}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Block 2: "Legacy & Impact" (Text Left, Image Right) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Content (Slide in from Left, on mobile appears first) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 flex flex-col justify-center"
          >
            <span className="text-brand-orange uppercase tracking-[0.2em] text-[13px] md:text-[14px] font-bold mb-3 block">
              OUR HERITAGE
            </span>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark mb-4 tracking-tight">
              Preserving a Legacy Through{" "}
              <span className="text-brand-blue">Excellence</span>
            </h2>

            <p className="text-brand-muted mb-8 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              Preserving a proud heritage, our education serves as the bridge
              that carries traditional dedication forward while inspiring future
              generations of automation engineers.
            </p>

            {/* Feature Grid (2x2) */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              {legacyFeatures.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0 shadow-2xs">
                    <span className="text-xl leading-none">{item.emoji}</span>
                  </div>
                  <span className="text-[15px] md:text-[16px] font-bold text-brand-dark">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Enroll Now Button */}
            <div>
              <Link
                href="/courses/software-testing-bootcamp"
                className="bg-brand-blue text-white px-8 py-3.5 rounded-full hover:bg-blue-600 transition-all font-semibold shadow-md shadow-brand-blue/20 inline-flex items-center gap-2 group active:scale-95 text-sm sm:text-base"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right: Visual (Slide in from Right, Asymmetrical Border Radius) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            {/* Asymmetrical Custom Border Radius */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80"
                alt="Modern collaborative tech team in office"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/25 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Decorative ambient glow */}
            <div className="absolute -top-8 -right-8 w-72 h-72 bg-brand-orange/10 blur-3xl rounded-full pointer-events-none -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}