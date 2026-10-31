"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  Sparkles,
  Layers,
  Clock,
  BookOpen,
  AlertCircle,
  Calendar,
  Award,
  ShieldCheck,
  Laptop,
  Code2,
  ImageIcon,
  Zap,
  Star,
  Trash2,
  GraduationCap,
  Users,
  TableProperties,
  Columns3,
  ListTree,
  FolderOpen,
  Headphones,
  FileText,
  Download,
  Upload,
} from "lucide-react";
import { CourseCard } from "@/components/ui/CourseCard";

export const dynamic = "force-dynamic";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    | "card"
    | "landing"
    | "overview"
    | "features"
    | "audiences"
    | "comparison"
    | "curriculum"
    | "batches"
    | "guidance"
    | "certification"
  >("card");

  // Form Data State
  const [formData, setFormData] = useState({
    // Course Card Info Fields
    category: "",
    card_image_url: "",
    placement_guarantee: "",
    short_description: "",
    card_features: [] as string[],

    // Tab 1: Hero Section
    subject: "",
    title: "",
    long_description: "",
    duration_mode: "",
    projects_count: "",
    accreditation_text: "",
    next_batch_text: "",
    accelerate_heading: "",
    accelerate_description: "",
    accelerate_bullets: [] as string[],

    // Tab 2: Course Overview
    overview_eyebrow: "",
    overview_heading: "",
    overview_description: "",
    tech_stack: [] as string[],
    outcome_title: "",
    outcome_text: "",
    overview_image_url: "",
    overview_badge_line1: "",
    overview_badge_line2: "",

    // Tab 3: Key Features
    advantages_eyebrow: "",
    advantages_heading: "",
    advantages_description: "",
    six_key_features: [] as {
      title: string;
      description: string;
      iconName: string;
      color: string;
    }[],

    // Tab 4: Target Audiences
    pathways_eyebrow: "",
    pathways_heading: "",
    tailored_pathways: [] as {
      iconName: string;
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      highlights: string[];
    }[],

    // Tab 5: Comparison Table
    comparison_eyebrow: "",
    comparison_heading: "",
    comparison_description: "",
    comparison_table: [] as {
      feature: string;
      revelation: string;
      others: string;
    }[],

    // Tab 6: Course Curriculum
    syllabus_eyebrow: "",
    syllabus_heading: "",
    syllabus_description: "",
    syllabus_pdf_url: "",
    curriculum: [] as {
      number: string;
      title: string;
      duration: string;
      description: string;
      topics: string[];
    }[],

    // Tab 7: Course Batches & Enrollment
    batches_eyebrow: "",
    batches_heading: "",
    batches_description: "",
    batch_options: [] as {
      id: string;
      name: string;
      type: string;
      timing: string;
      duration: string;
      badge: string;
      popular: boolean;
      description: string;
    }[],

    // Tab 8: Course Guidance & Mentorship
    guidance_eyebrow: "",
    guidance_title: "",
    guidance_description: "",

    // Tab 9: Certification Validation
    cert_eyebrow: "",
    cert_heading: "",
    cert_description: "",
    cert_image_url: "",
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
    ] as { title: string; desc: string }[],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [isUploadingCardImage, setIsUploadingCardImage] = useState(false);
  const [cardImageUploadError, setCardImageUploadError] = useState<string | null>(null);
  const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
  const [certImageUploadError, setCertImageUploadError] = useState<string | null>(null);

  // Temporary inputs for dynamic arrays
  const [newBulletInput, setNewBulletInput] = useState("");
  const [newTechInput, setNewTechInput] = useState("");
  const [newCardHighlightInput, setNewCardHighlightInput] = useState("");
  const [newTopicInputs, setNewTopicInputs] = useState<{ [key: number]: string }>({});

  // Helper to parse JSONB arrays
  function parseArrayField<T>(field: any, fallback: T[] = []): T[] {
    if (!field) return fallback;
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }

  // Fetch initial course data on mount
  useEffect(() => {
    async function loadCourse() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/admin/courses/${courseId}`);
        const data = await res.json();

        if (res.ok && data.success && data.course) {
          const c = data.course;
          setFormData({
            // Course Card Info
            category: c.category || "Software Testing & Automation",
            card_image_url:
              c.card_image_url ||
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
            placement_guarantee: c.placement_guarantee || "100% Placement Guarantee",
            short_description:
              c.short_description ||
              "Master manual testing, Java, Selenium, and API testing. Go from absolute beginner to job-ready QA Automation Engineer with live corporate projects and interview prep.",
            card_features: parseArrayField<string>(c.card_features, [
              "Live Corporate Projects",
              "1-on-1 Mock Interviews",
              "Resume & ATS Optimization",
              "Dedicated Placement Cell",
            ]),

            // Tab 1
            subject: c.subject || "",
            title: c.title || "",
            long_description: c.long_description || c.short_description || "",
            duration_mode: c.duration_mode || "3 Months • Live Online",
            projects_count: c.projects_count || "",
            accreditation_text: c.accreditation_text || "",
            next_batch_text: c.next_batch_text || "",
            accelerate_heading: c.accelerate_heading || "",
            accelerate_description: c.accelerate_description || "",
            accelerate_bullets: parseArrayField<string>(c.accelerate_bullets, [
              "Live Interactive Mentorship",
              "Daily Doubt Clarification Labs",
              "1-on-1 Mock HR & Tech Drills",
              "Dedicated Placement Officer",
            ]),

            // Tab 2
            overview_eyebrow: c.overview_eyebrow || "COURSE OVERVIEW",
            overview_heading: c.overview_heading || "What you will learn & master.",
            overview_description:
              c.overview_description ||
              "Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one.",
            tech_stack: parseArrayField<string>(c.tech_stack, [
              "End-to-End Manual Testing & Agile Jira",
              "Core Java & Object-Oriented Architecture",
              "Selenium 4 WebDriver & Page Object Model",
              "REST API Automation with Postman & REST Assured",
              "TestNG Parallel Execution & Extent Reports",
              "Git, GitHub & Jenkins CI/CD Pipelines",
            ]),
            outcome_title: c.outcome_title || "Outcome Guarantee:",
            outcome_text:
              c.outcome_text ||
              "By the end of 12 weeks, you will be capable of building automated regression test suites from scratch, designing API tests, and confidently facing senior SDET technical interviews.",
            overview_image_url:
              c.overview_image_url ||
              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
            overview_badge_line1: c.overview_badge_line1 || "120+ Hours",
            overview_badge_line2: c.overview_badge_line2 || "Hands-on QA Coding",

            // Tab 3
            advantages_eyebrow: c.advantages_eyebrow || "PROGRAM ADVANTAGES",
            advantages_heading: c.advantages_heading || "Why this is India's most effective QA program.",
            advantages_description:
              c.advantages_description ||
              "Everything you need to transform from beginner to corporate-ready QA engineer, all under one roof.",
            six_key_features: parseArrayField<{
              title: string;
              description: string;
              iconName: string;
              color: string;
            }>(c.six_key_features, [
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
                color: "text-rose-600",
              },
            ]),

            // Tab 4
            pathways_eyebrow: c.pathways_eyebrow || "WHO IS THIS COURSE FOR",
            pathways_heading: c.pathways_heading || "Tailored pathways for your background.",
            tailored_pathways: parseArrayField<{
              iconName: string;
              badge: string;
              title: string;
              subtitle: string;
              description: string;
              highlights: string[];
            }>(c.tailored_pathways, [
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
                ],
              },
            ]),

            // Tab 5
            comparison_eyebrow: c.comparison_eyebrow || "WHY CHOOSE US",
            comparison_heading: c.comparison_heading || "The Revelation IT Difference.",
            comparison_description:
              c.comparison_description ||
              "See why hundreds of learners choose our flagship bootcamp over traditional training centers.",
            comparison_table: parseArrayField<{
              feature: string;
              revelation: string;
              others: string;
            }>(c.comparison_table, [
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
                others: "Support ends immediately upon course completion",
              },
            ]),

            // Tab 6
            syllabus_eyebrow: c.syllabus_eyebrow || "COMPREHENSIVE SYLLABUS",
            syllabus_heading: c.syllabus_heading || "Curriculum designed for the modern industry.",
            syllabus_description:
              c.syllabus_description ||
              "Click any module to inspect the detailed topic breakdown and hands-on projects.",
            syllabus_pdf_url: c.syllabus_pdf_url || "",
            curriculum: parseArrayField<{
              number: string;
              title: string;
              duration: string;
              description: string;
              topics: string[];
            }>(c.curriculum, [
              {
                number: "01",
                title: "Manual Testing Fundamentals & Agile QA",
                duration: "Weeks 1 - 3",
                description:
                  "Master core software testing principles, SDLC models, STLC methodologies, and enterprise test case design.",
                topics: [
                  "SDLC Models: Waterfall, Agile Scrum, V-Model & Sprint Ceremonies",
                  "STLC: Test Planning, Scenario Design, Test Case Writing & Traceability Matrix (RTM)",
                  "Black Box Techniques: Equivalence Partitioning & Boundary Value Analysis",
                  "Functional, Non-Functional, Regression, Smoke, Sanity & Performance Overview",
                  "Bug Lifecycle: Severity vs. Priority & Defect Management in Atlassian Jira",
                  "Real-Time Project: End-to-End Test Suite Creation for an E-Commerce Platform",
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
            ]),

            // Tab 7
            batches_eyebrow: c.batches_eyebrow || "BATCH TIMINGS & ENROLLMENT",
            batches_heading: c.batches_heading || "Choose the batch that fits your schedule.",
            batches_description:
              c.batches_description ||
              "Flexible options for students, job seekers, and working professionals.",
            batch_options: parseArrayField<{
              id: string;
              name: string;
              type: string;
              timing: string;
              duration: string;
              badge: string;
              popular: boolean;
              description: string;
            }>(c.batch_options, [
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
            ]),

            // Tab 8
            guidance_eyebrow: c.guidance_eyebrow || "1-ON-1 CAREER GUIDANCE",
            guidance_title: c.guidance_title || "Not sure if Software Testing is right for you?",
            guidance_description:
              c.guidance_description ||
              "Get a free 1-on-1 profile evaluation with our Chief QA Architect. We will review your background, assess your aptitude, and recommend the fastest roadmap to break into IT.",

            // Tab 9
            cert_eyebrow: c.cert_eyebrow || "ACCREDITED & RECOGNIZED",
            cert_heading: c.cert_heading || "Industry-Recognized QA Certification.",
            cert_description:
              c.cert_description ||
              "Upon passing our capstone automation framework review and comprehensive mock technical panel, you receive a tamper-proof digital certificate that hiring managers instantly respect.",
            cert_image_url:
              c.cert_image_url ||
              "https://images.unsplash.com/photo-1589330694653-06def33cefca?w=1200",
            cert_features: (() => {
              const parsed = parseArrayField<{ title: string; desc: string }>(c.cert_features, [
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
              ]);
              while (parsed.length < 3) {
                parsed.push({ title: "", desc: "" });
              }
              return parsed;
            })(),
          });
        } else {
          setErrorMessage(data.error || "Failed to load course details.");
        }
      } catch (err: any) {
        console.error("Error loading course:", err);
        setErrorMessage("Unable to fetch course. Check server connection.");
      } finally {
        setIsLoading(false);
      }
    }

    if (courseId === "new") {
      setIsLoading(false);
      return;
    }

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  // Handle standard input change
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // --- Card Image Upload Handler ---
  async function handleCardImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCardImage(true);
    setCardImageUploadError(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/courses/upload-image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.file_url) {
        setFormData((prev) => ({ ...prev, card_image_url: result.file_url }));
      } else {
        setCardImageUploadError(result.error || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Image upload error:", err);
      setCardImageUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingCardImage(false);
    }
  }

  // --- Certificate Image Upload Handler (Tab 9) ---
  async function handleCertificateUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCertImage(true);
    setCertImageUploadError(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/courses/upload-certificate", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      const uploadedUrl = result.url || result.file_url;
      if (result.success && uploadedUrl) {
        setFormData((prev) => ({ ...prev, cert_image_url: uploadedUrl }));
      } else {
        setCertImageUploadError(result.error || "Failed to upload certificate image");
      }
    } catch (err: any) {
      console.error("Certificate image upload error:", err);
      setCertImageUploadError("Failed to upload certificate image. Please try again.");
    } finally {
      setIsUploadingCertImage(false);
    }
  }

  // --- Dynamic Card Highlights Handlers ---
  function handleAddCardHighlight() {
    const trimmed = newCardHighlightInput.trim();
    if (!trimmed) return;
    if (!formData.card_features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        card_features: [...prev.card_features, trimmed],
      }));
    }
    setNewCardHighlightInput("");
  }

  function handleRemoveCardHighlight(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      card_features: prev.card_features.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Bullet Handlers (Tab 1) ---
  function handleAddBullet() {
    const trimmed = newBulletInput.trim();
    if (!trimmed) return;
    if (!formData.accelerate_bullets.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        accelerate_bullets: [...prev.accelerate_bullets, trimmed],
      }));
    }
    setNewBulletInput("");
  }

  function handleRemoveBullet(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      accelerate_bullets: prev.accelerate_bullets.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Tech Stack Handlers (Tab 2) ---
  function handleAddTech() {
    const trimmed = newTechInput.trim();
    if (!trimmed) return;
    if (!formData.tech_stack.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, trimmed],
      }));
    }
    setNewTechInput("");
  }

  function handleRemoveTech(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Key Features Handlers (Tab 3) ---
  function handleFeatureChange(
    index: number,
    field: "title" | "description" | "iconName" | "color",
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.six_key_features];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, six_key_features: updated };
    });
  }

  function handleAddFeature() {
    setFormData((prev) => ({
      ...prev,
      six_key_features: [
        ...prev.six_key_features,
        {
          title: "New Feature Card",
          description: "Feature description explaining the unique benefit to learners.",
          iconName: "Award",
          color: "text-brand-orange",
        },
      ],
    }));
  }

  function handleRemoveFeature(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      six_key_features: prev.six_key_features.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Target Audiences Handlers (Tab 4) ---
  function handlePathwayChange(
    index: number,
    field: "iconName" | "badge" | "title" | "subtitle" | "description",
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.tailored_pathways];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, tailored_pathways: updated };
    });
  }

  function handlePathwayHighlightChange(
    cardIndex: number,
    highlightIndex: number,
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.tailored_pathways];
      const currentHighlights = Array.isArray(updated[cardIndex].highlights)
        ? [...updated[cardIndex].highlights]
        : ["", "", ""];

      while (currentHighlights.length < 3) {
        currentHighlights.push("");
      }

      currentHighlights[highlightIndex] = value;
      updated[cardIndex] = {
        ...updated[cardIndex],
        highlights: currentHighlights,
      };
      return { ...prev, tailored_pathways: updated };
    });
  }

  function handleAddPathway() {
    setFormData((prev) => ({
      ...prev,
      tailored_pathways: [
        ...prev.tailored_pathways,
        {
          iconName: "GraduationCap",
          badge: "Fast-Track Entry",
          title: "New Target Audience",
          subtitle: "Eligible Degrees / Profile",
          description: "Description explaining why this program is built for this background.",
          highlights: ["Key advantage 1", "Key advantage 2", "Key advantage 3"],
        },
      ],
    }));
  }

  function handleRemovePathway(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      tailored_pathways: prev.tailored_pathways.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Comparison Table Handlers (Tab 5) ---
  function handleComparisonRowChange(
    index: number,
    field: "feature" | "revelation" | "others",
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.comparison_table];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, comparison_table: updated };
    });
  }

  function handleAddComparisonRow() {
    setFormData((prev) => ({
      ...prev,
      comparison_table: [
        ...prev.comparison_table,
        {
          feature: "New Parameter",
          revelation: "Unique Revelation IT advantage...",
          others: "Generic institute limitation...",
        },
      ],
    }));
  }

  function handleRemoveComparisonRow(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      comparison_table: prev.comparison_table.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Course Curriculum Handlers (Tab 6 - Nested Repeater) ---
  function handleModuleChange(
    modIndex: number,
    field: "number" | "duration" | "title" | "description",
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.curriculum];
      updated[modIndex] = {
        ...updated[modIndex],
        [field]: value,
      };
      return { ...prev, curriculum: updated };
    });
  }

  function handleAddModule() {
    setFormData((prev) => {
      const nextNum = String(prev.curriculum.length + 1).padStart(2, "0");
      return {
        ...prev,
        curriculum: [
          ...prev.curriculum,
          {
            number: nextNum,
            duration: `Weeks ${prev.curriculum.length * 2 + 1} - ${prev.curriculum.length * 2 + 2}`,
            title: "New Module Title",
            description: "Module overview description explaining the skills taught.",
            topics: [
              "Topic / Practical Lab Drill 1",
              "Topic / Practical Lab Drill 2",
              "Real-Time Framework Integration",
            ],
          },
        ],
      };
    });
  }

  function handleRemoveModule(modIndex: number) {
    setFormData((prev) => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, idx) => idx !== modIndex),
    }));
  }

  function handleTopicChange(modIndex: number, topicIndex: number, value: string) {
    setFormData((prev) => {
      const updated = [...prev.curriculum];
      const currentTopics = [...(updated[modIndex].topics || [])];
      currentTopics[topicIndex] = value;
      updated[modIndex] = {
        ...updated[modIndex],
        topics: currentTopics,
      };
      return { ...prev, curriculum: updated };
    });
  }

  function handleAddTopic(modIndex: number) {
    const text = (newTopicInputs[modIndex] || "").trim();
    if (!text) return;
    setFormData((prev) => {
      const updated = [...prev.curriculum];
      const currentTopics = [...(updated[modIndex].topics || [])];
      currentTopics.push(text);
      updated[modIndex] = {
        ...updated[modIndex],
        topics: currentTopics,
      };
      return { ...prev, curriculum: updated };
    });
    setNewTopicInputs((prev) => ({ ...prev, [modIndex]: "" }));
  }

  function handleRemoveTopic(modIndex: number, topicIndex: number) {
    setFormData((prev) => {
      const updated = [...prev.curriculum];
      const currentTopics = (updated[modIndex].topics || []).filter((_, idx) => idx !== topicIndex);
      updated[modIndex] = {
        ...updated[modIndex],
        topics: currentTopics,
      };
      return { ...prev, curriculum: updated };
    });
  }

  // --- Dynamic Batch Timings Handlers (Tab 7) ---
  function handleBatchOptionChange(
    index: number,
    field: "id" | "name" | "type" | "timing" | "duration" | "badge" | "description",
    value: string
  ) {
    setFormData((prev) => {
      const updated = [...prev.batch_options];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, batch_options: updated };
    });
  }

  function handleBatchPopularToggle(index: number) {
    setFormData((prev) => {
      const updated = [...prev.batch_options];
      updated[index] = {
        ...updated[index],
        popular: !updated[index].popular,
      };
      return { ...prev, batch_options: updated };
    });
  }

  function handleAddBatchOption() {
    setFormData((prev) => ({
      ...prev,
      batch_options: [
        ...prev.batch_options,
        {
          id: `batch-${Date.now()}`,
          name: "New Batch Option",
          type: "Live Online (Zoom)",
          timing: "Mon - Fri • 7:00 PM - 8:30 PM IST",
          duration: "3 Months",
          badge: "Upcoming Batch",
          popular: false,
          description: "Comprehensive batch description for students and professionals.",
        },
      ],
    }));
  }

  function handleRemoveBatchOption(indexToRemove: number) {
    setFormData((prev) => ({
      ...prev,
      batch_options: prev.batch_options.filter((_, idx) => idx !== indexToRemove),
    }));
  }

  // --- Dynamic Certification Feature Handlers (Tab 9 - 3 Fixed Blocks) ---
  function handleCertFeatureChange(index: number, field: "title" | "desc", value: string) {
    setFormData((prev) => {
      const updated = [...prev.cert_features];
      while (updated.length <= index) {
        updated.push({ title: "", desc: "" });
      }
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, cert_features: updated };
    });
  }

  // --- Syllabus PDF Upload Handler (Tab 6) ---
  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setPdfUploadError(null);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/courses/upload-syllabus", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.success && result.file_url) {
        setFormData((prev) => ({ ...prev, syllabus_pdf_url: result.file_url }));
      } else {
        setPdfUploadError(result.error || "Failed to upload PDF");
      }
    } catch (err: any) {
      console.error("PDF upload error:", err);
      setPdfUploadError("Failed to upload PDF. Please try again.");
    } finally {
      setIsUploadingPdf(false);
    }
  }

  // Submit Handler (Dynamic POST for new course / PUT for update)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const isNew = courseId === "new";
      const endpoint = isNew ? "/api/admin/courses" : `/api/admin/courses/${courseId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess(true);
        if (isNew && data.course?.id) {
          router.push(`/dashboard/courses/${data.course.id}`);
        } else {
          setTimeout(() => setSaveSuccess(false), 3000);
        }
      } else {
        setErrorMessage(data.error || "Failed to save course data.");
      }
    } catch (err: any) {
      console.error("Error saving course:", err);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-24 flex flex-col items-center justify-center text-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin mb-4" />
        <h3 className="text-[18px] font-bold text-brand-dark">Loading Course Data...</h3>
        <p className="text-[14px] text-brand-muted mt-1">Fetching metadata for Course #{courseId}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-muted hover:text-brand-dark transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Courses</span>
          </Link>

          <h1 className="text-[32px] font-bold text-brand-dark leading-tight">
            Course Editor
          </h1>
          <p className="text-brand-muted text-[14px] mt-1">
            Editing: <span className="font-semibold text-brand-dark">{formData.title || (courseId === "new" ? "New Course" : `Course #${courseId}`)}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
            saveSuccess
              ? "bg-green-600 text-white shadow-green-600/25"
              : "bg-brand-orange hover:bg-[#e06b24] text-white shadow-brand-orange/25"
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("card")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "card"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Layers className={`w-4 h-4 ${activeTab === "card" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>Course Card Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("landing")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "landing"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Sparkles className={`w-4 h-4 ${activeTab === "landing" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>1. Landing Page (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "overview"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === "overview" ? "text-brand-blue" : "text-gray-400"}`} />
          <span>2. Course Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("features")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "features"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Star className={`w-4 h-4 ${activeTab === "features" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>3. Key Features</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audiences")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "audiences"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <GraduationCap className={`w-4 h-4 ${activeTab === "audiences" ? "text-emerald-500" : "text-gray-400"}`} />
          <span>4. Target Audiences</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "comparison"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <TableProperties className={`w-4 h-4 ${activeTab === "comparison" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>5. Comparison Table</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("batches")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "batches"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Clock className={`w-4 h-4 ${activeTab === "batches" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>7. Batch Timings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("guidance")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "guidance"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Headphones className={`w-4 h-4 ${activeTab === "guidance" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>8. Guidance Section</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certification")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "certification"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === "certification" ? "text-brand-orange" : "text-gray-400"}`} />
          <span>9. Certification</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`px-5 py-2.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === "curriculum"
              ? "bg-brand-dark text-white shadow-sm"
              : "text-brand-muted hover:text-brand-dark hover:bg-gray-100"
          }`}
        >
          <ListTree className={`w-4 h-4 ${activeTab === "curriculum" ? "text-brand-blue" : "text-gray-400"}`} />
          <span>6. Course Curriculum</span>
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[14px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Banner */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">Course data has been saved to NeonDB!</span>
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm space-y-10">

        {/* ========================================================================= */}
        {/* TAB 0: COURSE CARD INFO */}
        {/* ========================================================================= */}
        {activeTab === "card" && (
          <div className="space-y-8">
            {/* Header / Intro */}
            <div className="bg-gray-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Card Display Configuration</span>
                </div>
                <h2 className="text-[22px] font-bold text-brand-dark">
                  Course Card Grid Settings
                </h2>
                <p className="text-brand-muted text-[13px] mt-0.5">
                  Configure how this course appears in the course grids across the Homepage and All Courses catalog.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Course Category (Eyebrow Pill) *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Testing & Automation"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs font-bold"
                  />
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Displayed above the course card title and used for catalog filtering.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Testing (Manual + Automation SDET)"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs font-bold"
                  />
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Main heading rendered on the course card.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Card Short Description *
                  </label>
                  <textarea
                    rows={3}
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    placeholder="Brief 2-3 sentence overview of what the student will learn and master in this course..."
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                  />
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Concise summary displayed in the course preview card.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Placement Guarantee Text
                  </label>
                  <input
                    type="text"
                    name="placement_guarantee"
                    value={formData.placement_guarantee}
                    onChange={handleInputChange}
                    placeholder="e.g. 100% Placement Guarantee"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                  />
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Overlay badge displayed at the bottom-left of the card image.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark mb-2">
                    Duration & Mode Text
                  </label>
                  <input
                    type="text"
                    name="duration_mode"
                    value={formData.duration_mode}
                    onChange={handleInputChange}
                    placeholder="e.g. 3 Months • Live Online"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                  />
                  <p className="text-[11px] text-brand-muted mt-1.5">
                    Displayed with clock icon in the card footer.
                  </p>
                </div>
              </div>
            </div>

            {/* Card Image Upload & URL */}
            <div className="bg-gray-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
              <div>
                <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-brand-blue" />
                  <span>Card Visual / Thumbnail Image</span>
                </h3>
                <p className="text-brand-muted text-[13px] mt-0.5">
                  Upload an image from your computer or provide a direct web image URL (Unsplash, CDN, etc.).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="card_image_url"
                      value={formData.card_image_url}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/... or /uploads/courses/..."
                      className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark mb-2">
                      Or Upload Image File
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm active:scale-95">
                        <Upload className="w-4 h-4 text-brand-orange" />
                        <span>{isUploadingCardImage ? "Uploading..." : "Choose Image File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCardImageUpload}
                          disabled={isUploadingCardImage}
                          className="hidden"
                        />
                      </label>
                      {isUploadingCardImage && <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />}
                    </div>
                    {cardImageUploadError && (
                      <p className="text-xs text-red-500 mt-2">{cardImageUploadError}</p>
                    )}
                  </div>
                </div>

                {/* Preview Thumbnail */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-gray-200 text-center">
                  <span className="text-[11px] font-bold text-brand-muted uppercase mb-2">Image Preview</span>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {formData.card_image_url ? (
                      <img
                        src={formData.card_image_url}
                        alt="Card visual preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image set
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack Pills & Card Highlights (2 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tech Stack Pills */}
              <div className="bg-gray-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-5">
                <div>
                  <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-brand-orange" />
                    <span>Tech Stack Pills</span>
                  </h3>
                  <p className="text-brand-muted text-[13px] mt-0.5">
                    Tags rendered as pills on the card (e.g., Selenium 4, Java, Postman).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTechInput}
                    onChange={(e) => setNewTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. Selenium 4"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-4 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.tech_stack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-brand-dark shadow-2xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {formData.tech_stack.length === 0 && (
                    <p className="text-xs text-brand-muted italic">No tech stack pills added yet.</p>
                  )}
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="bg-gray-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-5">
                <div>
                  <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Card Highlights (Checklist)</span>
                  </h3>
                  <p className="text-brand-muted text-[13px] mt-0.5">
                    Checklist bullet points rendered with check icons.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCardHighlightInput}
                    onChange={(e) => setNewCardHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCardHighlight();
                      }
                    }}
                    placeholder="e.g. Live Corporate Projects"
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCardHighlight}
                    className="px-4 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {formData.card_features.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-gray-200 text-xs text-brand-dark font-medium shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCardHighlight(idx)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.card_features.length === 0 && (
                    <p className="text-xs text-brand-muted italic">No highlights added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Live Interactive Card Preview */}
            <div className="bg-gray-50/70 rounded-3xl p-6 sm:p-8 border border-gray-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-orange" />
                    <span>Live Card Preview</span>
                  </h3>
                  <p className="text-brand-muted text-[13px] mt-0.5">
                    Real-time frontend preview of how this course card will look on the homepage & course catalog.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Live Sync
                </span>
              </div>

              <div className="p-4 sm:p-6 bg-brand-bg rounded-2xl border border-gray-200">
                <CourseCard
                  category={formData.category || "Software Testing & Automation"}
                  title={formData.title || "Software Testing Course"}
                  short_description={formData.short_description || "Course description preview will appear here..."}
                  card_image_url={formData.card_image_url}
                  placement_guarantee={formData.placement_guarantee}
                  tech_stack={formData.tech_stack}
                  card_features={formData.card_features}
                  duration_mode={formData.duration_mode}
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: LANDING PAGE (HERO SECTION) */}
        {/* ========================================================================= */}
        {activeTab === "landing" && (
          <div className="space-y-10">
            {/* SECTION 1: MAIN HEADER */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hero Header</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                  <span>Main Header &amp; Titles</span>
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  The primary eyebrow badge, course title, and lead overview paragraph.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Subject / Eyebrow */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Course Subject / Eyebrow Badge
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. #1 RATED QA BOOTCAMP IN PUNE & ONLINE"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Course Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Course Name (Title) *
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Complete Software Testing & Automation Bootcamp"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Description */}
                <div>
                  <label
                    htmlFor="long_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Description
                  </label>
                  <textarea
                    id="long_description"
                    name="long_description"
                    rows={4}
                    value={formData.long_description}
                    onChange={handleInputChange}
                    placeholder="Master Manual Testing, Java, Selenium 4, and REST API testing to become a high-earning QA Automation Engineer in 3 months. Includes 100% placement guarantee and live project coaching."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: METRIC BADGES */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Key Metrics</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                  <span>Metric Badges</span>
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Key highlight values shown underneath the action buttons in the hero section.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Duration & Mode */}
                <div>
                  <label
                    htmlFor="duration_mode"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Duration &amp; Mode
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="duration_mode"
                      type="text"
                      name="duration_mode"
                      value={formData.duration_mode}
                      onChange={handleInputChange}
                      placeholder="3 Months (12 Wks)"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Projects Count */}
                <div>
                  <label
                    htmlFor="projects_count"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Projects Count
                  </label>
                  <div className="relative">
                    <Laptop className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="projects_count"
                      type="text"
                      name="projects_count"
                      value={formData.projects_count}
                      onChange={handleInputChange}
                      placeholder="10+ Real-World"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Accreditation */}
                <div>
                  <label
                    htmlFor="accreditation_text"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Accreditation
                  </label>
                  <div className="relative">
                    <Award className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="accreditation_text"
                      type="text"
                      name="accreditation_text"
                      value={formData.accreditation_text}
                      onChange={handleInputChange}
                      placeholder="ISTQB Aligned"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: ACCELERATE CARD (RIGHT SIDE) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Floating Card</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
                  <span>Accelerate Card (Right Side)</span>
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  The floating glassmorphic card on the right side of the Hero section.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Next Batch Text */}
                <div>
                  <label
                    htmlFor="next_batch_text"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Next Batch Text
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="next_batch_text"
                      type="text"
                      name="next_batch_text"
                      value={formData.next_batch_text}
                      onChange={handleInputChange}
                      placeholder="Next Batch: Monday"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                {/* Accelerate Heading */}
                <div>
                  <label
                    htmlFor="accelerate_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Card Heading
                  </label>
                  <input
                    id="accelerate_heading"
                    type="text"
                    name="accelerate_heading"
                    value={formData.accelerate_heading}
                    onChange={handleInputChange}
                    placeholder="Accelerate Your QA Journey"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Accelerate Description */}
                <div>
                  <label
                    htmlFor="accelerate_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Card Description
                  </label>
                  <textarea
                    id="accelerate_description"
                    name="accelerate_description"
                    rows={3}
                    value={formData.accelerate_description}
                    onChange={handleInputChange}
                    placeholder="Join 1,200+ graduates already working at leading IT giants and product startups across India."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>

                {/* Accelerate Bullets (Dynamic Array) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider">
                      Card Bullets ({formData.accelerate_bullets.length} items)
                    </label>
                  </div>

                  {/* Current Bullets List */}
                  <div className="space-y-2">
                    {formData.accelerate_bullets.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-[13px] text-gray-400 italic">
                        No card bullets added yet. Add items below.
                      </div>
                    ) : (
                      formData.accelerate_bullets.map((bullet, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-brand-dark text-[14px] font-semibold"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="w-5 h-5 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-[11px] font-bold shrink-0">
                              ✓
                            </span>
                            <span className="truncate">{bullet}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBullet(idx)}
                            className="p-1 rounded-lg hover:bg-white text-gray-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                            aria-label={`Remove ${bullet}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Bullet Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBulletInput}
                      onChange={(e) => setNewBulletInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddBullet();
                        }
                      }}
                      placeholder="e.g. 1-on-1 Mock HR & Tech Drills"
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddBullet}
                      className="px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: COURSE OVERVIEW (SECTION 2) */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* 1. Header Text */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Section 2 Content</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Header Text
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  The eyebrow badge, section heading, and in-depth overview text.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Eyebrow */}
                <div>
                  <label
                    htmlFor="overview_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Eyebrow (e.g., COURSE OVERVIEW)
                  </label>
                  <input
                    id="overview_eyebrow"
                    type="text"
                    name="overview_eyebrow"
                    value={formData.overview_eyebrow}
                    onChange={handleInputChange}
                    placeholder="COURSE OVERVIEW"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label
                    htmlFor="overview_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Heading *
                  </label>
                  <input
                    id="overview_heading"
                    type="text"
                    name="overview_heading"
                    value={formData.overview_heading}
                    onChange={handleInputChange}
                    placeholder="What you will learn & master."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Description */}
                <div>
                  <label
                    htmlFor="overview_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Description
                  </label>
                  <textarea
                    id="overview_description"
                    name="overview_description"
                    rows={4}
                    value={formData.overview_description}
                    onChange={handleInputChange}
                    placeholder="Traditional college degrees and generic crash courses leave major gaps in practical QA skills. This bootcamp bridges that divide by immersing you in real corporate workflows, enterprise frameworks, and defect lifecycles from day one."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tech Stack List */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Curriculum Technologies</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Tech Stack List
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Key framework and tool highlights rendered in the 2-column checklist.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider">
                    Tech Stack List ({formData.tech_stack.length} items)
                  </label>
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.tech_stack.length === 0 ? (
                    <div className="sm:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-[13px] text-gray-400 italic">
                      No tech stack items added yet. Add frameworks below.
                    </div>
                  ) : (
                    formData.tech_stack.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 text-brand-dark text-[14px] font-semibold"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="w-5 h-5 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-[11px] font-bold shrink-0">
                            ✓
                          </span>
                          <span className="truncate">{item}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(idx)}
                          className="p-1 rounded-lg hover:bg-white text-gray-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                          aria-label={`Remove ${item}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Tech Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newTechInput}
                    onChange={(e) => setNewTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. Selenium 4 WebDriver & Page Object Model"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Outcome Guarantee */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guarantee Card</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Outcome Guarantee
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  The highlighted commitment box located below the tech stack checklist.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Outcome Title */}
                <div>
                  <label
                    htmlFor="outcome_title"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Outcome Title (e.g., Outcome Guarantee:)
                  </label>
                  <input
                    id="outcome_title"
                    type="text"
                    name="outcome_title"
                    value={formData.outcome_title}
                    onChange={handleInputChange}
                    placeholder="Outcome Guarantee:"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Outcome Description */}
                <div>
                  <label
                    htmlFor="outcome_text"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Outcome Description
                  </label>
                  <textarea
                    id="outcome_text"
                    name="outcome_text"
                    rows={3}
                    value={formData.outcome_text}
                    onChange={handleInputChange}
                    placeholder="By the end of 12 weeks, you will be capable of building automated regression test suites from scratch, designing API tests, and confidently facing senior SDET technical interviews."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 4. Right Visual (Image & Badge) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-600 text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Right-Side Graphic</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Right Visual (Image &amp; Floating Badge)
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Configure the primary section graphic and floating bottom-left statistic badge.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Image URL */}
                <div>
                  <label
                    htmlFor="overview_image_url"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Image URL
                  </label>
                  <input
                    id="overview_image_url"
                    type="url"
                    name="overview_image_url"
                    value={formData.overview_image_url}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Floating Badge Line 1 & Line 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="overview_badge_line1"
                      className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                    >
                      Floating Badge Line 1 (e.g., 120+ Hours)
                    </label>
                    <div className="relative">
                      <Zap className="w-4 h-4 text-brand-orange absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="overview_badge_line1"
                        type="text"
                        name="overview_badge_line1"
                        value={formData.overview_badge_line1}
                        onChange={handleInputChange}
                        placeholder="120+ Hours"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="overview_badge_line2"
                      className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                    >
                      Floating Badge Line 2 (e.g., Hands-on QA Coding)
                    </label>
                    <input
                      id="overview_badge_line2"
                      type="text"
                      name="overview_badge_line2"
                      value={formData.overview_badge_line2}
                      onChange={handleInputChange}
                      placeholder="Hands-on QA Coding"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KEY FEATURES (SECTION 3) */}
        {/* ========================================================================= */}
        {activeTab === "features" && (
          <div className="space-y-10">
            {/* 1. Header Text (Grid Layout) */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Star className="w-3.5 h-3.5" />
                  <span>Section 3 Header</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Header Text
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Configure the section eyebrow badge, main title, and introductory text.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Eyebrow */}
                <div>
                  <label
                    htmlFor="advantages_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Eyebrow (e.g., PROGRAM ADVANTAGES)
                  </label>
                  <input
                    id="advantages_eyebrow"
                    type="text"
                    name="advantages_eyebrow"
                    value={formData.advantages_eyebrow}
                    onChange={handleInputChange}
                    placeholder="PROGRAM ADVANTAGES"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label
                    htmlFor="advantages_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Heading *
                  </label>
                  <input
                    id="advantages_heading"
                    type="text"
                    name="advantages_heading"
                    value={formData.advantages_heading}
                    onChange={handleInputChange}
                    placeholder="Why this is India's most effective QA program."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Description */}
                <div>
                  <label
                    htmlFor="advantages_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Description
                  </label>
                  <textarea
                    id="advantages_description"
                    name="advantages_description"
                    rows={3}
                    value={formData.advantages_description}
                    onChange={handleInputChange}
                    placeholder="Everything you need to transform from beginner to corporate-ready QA engineer, all under one roof."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Feature Cards Repeater (six_key_features) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Feature Cards</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-brand-dark">
                    Key Feature Cards ({formData.six_key_features.length})
                  </h3>
                  <p className="text-[13px] text-brand-muted mt-0.5">
                    Manage the advantage highlight cards with titles, icons, and descriptions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feature Card</span>
                </button>
              </div>

              {/* Repeater List */}
              <div className="space-y-6">
                {formData.six_key_features.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-200/80 text-gray-400 italic">
                    No feature cards added yet. Click &quot;Add Feature Card&quot; to create one.
                  </div>
                ) : (
                  formData.six_key_features.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-gray-50 border border-gray-200/90 relative space-y-4 hover:border-gray-300 transition-colors shadow-2xs"
                    >
                      {/* Card Header & Remove Button */}
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-brand-dark">
                            {card.title || `Feature Card #${idx + 1}`}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Card"
                          aria-label={`Delete Card #${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 4 Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Title */}
                        <div className="sm:col-span-1">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Card Title *
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                            placeholder="e.g. 100% Placement Guarantee"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Icon Name */}
                        <div className="sm:col-span-1">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Lucide Icon Name
                          </label>
                          <input
                            type="text"
                            value={card.iconName}
                            onChange={(e) => handleFeatureChange(idx, "iconName", e.target.value)}
                            placeholder="e.g. Award, Code2, Users, FileText"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Color Class */}
                        <div className="sm:col-span-1">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Tailwind Color Class
                          </label>
                          <input
                            type="text"
                            value={card.color}
                            onChange={(e) => handleFeatureChange(idx, "color", e.target.value)}
                            placeholder="e.g. text-brand-orange, text-brand-blue"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-3">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Card Description
                          </label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                            placeholder="Direct referrals to our 40+ hiring partners and unlimited interviews until you secure your offer letter."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: TARGET AUDIENCES (SECTION 4A) */}
        {/* ========================================================================= */}
        {activeTab === "audiences" && (
          <div className="space-y-10">
            {/* 1. Header Text (Grid Layout) */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Section 4A Header</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Header Text
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Configure the section eyebrow badge and main headline for target audience pathways.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Eyebrow */}
                <div>
                  <label
                    htmlFor="pathways_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Eyebrow (e.g., WHO IS THIS COURSE FOR)
                  </label>
                  <input
                    id="pathways_eyebrow"
                    type="text"
                    name="pathways_eyebrow"
                    value={formData.pathways_eyebrow}
                    onChange={handleInputChange}
                    placeholder="WHO IS THIS COURSE FOR"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label
                    htmlFor="pathways_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Heading (e.g., Tailored pathways...) *
                  </label>
                  <input
                    id="pathways_heading"
                    type="text"
                    name="pathways_heading"
                    value={formData.pathways_heading}
                    onChange={handleInputChange}
                    placeholder="Tailored pathways for your background."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Pathway Cards Repeater (tailored_pathways) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Audience Pathways</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-brand-dark">
                    Audience Pathway Cards ({formData.tailored_pathways.length})
                  </h3>
                  <p className="text-[13px] text-brand-muted mt-0.5">
                    Configure tailored cards for Graduates, Career Switchers, and Manual QA Testers.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddPathway}
                  className="px-4 py-2 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Audience Card</span>
                </button>
              </div>

              {/* Repeater List */}
              <div className="space-y-6">
                {formData.tailored_pathways.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-200/80 text-gray-400 italic">
                    No audience cards added yet. Click &quot;Add Audience Card&quot; to create one.
                  </div>
                ) : (
                  formData.tailored_pathways.map((card, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-gray-50 border border-gray-200/90 relative space-y-5 hover:border-gray-300 transition-colors shadow-2xs"
                    >
                      {/* Card Header & Delete Button */}
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-brand-dark">
                            {card.title || `Audience Card #${idx + 1}`}
                          </span>
                          {card.badge && (
                            <span className="text-[11px] font-semibold bg-brand-blue/10 text-brand-blue px-2.5 py-0.5 rounded-full">
                              {card.badge}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePathway(idx)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Card"
                          aria-label={`Delete Audience Card #${idx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Standard Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Card Title *
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => handlePathwayChange(idx, "title", e.target.value)}
                            placeholder="e.g. Recent Graduates"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Badge */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={card.badge}
                            onChange={(e) => handlePathwayChange(idx, "badge", e.target.value)}
                            placeholder="e.g. Fast-Track Entry"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={card.subtitle}
                            onChange={(e) => handlePathwayChange(idx, "subtitle", e.target.value)}
                            placeholder="e.g. BE, B.Tech, BCA, MCA..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Icon Name */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Lucide Icon Name
                          </label>
                          <input
                            type="text"
                            value={card.iconName}
                            onChange={(e) => handlePathwayChange(idx, "iconName", e.target.value)}
                            placeholder="e.g. GraduationCap, RefreshCw, Building2"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={card.description}
                          onChange={(e) => handlePathwayChange(idx, "description", e.target.value)}
                          placeholder="Break into the IT sector with high-demand automation skills that stand out among thousands of applicants."
                          className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs resize-none leading-relaxed"
                        />
                      </div>

                      {/* Strict Highlights: Exactly 3 Text Inputs */}
                      <div className="pt-2 border-t border-gray-200/80">
                        <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-2">
                          Key Highlights (Strictly 3 Points)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Point 1 */}
                          <div>
                            <label className="block text-[11px] font-semibold text-brand-muted mb-1">
                              Highlight Point 1
                            </label>
                            <input
                              type="text"
                              value={card.highlights?.[0] || ""}
                              onChange={(e) => handlePathwayHighlightChange(idx, 0, e.target.value)}
                              placeholder="e.g. Bridge the college-to-corporate skills gap"
                              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                            />
                          </div>

                          {/* Point 2 */}
                          <div>
                            <label className="block text-[11px] font-semibold text-brand-muted mb-1">
                              Highlight Point 2
                            </label>
                            <input
                              type="text"
                              value={card.highlights?.[1] || ""}
                              onChange={(e) => handlePathwayHighlightChange(idx, 1, e.target.value)}
                              placeholder="e.g. Build a GitHub portfolio of real frameworks"
                              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                            />
                          </div>

                          {/* Point 3 */}
                          <div>
                            <label className="block text-[11px] font-semibold text-brand-muted mb-1">
                              Highlight Point 3
                            </label>
                            <input
                              type="text"
                              value={card.highlights?.[2] || ""}
                              onChange={(e) => handlePathwayHighlightChange(idx, 2, e.target.value)}
                              placeholder="e.g. Guaranteed campus-equivalent placement support"
                              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: COMPARISON TABLE (SECTION 4B) */}
        {/* ========================================================================= */}
        {activeTab === "comparison" && (
          <div className="space-y-10">
            {/* 1. Header Text (Grid Layout) */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>Section 4B Header</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Header Text
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Configure the section eyebrow badge, main title, and introductory text.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Eyebrow */}
                <div>
                  <label
                    htmlFor="comparison_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Eyebrow (e.g., WHY CHOOSE US)
                  </label>
                  <input
                    id="comparison_eyebrow"
                    type="text"
                    name="comparison_eyebrow"
                    value={formData.comparison_eyebrow}
                    onChange={handleInputChange}
                    placeholder="WHY CHOOSE US"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label
                    htmlFor="comparison_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Heading *
                  </label>
                  <input
                    id="comparison_heading"
                    type="text"
                    name="comparison_heading"
                    value={formData.comparison_heading}
                    onChange={handleInputChange}
                    placeholder="The Revelation IT Difference."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Description */}
                <div>
                  <label
                    htmlFor="comparison_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Description
                  </label>
                  <textarea
                    id="comparison_description"
                    name="comparison_description"
                    rows={3}
                    value={formData.comparison_description}
                    onChange={handleInputChange}
                    placeholder="See why hundreds of learners choose our flagship bootcamp over traditional training centers."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Tabular Repeater (comparison_table) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <Columns3 className="w-3.5 h-3.5" />
                    <span>Spreadsheet Matrix</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-brand-dark">
                    Comparison Table Rows ({formData.comparison_table.length})
                  </h3>
                  <p className="text-[13px] text-brand-muted mt-0.5">
                    Configure comparison points between Revelation IT and traditional institutes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddComparisonRow}
                  className="px-4 py-2 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Comparison Row</span>
                </button>
              </div>

              {/* Spreadsheet Table View */}
              <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[12px] font-bold text-brand-dark uppercase tracking-wider">
                      <th className="py-3.5 px-4 w-[28%]">Feature &amp; Parameters</th>
                      <th className="py-3.5 px-4 w-[34%] text-brand-orange">⭐ Revelation IT</th>
                      <th className="py-3.5 px-4 w-[32%] text-gray-500">Other Institutes</th>
                      <th className="py-3.5 px-3 w-[6%] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.comparison_table.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400 italic text-sm">
                          No comparison rows added yet. Click &quot;Add Comparison Row&quot; below.
                        </td>
                      </tr>
                    ) : (
                      formData.comparison_table.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 align-top">
                            <input
                              type="text"
                              value={row.feature}
                              onChange={(e) => handleComparisonRowChange(idx, "feature", e.target.value)}
                              placeholder="e.g. Placement Commitment"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white"
                            />
                          </td>
                          <td className="p-3 align-top">
                            <textarea
                              rows={2}
                              value={row.revelation}
                              onChange={(e) => handleComparisonRowChange(idx, "revelation", e.target.value)}
                              placeholder="100% Placement Guarantee with direct corporate referrals"
                              className="w-full bg-brand-orange/5 border border-brand-orange/20 rounded-xl px-3 py-2 text-xs font-semibold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange focus:bg-white resize-none"
                            />
                          </td>
                          <td className="p-3 align-top">
                            <textarea
                              rows={2}
                              value={row.others}
                              onChange={(e) => handleComparisonRowChange(idx, "others", e.target.value)}
                              placeholder="Job notifications / forward resume only"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-muted placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white resize-none"
                            />
                          </td>
                          <td className="p-3 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveComparisonRow(idx)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Remove Row"
                              aria-label={`Remove row ${idx + 1}`}
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleAddComparisonRow}
                className="w-full py-3 rounded-xl border border-dashed border-gray-300 hover:border-brand-dark text-brand-muted hover:text-brand-dark font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer bg-gray-50/50 hover:bg-white"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Comparison Row</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: COURSE CURRICULUM (SECTION 5) */}
        {/* ========================================================================= */}
        {activeTab === "curriculum" && (
          <div className="space-y-10">
            {/* 1. Header Text (Grid Layout) */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <ListTree className="w-3.5 h-3.5" />
                  <span>Section 5 Header</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Header Text
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Configure the curriculum eyebrow badge, main title, and introductory text.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Eyebrow */}
                <div>
                  <label
                    htmlFor="syllabus_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Eyebrow (e.g., COMPREHENSIVE SYLLABUS)
                  </label>
                  <input
                    id="syllabus_eyebrow"
                    type="text"
                    name="syllabus_eyebrow"
                    value={formData.syllabus_eyebrow}
                    onChange={handleInputChange}
                    placeholder="COMPREHENSIVE SYLLABUS"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Heading */}
                <div>
                  <label
                    htmlFor="syllabus_heading"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Heading *
                  </label>
                  <input
                    id="syllabus_heading"
                    type="text"
                    name="syllabus_heading"
                    value={formData.syllabus_heading}
                    onChange={handleInputChange}
                    placeholder="Curriculum designed for the modern industry."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Main Description */}
                <div>
                  <label
                    htmlFor="syllabus_description"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Main Description
                  </label>
                  <textarea
                    id="syllabus_description"
                    name="syllabus_description"
                    rows={3}
                    value={formData.syllabus_description}
                    onChange={handleInputChange}
                    placeholder="Click any module to inspect the detailed topic breakdown and hands-on projects."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Modules Repeater (curriculum) */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Modules &amp; Topics</span>
                  </div>
                  <h3 className="text-[18px] font-bold text-brand-dark">
                    Curriculum Modules ({formData.curriculum.length})
                  </h3>
                  <p className="text-[13px] text-brand-muted mt-0.5">
                    Manage modules with expandable sub-topics and practical lab points.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-4 py-2 rounded-xl bg-brand-dark text-white font-bold text-[13px] hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Modules List */}
              <div className="space-y-8">
                {formData.curriculum.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-200/80 text-gray-400 italic">
                    No curriculum modules added yet. Click &quot;Add Module&quot; above.
                  </div>
                ) : (
                  formData.curriculum.map((mod, modIdx) => (
                    <div
                      key={modIdx}
                      className="p-6 md:p-7 rounded-2xl bg-gray-50 border border-gray-200/90 relative space-y-5 hover:border-gray-300 transition-colors shadow-2xs"
                    >
                      {/* Module Header Bar */}
                      <div className="flex items-center justify-between border-b border-gray-200/80 pb-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-brand-orange text-white text-sm font-bold flex items-center justify-center font-heading">
                            {mod.number || String(modIdx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h4 className="text-[16px] font-bold text-brand-dark leading-tight">
                              {mod.title || `Module #${modIdx + 1}`}
                            </h4>
                            <span className="text-[12px] font-semibold text-brand-blue">
                              {mod.duration || "Duration not set"}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveModule(modIdx)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Module"
                          aria-label={`Delete Module ${mod.number || modIdx + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Module Main Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Number */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Module Number *
                          </label>
                          <input
                            type="text"
                            value={mod.number}
                            onChange={(e) => handleModuleChange(modIdx, "number", e.target.value)}
                            placeholder="01"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark font-bold placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Duration */}
                        <div>
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Duration *
                          </label>
                          <input
                            type="text"
                            value={mod.duration}
                            onChange={(e) => handleModuleChange(modIdx, "duration", e.target.value)}
                            placeholder="Weeks 1 - 3"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-2">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Module Title *
                          </label>
                          <input
                            type="text"
                            value={mod.title}
                            onChange={(e) => handleModuleChange(modIdx, "title", e.target.value)}
                            placeholder="e.g. Manual Testing Fundamentals & Agile QA"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark font-bold placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                          />
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-4">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider mb-1.5">
                            Module Overview / Description
                          </label>
                          <textarea
                            rows={2}
                            value={mod.description}
                            onChange={(e) => handleModuleChange(modIdx, "description", e.target.value)}
                            placeholder="Master core software testing principles, SDLC models, STLC methodologies, and enterprise test case design."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* NESTED TOPICS REPEATER */}
                      <div className="pt-3 border-t border-gray-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-[12px] font-bold text-brand-dark uppercase tracking-wider">
                            Detailed Topics / Sub-points ({mod.topics?.length || 0} items)
                          </label>
                        </div>

                        {/* Topics List */}
                        <div className="space-y-2">
                          {!mod.topics || mod.topics.length === 0 ? (
                            <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-400 italic">
                              No topics added to this module yet. Add topics below.
                            </div>
                          ) : (
                            mod.topics.map((topic, topicIdx) => (
                              <div
                                key={topicIdx}
                                className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs"
                              >
                                <span className="w-5 h-5 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-[11px] font-bold shrink-0">
                                  ✓
                                </span>
                                <input
                                  type="text"
                                  value={topic}
                                  onChange={(e) => handleTopicChange(modIdx, topicIdx, e.target.value)}
                                  placeholder="Topic breakdown..."
                                  className="flex-1 bg-transparent border-none text-xs sm:text-sm font-semibold text-brand-dark focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTopic(modIdx, topicIdx)}
                                  className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer shrink-0"
                                  title="Delete Topic"
                                  aria-label={`Delete topic ${topicIdx + 1}`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Topic Input Row */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={newTopicInputs[modIdx] || ""}
                            onChange={(e) => setNewTopicInputs((prev) => ({ ...prev, [modIdx]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTopic(modIdx);
                              }
                            }}
                            placeholder="Add another topic or drill (e.g. Bug Lifecycle in Jira)..."
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTopic(modIdx)}
                            className="px-4 py-2 rounded-xl bg-brand-dark text-white font-bold text-xs hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Topic</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 3. Syllabus PDF Document (Lead-Gated Resource) */}
            <div className="space-y-6 pt-8 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lead-Gated Resource</span>
                </div>
                <h3 className="text-[18px] font-bold text-brand-dark">
                  Syllabus PDF Document
                </h3>
                <p className="text-[13px] text-brand-muted mt-0.5">
                  Upload a complete syllabus PDF for prospective students to download after submitting their contact information.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2">
                    Upload Syllabus PDF File
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-bold transition-all shadow-xs active:scale-95">
                      {isUploadingPdf ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span>{isUploadingPdf ? "Uploading PDF..." : "Choose PDF Document"}</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        disabled={isUploadingPdf}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-brand-muted">
                      Supports .pdf files up to 25MB (saved to /uploads/syllabuses/)
                    </span>
                  </div>
                  {pdfUploadError && (
                    <p className="text-xs text-red-600 font-semibold mt-2">
                      {pdfUploadError}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="syllabus_pdf_url"
                    className="block text-[13px] font-bold text-brand-dark uppercase tracking-wider mb-2"
                  >
                    Syllabus PDF Document URL
                  </label>
                  <input
                    id="syllabus_pdf_url"
                    type="text"
                    name="syllabus_pdf_url"
                    value={formData.syllabus_pdf_url}
                    onChange={handleInputChange}
                    placeholder="/uploads/syllabuses/software-testing-syllabus.pdf"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-all shadow-2xs"
                  />
                  <p className="text-xs text-brand-muted mt-1.5">
                    Enter a direct relative or absolute URL to the PDF, or use the file uploader above.
                  </p>
                </div>

                {formData.syllabus_pdf_url && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">Attached: <strong className="font-bold">{formData.syllabus_pdf_url}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <a
                        href={formData.syllabus_pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-blue hover:underline font-bold inline-flex items-center gap-1"
                      >
                        <span>Preview PDF</span>
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, syllabus_pdf_url: "" }))}
                        className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 7: COURSE BATCHES & ENROLLMENT */}
        {/* ========================================================================= */}
        {activeTab === "batches" && (
          <div className="space-y-10">
            {/* SECTION 1: HEADER TEXTS */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Section Header</span>
                </div>
                <h2 className="text-[20px] font-bold text-brand-dark">
                  Batch Timings &amp; Schedules Header
                </h2>
                <p className="text-brand-muted text-[13px] mt-0.5">
                  Configure the title, eyebrow tag, and subtitle shown above the batch comparison cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="batches_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Eyebrow / Sub-Header Tag
                  </label>
                  <input
                    id="batches_eyebrow"
                    name="batches_eyebrow"
                    type="text"
                    value={formData.batches_eyebrow}
                    onChange={handleInputChange}
                    placeholder="e.g. BATCH TIMINGS & ENROLLMENT"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="batches_heading"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Section Heading *
                  </label>
                  <input
                    id="batches_heading"
                    name="batches_heading"
                    type="text"
                    required
                    value={formData.batches_heading}
                    onChange={handleInputChange}
                    placeholder="e.g. Choose the batch that fits your schedule."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="batches_description"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Section Description
                  </label>
                  <textarea
                    id="batches_description"
                    name="batches_description"
                    rows={2}
                    value={formData.batches_description}
                    onChange={handleInputChange}
                    placeholder="e.g. Flexible options for students, job seekers, and working professionals."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: BATCH OPTIONS REPEATER */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Batch Offerings &amp; Schedules</span>
                  </div>
                  <h2 className="text-[20px] font-bold text-brand-dark">
                    Configured Batch Cards ({formData.batch_options.length})
                  </h2>
                  <p className="text-brand-muted text-[13px] mt-0.5">
                    Manage the interactive batch cards rendered on the course landing page and in the enrollment form.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddBatchOption}
                  className="px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-[#e06b24] text-white font-bold text-[13px] flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Batch Option</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.batch_options.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-brand-dark">No Batch Options Defined</p>
                    <p className="text-xs text-brand-muted mt-1">Click &quot;Add Batch Option&quot; above to create your first course schedule.</p>
                  </div>
                ) : (
                  formData.batch_options.map((batch, batchIdx) => (
                    <div
                      key={batch.id || batchIdx}
                      className={`p-6 rounded-2xl border transition-all space-y-5 ${
                        batch.popular
                          ? "bg-brand-orange/5 border-brand-orange/40 shadow-sm"
                          : "bg-gray-50/70 border-gray-200"
                      }`}
                    >
                      {/* Batch Header Bar */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200/80">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-brand-dark text-white text-xs font-bold flex items-center justify-center">
                            #{batchIdx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-sm text-brand-dark">
                              {batch.name || "Untitled Batch"}
                            </span>
                            {batch.popular && (
                              <span className="ml-2.5 px-2.5 py-0.5 bg-brand-orange text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full">
                                Featured / Popular
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBatchOption(batchIdx)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Batch Option"
                          aria-label={`Delete batch ${batch.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Batch Inputs Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Batch Identifier / Unique ID (Slug) *
                          </label>
                          <input
                            type="text"
                            value={batch.id}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "id", e.target.value)}
                            placeholder="e.g. weekday-online, weekend-online, offline-pune"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Batch Name / Title *
                          </label>
                          <input
                            type="text"
                            value={batch.name}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "name", e.target.value)}
                            placeholder="e.g. Weekday Batch, Weekend Batch"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Format / Delivery Mode *
                          </label>
                          <input
                            type="text"
                            value={batch.type}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "type", e.target.value)}
                            placeholder="e.g. Live Online (Zoom) or Offline Pune Campus"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Class Timing Schedule *
                          </label>
                          <input
                            type="text"
                            value={batch.timing}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "timing", e.target.value)}
                            placeholder="e.g. Mon - Fri • 7:30 AM or 8:00 PM IST"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Duration &amp; Lab Commitment *
                          </label>
                          <input
                            type="text"
                            value={batch.duration}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "duration", e.target.value)}
                            placeholder="e.g. 3 Months (1.5 hrs/day) or 3 Months • In-Person Labs"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Badge / Highlight Pill Text
                          </label>
                          <input
                            type="text"
                            value={batch.badge}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "badge", e.target.value)}
                            placeholder="e.g. Fastest Progression, For Working Pros, ⭐ Popular in Pune"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Batch Description
                          </label>
                          <textarea
                            rows={2}
                            value={batch.description}
                            onChange={(e) => handleBatchOptionChange(batchIdx, "description", e.target.value)}
                            placeholder="e.g. Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs leading-relaxed"
                          />
                        </div>

                        {/* Popular Toggle */}
                        <div className="md:col-span-2 pt-1">
                          <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={batch.popular || false}
                              onChange={() => handleBatchPopularToggle(batchIdx)}
                              className="w-4 h-4 text-brand-orange rounded border-gray-300 focus:ring-brand-orange"
                            />
                            <span className="text-xs font-bold text-brand-dark">
                              Highlight as &quot;Popular / Most Recommended&quot; Batch (renders with prominent orange styling &amp; badge)
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 8: COURSE GUIDANCE & MENTORSHIP */}
        {/* ========================================================================= */}
        {activeTab === "guidance" && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                <Headphones className="w-3.5 h-3.5" />
                <span>Mentorship &amp; Counseling Banner</span>
              </div>
              <h2 className="text-[20px] font-bold text-brand-dark">
                1-on-1 Guidance &amp; Consultation Banner
              </h2>
              <p className="text-brand-muted text-[13px] mt-0.5">
                Configure the high-converting dark callout banner offering 1-on-1 profile evaluations and direct WhatsApp counseling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="guidance_eyebrow"
                  className="block text-[13px] font-bold text-brand-dark mb-2"
                >
                  Eyebrow Tag (e.g., 1-ON-1 CAREER GUIDANCE)
                </label>
                <input
                  id="guidance_eyebrow"
                  name="guidance_eyebrow"
                  type="text"
                  value={formData.guidance_eyebrow}
                  onChange={handleInputChange}
                  placeholder="e.g. 1-ON-1 CAREER GUIDANCE"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="guidance_title"
                  className="block text-[13px] font-bold text-brand-dark mb-2"
                >
                  Main Heading *
                </label>
                <input
                  id="guidance_title"
                  name="guidance_title"
                  type="text"
                  required
                  value={formData.guidance_title}
                  onChange={handleInputChange}
                  placeholder="e.g. Not sure if Software Testing is right for you?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-bold"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="guidance_description"
                  className="block text-[13px] font-bold text-brand-dark mb-2"
                >
                  Main Description (Textarea)
                </label>
                <textarea
                  id="guidance_description"
                  name="guidance_description"
                  rows={4}
                  value={formData.guidance_description}
                  onChange={handleInputChange}
                  placeholder="e.g. Get a free 1-on-1 profile evaluation with our Chief QA Architect. We will review your background, assess your aptitude, and recommend the fastest roadmap to break into IT."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}


        {/* ========================================================================= */}
        {/* TAB 9: CERTIFICATION VALIDATION */}
        {/* ========================================================================= */}
        {activeTab === "certification" && (
          <div className="space-y-10">
            {/* SECTION 1: HEADER & IMAGE */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Certificate Presentation</span>
                </div>
                <h2 className="text-[20px] font-bold text-brand-dark">
                  Certification Validation Header &amp; Image
                </h2>
                <p className="text-brand-muted text-[13px] mt-0.5">
                  Configure the accreditation badge, title, certificate photo/mockup, and description.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cert_eyebrow"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Eyebrow (e.g., ACCREDITED &amp; RECOGNIZED)
                  </label>
                  <input
                    id="cert_eyebrow"
                    name="cert_eyebrow"
                    type="text"
                    value={formData.cert_eyebrow}
                    onChange={handleInputChange}
                    placeholder="e.g. ACCREDITED & RECOGNIZED"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cert_heading"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Main Heading *
                  </label>
                  <input
                    id="cert_heading"
                    name="cert_heading"
                    type="text"
                    required
                    value={formData.cert_heading}
                    onChange={handleInputChange}
                    placeholder="e.g. Industry-Recognized QA Certification."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-bold"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label
                    htmlFor="cert_image_url"
                    className="block text-[13px] font-bold text-brand-dark"
                  >
                    Certificate Image URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    <input
                      id="cert_image_url"
                      name="cert_image_url"
                      type="text"
                      value={formData.cert_image_url}
                      onChange={handleInputChange}
                      placeholder="e.g. /uploads/certificates/... or https://..."
                      className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-mono text-xs"
                    />

                    {/* Stylized File Upload Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="cursor-pointer px-4 py-3 rounded-xl bg-brand-dark hover:bg-black text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm active:scale-95">
                        <Upload className="w-4 h-4 text-brand-orange" />
                        <span>{isUploadingCertImage ? "Uploading..." : "Upload Certificate Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCertificateUpload}
                          disabled={isUploadingCertImage}
                          className="hidden"
                        />
                      </label>
                      {isUploadingCertImage && (
                        <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />
                      )}
                    </div>

                    {/* Image Preview Thumbnail */}
                    {formData.cert_image_url && (
                      <div className="w-20 h-14 rounded-xl border border-gray-200 overflow-hidden shrink-0 relative bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.cert_image_url}
                          alt="Certificate Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {certImageUploadError && (
                    <p className="text-xs text-red-500 font-semibold">{certImageUploadError}</p>
                  )}
                  <p className="text-xs text-brand-muted">
                    Paste an image URL or click &quot;Upload Certificate Image&quot; to choose a local file from your computer.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="cert_description"
                    className="block text-[13px] font-bold text-brand-dark mb-2"
                  >
                    Main Description (Textarea)
                  </label>
                  <textarea
                    id="cert_description"
                    name="cert_description"
                    rows={3}
                    value={formData.cert_description}
                    onChange={handleInputChange}
                    placeholder="e.g. Upon passing our capstone automation framework review and comprehensive mock technical panel, you receive a tamper-proof digital certificate that hiring managers instantly respect."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: 3 FIXED CERTIFICATION FEATURES */}
            <div className="space-y-6 pt-4 border-t border-gray-100">
              <div className="border-b border-gray-100 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/10 text-brand-blue text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Core Accreditation Highlights</span>
                </div>
                <h2 className="text-[20px] font-bold text-brand-dark">
                  Accreditation Highlights (3 Fixed Features)
                </h2>
                <p className="text-brand-muted text-[13px] mt-0.5">
                  Configure the three key credential features displayed alongside the certificate mockup.
                </p>
              </div>

              <div className="space-y-5">
                {[0, 1, 2].map((featureIdx) => {
                  const item = formData.cert_features[featureIdx] || { title: "", desc: "" };
                  return (
                    <div
                      key={featureIdx}
                      className="p-6 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-4"
                    >
                      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                        <span className="w-7 h-7 rounded-lg bg-brand-dark text-white text-xs font-bold flex items-center justify-center">
                          #{featureIdx + 1}
                        </span>
                        <span className="font-bold text-sm text-brand-dark">
                          Feature {featureIdx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Feature Title *
                          </label>
                          <input
                            type="text"
                            value={item.title || ""}
                            onChange={(e) => handleCertFeatureChange(featureIdx, "title", e.target.value)}
                            placeholder="e.g. Verifiable Digital Credential"
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs font-bold"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-brand-dark mb-1.5">
                            Feature Description *
                          </label>
                          <input
                            type="text"
                            value={item.desc || ""}
                            onChange={(e) => handleCertFeatureChange(featureIdx, "desc", e.target.value)}
                            placeholder="e.g. Includes a unique certificate ID and QR code for one-click verification by tech recruiters."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-orange shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/dashboard/courses"
            className="text-[14px] font-bold text-brand-muted hover:text-brand-dark transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-3.5 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
              saveSuccess
                ? "bg-green-600 text-white shadow-green-600/25"
                : "bg-brand-orange hover:bg-[#e06b24] text-white shadow-brand-orange/25"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>
                  Save{" "}
                  {activeTab === "card"
                    ? "Course Card Info"
                    : activeTab === "landing"
                    ? "Landing Page"
                    : activeTab === "overview"
                    ? "Course Overview"
                    : activeTab === "features"
                    ? "Key Features"
                    : activeTab === "audiences"
                    ? "Target Audiences"
                    : activeTab === "comparison"
                    ? "Comparison Table"
                    : activeTab === "curriculum"
                    ? "Course Curriculum"
                    : activeTab === "batches"
                    ? "Batch Timings"
                    : activeTab === "guidance"
                    ? "Guidance Section"
                    : "Certification"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
