"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface MiniCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  bookings: InterviewBooking[];
}

export function MiniCalendar({
  selectedDate,
  onSelectDate,
  bookings,
}: MiniCalendarProps) {
  // Parse currently selected date for mini calendar view
  const [viewDate, setViewDate] = useState(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    return new Date(y || new Date().getFullYear(), (m ? m - 1 : new Date().getMonth()), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Calculate day cells: starting on Monday (ISO week)
  const days = React.useMemo(() => {
    // 0 = Sun, 1 = Mon, ..., 6 = Sat -> convert to 0 = Mon ... 6 = Sun
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateString: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      hasBookings: boolean;
    }> = [];

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
        hasBookings: bookings.some((b) => b.booking_date === dateString),
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
        hasBookings: bookings.some((b) => b.booking_date === dateString),
      });
    }

    // Next month padding to fill rows
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
        hasBookings: bookings.some((b) => b.booking_date === dateString),
      });
    }

    return cells;
  }, [year, month, bookings]);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
      {/* Month Navigator */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-brand-dark tracking-tight">
          {monthName}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-100 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-gray-100 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels (Mon - Sun) */}
      <div className="grid grid-cols-7 text-center mb-1 text-[10px] font-bold text-brand-muted uppercase tracking-wider">
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
        <span>Su</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days.map((day, idx) => {
          const isSelected = day.dateString === selectedDate;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(day.dateString)}
              className={`relative h-7 w-7 mx-auto rounded-full text-xs flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? "bg-brand-orange text-white font-bold shadow-xs shadow-brand-orange/30 scale-105"
                  : day.isToday
                  ? "border border-brand-orange text-brand-orange font-bold hover:bg-brand-orange/10"
                  : day.isCurrentMonth
                  ? "text-brand-dark hover:bg-gray-100"
                  : "text-gray-300 hover:text-gray-500"
              }`}
            >
              <span>{day.dayNum}</span>
              {/* Booking Indicator Dot */}
              {day.hasBookings && !isSelected && (
                <span
                  className="absolute bottom-0.5 w-1 h-1 rounded-full bg-brand-orange"
                  title="Has scheduled interviews"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
