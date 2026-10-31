import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { CourseCatalog } from "@/components/sections/courses/CourseCatalog";
import { CorporatePartners } from "@/components/sections/CorporatePartners";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export const metadata: Metadata = {
  title: "All Courses | Revelation IT Training",
  description:
    "Explore our industry-led Software Testing, QA Automation, and ISTQB certification courses designed for career transformation.",
};

export default function CoursesPage() {
  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      {/* 0. Fixed Glassmorphic Navigation */}
      <Navbar />

      {/* 1. Subtle Background Texture Overlay */}
      <BackgroundTexture />

      {/* 2. Course Catalog Hero, Stats, Filters, & Spotlight Card */}
      <CourseCatalog />

      {/* 3. Corporate Hiring Partners Infinite Marquee */}
      <CorporatePartners />

      {/* 4. Interactive Parallax CTA Banner */}
      <CTA />

      {/* 5. Comprehensive Mega-Footer */}
      <Footer />

      {/* 6. Persistent Floating Actions Dock */}
      <FloatingActions />
    </main>
  );
}