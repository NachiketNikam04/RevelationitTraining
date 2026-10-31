import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutFeatures } from "@/components/sections/AboutFeatures";
import { Team } from "@/components/sections/Team";
import { CorporatePartners } from "@/components/sections/CorporatePartners";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export const metadata: Metadata = {
  title: "About Us | Revelation IT Training",
  description:
    "Learn about our mission, vision, and team at Revelation IT Training. Empowering the next generation of software testing and automation leaders.",
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      {/* 0. Fixed Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* 1. Subtle Background Texture Overlay */}
      <BackgroundTexture />

      {/* 2. Dedicated About Us Hero Section */}
      <AboutHero />

      {/* 3. Two-Part Alternating Feature Section */}
      <AboutFeatures />

      {/* 4. Meet Our Team Mentor Showcase */}
      <Team />

      {/* 5. Corporate Hiring Partners Infinite Marquee */}
      <CorporatePartners />

      {/* 6. Interactive Parallax CTA Banner */}
      <CTA />

      {/* 7. Comprehensive Mega-Footer */}
      <Footer />

      {/* 8. Persistent Floating Actions Dock */}
      <FloatingActions />
    </main>
  );
}