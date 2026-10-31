"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BatchCard, Batch } from "@/components/ui/BatchCard";
import { EnrollmentModal } from "@/components/ui/EnrollmentModal";

export function Batches({ showViewAll = true }: { showViewAll?: boolean }) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    async function fetchBatches() {
      try {
        const res = await fetch("/api/batches", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.batches) && data.batches.length > 0) {
            setBatches(data.batches);
          }
        }
      } catch (error) {
        console.error("Failed to fetch batches for homepage:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBatches();
  }, []);

  const handleEnroll = (batch: Batch) => {
    const label = batch.courseTitle
      ? `${batch.courseTitle} - ${batch.name || batch.title}`
      : (batch.name || batch.title || "Software Testing Cohort");
    setSelectedBatch(label);
    setIsModalOpen(true);
  };

  // Limit to 3 most recent / upcoming batches for the homepage showcase
  const displayedBatches = batches.slice(0, 3);

  return (
    <section
      id="batches-list"
      className="bg-brand-bg py-12 md:py-16 px-6 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em] mb-2">
            <span>ENROLLMENT OPEN</span>
          </div>

          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark mb-4 text-center tracking-tight">
            Upcoming Training Batches
          </h2>

          <p className="text-[16px] md:text-[18px] font-normal leading-[1.7] text-brand-muted mb-10 md:mb-12 text-center max-w-2xl mx-auto">
            Secure your seat in our next intensive QA Automation cohort.
          </p>
        </div>

        {/* 3-Column Batches Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onEnroll={handleEnroll}
            />
          ))}
        </div>

        {/* View All Batches CTA Button */}
        {showViewAll && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <Link
              className="bg-brand-bg border-2 border-brand-dark text-brand-dark px-8 py-3.5 rounded-full hover:bg-brand-dark hover:text-white transition-all font-semibold inline-flex items-center gap-2 group shadow-sm"
              href="/batches"
            >
              <span>View All Batches</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
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

export default Batches;
