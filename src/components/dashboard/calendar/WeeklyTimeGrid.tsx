"use client";

import React, { useMemo } from "react";
import { Building2, Clock, Mail, Plus } from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface WeeklyTimeGridProps {
  currentWeekDays: Array<{
    dateString: string;
    dayName: string;
    dayNum: number;
    isToday: boolean;
  }>;
  bookings: InterviewBooking[];
  onSelectBooking: (booking: InterviewBooking) => void;
  onOpenBooking: (dateStr: string, hour: number) => void;
}

// 7 AM to 5 PM
const START_HOUR = 7;
const END_HOUR = 17;
const TOTAL_HOURS = END_HOUR - START_HOUR; // 10 hours
const ROW_HEIGHT_PX = 68; // Height in pixels for each hour row

// Theme palette variations for bookings with solid opaque backgrounds for hover overlay
const CARD_THEMES = [
  {
    bg: "bg-[#fff7ed] hover:bg-[#fff7ed]", // solid orange-50
    border: "border-l-4 border-l-[#f77c34] border-orange-200/90",
    avatarBg: "bg-[#f77c34] text-white",
    companyText: "text-[#ea580c]",
    shadow: "shadow-xs hover:shadow-xl shadow-orange-500/20",
  },
  {
    bg: "bg-[#f0f9ff] hover:bg-[#f0f9ff]", // solid sky-50
    border: "border-l-4 border-l-[#0fa8d6] border-sky-200/90",
    avatarBg: "bg-[#0fa8d6] text-white",
    companyText: "text-[#0284c7]",
    shadow: "shadow-xs hover:shadow-xl shadow-sky-500/20",
  },
  {
    bg: "bg-[#f0fdf4] hover:bg-[#f0fdf4]", // solid emerald-50
    border: "border-l-4 border-l-emerald-500 border-emerald-200/90",
    avatarBg: "bg-emerald-600 text-white",
    companyText: "text-emerald-700",
    shadow: "shadow-xs hover:shadow-xl shadow-emerald-500/20",
  },
  {
    bg: "bg-[#fffbeb] hover:bg-[#fffbeb]", // solid amber-50
    border: "border-l-4 border-l-amber-500 border-amber-200/90",
    avatarBg: "bg-amber-600 text-white",
    companyText: "text-amber-800",
    shadow: "shadow-xs hover:shadow-xl shadow-amber-500/20",
  },
  {
    bg: "bg-[#faf5ff] hover:bg-[#faf5ff]", // solid purple-50
    border: "border-l-4 border-l-purple-500 border-purple-200/90",
    avatarBg: "bg-purple-600 text-white",
    companyText: "text-purple-700",
    shadow: "shadow-xs hover:shadow-xl shadow-purple-500/20",
  },
];

export function WeeklyTimeGrid({
  currentWeekDays,
  bookings,
  onSelectBooking,
  onOpenBooking,
}: WeeklyTimeGridProps) {
  // Hours array from 7 AM to 5 PM
  const hours = useMemo(() => {
    const list = [];
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      list.push(h);
    }
    return list;
  }, []);

  // Format hour for display: 7 -> 7 AM, 12 -> 12 PM, 13 -> 1 PM
  const formatHourLabel = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12} ${ampm}`;
  };

  // Convert time string "08:30:00" to decimal hour: 8.5
  const parseTimeToDecimal = (timeStr: string): number => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return (h || 0) + (m || 0) / 60;
  };

  // Format time range for card: "08:00:00" -> "8:00 - 10:00 AM"
  const formatCardTimeSlot = (startTime: string, endTime: string) => {
    const formatPiece = (t: string) => {
      const [h, m] = t.split(":");
      const hour = parseInt(h || "0", 10);
      const min = m || "00";
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${min} ${ampm}`;
    };
    return `${formatPiece(startTime)} - ${formatPiece(endTime)}`;
  };

  // Get initials from candidate name (e.g. "Rahul Sharma" -> "RS")
  const getInitials = (name: string) => {
    if (!name) return "S";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };

  // Live Current Time Marker
  const now = new Date();
  const currentDecimalHour = now.getHours() + now.getMinutes() / 60;
  const isCurrentTimeInGrid =
    currentDecimalHour >= START_HOUR && currentDecimalHour <= END_HOUR;
  const currentTimeTopPx = (currentDecimalHour - START_HOUR) * ROW_HEIGHT_PX;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* ------------------------------------------------------------------ */}
      {/* Column Headers (Days of the week)                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-20 shadow-xs">
        {/* Time gutter spacer */}
        <div className="w-16 sm:w-20 shrink-0 border-r border-gray-200 bg-gray-50/70 p-3 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-brand-muted">
          <span>Time</span>
        </div>

        {/* 7 Day Column Headers */}
        <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200">
          {currentWeekDays.map((day, idx) => (
            <div
              key={idx}
              className={`p-2 sm:p-3 text-center transition-colors ${
                day.isToday ? "bg-orange-50/40" : "bg-white"
              }`}
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-muted block">
                {day.dayName}
              </span>
              <div className="mt-1 flex items-center justify-center">
                <span
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-black transition-all ${
                    day.isToday
                      ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/30 ring-2 ring-brand-orange/20"
                      : "text-brand-dark hover:bg-gray-100"
                  }`}
                >
                  {day.dayNum}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Time Grid Body                                                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-y-auto relative min-h-[500px]">
        <div
          className="flex relative"
          style={{ height: `${TOTAL_HOURS * ROW_HEIGHT_PX}px` }}
        >
          {/* Time Gutter Column (Left labels: 7 AM - 5 PM) */}
          <div className="w-16 sm:w-20 shrink-0 border-r border-gray-200 bg-gray-50/40 relative select-none">
            {hours.slice(0, TOTAL_HOURS).map((h, i) => (
              <div
                key={h}
                className="absolute right-2 text-[11px] font-bold text-brand-muted -translate-y-2.5"
                style={{ top: `${i * ROW_HEIGHT_PX}px` }}
              >
                {formatHourLabel(h)}
              </div>
            ))}
          </div>

          {/* 7 Day Columns Grid */}
          <div className="flex-1 grid grid-cols-7 divide-x divide-gray-200 relative">
            {/* Background Hour Lines across all columns */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {hours.slice(0, TOTAL_HOURS).map((h, i) => (
                <div
                  key={h}
                  className="w-full border-t border-gray-100 absolute"
                  style={{ top: `${i * ROW_HEIGHT_PX}px` }}
                >
                  {/* Subtle half-hour dashed guideline */}
                  <div className="w-full border-t border-dashed border-gray-50 mt-[34px]" />
                </div>
              ))}
            </div>

            {/* Individual Day Columns */}
            {currentWeekDays.map((day, colIdx) => {
              // Filter bookings for this day
              const dayBookings = bookings.filter(
                (b) => b.booking_date === day.dateString
              );

              return (
                <div
                  key={colIdx}
                  className={`relative h-full transition-colors group/col ${
                    day.isToday ? "bg-orange-50/15" : "hover:bg-gray-50/30"
                  }`}
                >
                  {/* Clickable slot drop targets for each hour */}
                  {hours.slice(0, TOTAL_HOURS).map((h, rowIdx) => (
                    <button
                      key={rowIdx}
                      type="button"
                      onClick={() => onOpenBooking(day.dateString, h)}
                      className="absolute inset-x-0 w-full h-[68px] opacity-0 group-hover/col:opacity-100 hover:bg-brand-orange/5 transition-opacity flex items-start justify-end p-1 z-5 text-[10px] text-brand-orange font-bold cursor-pointer"
                      style={{ top: `${rowIdx * ROW_HEIGHT_PX}px` }}
                      title={`Book interview on ${day.dayName} at ${formatHourLabel(h)}`}
                    >
                      <Plus className="w-3.5 h-3.5 text-brand-orange/40 hover:text-brand-orange" />
                    </button>
                  ))}

                  {/* Red/Orange Current Time Horizontal Bar on Today's column */}
                  {day.isToday && isCurrentTimeInGrid && (
                    <div
                      className="absolute inset-x-0 z-20 pointer-events-none flex items-center"
                      style={{ top: `${currentTimeTopPx}px` }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-xs -ml-1.5 animate-pulse" />
                      <div className="w-full border-t-2 border-brand-orange shadow-xs" />
                    </div>
                  )}

                  {/* Render Booked Event Cards */}
                  {dayBookings.map((booking, bIdx) => {
                    const startDec = parseTimeToDecimal(booking.start_time);
                    const endDec = parseTimeToDecimal(booking.end_time);

                    // Clamp to visible 7 AM - 5 PM range
                    const visibleStart = Math.max(START_HOUR, startDec);
                    const visibleEnd = Math.min(END_HOUR, endDec);

                    if (visibleEnd <= START_HOUR || visibleStart >= END_HOUR) {
                      return null; // Outside 7 AM - 5 PM range
                    }

                    const topPx = (visibleStart - START_HOUR) * ROW_HEIGHT_PX;
                    const durationHours = Math.max(0.6, visibleEnd - visibleStart);
                    const heightPx = Math.max(48, durationHours * ROW_HEIGHT_PX);

                    const theme = CARD_THEMES[bIdx % CARD_THEMES.length];
                    const initials = getInitials(booking.student_name);
                    const isRightSide = colIdx >= 5;

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
                        className={`group absolute z-10 rounded-xl p-2 sm:p-2.5 border cursor-pointer transition-all duration-200 ease-in-out flex flex-col justify-between inset-x-1 overflow-hidden hover:overflow-visible hover:!h-auto hover:!min-h-max group-hover:w-72 group-hover:min-w-[280px] hover:w-72 hover:min-w-[280px] group-hover:z-[60] hover:z-[60] hover:shadow-2xl ${
                          isRightSide
                            ? "group-hover:right-1 group-hover:left-auto hover:right-1 hover:left-auto"
                            : "group-hover:left-1 group-hover:right-auto hover:left-1 hover:right-auto"
                        } ${theme.bg} ${theme.border} ${theme.shadow}`}
                        title={`${booking.student_name} (${booking.company_name}) - ${booking.start_time} to ${booking.end_time}`}
                      >
                        {/* Top: Avatar & Student Name + Email */}
                        <div className="flex items-start gap-1.5 min-w-0">
                          <div
                            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5 ${theme.avatarBg}`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-brand-dark truncate block group-hover:whitespace-nowrap group-hover:overflow-visible leading-tight">
                              {booking.student_name}
                            </span>
                            {/* Student Email Address (Revealed on hover on a single, clean line) */}
                            {booking.student_email && (
                              <div className="hidden group-hover:flex items-center gap-1.5 text-[10px] text-brand-muted font-mono mt-1 whitespace-nowrap">
                                <Mail className="w-2.5 h-2.5 shrink-0 text-brand-muted" />
                                <span className="group-hover:whitespace-nowrap font-medium text-gray-700">
                                  {booking.student_email}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle: Company Name */}
                        <div className="flex items-center gap-1.5 min-w-0 mt-1 whitespace-nowrap">
                          <Building2 className="w-3 h-3 text-brand-muted shrink-0" />
                          <span
                            className={`text-[11px] font-bold truncate group-hover:whitespace-nowrap leading-tight ${theme.companyText}`}
                          >
                            {booking.company_name}
                          </span>
                        </div>

                        {/* Bottom: Exact Time Slot */}
                        <div className="flex items-center gap-1.5 min-w-0 mt-1 text-[10px] text-brand-muted font-mono whitespace-nowrap">
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate group-hover:whitespace-nowrap font-semibold">
                            {formatCardTimeSlot(booking.start_time, booking.end_time)}
                          </span>
                        </div>

                        {/* Action indicator in expanded state */}
                        <div className="hidden group-hover:flex items-center justify-between text-[9px] font-bold text-brand-orange mt-2 pt-1.5 border-t border-black/5 whitespace-nowrap">
                          <span className="text-[9px] font-medium text-brand-muted font-sans">
                            Confirmed Slot
                          </span>
                          <span>Click to inspect &rarr;</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
