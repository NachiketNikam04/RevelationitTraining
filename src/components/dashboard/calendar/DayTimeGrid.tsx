"use client";

import React, { useMemo } from "react";
import { Building2, Clock, Mail, User, Plus } from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface DayTimeGridProps {
  currentDateString: string; // YYYY-MM-DD
  bookings: InterviewBooking[];
  onSelectBooking: (booking: InterviewBooking) => void;
  onOpenBooking: (dateStr: string, hour: number) => void;
}

const START_HOUR = 7;
const END_HOUR = 17;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 10 hours
const ROW_HEIGHT_PX = 76; // Roomier for single-day view

export function DayTimeGrid({
  currentDateString,
  bookings,
  onSelectBooking,
  onOpenBooking,
}: DayTimeGridProps) {
  const hours = useMemo(() => {
    const list = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      list.push(h);
    }
    return list;
  }, []);

  const dayBookings = useMemo(() => {
    return bookings.filter((b) => b.booking_date === currentDateString);
  }, [bookings, currentDateString]);

  const formatHourLabel = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const parseTimeToDecimal = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) + (m || 0) / 60;
  };

  const formatCardTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h || "0", 10);
    const min = m || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${min} ${ampm}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "S";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto relative select-none">
      <div
        className="relative flex"
        style={{ height: `${TOTAL_HOURS * ROW_HEIGHT_PX}px` }}
      >
        {/* Time Labels Gutter */}
        <div className="w-24 shrink-0 border-r border-gray-200 bg-gray-50/50 relative">
          {hours.slice(0, TOTAL_HOURS).map((h, i) => (
            <div
              key={h}
              className="absolute right-3 text-xs font-bold text-brand-muted -translate-y-2.5 font-mono"
              style={{ top: `${i * ROW_HEIGHT_PX}px` }}
            >
              {formatHourLabel(h)}
            </div>
          ))}
        </div>

        {/* Day Column */}
        <div className="flex-1 relative">
          {/* Background Hour Lines */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {hours.slice(0, TOTAL_HOURS).map((h, i) => (
              <div
                key={h}
                className="w-full border-t border-gray-100 absolute"
                style={{ top: `${i * ROW_HEIGHT_PX}px` }}
              >
                <div className="w-full border-t border-dashed border-gray-50 mt-[38px]" />
              </div>
            ))}
          </div>

          {/* Clickable slots for adding bookings */}
          {hours.slice(0, TOTAL_HOURS).map((h, rowIdx) => (
            <button
              key={rowIdx}
              type="button"
              onClick={() => onOpenBooking(currentDateString, h)}
              className="absolute inset-x-0 w-full h-[76px] hover:bg-brand-orange/5 transition-colors flex items-center justify-end pr-6 group z-5 cursor-pointer"
              style={{ top: `${rowIdx * ROW_HEIGHT_PX}px` }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange bg-white px-3 py-1.5 rounded-lg border border-brand-orange/30 shadow-xs">
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule at {formatHourLabel(h)}</span>
              </div>
            </button>
          ))}

          {/* Bookings */}
          {dayBookings.map((booking) => {
            const startDec = parseTimeToDecimal(booking.start_time);
            const endDec = parseTimeToDecimal(booking.end_time);

            const visibleStart = Math.max(START_HOUR, startDec);
            const visibleEnd = Math.min(END_HOUR, endDec);

            if (visibleEnd <= START_HOUR || visibleStart >= END_HOUR) return null;

            const topPx = (visibleStart - START_HOUR) * ROW_HEIGHT_PX;
            const duration = Math.max(0.6, visibleEnd - visibleStart);
            const heightPx = Math.max(56, duration * ROW_HEIGHT_PX);

            const initials = getInitials(booking.student_name);

            return (
              <div
                key={booking.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBooking(booking);
                }}
                style={{
                  top: `${topPx + 2}px`,
                  height: `${heightPx - 4}px`,
                  minHeight: `${heightPx - 4}px`,
                }}
                className="group absolute inset-x-4 z-10 rounded-2xl p-4 border border-l-4 border-l-[#f77c34] border-gray-200 bg-[#fff7ed] shadow-xs hover:shadow-xl hover:!h-auto hover:!min-h-max hover:z-50 hover:overflow-visible transition-all duration-200 ease-in-out cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange text-white font-black text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-dark">
                        {booking.student_name}
                      </h4>
                      <p className="text-xs text-brand-muted flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-brand-muted" />
                        <span>{booking.student_email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold text-brand-dark shadow-xs">
                    <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                    <span>{booking.company_name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-brand-muted pt-2 border-t border-orange-200/50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span className="font-bold text-brand-dark">
                      {formatCardTime(booking.start_time)} - {formatCardTime(booking.end_time)}
                    </span>
                  </div>
                  <span className="text-[11px] font-sans font-semibold text-brand-orange">
                    Click to view / manage
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
