"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export interface Batch {
  id: string;
  name: string;
  title?: string;
  courseTitle?: string;
  courseSlug?: string;
  courseId?: number;
  type?: string;
  mode?: string;
  timing?: string;
  schedule?: string;
  startDate?: string;
  duration?: string;
  badge?: string;
  popular?: boolean;
  seats?: string;
  description?: string;
  features?: string[];
}

export interface BatchCardProps {
  batch?: Batch;
  onEnroll?: (batch: Batch) => void;
  className?: string;
  // Also support flat props
  id?: string;
  name?: string;
  title?: string;
  courseTitle?: string;
  courseSlug?: string;
  courseId?: number;
  type?: string;
  mode?: string;
  timing?: string;
  schedule?: string;
  startDate?: string;
  duration?: string;
  badge?: string;
  popular?: boolean;
  seats?: string;
  description?: string;
  features?: string[];
}

export function BatchCard(props: BatchCardProps) {
  const batch: Batch = props.batch || {
    id: props.id || "",
    name: props.name || props.title || "Upcoming Batch",
    title: props.title || props.name || "Upcoming Batch",
    courseTitle: props.courseTitle || "Software Testing & Automation",
    courseSlug: props.courseSlug || "software-testing-bootcamp",
    courseId: props.courseId,
    type: props.type || props.mode || "Live Online (Zoom)",
    mode: props.mode || props.type || "Live Online (Zoom)",
    timing: props.timing || props.schedule || "Flexible Timings",
    schedule: props.schedule || props.timing || "Flexible Timings",
    startDate: props.startDate,
    duration: props.duration || "3 Months",
    badge: props.badge,
    popular: Boolean(props.popular),
    seats: props.seats,
    description: props.description || "",
    features: props.features,
  };

  const displayName = batch.name || batch.title || "Scheduled Batch";
  const displayTiming = batch.timing || batch.schedule || "Flexible Timings";
  const displayMode = batch.type || batch.mode || "Live Online (Zoom)";
  const isOffline = displayMode.toLowerCase().includes("offline");

  return (
    <div
      className={`bg-white rounded-3xl p-7 md:p-8 flex flex-col justify-between transition-all duration-300 relative group shadow-sm hover:shadow-xl ${
        batch.popular
          ? "border-2 border-brand-orange ring-2 ring-brand-orange/15 hover:border-brand-orange"
          : "border border-gray-200 hover:border-brand-blue/30"
      } ${props.className || ""}`}
    >
      {/* Floating Popular Badge */}
      {batch.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap z-10 flex items-center gap-1.5">
          <span>{batch.badge || "⭐ Popular Choice"}</span>
        </div>
      )}

      <div>
        {/* Course Context Label & Inline Badge / Duration */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {batch.courseTitle ? (
            <span
              className="text-[11px] font-extrabold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full truncate max-w-[210px]"
              title={batch.courseTitle}
            >
              {batch.courseTitle}
            </span>
          ) : batch.badge ? (
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              {batch.badge}
            </span>
          ) : (
            <span />
          )}

          {!batch.popular && batch.badge ? (
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full shrink-0">
              {batch.badge}
            </span>
          ) : batch.duration ? (
            <span className="text-[11px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-2.5 py-0.5 rounded-full uppercase tracking-wide shrink-0">
              {batch.duration}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-1 tracking-tight">
          {displayName}
        </h3>

        {/* Mode Tag */}
        <p className="text-xs font-semibold text-brand-muted mb-4">
          {displayMode}
        </p>

        {/* Schedule / Timing Pill Box */}
        <div className="my-4 p-4 rounded-2xl bg-brand-bg/90 border border-gray-200/60 space-y-2.5">
          {batch.startDate && batch.startDate !== "Upcoming Batch" && (
            <div className="text-[14px] font-medium text-brand-muted flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-brand-orange shrink-0" />
              <span className="text-brand-dark font-semibold">{batch.startDate}</span>
            </div>
          )}

          <div className="text-[14px] font-medium text-brand-muted flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-brand-blue shrink-0" />
            <span className="text-brand-dark font-semibold">{displayTiming}</span>
          </div>

          <div className="text-[14px] font-medium text-brand-muted flex items-center gap-2.5">
            {isOffline ? (
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Video className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{displayMode}</span>
          </div>

          {batch.seats && (
            <div className="text-[13px] font-bold text-brand-dark flex items-center gap-2.5 pt-1 border-t border-gray-200/50">
              <Users className="w-4 h-4 text-brand-muted shrink-0" />
              <span>{batch.seats}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {batch.description && (
          <p className="text-[14px] leading-relaxed text-brand-muted mb-4">
            {batch.description}
          </p>
        )}

        {/* Included Highlights */}
        {Array.isArray(batch.features) && batch.features.length > 0 && (
          <div className="space-y-2 pb-5 pt-2 border-b border-gray-100 mb-6">
            {batch.features.slice(0, 3).map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-[13px] text-brand-dark"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={() => props.onEnroll?.(batch)}
        className="mt-4 w-full py-3.5 rounded-full font-bold text-sm transition-all active:scale-95 text-center flex items-center justify-center gap-2 bg-brand-orange text-white hover:bg-[#e06b24] shadow-md shadow-brand-orange/25 group cursor-pointer"
      >
        <span>Enroll in this Batch</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>
    </div>
  );
}

export default BatchCard;
