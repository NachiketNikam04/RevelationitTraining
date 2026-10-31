"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Sparkles, Star, Users, CheckCircle, Award } from "lucide-react";

import { useState, useEffect } from "react";

const teachers = [
  {
    name: "Dr. Vikram Sethi",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
  },
  {
    name: "Aman Gupta",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
  },
  {
    name: "Meera Nair",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
  },
  {
    name: "David Chen",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
  },
];

interface CompanyItem {
  id?: number;
  name?: string;
  company_name?: string;
  logo_url?: string;
  iconText?: string;
  color?: string;
}

const fallbackCompanies: CompanyItem[] = [
  { name: "Google", iconText: "G", color: "text-blue-500" },
  { name: "Microsoft", iconText: "MS", color: "text-sky-600" },
  { name: "Amazon", iconText: "A", color: "text-amber-500" },
  { name: "Infosys", iconText: "INF", color: "text-blue-600" },
  { name: "Cognizant", iconText: "CTS", color: "text-teal-600" },
  { name: "Accenture", iconText: ">", color: "text-purple-600" },
  { name: "TCS", iconText: "TCS", color: "text-rose-600" },
  { name: "Wipro", iconText: "W", color: "text-emerald-600" },
];

export function Features() {
  const [dbCompanies, setDbCompanies] = useState<CompanyItem[]>([]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies", {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.companies) && data.companies.length > 0) {
          setDbCompanies(data.companies);
        }
      } catch (err) {
        console.error("Error fetching companies in Features:", err);
      }
    }
    fetchCompanies();
  }, []);

  const hasDb = dbCompanies.length > 0;
  let marqueeItems: CompanyItem[] = [];

  if (hasDb) {
    let repeated = [...dbCompanies];
    while (repeated.length < 16) {
      repeated = [...repeated, ...dbCompanies];
    }
    marqueeItems = [...repeated, ...repeated];
  } else {
    let repeated = [...fallbackCompanies];
    while (repeated.length < 16) {
      repeated = [...repeated, ...fallbackCompanies];
    }
    marqueeItems = [...repeated, ...repeated];
  }

  return (
    <section id="features" className="relative py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
          <span>Proven QA Mentorship Ecosystem</span>
        </div>
        <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
          Built for Fast-Track Careers in{" "}
          <span className="text-brand-blue">Software Testing</span>
        </h2>
        <p className="mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] text-brand-muted">
          Our curriculum is developed in collaborate with hiring managers and texting experts to bridge
          the gap between textbook QA concepts and industry level testing skill needs.
        </p>
      </div>

      {/* Bento Grid Container with Scroll Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
      >
        {/* Left Card: Student Studying (Full Height) */}
        <div className="relative group rounded-[28px] overflow-hidden border border-brand-dark/10 shadow-lg min-h-[440px] md:min-h-[520px] flex flex-col justify-between p-6 sm:p-8">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80"
            alt="Student studying in live lab"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="relative z-10 self-start">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-brand-dark text-[12px] font-bold uppercase tracking-wide shadow-xs">
              <Award className="w-3.5 h-3.5 text-brand-orange" />
              Enhance Skills
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 text-white mt-auto">
            <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-2">
              Work on Enterprise Grade Testing Frameworks
            </h3>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-gray-200">
              Learn end-to-end software testing skills including Manual and Automation, taking you from beginner concepts to job ready expertise.
            </p>
          </div>
        </div>

        {/* Middle Column (Stacked Cards) */}
        <div className="flex flex-col gap-6 lg:gap-8 justify-between">
          {/* Middle Top Card: Professional Teachers */}
          <div className="relative rounded-[28px] bg-brand-orange/10 border border-brand-orange/20 p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-xs hover:border-brand-orange/35 transition-all duration-300">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/15 text-brand-orange text-[12px] font-bold uppercase tracking-wide mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Industry Mentors</span>
              </div>
              <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-2">
                We have 40+ Professional Mentors
              </h3>
              <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-brand-muted">
                Learn directly from senior QA Architects and SDET Leads working
                in top tech multinationals.
              </p>
            </div>

            {/* Overlapping Avatars Cluster */}
            <div className="mt-6 flex items-center gap-3">
              <div className="text-xs">
                <p className="font-semibold text-brand-dark">Active Instructors</p>
                <p className="text-brand-muted">Avg 8+ Years Experience</p>
              </div>
            </div>
          </div>

          {/* Middle Bottom Card: Inspirational Quote */}
          <div className="relative rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-xs hover:border-emerald-500/35 transition-all duration-300">
            <Quote className="absolute -top-1 -right-1 w-16 h-16 text-emerald-500/15 pointer-events-none rotate-12" />

            <div className="relative z-10">
              <div className="flex items-center gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <blockquote className="text-[18px] md:text-[20px] font-bold text-brand-dark italic leading-snug">
                &ldquo;Believe in yourself, keep learning, keep patience, keep consistency and success will
                follow you.&rdquo;
              </blockquote>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-dark text-[15px] md:text-[16px]">
                  Aashish P.
                </p>
                <p className="text-xs text-brand-muted">
                  Lead SDET &bull; Ex-Avalara
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-500/15 px-3 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Industry Veteran
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Student on Tablet */}
        <div className="relative group rounded-[28px] overflow-hidden border border-brand-dark/10 shadow-lg min-h-[440px] md:min-h-[520px] flex flex-col justify-between p-6 sm:p-8">
          <Image
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80"
            alt="Student studying with tablet"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/40 to-transparent pointer-events-none" />

          {/* Top Pill Badge */}
          <div className="relative z-10 self-start">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-brand-dark text-[12px] font-bold uppercase tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              Hybrid & Flexible
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 text-white mt-auto">
            <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-2">
              Flexible Remote Learning, Live & Interactive            </h3>
            <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-gray-200">
              Choose between weekday tracks and weekend batches. Attend live virtual classes from home, backed by session recordings and 1-on-1 doubt clearing.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Logo Ticker Section */}
      <div className="mt-12 md:mt-16 pt-8 border-t border-brand-dark/10">
        <p className="text-[22px] font-bold uppercase tracking-wide text-brand-muted text-center mb-8">
          Candidate Placed in
        </p>

        {/* Infinite Horizontal Scrolling Marquee */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex items-center py-2">
            {marqueeItems.map((company, idx) => {
              const displayName = company.company_name || company.name || "Hiring Partner";
              const hasLogo = Boolean(company.logo_url);

              if (hasLogo) {
                return (
                  <div
                    key={`placed-company-${company.id || idx}-${idx}`}
                    className="flex items-center justify-center mx-6 md:mx-10 shrink-0 select-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={company.logo_url}
                      alt={displayName}
                      width={140}
                      height={56}
                      loading="lazy"
                      className="h-10 md:h-14 w-auto object-contain"
                      style={{ width: "auto" }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`${company.name}-${idx}`}
                  className="flex items-center justify-center mx-6 md:mx-10 shrink-0 select-none"
                >
                  <span className="text-base md:text-lg font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">
                    {displayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}