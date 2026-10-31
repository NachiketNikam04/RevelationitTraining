import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { Hero } from "@/components/sections/Hero";
import { AboutUs } from "@/components/sections/AboutUs";
import { Features } from "@/components/sections/Features";
import { Impact } from "@/components/sections/Impact";
import { Course } from "@/components/sections/Course";
import { Batches } from "@/components/sections/Batches";
import { Team } from "@/components/sections/Team";
import { Services } from "@/components/sections/Services";
import { KeyFeatures } from "@/components/sections/KeyFeatures";
import { Blog } from "@/components/sections/Blog";
import { FAQ } from "@/components/sections/FAQ";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-brand-bg text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      {/* 0. Premium Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* 1. Global Subtle Grid Background Texture */}
      <BackgroundTexture />

      {/* 2. Hero Section with Floating Animated Elements */}
      <Hero />

      {/* 3. About Us Section with Image & Trust Badge */}
      <AboutUs />

      {/* 4. Bento Grid & Social Proof Section */}
      <Features />

      {/* 5. Impact & Metrics Statistics Counter Section */}
      <Impact />

      {/* 6. Featured Flagship Course Showcase */}
      <Course />

      {/* 7. Upcoming Training Batches & Schedule */}
      <Batches showViewAll={true} />

      {/* 8. Meet Our Team Interactive Mentor Showcase */}
      <Team />

      {/* 8. Core Services Sticky Scroll-Spy Section */}
      <Services />

      {/* 9. Key Features Horizontal Hover Accordion */}
      <KeyFeatures />

      {/* 10. Animated Blog & Insights Magazine Section */}
      <Blog />

      {/* 11. FAQ / Common Questions Hover Accordion */}
      <FAQ />

      {/* 12. Interactive Testimonial Hanger Carousel */}
      <Testimonials />

      {/* 13. Interactive Parallax CTA Banner */}
      <CTA />

      {/* 14. Comprehensive Mega-Footer */}
      <Footer />

      {/* 15. Persistent Floating Actions Dock */}
      <FloatingActions />
    </main>
  );
}