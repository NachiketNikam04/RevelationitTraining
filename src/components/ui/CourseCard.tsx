"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";

export interface CourseCardProps {
  id?: string | number;
  slug?: string;
  category?: string;
  title: string;
  short_description?: string;
  card_image_url?: string;
  placement_guarantee?: string;
  tech_stack?: string[] | string;
  card_features?: string[] | string;
  duration_mode?: string;
}

// Helper to safely parse JSON or array fields from database
function parseArrayField(field: string[] | string | undefined | null, fallback: string[] = []): string[] {
  if (!field) return fallback;
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return field.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return fallback;
}

export function CourseCard({
  slug = "software-testing-bootcamp",
  category = "Software Testing & Automation",
  title,
  short_description = "Master manual testing, Java, Selenium, and API testing. Go from absolute beginner to job-ready QA Automation Engineer with live corporate projects and interview prep.",
  card_image_url = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
  placement_guarantee = "100% Placement Guarantee",
  tech_stack,
  card_features,
  duration_mode = "3 Months • Live Online",
}: CourseCardProps) {
  const techPills = parseArrayField(tech_stack, [
    "Java",
    "Selenium 4",
    "Postman API",
    "CI/CD Jenkins",
    "TestNG",
    "Jira Agile",
  ]);

  const highlights = parseArrayField(card_features, [
    "Live Corporate Projects",
    "1-on-1 Mock Interviews",
    "Resume & ATS Optimization",
    "Dedicated Placement Cell",
  ]);

  const imageSrc =
    card_image_url && card_image_url.trim()
      ? card_image_url
      : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-100 rounded-[2rem] p-6 sm:p-8 lg:p-10 hover:shadow-2xl hover:border-brand-blue/30 transition-all duration-500 shadow-xl shadow-brand-dark/[0.04] w-full"
    >
      {/* Left Visual (col-span-12 lg:col-span-5) */}
      <div className="col-span-12 lg:col-span-5 relative">
        <div className="aspect-video lg:aspect-square rounded-2xl overflow-hidden relative shadow-md group border border-brand-dark/5">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent pointer-events-none" />

          {/* Static Best Seller Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-dark shadow-sm border border-brand-dark/5 flex items-center gap-1.5">
            <span>⭐</span>
            <span>Best Seller</span>
          </div>

          {/* Placement Guarantee Chip */}
          {placement_guarantee && (
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-white">
              {placement_guarantee}
            </div>
          )}
        </div>
      </div>

      {/* Right Content (col-span-12 lg:col-span-7 flex flex-col justify-center) */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
        {/* Category Eyebrow */}
        {category && (
          <span className="text-brand-blue text-[12px] font-bold uppercase tracking-wide">
            {category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-[28px] md:text-[32px] font-bold leading-[1.3] text-brand-dark mt-2 tracking-tight mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-brand-muted mt-3 text-[15px] md:text-[16px] font-normal leading-[1.6]">
          {short_description}
        </p>

        {/* Tech Stack Pills */}
        {techPills.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6">
            {techPills.map((tech) => (
              <span
                key={tech}
                className="bg-brand-bg border border-gray-200 text-brand-dark text-[12px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Highlights Checklist */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-200/50">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-[15px] md:text-[16px] font-normal text-brand-dark"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-8 border-t border-gray-200/60">
          <Link
            href={`/courses/${slug}`}
            className="bg-brand-orange text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#e06b24] hover:shadow-lg hover:shadow-brand-orange/25 transition-all text-sm sm:text-base inline-flex items-center gap-2 group active:scale-95 shadow-sm"
          >
            <span>View Full Syllabus</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          {duration_mode && (
            <div className="text-brand-dark font-bold text-sm sm:text-base ml-auto flex items-center gap-2 bg-brand-bg px-4 py-2 rounded-full border border-gray-200/70 shadow-2xs">
              <Clock className="w-4 h-4 text-brand-blue" />
              <span>{duration_mode}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CourseCard;
