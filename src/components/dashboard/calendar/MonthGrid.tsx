"use client";

import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface MonthGridProps {
  currentDate: Date;
  bookings: InterviewBooking[];
  onSelectBooking: (booking: InterviewBooking) => void;
  onOpenBooking: (dateStr: string, hour: number) => void;
  onSelectDay: (dateStr: string) => void;
}

export function MonthGrid({
  currentDate,
  bookings,
  onSelectBooking,
  onOpenBooking,
  onSelectDay,
}: MonthGridProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    // 0 = Sun -> convert to 0 = Mon ... 6 = Sun
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    const todayStr = new Date().toISOString().split("T")[0];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const mm = String(prevDate.getMonth() + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateString = `${prevDate.getFullYear()}-${mm}-${dd}`;
      cells.push({
        dateString,
        dayNum: d,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        events: bookings.filter((b) => b.booking_date === dateString),
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateString = `${year}-${mm}-${dd}`;
      cells.push({
        dateString,
        dayNum: d,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        events: bookings.filter((b) => b.booking_date === dateString),
      });
    }

    // Next month padding
    const totalCells = Math.ceil(cells.length / 7) * 7;
    const remaining = totalCells - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const mm = String(nextDate.getMonth() + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateString = `${nextDate.getFullYear()}-${mm}-${dd}`;
      cells.push({
        dateString,
        dayNum: d,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        events: bookings.filter((b) => b.booking_date === dateString),
      });
    }

    return cells;
  }, [year, month, bookings]);

  const formatShortTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h || "0", 10);
    const min = m || "00";
    const ampm = hour >= 12 ? "p" : "a";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${min}${ampm}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Weekday Headers (Mon - Sun) */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50/70 text-center py-2.5 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>

      {/* 35 or 42 Month Cells */}
      <div className="flex-1 grid grid-cols-7 divide-x divide-y divide-gray-100 overflow-y-auto">
        {calendarDays.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => onSelectDay(cell.dateString)}
            className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors group cursor-pointer ${
              !cell.isCurrentMonth
                ? "bg-gray-50/30 text-gray-300"
                : cell.isToday
                ? "bg-orange-50/20"
                : "bg-white hover:bg-gray-50/60"
            }`}
          >
            {/* Cell Header: Day Number + Add Action */}
            <div className="flex items-center justify-between">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  cell.isToday
                    ? "bg-brand-orange text-white"
                    : cell.isCurrentMonth
                    ? "text-brand-dark"
                    : "text-gray-300"
                }`}
              >
                {cell.dayNum}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBooking(cell.dateString, 10);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-brand-orange/10 text-brand-orange transition-opacity"
                title="Add booking on this date"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Event badges */}
            <div className="space-y-1 mt-1 overflow-hidden">
              {cell.events.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBooking(b);
                  }}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-orange-50 text-orange-950 border border-orange-200/80 truncate hover:bg-orange-100 transition-colors flex items-center gap-1"
                  title={`${b.student_name} (${b.company_name})`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                  <span className="font-bold truncate">{b.student_name}</span>
                  <span className="text-brand-muted text-[9px] shrink-0 font-mono">
                    {formatShortTime(b.start_time)}
                  </span>
                </div>
              ))}
              {cell.events.length > 3 && (
                <div className="text-[9px] font-bold text-brand-muted pl-1">
                  +{cell.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
