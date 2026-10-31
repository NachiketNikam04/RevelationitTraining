"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import Award01Icon from "@hugeicons/core-free-icons/Award01Icon";

const checklistItems = [
  "Industry-Grade Curriculum",
  "Live Mock Interviews",
  "Real Corporate Domain Projects",
  "Dedicated Placement Cell",
];

export function AboutUs() {
  return (
    <section id="about" className="bg-brand-bg py-12 md:py-20 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-brand-blue/5 blur-3xl rounded-full pointer-events-none -z-0" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: Visuals (Slide in from Left) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Image Wrapper */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-brand-dark/5 group">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
                alt="Students collaborating at Revelation IT Training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="absolute -bottom-6 -right-3 sm:-bottom-6 sm:-right-6 md:bottom-8 md:-right-8 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 z-10"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange shadow-xs flex-shrink-0">
                <HugeiconsIcon icon={Award01Icon} size={26} />
              </div>
              <div>
                <span className="font-bold text-brand-dark text-[16px] block leading-tight">
                  100% Placement
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-muted mt-0.5 block">
                  Track Record
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: The Narrative (Slide in from Right) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>ABOUT REVELATION IT</span>
            </div>

            {/* Main Title */}
            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              Shaping the next generation of <span className="text-brand-blue">Software Testing</span> and <span className="text-brand-blue">Automation QA Experts</span>.
            </h2>

            {/* Paragraphs */}
            <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4">
              We go beyond traditional textbook learning. At Revelation IT
              Training, our mission is to bridge the gap between academic knowledge
              and real world corporate demands.
            </p>

            <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4">
              Learn from industry experts, we provide a rigorous, hands-on
              environment where you work on live projects, master modern testing
              frameworks, and prepare for guaranteed career success.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-brand-dark/8">
              {checklistItems.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                  </div>
                  <span className="text-[15px] md:text-[16px] font-normal text-brand-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-dark text-white font-semibold text-sm sm:text-base hover:bg-black transition-all duration-200 shadow-md shadow-brand-dark/10 active:scale-95 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}