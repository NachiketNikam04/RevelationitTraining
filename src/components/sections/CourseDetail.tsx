"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { InteractiveGrid } from "@/components/ui/InteractiveGrid";
import { EnrollmentModal } from "@/components/ui/EnrollmentModal";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Laptop,
  Users,
  Award,
  Calendar,
  ChevronDown,
  ShieldCheck,
  Code2,
  FileText,
  Briefcase,
  Headphones,
  Check,
  Building2,
  GraduationCap,
  RefreshCw,
  QrCode,
  Send,
  PhoneCall,
  Download,
  X,
  Loader2,
} from "lucide-react";

// ==============================================================================
// 1. TypeScript Interface for Course NeonDB Schema
// ==============================================================================
export interface CourseData {
  id: number;
  slug: string;
  subject: string;
  title: string;
  short_description?: string;
  long_description: string;
  projects_count: string;
  accreditation_text: string;
  duration_mode: string;
  next_batch_text?: string;
  accelerate_heading?: string;
  accelerate_description?: string;
  accelerate_bullets?: string[];
  syllabus_pdf_url?: string;
  
  // Course Overview (Section 2)
  overview_eyebrow?: string;
  overview_heading?: string;
  overview_description?: string;
  tech_stack: string[];
  outcome_title?: string;
  outcome_text?: string;
  overview_image_url?: string;
  overview_badge_line1?: string;
  overview_badge_line2?: string;

  // Key Features (Section 3)
  advantages_eyebrow?: string;
  advantages_heading?: string;
  advantages_description?: string;
  six_key_features: {
    title: string;
    description: string;
    iconName: string;
    color: string;
  }[];

  // Target Audiences (Section 4A)
  pathways_eyebrow?: string;
  pathways_heading?: string;
  tailored_pathways: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    iconName: string;
  }[];

  // Comparison Table (Section 4B)
  comparison_eyebrow?: string;
  comparison_heading?: string;
  comparison_description?: string;
  comparison_table: {
    feature: string;
    revelation: string;
    others: string;
  }[];

  // Course Batches & Enrollment (Section 6)
  batches_eyebrow?: string;
  batches_heading?: string;
  batches_description?: string;
  batch_options?: {
    id: string;
    name: string;
    type: string;
    timing: string;
    duration: string;
    badge: string;
    popular?: boolean;
    description: string;
  }[];

  // Course Curriculum (Section 5)
  syllabus_eyebrow?: string;
  syllabus_heading?: string;
  syllabus_description?: string;
  curriculum: {
    number: string;
    title: string;
    duration: string;
    description: string;
    topics: string[];
  }[];

  // Guidance & Mentorship (Section 7)
  guidance_eyebrow?: string;
  guidance_title: string;
  guidance_description: string;
  // Certification Validation (Section 8)
  cert_eyebrow?: string;
  cert_heading: string;
  cert_description: string;
  cert_image_url?: string;
  cert_features: {
    title: string;
    desc: string;
  }[];
}

// ==============================================================================
// 2. Icon Mapper Utility
// ==============================================================================
const IconMapper = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.CheckCircle2;
  return <IconComponent className={className} />;
};

// ==============================================================================
// 3. Fallback / Default Course Data
// ==============================================================================
export const defaultCourseData: CourseData = {
  id: 1,
  slug: "software-testing-bootcamp",
  subject: "#1 RATED QA BOOTCAMP IN PUNE & ONLINE",
  title: "Complete Software Testing & Automation Bootcamp",
  short_description:
    "Master Manual Testing, Java, Selenium 4, and REST API testing to become a high-earning QA Automation Engineer in 3 months.",
  long_description:
    "Master Manual Testing, Java, Selenium 4, and REST API testing to become a high-earning QA Automation Engineer in 3 months. Includes 100% placement guarantee and live project coaching.",
  projects_count: "10+ Real-World",
  accreditation_text: "ISTQB Aligned",
  duration_mode: "3 Months (12 Wks)",
  next_batch_text: "Next Batch: Monday",
  accelerate_heading: "Accelerate Your QA Journey",
  accelerate_description:
    "Join 1,200+ graduates already working at leading IT giants and product startups across India.",
    accelerate_bullets: [
    "Live Interactive Mentorship",
    "Daily Doubt Clarification Labs",
    "1-on-1 Mock HR & Tech Drills",
    "Dedicated Placement Officer",
  ],
  overview_eyebrow: "COURSE OVERVIEW",
  overview_heading: "What you will learn & master.",
  overview_description:
    "Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one.",
  tech_stack: [
    "End-to-End Manual Testing & Agile Jira",
    "Core Java & Object-Oriented Architecture",
    "Selenium 4 WebDriver & Page Object Model",
    "REST API Automation with Postman & REST Assured",
    "TestNG Parallel Execution & Extent Reports",
    "Git, GitHub & Jenkins CI/CD Pipelines",
  ],
  outcome_title: "Outcome Guarantee:",
  outcome_text:
    "By the end of 12 weeks, you will be capable of building automated regression test suites from scratch, designing API tests, and confidently facing senior SDET technical interviews.",
  overview_image_url:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    overview_badge_line1: "120+ Hours",
  overview_badge_line2: "Hands-on QA Coding",
  advantages_eyebrow: "PROGRAM ADVANTAGES",
  advantages_heading: "Why this is India's most effective QA program.",
  advantages_description:
    "Everything you need to transform from beginner to corporate-ready QA engineer, all under one roof.",
  six_key_features: [
    {
      iconName: "Award",
      title: "100% Placement Guarantee",
      description:
        "Direct referrals to our 40+ hiring partners and unlimited interviews until you secure your offer letter.",
      color: "text-brand-orange",
    },
    {
      iconName: "Code2",
      title: "Live Real-World Projects",
      description:
        "Build test frameworks for actual live web apps, banking APIs, and e-commerce platforms.",
      color: "text-brand-blue",
    },
    {
      iconName: "Users",
      title: "Industry Expert Trainers",
      description:
        "Learn directly from senior SDETs and QA leads with 10+ years of tier-1 tech enterprise experience.",
      color: "text-emerald-600",
    },
    {
      iconName: "FileText",
      title: "Resume & LinkedIn Building",
      description:
        "ATS-optimized resumes, GitHub test portfolios, and personalized LinkedIn profiles to attract top recruiters.",
      color: "text-purple-600",
    },
    {
      iconName: "Briefcase",
      title: "Mock HR & Tech Interviews",
      description:
        "1-on-1 mock interviews, coding tests, and behavioral drills with instant constructive feedback.",
      color: "text-amber-600",
    },
    {
      iconName: "Headphones",
      title: "24/7 Lab & Doubt Access",
      description:
        "Round-the-clock code review assistance and dedicated discord/chat groups with mentors.",
      color: "text-rose-600",    },
  ],
  pathways_eyebrow: "WHO IS THIS COURSE FOR",
  pathways_heading: "Tailored pathways for your background.",
  tailored_pathways: [
    {
      iconName: "GraduationCap",
      badge: "Fast-Track Entry",
      title: "Recent Graduates",
      subtitle: "BE, B.Tech, BCA, MCA, B.Sc & M.Sc Students",
      description:
        "Break into the IT sector with high-demand automation skills that stand out among thousands of applicants. No prior corporate experience required.",
      highlights: [
        "Bridge the college-to-corporate skills gap",
        "Build a GitHub portfolio of real frameworks",
        "Guaranteed campus-equivalent placement support",
      ],
    },
    {
      iconName: "RefreshCw",
      badge: "Zero Coding Required",
      title: "Career Switchers",
      subtitle: "Non-IT & Support Professionals",
      description:
        "Transition smoothly from BPO, sales, operations, or non-technical domains into high-paying QA roles with structured, beginner-friendly Java coaching.",
      highlights: [
        "Step-by-step foundation from absolute zero",
        "Learn how to explain your career transition",
        "Salary jump of up to 150% into IT",
      ],
    },
    {
      iconName: "Building2",
      badge: "Skill & Salary Upgrade",
      title: "Manual QA Testers",
      subtitle: "Experienced Manual / Functional Testers",
      description:
        "Upgrade your technical profile from manual test execution to full-stack Automation SDET with Selenium, API testing, and CI/CD pipelines.",
      highlights: [
        "Transition from Manual to SDET / Lead QA",
        "Master Java, Selenium 4, and REST Assured",
        "Qualify for senior automation job profiles",
      ],    },
  ],
  comparison_eyebrow: "WHY CHOOSE US",
  comparison_heading: "The Revelation IT Difference.",
  comparison_description:
    "See why hundreds of learners choose our flagship bootcamp over traditional training centers.",
  comparison_table: [
    {
      feature: "Placement Commitment",
      revelation: "100% Placement Guarantee with direct corporate referrals",
      others: "Job notifications / forward resume only",
    },
    {
      feature: "Curriculum Modernity",
      revelation: "2026 Tech Stack (Selenium 4, REST Assured, Jenkins CI/CD)",
      others: "Outdated Selenium 2/3 and manual-heavy content",
    },
    {
      feature: "Mentorship Model",
      revelation: "1-on-1 personal code reviews & personalized coaching",
      others: "Crowded 100+ batches with generic video playback",
    },
    {
      feature: "Project Quality",
      revelation: "Enterprise Banking & E-Commerce Live Architectures",
      others: "Toy login pages and static demo forms",
    },
    {
      feature: "Mock Interview Drills",
      revelation: "Unlimited 1-on-1 technical & HR drill downs until hired",
      others: "1 single generic mock test",
    },
    {
      feature: "Post-Job Support",
      revelation: "Real-job technical guidance during your first 90 days",
      others: "Support ends immediately upon course completion",    },
  ],
  syllabus_eyebrow: "COMPREHENSIVE SYLLABUS",
  syllabus_heading: "Curriculum designed for the modern industry.",
  syllabus_description:
    "Click any module to inspect the detailed topic breakdown and hands-on projects.",
  syllabus_pdf_url: "",
  curriculum: [
    {
      number: "01",
      title: "Manual Testing Fundamentals & Agile QA",
      duration: "Weeks 1 - 3",
      description:
        "Master the complete software testing lifecycle, defect management, and corporate Agile Scrum practices from ground up.",
      topics: [
        "Software Development Life Cycle (SDLC) vs. Software Testing Life Cycle (STLC)",
        "Agile Scrum Framework: Sprint Planning, Daily Standups, Retrospectives",
        "Test Planning: Test Strategy, Test Scenarios & Comprehensive Test Case Writing",
        "Functional, Non-Functional, Regression, Smoke, Sanity & Boundary Value Testing",
        "Bug Lifecycle: Severity vs. Priority & Defect Management in Atlassian Jira",
        "Real-Time Project: End-to-end Test Suite Creation for an E-Commerce Platform",
      ],
    },
    {
      number: "02",
      title: "Core Java for QA & Automation Engineers",
      duration: "Weeks 4 - 6",
      description:
        "Designed specifically for beginners to build solid Object-Oriented Programming skills required for automation test scripting.",
      topics: [
        "Java Basics: JVM, JRE, JDK, Data Types, Control Statements & Loops",
        "OOPs Concepts: Inheritance, Polymorphism, Abstraction & Encapsulation",
        "Java Collections Framework: List, Set, Map, ArrayList, HashMap & Iterators",
        "Exception Handling, File I/O & Apache POI for Excel Test Data Reading",
        "String Manipulations, Regular Expressions & Memory Management",
        "Real-Time Project: Data Parsing & Automated Test Data Generation in Java",
      ],
    },
    {
      number: "03",
      title: "Selenium WebDriver 4 & Framework Architecture",
      duration: "Weeks 7 - 9",
      description:
        "Build enterprise-grade test automation frameworks using Selenium WebDriver, TestNG, and Page Object Model (POM).",
      topics: [
        "Selenium 4 Architecture, WebDriver API & Dynamic XPath/CSS Locators",
        "Handling Dynamic Waits, Alerts, Popups, Frames, Multi-Tabs & Action Chains",
        "TestNG Framework: Annotations, Assertions, DataProviders & Parallel Test Execution",
        "Page Object Model (POM) Design Pattern & Page Factory Implementation",
        "Data-Driven & Hybrid Framework Architecture from Scratch",
        "Real-Time Project: Hybrid Automation Suite with Extent Reports & Cross-Browser Grid",
      ],
    },
    {
      number: "04",
      title: "API Testing with Postman & REST Assured",
      duration: "Weeks 10 - 11",
      description:
        "Validate microservices and backend systems through manual API exploration and automated Java REST Assured test suites.",
      topics: [
        "Web Services & REST Architecture: HTTP Methods (GET, POST, PUT, DELETE) & Status Codes",
        "Postman: Environment Variables, Collections, Pre-request Scripts & Test Assertions",
        "REST Assured Library: BDD Syntax (given/when/then) & JSON Path Parsing",
        "Serialization & Deserialization with Jackson / GSON POJO Classes",
        "Authentication Mechanisms: Bearer Tokens, API Keys & OAuth 2.0",
        "Real-Time Project: Banking & Payment Gateway REST API Automated Regression Suite",
      ],
    },
    {
      number: "05",
      title: "CI/CD, Version Control & DevOps Integration",
      duration: "Week 12",
      description:
        "Integrate automated test suites into modern Continuous Integration / Continuous Deployment (CI/CD) pipelines.",
      topics: [
        "Git & GitHub: Branching Strategy, Commits, Pull Requests & Merge Conflict Resolution",
        "Maven Build Tool: Dependencies Management, plugins & pom.xml Optimization",
        "Jenkins CI/CD: Automated Trigger Jobs, Parameterized Builds & Scheduled Runs",
        "Allure Reporting & Automated Email / Slack Notification Webhooks",
        "ISTQB Certification Preparation & Real-Job Deployment Support",
        "Capstone Project: Full CI/CD Test Pipeline Execution with Live GitHub Triggers",
      ],
    },
  ],
    batches_eyebrow: "BATCH TIMINGS & ENROLLMENT",
  batches_heading: "Choose the batch that fits your schedule.",
  batches_description:
    "Flexible options for students, job seekers, and working professionals.",
  batch_options: [
    {
      id: "weekday-online",
      name: "Weekday Batch",
      type: "Live Online (Zoom)",
      timing: "Mon - Fri • 7:30 AM or 8:00 PM IST",
      duration: "3 Months (1.5 hrs/day)",
      badge: "Fastest Progression",
      popular: false,
      description:
        "Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days.",
    },
    {
      id: "weekend-online",
      name: "Weekend Batch",
      type: "Live Online (Zoom)",
      timing: "Sat & Sun • 10:00 AM - 1:30 PM IST",
      duration: "3.5 Months (3.5 hrs/day)",
      badge: "For Working Pros",
      popular: false,
      description:
        "Tailored for working professionals who want to upskill without disrupting their weekly work schedule.",
    },
    {
      id: "offline-pune",
      name: "Classroom Batch",
      type: "Offline Pune Campus",
      timing: "Mon - Fri • Morning / Afternoon Batches",
      duration: "3 Months • In-Person Labs",
      badge: "⭐ Popular in Pune",
      popular: true,
      description:
        "Hands-on lab training at our Pimpri-Chinchwad / Pune campus with direct face-to-face mentor instruction.",
    },
  ],
  guidance_eyebrow: "1-ON-1 CAREER GUIDANCE",
  guidance_title: "Not sure if Software Testing is right for you?",
  guidance_description:
    "Get a free 1-on-1 profile evaluation with our Chief QA Architect. We will review your background, assess your aptitude, and recommend the fastest roadmap to break into IT.",
  cert_eyebrow: "ACCREDITED & RECOGNIZED",
  cert_heading: "Industry-Recognized QA Certification.",
  cert_description:
    "Upon passing our capstone automation framework review and comprehensive mock technical panel, you receive a tamper-proof digital certificate that hiring managers instantly respect.",
  cert_image_url: "https://images.unsplash.com/photo-1589330694653-06def33cefca?w=1200",
  cert_features: [
    {
      title: "Verifiable Digital Credential",
      desc: "Includes a unique certificate ID and QR code for one-click verification by tech recruiters.",
    },
    {
      title: "ISTQB® Syllabus Alignment",
      desc: "Prepares you to ace the ISTQB Certified Tester Foundation Level (CTFL) exam on your first attempt.",
    },
    {
      title: "Direct LinkedIn & ATS Integration",
      desc: "Easily add the certificate to your LinkedIn profile and resume to stand out in corporate applicant pools.",
    },
  ],
};

// Batches Options
const batchOptions = [
  {
    id: "weekday-online",
    name: "Weekday Batch",
    type: "Live Online (Zoom)",
    timing: "Mon - Fri • 7:30 AM or 8:00 PM IST",
    duration: "3 Months (1.5 hrs/day)",
    badge: "Fastest Progression",
    description:
      "Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days.",
  },
  {
    id: "weekend-online",
    name: "Weekend Batch",
    type: "Live Online (Zoom)",
    timing: "Sat & Sun • 10:00 AM - 1:30 PM IST",
    duration: "3.5 Months (3.5 hrs/day)",
    badge: "For Working Pros",
    description:
      "Tailored for working professionals who want to upskill without disrupting their weekly work schedule.",
  },
  {
    id: "offline-pune",
    name: "Classroom Batch",
    type: "Offline Pune Campus",
    timing: "Mon - Fri • Morning / Afternoon Batches",
    duration: "3 Months • In-Person Labs",
    badge: "⭐ Popular in Pune",
    popular: true,
    description:
      "Hands-on lab training at our Pimpri-Chinchwad / Pune campus with direct face-to-face mentor instruction.",
  },
];

// ==============================================================================
// 4. CourseDetail Component
// ==============================================================================
export function CourseDetail({
  course = defaultCourseData,
}: {
  course?: CourseData;
}) {
  const batchesToRender = course.batch_options && course.batch_options.length > 0 ? course.batch_options : defaultCourseData.batch_options || [];
  const [activeModule, setActiveModule] = useState<number | null>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContext, setModalContext] = useState("");

  // Lead Generation Syllabus Download Modal State
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);
  const [syllabusLead, setSyllabusLead] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [isSubmittingSyllabusLead, setIsSubmittingSyllabusLead] = useState(false);
  const [syllabusLeadSuccess, setSyllabusLeadSuccess] = useState(false);
  const [syllabusLeadError, setSyllabusLeadError] = useState<string | null>(null);

  const handleSyllabusLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusLead.full_name || !syllabusLead.email || !syllabusLead.phone) {
      setSyllabusLeadError("Please complete all required fields.");
      return;
    }

    setIsSubmittingSyllabusLead(true);
    setSyllabusLeadError(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: syllabusLead.full_name,
          email: syllabusLead.email,
          phone: syllabusLead.phone,
          course_interest: `Syllabus Download - ${course.title}`,
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.inquiry)) {
        setSyllabusLeadSuccess(true);
        // Trigger the PDF download in a new tab
        if (course.syllabus_pdf_url) {
          window.open(course.syllabus_pdf_url, "_blank");
        }
      } else {
        setSyllabusLeadError(data.error || "Failed to submit. Please try again.");
      }
    } catch (err: any) {
      console.error("[SyllabusLead] Submission Error:", err);
      setSyllabusLeadError("Something went wrong. Please try again.");
    } finally {
      setIsSubmittingSyllabusLead(false);
    }
  };

  const bulletsToRender =
    course.accelerate_bullets && course.accelerate_bullets.length > 0
      ? course.accelerate_bullets
      : defaultCourseData.accelerate_bullets || [];

  return (
    <div className="w-full flex flex-col bg-brand-bg">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & BREADCRUMBS */}
      {/* ========================================================================= */}
      <section className="bg-brand-dark pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        {/* Interactive RiT Grid Background */}
        <InteractiveGrid />

        {/* Soft radial glow in top right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/15 blur-[120px] rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/10 blur-[100px] rounded-full pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto relative z-10 pointer-events-none">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="text-gray-400 text-xs sm:text-sm mb-6 flex items-center gap-2 flex-wrap pointer-events-auto"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link href="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <span>&gt;</span>
            <span className="text-brand-orange font-medium">
              {course.title}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8">
              <div className="bg-brand-dark/40 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
                  <span>{course.subject}</span>
                </div>

                {/* Title */}
                <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-white tracking-tight mt-2">
                  {course.title}
                </h1>

                {/* Subtitle / Long Description */}
                <p className="text-gray-300 text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4 max-w-3xl">
                  {course.long_description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mt-8 pointer-events-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setModalContext(course.title);
                      setIsModalOpen(true);
                    }}
                    className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-[#e06b24] hover:shadow-xl hover:shadow-brand-orange/30 transition-all text-sm sm:text-base inline-flex items-center gap-2 group active:scale-95 shadow-md cursor-pointer"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <a
                    href="#syllabus"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-4 rounded-full font-semibold transition-all text-sm sm:text-base inline-flex items-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
                  >
                    <span>Explore Curriculum</span>
                    <ChevronDown className="w-4 h-4" />
                  </a>
                </div>

                {/* Key Highlight Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-orange flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400 block">Placement</span>
                      <span className="text-[15px] md:text-[16px] font-bold text-white">100% Guarantee</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400 block">Duration</span>
                      <span className="text-[15px] md:text-[16px] font-bold text-white">
                        {course.duration_mode || "3 Months (12 Wks)"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400 block">Projects</span>
                      <span className="text-[15px] md:text-[16px] font-bold text-white">
                        {course.projects_count}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400 block">Accreditation</span>
                      <span className="text-[15px] md:text-[16px] font-bold text-white">
                        {course.accreditation_text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (4 cols) */}
            <div className="lg:col-span-4 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-orange bg-brand-orange/20 px-3 py-1 rounded-full">
                    Limited Seats
                  </span>
                  <span className="text-xs text-gray-300 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                    {course.next_batch_text || "Next Batch: Monday"}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white mb-2">
                  {course.accelerate_heading || "Accelerate Your QA Journey"}
                </h3>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  {course.accelerate_description ||
                    "Join 1,200+ graduates already working at leading IT giants and product startups across India."}
                </p>

                <div className="space-y-3 mb-6">
                  {bulletsToRender.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalContext(course.title);
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-brand-orange hover:bg-[#e06b24] text-white py-3.5 rounded-2xl font-bold text-center block text-sm shadow-lg shadow-brand-orange/25 transition-all cursor-pointer"
                >
                  Book Free Demo &amp; Syllabus
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. COURSE OVERVIEW (Image Right, Text Left) */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>COURSE OVERVIEW</span>
            </div>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
              What you will learn &amp; master.
            </h2>

            <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              Traditional college degrees and generic crash courses leave major
              gaps in practical QA skills. This bootcamp bridges that divide by
              immersing you in real corporate workflows, enterprise frameworks, and
              defect lifecycles from day one.
            </p>

            {/* Tech Stack List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {course.tech_stack?.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base font-semibold text-brand-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <p className="text-sm font-medium text-brand-muted leading-relaxed">
                <strong className="text-brand-dark">Outcome Guarantee:</strong> By
                the end of 12 weeks, you will be capable of building automated
                regression test suites from scratch, designing API tests, and
                confidently facing senior SDET technical interviews.
              </p>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-brand-dark/10 group">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80"
                alt="Code editor and automated testing suite in action"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Bottom Left */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-brand-dark/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-orange/15 flex items-center justify-center text-brand-orange font-bold">
                  ⚡
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-dark block">
                    120+ Hours
                  </span>
                  <span className="text-[11px] text-brand-muted block font-medium">
                    Hands-on QA Coding
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY FEATURES (Grid Layout) */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>{course.advantages_eyebrow || "PROGRAM ADVANTAGES"}</span>
            </div>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              {course.advantages_heading || "Why this is India's most effective QA program."}
            </h2>
            <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              {course.advantages_description ||
                "Everything you need to transform from beginner to corporate-ready QA engineer, all under one roof."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {course.six_key_features?.map((feat) => (
              <div
                key={feat.title}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 group shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-brand-bg border border-gray-100 flex items-center justify-center mb-6 shadow-2xs group-hover:scale-110 transition-transform">
                    <IconMapper name={feat.iconName} className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-brand-muted text-[15px] md:text-[16px] font-normal leading-[1.6]">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHO IS THIS FOR & THE REVELATION DIFFERENCE */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-20">
          {/* Section A: Target Audiences */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
                <span>{course.pathways_eyebrow || "WHO IS THIS COURSE FOR"}</span>
              </div>
              <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
                {course.pathways_heading || "Tailored pathways for your background."}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {course.tailored_pathways?.map((aud) => (
                <div
                  key={aud.title}
                  className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md hover:shadow-xl hover:border-brand-orange/30 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-dark border border-gray-100">
                        <IconMapper name={aud.iconName} className="w-6 h-6 text-brand-orange" />
                      </div>
                      <span className="text-[12px] font-bold uppercase tracking-wide text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
                        {aud.badge}
                      </span>
                    </div>

                    <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-1">
                      {aud.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-orange mt-1 mb-4">
                      {aud.subtitle}
                    </p>
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-brand-muted mb-6">
                      {aud.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-gray-100">
                      {aud.highlights?.filter(Boolean).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-dark">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: The Revelation Difference Comparison Table */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
                <span>{course.comparison_eyebrow || "WHY CHOOSE US"}</span>
              </div>
              <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
                {course.comparison_heading || "The Revelation IT Difference."}
              </h2>
              <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
                {course.comparison_description ||
                  "See why hundreds of learners choose our flagship bootcamp over traditional training centers."}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-brand-muted w-1/3">
                      Features &amp; Parameters
                    </th>
                    <th className="p-6 text-sm font-extrabold uppercase tracking-wider text-brand-orange bg-brand-orange/5 border-x border-brand-orange/20 w-1/3">
                      <span className="flex items-center gap-2">
                        <span>⭐ Revelation IT Training</span>
                      </span>
                    </th>
                    <th className="p-6 text-sm font-bold uppercase tracking-wider text-gray-400 w-1/3">
                      Other Institutes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm sm:text-base">
                  {course.comparison_table?.map((row) => (
                    <tr key={row.feature} className="hover:bg-gray-50/40 transition-colors">
                      <td className="p-6 font-bold text-brand-dark">
                        {row.feature}
                      </td>
                      <td className="p-6 font-semibold text-brand-dark bg-brand-orange/5 border-x border-brand-orange/20">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{row.revelation}</span>
                        </div>
                      </td>
                      <td className="p-6 text-brand-muted">
                        <div className="flex items-start gap-2.5">
                          <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{row.others}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DETAILED COURSE SYLLABUS (Accordion Component) */}
      {/* ========================================================================= */}
      <section id="syllabus" className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>{course.syllabus_eyebrow || "COMPREHENSIVE SYLLABUS"}</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              {course.syllabus_heading || "Curriculum designed for the modern industry."}
            </h2>
            <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              {course.syllabus_description ||
                "Click any module to inspect the detailed topic breakdown and hands-on projects."}
            </p>
          </div>

          <div className="space-y-4">
            {course.curriculum?.map((mod, idx) => {
              const isOpen = activeModule === idx;

              return (
                <div
                  key={mod.title || idx}
                  className={`rounded-3xl border transition-all duration-300 bg-white overflow-hidden ${
                    isOpen
                      ? "border-brand-orange shadow-lg ring-1 ring-brand-orange/20"
                      : "border-gray-200/80 shadow-xs hover:border-gray-300"
                  }`}
                >
                  {/* Module Header Bar */}
                  <button
                    type="button"
                    onClick={() => setActiveModule(isOpen ? null : idx)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-extrabold text-lg flex-shrink-0 transition-colors ${
                          isOpen
                            ? "bg-brand-orange text-white"
                            : "bg-brand-bg text-brand-dark border border-gray-200"
                        }`}
                      >
                        {mod.number}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                            {mod.duration}
                          </span>
                        </div>
                        <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark">
                          {mod.title}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "bg-brand-dark text-white rotate-180" : "bg-gray-100 text-brand-dark"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {/* Module Accordion Details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <div className="px-6 sm:px-7 pb-7 pt-2 border-t border-gray-100 text-sm sm:text-base">
                          <p className="text-brand-muted mb-4 text-[15px] md:text-[16px] font-normal leading-[1.6]">
                            {mod.description}
                          </p>

                          <div className="space-y-3">
                            {mod.topics?.map((topic) => (
                              <div key={topic} className="flex items-start gap-3">
                                <CheckCircle2 className="w-4 h-4 text-brand-orange flex-shrink-0 mt-1" />
                                <span className="text-brand-dark font-medium">{topic}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Download Full Syllabus PDF Button (Lead-Gated) */}
          {course.syllabus_pdf_url && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => {
                  setSyllabusLeadSuccess(false);
                  setSyllabusLeadError(null);
                  setIsSyllabusModalOpen(true);
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand-orange text-white rounded-full font-bold text-base hover:bg-[#e06b24] shadow-lg shadow-brand-orange/30 hover:shadow-xl active:scale-95 transition-all cursor-pointer group"
              >
                <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                <span>Download Full Syllabus PDF</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COURSE BATCHES & SCHEDULE */}
      {/* ========================================================================= */}
      <section id="batches" className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>{course.batches_eyebrow || "BATCH TIMINGS & ENROLLMENT"}</span>
            </div>
            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              {course.batches_heading || "Choose the batch that fits your schedule."}
            </h2>
            <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              {course.batches_description || "Flexible options for students, job seekers, and working professionals."}
            </p>
          </div>

          {/* Batches 3-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {batchesToRender.map((batch) => (
              <div
                key={batch.id}
                className={`bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  batch.popular
                    ? "border-2 border-brand-orange shadow-2xl ring-2 ring-brand-orange/20"
                    : "border border-gray-200 shadow-md hover:shadow-xl"
                }`}
              >
                {batch.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    {batch.badge}
                  </div>
                )}

                <div>
                  {!batch.popular && (
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full mb-3">
                      {batch.badge}
                    </span>
                  )}

                  <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-1">
                    {batch.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-muted mt-1">
                    {batch.type}
                  </p>

                  <div className="my-6 p-4 rounded-2xl bg-brand-bg border border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-dark">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      <span>{batch.timing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-muted">
                      <Calendar className="w-4 h-4 text-brand-blue" />
                      <span>{batch.duration}</span>
                    </div>
                  </div>

                  <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-brand-muted mb-6">
                    {batch.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setModalContext(`${course.title} - ${batch.name || 'Selected Batch'}`);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 cursor-pointer bg-brand-orange text-white hover:bg-[#e06b24] shadow-md shadow-brand-orange/25"
                >
                  Apply for This Batch
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. COURSE GUIDANCE & MENTORSHIP */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-4 sm:mx-6 lg:mx-auto my-10 md:my-12 bg-brand-dark rounded-[2.5rem] py-12 md:py-16 px-6 sm:px-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <Users className="w-10 h-10 text-brand-orange" />
          </div>

          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            {course.guidance_eyebrow || "1-ON-1 CAREER GUIDANCE"}
          </span>

          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-white tracking-tight mt-2">
            {course.guidance_title}
          </h2>

          <p className="text-gray-300 mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] max-w-2xl mx-auto">
            {course.guidance_description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={() => {
                setModalContext(`${course.title} - Consultation`);
                setIsModalOpen(true);
              }}
              className="bg-brand-orange text-white px-8 py-4 rounded-full font-bold hover:bg-[#e06b24] hover:shadow-xl hover:shadow-brand-orange/30 transition-all text-sm sm:text-base inline-flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <span>Book Free 1-on-1 Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://wa.me/917558339190?text=Hello%2C%20I%20would%20like%20to%20book%20a%20free%20career%20counseling%20session%20for%20the%20QA%20Bootcamp."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-4 rounded-full font-semibold transition-all text-sm sm:text-base inline-flex items-center gap-2 backdrop-blur-md"
            >
              <PhoneCall className="w-4 h-4 text-[#25D366]" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CERTIFICATION VALIDATION */}
      {/* ========================================================================= */}
      <section className="bg-brand-bg py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Certificate Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src={course.cert_image_url || "https://images.unsplash.com/photo-1589330694653-06def33cefca?w=1200"}
              alt="Course Certificate"
              className="object-cover"
              fill
            />
          </div>

          {/* Right: Text Information */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>{course.cert_eyebrow || "ACCREDITED & RECOGNIZED"}</span>
            </div>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
              {course.cert_heading}
            </h2>

            <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7]">
              {course.cert_description}
            </p>

            <div className="space-y-4 mt-8">
              {course.cert_features?.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[18px] font-bold text-brand-dark">
                      {item.title}
                    </h3>
                    <p className="text-[15px] md:text-[16px] font-normal leading-[1.6] text-brand-muted mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lead Generation Syllabus Download Modal */}
      <AnimatePresence>
        {isSyllabusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSyllabusModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 overflow-hidden"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsSyllabusModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Curriculum Document</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark tracking-tight">
                  Download Full Syllabus
                </h3>
                <p className="text-brand-muted text-sm mt-1.5 leading-relaxed">
                  Enter your contact details below to get instant access to the complete <strong>{course.title}</strong> syllabus &amp; project roadmap.
                </p>
              </div>

              {/* Success Message or Form */}
              {syllabusLeadSuccess ? (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-dark">
                    Your Download Has Started!
                  </h4>
                  <p className="text-brand-muted text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, {syllabusLead.full_name}. The PDF was opened in a new tab. Our admissions team will also reach out to answer any curriculum questions.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    {course.syllabus_pdf_url && (
                      <a
                        href={course.syllabus_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-bold text-sm hover:bg-[#0c8cb3] transition-all shadow-md active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        <span>Re-open PDF</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsSyllabusModalOpen(false)}
                      className="px-6 py-3 bg-gray-100 text-brand-dark rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSyllabusLeadSubmit} className="space-y-4">
                  {syllabusLeadError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                      {syllabusLeadError}
                    </div>
                  )}

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={syllabusLead.full_name}
                      onChange={(e) =>
                        setSyllabusLead((prev) => ({ ...prev, full_name: e.target.value }))
                      }
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={syllabusLead.email}
                      onChange={(e) =>
                        setSyllabusLead((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="e.g. rahul.sharma@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={syllabusLead.phone}
                      onChange={(e) =>
                        setSyllabusLead((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingSyllabusLead}
                      className="w-full py-3.5 bg-brand-orange text-white rounded-full font-bold text-sm hover:bg-[#e06b24] shadow-lg shadow-brand-orange/30 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmittingSyllabusLead ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Preparing Download...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Get Free Syllabus PDF</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center">
                    🔒 We respect your privacy. No spam ever.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCourse={modalContext}
      />
    </div>
  );
}
