"use client";

import React, { useState, useEffect } from "react";
import { Layers } from "lucide-react";
import { BatchCard, Batch } from "@/components/ui/BatchCard";
import { EnrollmentModal } from "@/components/ui/EnrollmentModal";

export type AggregatedBatch = Batch;

export interface UniqueCourse {
  id: number;
  title: string;
  slug: string;
}

export interface BatchesClientProps {
  uniqueCourses?: UniqueCourse[];
  aggregatedBatches?: Batch[];
}

export function BatchesClient({
  uniqueCourses: initialCourses = [],
  aggregatedBatches: initialBatches = [],
}: BatchesClientProps) {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);
  const [uniqueCourses, setUniqueCourses] = useState<UniqueCourse[]>(initialCourses);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    async function loadBatches() {
      try {
        const res = await fetch("/api/batches", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.batches)) {
            setBatches(data.batches);
            if (Array.isArray(data.uniqueCourses) && data.uniqueCourses.length > 0) {
              setUniqueCourses(data.uniqueCourses);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load batches from /api/batches:", err);
      }
    }

    loadBatches();
  }, []);

  const filteredBatches =
    selectedCourseSlug === "all"
      ? batches
      : batches.filter((b) => b.courseSlug === selectedCourseSlug);

  const handleEnroll = (batch: Batch) => {
    const label = batch.courseTitle
      ? `${batch.courseTitle} - ${batch.name || batch.title}`
      : (batch.name || batch.title || "Scheduled Batch");
    setSelectedBatch(label);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-brand-bg py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-100/60">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-12">
        {/* Dynamic Horizontal Filter Bar (Rendered ONLY if uniqueCourses > 1) */}
        {uniqueCourses.length > 1 && (
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCourseSlug("all")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                selectedCourseSlug === "all"
                  ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25 scale-105"
                  : "bg-white text-brand-muted hover:text-brand-dark hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Pathways ({batches.length})
            </button>

            {uniqueCourses.map((course) => {
              const isActive = selectedCourseSlug === course.slug;
              const count = batches.filter((b) => b.courseSlug === course.slug).length;

              return (
                <button
                  key={course.slug}
                  type="button"
                  onClick={() => setSelectedCourseSlug(course.slug)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                    isActive
                      ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25 scale-105"
                      : "bg-white text-brand-muted hover:text-brand-dark hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {course.title} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Batch Cards Grid */}
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gray-200 shadow-sm">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-brand-dark">No Active Batches Found</h3>
            <p className="text-sm text-brand-muted mt-2">
              We are finalizing the schedule for this pathway. Please contact our counselors or check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBatches.map((batch) => (
              <BatchCard
                key={`${batch.courseSlug || "course"}-${batch.id}`}
                batch={batch}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>

      {/* Global Enrollment Modal */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultCourse={selectedBatch}
      />
    </section>
  );
}

export default BatchesClient;
