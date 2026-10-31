import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export const metadata: Metadata = {
  title: "Contact Us | Revelation IT Training",
  description:
    "Have questions about our software testing courses, batches, or placement guarantees? Get in touch with our admissions and career mentorship team in Pune.",
};

export default function ContactPage() {
  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      {/* 0. Fixed Glassmorphic Navigation */}
      <Navbar />

      {/* 1. Subtle Background Texture Overlay */}
      <BackgroundTexture />

      {/* 2. Contact Page Section (Direct Connect Cards, Team Contacts & Query Form) */}
      <ContactSection />

      {/* 3. Comprehensive Mega-Footer */}
      <Footer />

      {/* 4. Persistent Floating Actions Dock */}
      <FloatingActions />
    </main>
  );
}