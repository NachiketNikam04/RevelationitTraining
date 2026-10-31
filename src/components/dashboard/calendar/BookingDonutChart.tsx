"use client";

import React, { useMemo } from "react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface BookingDonutChartProps {
  currentWeekBookings: InterviewBooking[];
}

const PALETTE = [
  { name: "Brand Orange", stroke: "#f77c34", bgClass: "bg-[#f77c34]" },
  { name: "Brand Blue", stroke: "#0fa8d6", bgClass: "bg-[#0fa8d6]" },
  { name: "Amber", stroke: "#f59e0b", bgClass: "bg-amber-500" },
  { name: "Emerald", stroke: "#10b981", bgClass: "bg-emerald-500" },
  { name: "Purple", stroke: "#8b5cf6", bgClass: "bg-purple-500" },
];

export function BookingDonutChart({ currentWeekBookings }: BookingDonutChartProps) {
  const total = currentWeekBookings.length;

  // Group by company
  const companyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of currentWeekBookings) {
      const comp = b.company_name?.trim() || "Other";
      counts[comp] = (counts[comp] || 0) + 1;
    }

    const entries = Object.entries(counts)
      .map(([company, count], i) => ({
        company,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.count - a.count);

    return entries;
  }, [currentWeekBookings, total]);

  // SVG circle calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius; // ~289.026

  let accumulatedLength = 0;
  const segments = companyBreakdown.map((item) => {
    const arcLength = (item.count / (total || 1)) * circumference;
    const offset = -accumulatedLength;
    accumulatedLength += arcLength;
    return {
      ...item,
      strokeDasharray: `${arcLength} ${circumference}`,
      strokeDashoffset: offset,
    };
  });

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-brand-dark tracking-tight">
          Booking Summary
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
          This Week
        </span>
      </div>

      <div className="flex flex-col items-center">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="14"
              fill="transparent"
            />

            {/* Slices */}
            {total > 0 ? (
              segments.map((seg, idx) => (
                <circle
                  key={idx}
                  cx="64"
                  cy="64"
                  r={radius}
                  stroke={seg.color.stroke}
                  strokeWidth="14"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-500 ease-out"
                />
              ))
            ) : (
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="14"
                fill="transparent"
              />
            )}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-brand-dark leading-none">
              {total}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mt-1">
              {total === 1 ? "Slot" : "Slots"}
            </span>
          </div>
        </div>

        {/* Legend / Breakdown */}
        <div className="w-full mt-3 space-y-1.5">
          {total === 0 ? (
            <p className="text-xs text-center text-brand-muted py-1">
              No interviews scheduled for this week.
            </p>
          ) : (
            companyBreakdown.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-0.5"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color.bgClass}`}
                  />
                  <span className="font-semibold text-brand-dark truncate">
                    {item.company}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px] text-brand-muted">
                  <span className="font-bold text-brand-dark">{item.count}</span>
                  <span>({item.percentage}%)</span>
                </div>
              </div>
            ))
          )}
          {companyBreakdown.length > 4 && (
            <div className="text-[10px] text-center text-brand-muted pt-1">
              +{companyBreakdown.length - 4} more companies
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
