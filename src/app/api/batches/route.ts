import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";
import { Batch } from "@/components/ui/BatchCard";

export const dynamic = "force-dynamic";

const DEFAULT_FALLBACK_BATCHES: Batch[] = [
  {
    id: "batch-weekday-online",
    name: "Selenium Automation Testing",
    title: "Selenium Automation Testing",
    courseTitle: "Software Testing & Automation",
    courseSlug: "software-testing-bootcamp",
    type: "Live Online (Zoom)",
    mode: "Live Online (Zoom)",
    timing: "Mon - Fri • 7:30 AM or 8:00 PM IST",
    schedule: "Mon - Fri • 7:30 AM or 8:00 PM IST",
    startDate: "Starts Oct 14, 2026",
    duration: "3 Months (1.5 hrs/day)",
    badge: "Fastest Progression",
    popular: false,
    seats: "Only 4 seats remaining",
    description: "Ideal for graduates and job seekers dedicated to fast-tracking their placement within 90 days.",
    features: [
      "100% Live Mentor-Led Sessions",
      "Recorded Lectures & Lifetime Notes",
      "Weekly 1-on-1 Doubt Clearing",
    ],
  },
  {
    id: "batch-weekend-online",
    name: "Weekend Batch",
    title: "Weekend Batch",
    courseTitle: "Software Testing & Automation",
    courseSlug: "software-testing-bootcamp",
    type: "Live Online (Zoom)",
    mode: "Live Online (Zoom)",
    timing: "Sat & Sun • 10:00 AM - 1:30 PM IST",
    schedule: "Sat & Sun • 10:00 AM - 1:30 PM IST",
    startDate: "Starts Oct 19, 2026",
    duration: "3.5 Months (3.5 hrs/day)",
    badge: "For Working Pros",
    popular: true,
    seats: "12 seats remaining",
    description: "Tailored for working professionals who want to upskill without disrupting their weekly work schedule.",
    features: [
      "Designed for Working Professionals",
      "Deep-Dive Weekend Framework Labs",
      "Mock Interviews & Resume Reviews",
    ],
  },
  {
    id: "batch-offline-classroom",
    name: "Classroom Batch",
    title: "Classroom Cohort",
    courseTitle: "Software Testing & Automation",
    courseSlug: "software-testing-bootcamp",
    type: "Offline Pune Campus",
    mode: "In-Person Classroom & Lab",
    timing: "Mon - Fri • Morning / Afternoon Batches",
    schedule: "Mon - Fri • Morning / Afternoon Batches",
    startDate: "Starts Oct 21, 2026",
    duration: "3 Months • In-Person Labs",
    badge: "⭐ Popular in Pune",
    popular: true,
    seats: "Pimpri-Chinchwad / Pune Campus",
    description: "Hands-on lab training at our Pimpri-Chinchwad / Pune campus with direct face-to-face mentor instruction.",
    features: [
      "Physical Lab & Dedicated Workstation",
      "Face-to-Face Mentorship & Coaching",
      "Direct On-Campus Placement Drives",
    ],
  },
];

// Helper to safely parse dates for chronological ordering (newest/upcoming first)
function parseStartDateScore(startDateStr?: string): number {
  if (!startDateStr) return 0;
  const cleaned = startDateStr.replace(/^starts\s+/i, "").trim();
  const timestamp = Date.parse(cleaned);
  return isNaN(timestamp) ? 0 : timestamp;
}

export async function GET() {
  try {
    await initDbSchema();

    const result = await pool.query(`
      SELECT id, title, slug, next_batch_text, batch_options, created_at 
      FROM courses 
      WHERE status = 'Published' AND batch_options IS NOT NULL 
      ORDER BY id ASC;
    `);

    const courses = result.rows;
    const uniqueCourses: { id: number; title: string; slug: string }[] = [];
    const batches: Batch[] = [];

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
        options.forEach((b: any, index: number) => {
          const batchName = b.name || b.title || "Upcoming Batch";
          const batchType = b.type || b.mode || "Live Online (Zoom)";
          const batchTiming = b.timing || b.schedule || "Flexible Timings";
          const batchDuration = b.duration || "3 Months";
          const batchStartDate = b.startDate || b.start_date || c.next_batch_text || "Upcoming Batch";
          const batchBadge = b.badge || (b.popular ? "⭐ Popular Choice" : "");
          const isPopular = Boolean(b.popular);

          batches.push({
            id: b.id || `batch-${c.id}-${index}`,
            name: batchName,
            title: batchName,
            courseTitle: c.title,
            courseSlug: c.slug,
            courseId: c.id,
            type: batchType,
            mode: batchType,
            timing: batchTiming,
            schedule: batchTiming,
            duration: batchDuration,
            startDate: batchStartDate,
            badge: batchBadge,
            popular: isPopular,
            seats: b.seats || (batchType.toLowerCase().includes("offline") ? "Pimpri-Chinchwad / Pune Campus" : "Seats Available"),
            description:
              b.description ||
              "Intensive corporate-grade software testing and automation training with 1-on-1 mentorship.",
            features: Array.isArray(b.features) && b.features.length > 0
              ? b.features
              : [
                  "100% Live Mentor-Led Sessions",
                  "Real-World Corporate Projects",
                  "Dedicated Placement Support",
                ],
          });
        });
      }
    });

    // If no batches in database yet, use the fallback list
    const finalBatches = batches.length > 0 ? batches : DEFAULT_FALLBACK_BATCHES;

    // Sort by start date (newest/upcoming first)
    finalBatches.sort((a, b) => {
      const scoreA = parseStartDateScore(a.startDate);
      const scoreB = parseStartDateScore(b.startDate);
      if (scoreA !== 0 && scoreB !== 0) {
        return scoreA - scoreB; // Earliest upcoming first
      }
      return 0;
    });

    return NextResponse.json(
      {
        success: true,
        batches: finalBatches,
        uniqueCourses: uniqueCourses.length > 0 ? uniqueCourses : [
          {
            id: 1,
            title: "Software Testing & Automation",
            slug: "software-testing-bootcamp",
          },
        ],
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/batches] GET Error:", error);
    return NextResponse.json(
      {
        success: true,
        batches: DEFAULT_FALLBACK_BATCHES,
        uniqueCourses: [
          {
            id: 1,
            title: "Software Testing & Automation",
            slug: "software-testing-bootcamp",
          },
        ],
        fallback: true,
      },
      { status: 200 }
    );
  }
}
