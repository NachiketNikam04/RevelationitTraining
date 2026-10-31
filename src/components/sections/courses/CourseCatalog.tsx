"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import {
  Search,
  Star,
} from "lucide-react";
import { CourseCard, CourseCardProps } from "@/components/ui/CourseCard";

const DEFAULT_COURSES: CourseCardProps[] = [
  {
    slug: "software-testing-bootcamp",
    category: "Software Testing & Automation",
    title: "Software Testing (Manual + Automation SDET)",
    short_description:
      "Master manual testing, Java, Selenium, and API testing. Go from absolute beginner to job-ready QA Automation Engineer with live corporate projects and interview prep.",
    card_image_url:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    placement_guarantee: "100% Placement Guarantee",
    duration_mode: "3 Months • Live Online",
    tech_stack: [
      "Java",
      "Selenium 4",
      "Postman API",
      "CI/CD Jenkins",
      "TestNG",
      "Jira Agile",
    ],
    card_features: [
      "Live Corporate Projects",
      "1-on-1 Mock Interviews",
      "Resume & ATS Optimization",
      "Dedicated Placement Cell",
    ],
  },
];

// =========================================================================
// Reusable Animated Counter Component
// =========================================================================
const Counter = ({ from = 0, to, decimals = 0, suffix = "" }: { from?: number, to: number, decimals?: number, suffix?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(from);

  useEffect(() => {
    if (inView) {
      animate(count, to, { 
        duration: 2, // 2 seconds to finish counting
        ease: "easeOut" 
      });
    }
  }, [count, inView, to]);

  // Formats the rolling number to keep the correct decimal places and appends the suffix
  const display = useTransform(count, (latest) => latest.toFixed(decimals) + suffix);

  return <motion.span ref={ref}>{display}</motion.span>;
};

// =========================================================================
// Main Course Catalog Component
// =========================================================================
export function CourseCatalog() {
  const [courses, setCourses] = useState<CourseCardProps[]>(DEFAULT_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Courses", active: true },
    { id: "qa", label: "Software Testing", active: true },
    { id: "dev", label: "Full Stack Dev (Soon)", active: false },
    { id: "cloud", label: "Cloud & DevOps (Soon)", active: false },
    { id: "data", label: "AI & Data (Soon)", active: false },
  ];

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
            setCourses(data.courses);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses for catalog:", error);
      }
    }

    fetchCourses();
  }, []);

  // Filter courses based on search query and category
  const filteredCourses = courses.filter((course) => {
    const titleStr = course.title || "";
    const descStr = course.short_description || "";
    const catStr = course.category || "";
    const techArr = Array.isArray(course.tech_stack)
      ? course.tech_stack
      : typeof course.tech_stack === "string"
      ? [course.tech_stack]
      : [];

    const matchesSearch =
      !searchQuery.trim() ||
      titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      catStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      techArr.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "qa" &&
        (catStr.toLowerCase().includes("testing") ||
          catStr.toLowerCase().includes("qa") ||
          titleStr.toLowerCase().includes("testing")));

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. Page Header & Stats Banner */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-blue/5 blur-3xl rounded-full pointer-events-none -z-0" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-brand-orange/5 blur-3xl rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            <span>EXPERT IT COURSES</span>
          </div>

          <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
            Launch your career in IT with <span className="text-brand-blue">Industry-led</span> Training.
          </h1>

          <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] max-w-2xl mx-auto mt-4">
            Hands-on software testing and automation programs designed to take
            you from fundamentals to high-paying placement offers.
          </p>

          {/* Floating Stats Bar */}
          <div className="mt-10 max-w-5xl mx-auto -mb-20 relative z-20">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 border border-gray-100/90 text-center">
              {/* Stat 1 */}
              <div className="py-4 sm:py-0 sm:px-6">
                <span className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark block tracking-tight">
                  <Counter to={100} suffix="%" />
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-muted mt-1 block">
                  Placement Support
                </span>
              </div>

              {/* Stat 2 */}
              <div className="py-4 sm:py-0 sm:px-6">
                <span className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark block tracking-tight">
                  <Counter to={100} suffix="+" />
                </span>
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-muted mt-1 block">
                  Hiring Partners
                </span>
              </div>

              {/* Stat 3 */}
              <div className="py-4 sm:py-0 sm:px-6 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
                    <Counter to={5} decimals={1} suffix="/5" />
                  </span>
                  <Star className="w-5 h-5 fill-brand-orange text-brand-orange mb-1" />
                </div>
                <span className="text-[12px] font-bold uppercase tracking-wide text-brand-muted mt-1 block">
                  Average Student Rating
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. The Catalog Section (Horizontal Filters & Featured Course Card) */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Horizontal Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 md:mb-12">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, skills, tools..."
                className="bg-white border border-gray-200 rounded-full pl-11 pr-5 py-3 w-full text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-colors shadow-2xs"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              {categories.map((cat) => {
                const isSelected =
                  cat.id === "all" || cat.id === "qa"
                    ? selectedCategory === cat.id || selectedCategory === "all"
                    : false;

                if (!cat.active) {
                  return (
                    <button
                      key={cat.id}
                      disabled
                      className="bg-gray-100 text-gray-400 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold cursor-not-allowed opacity-60 border border-gray-200/60"
                    >
                      {cat.label}
                    </button>
                  );
                }

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                      isSelected
                        ? "bg-brand-dark text-white shadow-sm"
                        : "bg-white text-brand-dark hover:bg-gray-100 border border-gray-200/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. The Featured Course Card (Horizontal Spotlight) */}
          {/* ========================================================================= */}
          {filteredCourses.length > 0 ? (
            <div className="space-y-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id || course.slug} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-brand-dark">
                No matching courses found
              </h3>
              <p className="text-brand-muted text-sm mt-2">
                Try searching for &quot;Software Testing&quot;, &quot;Selenium&quot;, or &quot;Java&quot;.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 px-5 py-2 bg-brand-dark text-white text-xs font-semibold rounded-full cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}