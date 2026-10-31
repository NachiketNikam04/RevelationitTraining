"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

export function AboutHero() {
  return (
    <section className="bg-brand-bg pt-28 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column: The Narrative (Text) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            {/* Eyebrow */}
            <span className="text-brand-orange uppercase tracking-[0.2em] text-[13px] md:text-[14px] font-bold mb-4 block">
              ABOUT US
            </span>

            {/* Main Title */}
            <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              Empowering the next <span className="text-brand-blue">Generation</span> of IT professionals.
            </h1>

            {/* Description */}
            <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4">
              At Revelation IT Training, we bridge the gap between academic education and real-world tech industry demands. 
              Founded with a mission to build practical, job ready expertise, we deliver hands-on, mentor led training across high demand domains including software development, testing, and modern digital tools. 
              Our curriculum blends immersive, project-based learning with dedicated placement support and resume-building mentorship empowering students, graduates, and career changers to enter the IT workforce with confidence and measurable skills.
            </p>

            <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4">
              Our flagship Software Testing program is engineered to provide an end to end mastery of quality assurance, covering everything from core manual testing methodologies to creating automation framework confidently.
            </p>

            <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4">
              Beyond technical excellence, Revelation IT Training operates as a full spectrum career launchpad. we empower every candidate with rigorous mock technical interviews, personalized resume and LinkedIn profile optimization and dedicated placement assistance. 
              By combining technical depth, real-time project experience, and unwavering post-training support, Revelation IT Training ensures you step into the competitive IT landscape not merely as a certified candidate, but as a confident, high-performing Quality Assurance engineer prepared to deliver immediate value from day one.      
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="bg-brand-blue text-white px-7 py-3.5 rounded-full font-bold hover:shadow-lg hover:shadow-brand-blue/25 hover:bg-[#0c8cb3] transition-all text-sm sm:text-base inline-flex items-center gap-2 group active:scale-95 shadow-xs"
              >
                <span>Join our mission</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: The Visual (Image) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Soft decorative blur blob behind the image wrapper */}
            <div className="-z-10 w-full h-full rounded-full absolute -top-8 -right-8 bg-brand-orange/10 blur-3xl pointer-events-none" />

            {/* Main Image Wrapper */}
            <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80"
                alt="Tech mentor guiding students at Revelation IT Training"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Trust Card overlapping bottom-left */}
            <div className="absolute -bottom-4 -left-3 sm:bottom-6 sm:-left-6 bg-white text-brand-dark p-4 sm:p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5 z-10">
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange flex-shrink-0 shadow-2xs">
                <Star className="w-5 h-5 fill-brand-orange text-brand-orange" />
              </div>
              <div>
                <span className="font-bold text-brand-dark text-[16px] block leading-tight">
                  10+ Years Industry Experience
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-muted mt-0.5 block">
                  Excellence in QA &amp; Automation
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}