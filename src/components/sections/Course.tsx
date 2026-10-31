"use client";

import React, { useState, useEffect } from "react";
import { CourseCard, CourseCardProps } from "@/components/ui/CourseCard";

const DEFAULT_COURSE: CourseCardProps = {
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
};

export function Course() {
  const [courses, setCourses] = useState<CourseCardProps[]>([DEFAULT_COURSE]);

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
        console.error("Failed to fetch courses for homepage:", error);
      }
    }

    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      className="relative py-12 md:py-22 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
          <span>OUR FLAGSHIP PROGRAM</span>
        </div>
        <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
          Software Testing — <span className="text-brand-blue">Manual</span> and <span className="text-brand-blue">Automation</span>
        </h2>
        <p className="mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] text-brand-muted">
          An intensive, job-oriented curriculum engineered to take you from foundational QA concepts to designing modern enterprise automation test suites.
        </p>
      </div>

      {/* Featured Courses Container with Subtle Glow Backdrops */}
      <div className="relative">
        <div className="absolute -top-16 -left-16 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id || course.slug} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Course;