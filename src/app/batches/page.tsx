import type { Metadata } from "next";
import { pool, initDbSchema } from "@/backend/config/db";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { BatchesClient, type AggregatedBatch, type UniqueCourse } from "@/components/sections/BatchesClient";
import { CorporatePartners } from "@/components/sections/CorporatePartners";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Sparkles, Calendar, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Upcoming Batches & Schedules | Revelation IT Training",
  description:
    "Explore upcoming weekday, weekend, and offline classroom batches across all tech pathways at Revelation IT Training Pune.",
};

async function getAggregatedBatches(): Promise<{
  uniqueCourses: UniqueCourse[];
  aggregatedBatches: AggregatedBatch[];
}> {
  try {
    await initDbSchema();
    const result = await pool.query(`
      SELECT id, title, slug, batch_options 
      FROM courses 
      WHERE status = 'Published' AND batch_options IS NOT NULL
      ORDER BY id ASC;
    `);

    let courses = result.rows;

    // Fallback if no published courses with batch_options yet
    if (courses.length === 0) {
      courses = [
        {
          id: 1,
          title: "Complete Software Testing & Automation Bootcamp",
          slug: "software-testing-bootcamp",
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
        },
      ];
    }

    const uniqueCourses: UniqueCourse[] = [];
    const aggregatedBatches: AggregatedBatch[] = [];

    courses.forEach((c: any) => {
      uniqueCourses.push({
        id: c.id,
        title: c.title,
        slug: c.slug,
      });

      let options = c.batch_options;
      if (typeof options === "string") {
        try {
          options = JSON.parse(options);
        } catch {
          options = [];
        }
      }

      if (Array.isArray(options)) {
        options.forEach((batch: any) => {
          aggregatedBatches.push({
            id: batch.id || `batch-${Math.random()}`,
            name: batch.name || "Scheduled Batch",
            type: batch.type || "Live Online",
            timing: batch.timing || "Flexible Timings",
            duration: batch.duration || "3 Months",
            badge: batch.badge || "",
            popular: Boolean(batch.popular),
            description: batch.description || "",
            courseId: c.id,
            courseTitle: c.title,
            courseSlug: c.slug,
          });
        });
      }
    });

    return { uniqueCourses, aggregatedBatches };
  } catch (error) {
    console.error("Error loading aggregated batches:", error);
    return {
      uniqueCourses: [],
      aggregatedBatches: [],
    };
  }
}

export default async function BatchesPage() {
  const { uniqueCourses, aggregatedBatches } = await getAggregatedBatches();

  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange scroll-smooth">
      {/* 0. Fixed Sticky Navigation */}
      <Navbar />

      {/* 1. Subtle Global Background Texture */}
      <BackgroundTexture />

      {/* 2. Premium Batches Hero Section */}
      <section className="relative bg-brand-dark text-white pt-36 pb-20 md:pt-44 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-orange/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-brand-blue/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <span>UPCOMING SCHEDULES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Find the perfect time to upskill.
          </h1>

          <p className="text-gray-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
            Explore our upcoming weekday, weekend and online classroom batches across all tech pathways.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm font-semibold text-gray-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Morning &amp; Evening Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-blue" />
              <span>New Batches Every Month</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Placement Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Client Dynamic Batches Aggregator */}
      <BatchesClient
        uniqueCourses={uniqueCourses}
        aggregatedBatches={aggregatedBatches}
      />

      {/* 4. Corporate Hiring Network */}
      <CorporatePartners />

      {/* 5. Interactive Parallax CTA Banner */}
      <CTA />

      {/* 6. Comprehensive Mega-Footer */}
      <Footer />

      {/* 7. Persistent Floating Actions Dock */}
      <FloatingActions />
    </main>
  );
}
