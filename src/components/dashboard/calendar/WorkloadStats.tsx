"use client";

import React, { useMemo } from "react";
import { Clock, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface WorkloadStatsProps {
  currentWeekBookings: InterviewBooking[];
}

export function WorkloadStats({ currentWeekBookings }: WorkloadStatsProps) {
  // Compute total booked hours
  const { bookedHours, percentage, status } = useMemo(() => {
    let totalMinutes = 0;

    for (const b of currentWeekBookings) {
      if (b.start_time && b.end_time) {
        const [sh, sm] = b.start_time.split(":").map(Number);
        const [eh, em] = b.end_time.split(":").map(Number);
        const startMin = (sh || 0) * 60 + (sm || 0);
        const endMin = (eh || 0) * 60 + (em || 0);
        if (endMin > startMin) {
          totalMinutes += endMin - startMin;
        }
      }
    }

    const hours = Math.round((totalMinutes / 60) * 10) / 10;
    // Capacity base: 10 hrs/day (7 AM - 5 PM) x 5 core weekdays = 50 hours capacity
    const capacityHours = 50;
    const pct = Math.min(100, Math.round((hours / capacityHours) * 100));

    let statLabel = "Light Workload";
    let colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";

    if (pct >= 75) {
      statLabel = "Near Capacity";
      colorClass = "text-rose-600 bg-rose-50 border-rose-200";
    } else if (pct >= 40) {
      statLabel = "Moderate Workload";
      colorClass = "text-brand-orange bg-brand-orange/10 border-brand-orange/30";
    }

    return {
      bookedHours: hours,
      percentage: pct,
      status: statLabel,
      colorClass,
    };
  }, [currentWeekBookings]);

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-brand-orange" />
          <h4 className="text-xs font-bold text-brand-dark tracking-tight">
            Weekly Schedule Fullness
          </h4>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.includes("Near") ? "text-rose-600 bg-rose-50 border-rose-200" : status.includes("Moderate") ? "text-brand-orange bg-brand-orange/10 border-brand-orange/20" : "text-emerald-700 bg-emerald-50 border-emerald-200"}`}
        >
          {status}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-brand-dark">{percentage}% Full</span>
          <span className="text-brand-muted text-[11px] font-mono">
            {bookedHours}h / 50h capacity
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-[#f77c34] to-[#ea580c]"
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>
      </div>

      {/* Micro Metrics */}
      <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2 rounded-xl bg-gray-50/80 border border-gray-100">
          <span className="text-[10px] font-bold uppercase text-brand-muted block">
            Interviews
          </span>
          <span className="text-sm font-black text-brand-dark mt-0.5 block">
            {currentWeekBookings.length}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-gray-50/80 border border-gray-100">
          <span className="text-[10px] font-bold uppercase text-brand-muted block">
            Avg Duration
          </span>
          <span className="text-sm font-black text-brand-dark mt-0.5 block">
            {currentWeekBookings.length > 0
              ? `${Math.round((bookedHours / currentWeekBookings.length) * 60)} min`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
