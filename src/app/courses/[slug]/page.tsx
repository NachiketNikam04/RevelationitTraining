import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pool, initDbSchema } from "@/backend/config/db";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { CourseDetail, defaultCourseData, type CourseData } from "@/components/sections/CourseDetail";
import { CorporatePartners } from "@/components/sections/CorporatePartners";
import { FAQ, type FAQItem } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

type Props = {
  params: Promise<{ slug: string }>;
};

const courseFaqs: FAQItem[] = [
  {
    question: "Do I need prior programming experience before joining this bootcamp?",
    answer:
      "No. We start from ground zero with core programming logic and Java fundamentals. Over 60% of our successful alumni joined with non-IT or non-coding backgrounds.",
  },
  {
    question: "How does the 100% Placement Guarantee work?",
    answer:
      "Upon completing the syllabus, building your capstone automation frameworks, and clearing our internal mock panels, our corporate placement cell directly refers your profile to our 40+ hiring partners until you accept an offer.",
  },
  {
    question: "Are class recordings provided if I miss a live lecture?",
    answer:
      "Yes, every live lecture is recorded in HD and uploaded to your student portal within 2 hours, along with source code repositories and class notes for lifetime access.",
  },
  {
    question: "Does the curriculum cover the ISTQB certification exam?",
    answer:
      "Yes, our syllabus is strictly aligned with the ISTQB Certified Tester Foundation Level (CTFL) syllabus. We provide official sample question banks, mock tests, and exam registration assistance.",
  },
  {
    question: "What is the difference between the Online and Offline Pune classroom batches?",
    answer:
      "Both tracks share the identical curriculum, live mentorship, and placement guarantee. The classroom batch in Pimpri-Chinchwad / Pune offers in-person lab access and face-to-face mentor interaction.",
  },
  {
    question: "Do you provide on-the-job support after I get hired?",
    answer:
      "Yes! Our unique Real-Job Support program gives you access to senior mentors during your first 90 days at your new job to help you navigate real corporate codebases and sprint tasks with confidence.",
  },
];

// Helper to safely parse JSONB fields from DB
function parseJsonField(field: any, fallback: any = []) {
  if (!field) return fallback;
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      return JSON.parse(field);
    } catch {
      return fallback;
    }
  }
  return field;
}

// Fetch Course Data from DB
async function getCourseBySlug(slug: string): Promise<CourseData | null> {
  try {
    await initDbSchema();
    const result = await pool.query("SELECT * FROM courses WHERE slug = $1 LIMIT 1", [slug]);

    if (result.rows.length === 0) {
      if (slug === "software-testing-bootcamp") {
        return defaultCourseData;
      }
      return null;
    }

    const row = result.rows[0];

    const courseData: CourseData = {
      id: row.id,
      slug: row.slug,
      subject: row.subject || defaultCourseData.subject,
      title: row.title || defaultCourseData.title,
      short_description: row.short_description || defaultCourseData.short_description,
      long_description: row.long_description || row.short_description || defaultCourseData.long_description,
      projects_count: row.projects_count || defaultCourseData.projects_count,
      accreditation_text: row.accreditation_text || defaultCourseData.accreditation_text,
      duration_mode: row.duration_mode || defaultCourseData.duration_mode,
      next_batch_text: row.next_batch_text || defaultCourseData.next_batch_text,
      accelerate_heading: row.accelerate_heading || defaultCourseData.accelerate_heading,
      accelerate_description: row.accelerate_description || defaultCourseData.accelerate_description,
      accelerate_bullets: parseJsonField(row.accelerate_bullets, defaultCourseData.accelerate_bullets),
      
      // Course Overview (Section 2)
      overview_eyebrow: row.overview_eyebrow || defaultCourseData.overview_eyebrow,
      overview_heading: row.overview_heading || defaultCourseData.overview_heading,
      overview_description: row.overview_description || defaultCourseData.overview_description,
      tech_stack: parseJsonField(row.tech_stack, defaultCourseData.tech_stack),
      outcome_title: row.outcome_title || defaultCourseData.outcome_title,
      outcome_text: row.outcome_text || defaultCourseData.outcome_text,
      overview_image_url: row.overview_image_url || defaultCourseData.overview_image_url,
      overview_badge_line1: row.overview_badge_line1 || defaultCourseData.overview_badge_line1,
      overview_badge_line2: row.overview_badge_line2 || defaultCourseData.overview_badge_line2,

      // Key Features (Section 3)
      advantages_eyebrow: row.advantages_eyebrow || defaultCourseData.advantages_eyebrow,
      advantages_heading: row.advantages_heading || defaultCourseData.advantages_heading,
      advantages_description: row.advantages_description || defaultCourseData.advantages_description,
      six_key_features: parseJsonField(row.six_key_features, defaultCourseData.six_key_features),

      // Target Audiences (Section 4A)
      pathways_eyebrow: row.pathways_eyebrow || defaultCourseData.pathways_eyebrow,
      pathways_heading: row.pathways_heading || defaultCourseData.pathways_heading,
      tailored_pathways: parseJsonField(row.tailored_pathways, defaultCourseData.tailored_pathways),

      // Comparison Table (Section 4B)
      comparison_eyebrow: row.comparison_eyebrow || defaultCourseData.comparison_eyebrow,
      comparison_heading: row.comparison_heading || defaultCourseData.comparison_heading,
      comparison_description: row.comparison_description || defaultCourseData.comparison_description,
      comparison_table: parseJsonField(row.comparison_table, defaultCourseData.comparison_table),

      // Course Curriculum (Section 5)
      syllabus_eyebrow: row.syllabus_eyebrow || defaultCourseData.syllabus_eyebrow,
      syllabus_heading: row.syllabus_heading || defaultCourseData.syllabus_heading,
      syllabus_description: row.syllabus_description || defaultCourseData.syllabus_description,
      syllabus_pdf_url: row.syllabus_pdf_url || defaultCourseData.syllabus_pdf_url || "",
      curriculum: parseJsonField(row.curriculum, defaultCourseData.curriculum),

      // Course Batches & Enrollment (Section 6)
      batches_eyebrow: row.batches_eyebrow || defaultCourseData.batches_eyebrow,
      batches_heading: row.batches_heading || defaultCourseData.batches_heading,
      batches_description: row.batches_description || defaultCourseData.batches_description,
      batch_options: parseJsonField(row.batch_options, defaultCourseData.batch_options),

      // Guidance & Mentorship (Section 7)
      guidance_eyebrow: row.guidance_eyebrow || defaultCourseData.guidance_eyebrow,
      guidance_title: row.guidance_title || defaultCourseData.guidance_title,
      guidance_description: row.guidance_description || defaultCourseData.guidance_description,
      // Certification Validation (Section 8)
      cert_eyebrow: row.cert_eyebrow || defaultCourseData.cert_eyebrow,
      cert_heading: row.cert_heading || defaultCourseData.cert_heading,
      cert_description: row.cert_description || defaultCourseData.cert_description,
      cert_image_url: row.cert_image_url || "",
      cert_features: parseJsonField(row.cert_features, defaultCourseData.cert_features),
    };

    return courseData;
  } catch (error) {
    console.error("[getCourseBySlug] DB Query error:", error);
    if (slug === "software-testing-bootcamp") {
      return defaultCourseData;
    }
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  const readableTitle = course?.title || (
    slug === "software-testing-bootcamp"
      ? "Complete Software Testing & Automation Bootcamp"
      : `${slug.replace(/-/g, " ")} | Course Details`
  );

  return {
    title: `${readableTitle} | Revelation IT Training`,
    description:
      course?.long_description?.slice(0, 160) ||
      "Master Manual Testing, Java, Selenium 4, and REST API testing to become a job-ready QA Automation Engineer in 3 months with 100% placement support.",
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange scroll-smooth">
      {/* 0. Fixed Glassmorphic Navigation */}
      <Navbar />

      {/* 1. Subtle Background Texture Overlay */}
      <BackgroundTexture />

      {/* 2. Comprehensive Course Detail Core */}
      <CourseDetail course={course} />

      {/* 3. Corporate Hiring Network */}
      <CorporatePartners />

      {/* 4. Frequently Asked Questions */}
      <FAQ items={courseFaqs} />

      {/* 5. Call To Action Footer Banner */}
      <CTA />

      {/* 6. Footer */}
      <Footer />

      {/* 7. Floating WhatsApp & Callback Trigger */}
      <FloatingActions />
    </main>
  );
}
