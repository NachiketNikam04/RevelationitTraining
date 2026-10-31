"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  ListFilter,
  CheckCircle2,
  AlertCircle,
  X,
  Building2,
  TableProperties,
} from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";
import { MiniCalendar } from "@/components/dashboard/calendar/MiniCalendar";
import { BookingDonutChart } from "@/components/dashboard/calendar/BookingDonutChart";
import { WorkloadStats } from "@/components/dashboard/calendar/WorkloadStats";
import { WeeklyTimeGrid } from "@/components/dashboard/calendar/WeeklyTimeGrid";
import { DayTimeGrid } from "@/components/dashboard/calendar/DayTimeGrid";
import { MonthGrid } from "@/components/dashboard/calendar/MonthGrid";
import { BookingDetailModal } from "@/components/dashboard/calendar/BookingDetailModal";
import { CreateBookingModal } from "@/components/dashboard/calendar/CreateBookingModal";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export const dynamic = "force-dynamic";

export default function CalendarDashboardPage() {
  // ---------------------------------------------------------------------------
  // Data State
  // ---------------------------------------------------------------------------
  const [bookings, setBookings] = useState<InterviewBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Navigation & View State
  // ---------------------------------------------------------------------------
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week");
  // Active anchor date (defaults to today's date)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  // Selected date string (YYYY-MM-DD)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  // ---------------------------------------------------------------------------
  // Modal States
  // ---------------------------------------------------------------------------
  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<InterviewBooking | null>(null);

  // Create / Edit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createInitialDate, setCreateInitialDate] = useState<string>("");
  const [createInitialHour, setCreateInitialHour] = useState<number>(10);
  const [editingBooking, setEditingBooking] = useState<InterviewBooking | null>(null);

  // ---------------------------------------------------------------------------
  // Toast State
  // ---------------------------------------------------------------------------
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: "success" | "error" | "info", message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------------------------------------------------------------------------
  // Fetch Bookings from Backend API
  // ---------------------------------------------------------------------------
  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.data || []);
      } else {
        addToast("error", data.error || "Failed to load bookings from database.");
      }
    } catch (err) {
      console.error("Bookings fetch error:", err);
      addToast("error", "Unable to connect to database API.");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // ---------------------------------------------------------------------------
  // Current Week Computations (Monday to Sunday)
  // ---------------------------------------------------------------------------
  const currentWeekDays = useMemo(() => {
    const d = new Date(currentDate);
    // 0 = Sun, 1 = Mon ... 6 = Sat -> Mon is index 0
    const dayOfWeek = (d.getDay() + 6) % 7;
    // Monday of current week
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayOfWeek);

    const days = [];
    const todayStr = new Date().toISOString().split("T")[0];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      const y = dayDate.getFullYear();
      const m = String(dayDate.getMonth() + 1).padStart(2, "0");
      const dateNum = String(dayDate.getDate()).padStart(2, "0");
      const dateString = `${y}-${m}-${dateNum}`;

      days.push({
        dateString,
        dayName: dayNames[i],
        dayNum: dayDate.getDate(),
        isToday: dateString === todayStr,
      });
    }

    return days;
  }, [currentDate]);

  // Bookings in the current active week
  const currentWeekBookings = useMemo(() => {
    const weekDateStrings = new Set(currentWeekDays.map((d) => d.dateString));
    return bookings.filter((b) => weekDateStrings.has(b.booking_date));
  }, [bookings, currentWeekDays]);

  // ---------------------------------------------------------------------------
  // Header Navigation Helpers
  // ---------------------------------------------------------------------------
  function handlePrev() {
    const d = new Date(currentDate);
    if (viewMode === "day") {
      d.setDate(d.getDate() - 1);
    } else if (viewMode === "week") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    setCurrentDate(d);
    setSelectedDateStr(d.toISOString().split("T")[0]);
  }

  function handleNext() {
    const d = new Date(currentDate);
    if (viewMode === "day") {
      d.setDate(d.getDate() + 1);
    } else if (viewMode === "week") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    setCurrentDate(d);
    setSelectedDateStr(d.toISOString().split("T")[0]);
  }

  function handleToday() {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split("T")[0]);
  }

  function handleSelectMiniCalendarDate(dateStr: string) {
    setSelectedDateStr(dateStr);
    const [y, m, d] = dateStr.split("-").map(Number);
    setCurrentDate(new Date(y, m - 1, d));
  }

  // Header Title Formatter
  const headerTitle = useMemo(() => {
    if (viewMode === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
    if (viewMode === "week") {
      const first = currentWeekDays[0];
      const last = currentWeekDays[6];
      if (!first || !last) return "";

      const [y1, m1, d1] = first.dateString.split("-").map(Number);
      const [y2, m2, d2] = last.dateString.split("-").map(Number);
      const start = new Date(y1, m1 - 1, d1);
      const end = new Date(y2, m2 - 1, d2);

      const mStart = start.toLocaleDateString("en-US", { month: "short" });
      const mEnd = end.toLocaleDateString("en-US", { month: "short" });

      if (mStart === mEnd) {
        return `${mStart} ${d1} – ${d2}, ${y1}`;
      }
      return `${mStart} ${d1} – ${mEnd} ${d2}, ${y2}`;
    }
    // Month View
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [viewMode, currentDate, currentWeekDays]);

  // ---------------------------------------------------------------------------
  // Modal Handlers
  // ---------------------------------------------------------------------------
  function handleOpenNewBooking(dateStr?: string, hour: number = 10) {
    setEditingBooking(null);
    setCreateInitialDate(dateStr || selectedDateStr);
    setCreateInitialHour(hour);
    setIsCreateModalOpen(true);
  }

  function handleEditBooking(booking: InterviewBooking) {
    setEditingBooking(booking);
    setIsCreateModalOpen(true);
  }

  async function handleSaveBooking(
    formData: {
      student_name: string;
      student_email: string;
      company_name: string;
      booking_date: string;
      start_time: string;
      end_time: string;
    },
    editId?: number
  ) {
    try {
      if (editId) {
        const res = await fetch(`/api/admin/bookings/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.status === 409) {
          return { success: false, error: data.error, isConflict: true };
        }
        if (res.ok && data.success) {
          addToast("success", "Interview slot updated successfully!");
          loadBookings();
          return { success: true };
        }
        return { success: false, error: data.error || "Update failed." };
      } else {
        const res = await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.status === 409) {
          return { success: false, error: data.error, isConflict: true };
        }
        if (res.ok && data.success) {
          addToast("success", "Interview slot scheduled successfully!");
          loadBookings();
          return { success: true };
        }
        return { success: false, error: data.error || "Creation failed." };
      }
    } catch (err: any) {
      console.error("Booking save error:", err);
      return { success: false, error: "Network error saving booking." };
    }
  }

  async function handleDeleteBooking(id: number) {
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addToast("success", "Interview slot cancelled successfully.");
        loadBookings();
      } else {
        addToast("error", data.error || "Failed to cancel interview.");
      }
    } catch (err) {
      console.error("Booking delete error:", err);
      addToast("error", "Failed to cancel interview.");
    }
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] lg:h-screen bg-brand-bg text-brand-dark overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Toast Notification Stack                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 ${
              toast.type === "success"
                ? "bg-white border-emerald-200 text-emerald-950 shadow-emerald-500/10"
                : toast.type === "error"
                ? "bg-white border-rose-200 text-rose-950 shadow-rose-500/10"
                : "bg-white border-blue-200 text-blue-950 shadow-blue-500/10"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FULL-PAGE LAYOUT: Left Sidebar (300px) + Main Content Area         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================================================================ */}
        {/* LEFT SIDEBAR (approx. 300px width)                               */}
        {/* ================================================================ */}
        <aside className="w-full lg:w-[320px] shrink-0 border-r border-gray-200 bg-white p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto z-10 shadow-xs">
          {/* Top Sidebar CTA & View Table Link */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOpenNewBooking()}
              className="w-full py-3 px-4 rounded-2xl bg-brand-orange text-white text-xs sm:text-sm font-bold hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-orange/25 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>

            <Link
              href="/dashboard/scheduling"
              className="w-full py-2 px-3 rounded-xl border border-gray-200 text-brand-dark text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <TableProperties className="w-3.5 h-3.5 text-brand-muted" />
              <span>Manage Whitelist & Bookings Table</span>
            </Link>
          </div>

          {/* 1. Mini-Calendar */}
          <MiniCalendar
            selectedDate={selectedDateStr}
            onSelectDate={handleSelectMiniCalendarDate}
            bookings={bookings}
          />

          {/* 2. Booking Summary (Donut Chart) */}
          <BookingDonutChart currentWeekBookings={currentWeekBookings} />

          {/* 3. Workload / Schedule Fullness Stats */}
          <WorkloadStats currentWeekBookings={currentWeekBookings} />
        </aside>

        {/* ================================================================ */}
        {/* MAIN CALENDAR AREA                                               */}
        {/* ================================================================ */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Main Top Header Bar */}
          <header className="p-3.5 sm:p-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs z-15">
            {/* Left: Today, Nav Chevrons, Date Heading */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleToday}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-brand-dark text-xs font-bold hover:bg-gray-100 transition-colors shadow-xs"
              >
                Today
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded-xl text-brand-muted hover:text-brand-dark hover:bg-gray-100 transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-xl text-brand-muted hover:text-brand-dark hover:bg-gray-100 transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-black text-brand-dark tracking-tight ml-1">
                {headerTitle}
              </h2>
            </div>

            {/* Right: View Toggles (Day, Week, Month) & Refresh */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  loadBookings();
                  addToast("info", "Syncing interview bookings...");
                }}
                className="p-2 rounded-xl text-brand-muted hover:text-brand-dark hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                title="Refresh Calendar"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Segmented View Control */}
              <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setViewMode("day")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "day"
                      ? "bg-white text-brand-dark shadow-xs font-extrabold"
                      : "text-brand-muted hover:text-brand-dark"
                  }`}
                >
                  Day
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("week")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "week"
                      ? "bg-white text-brand-dark shadow-xs font-extrabold"
                      : "text-brand-muted hover:text-brand-dark"
                  }`}
                >
                  Week
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("month")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === "month"
                      ? "bg-white text-brand-dark shadow-xs font-extrabold"
                      : "text-brand-muted hover:text-brand-dark"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </header>

          {/* Active View Grid */}
          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden bg-brand-bg">
            {viewMode === "week" && (
              <WeeklyTimeGrid
                currentWeekDays={currentWeekDays}
                bookings={bookings}
                onSelectBooking={(b) => setSelectedBooking(b)}
                onOpenBooking={(dateStr, hour) => handleOpenNewBooking(dateStr, hour)}
              />
            )}

            {viewMode === "day" && (
              <DayTimeGrid
                currentDateString={selectedDateStr}
                bookings={bookings}
                onSelectBooking={(b) => setSelectedBooking(b)}
                onOpenBooking={(dateStr, hour) => handleOpenNewBooking(dateStr, hour)}
              />
            )}

            {viewMode === "month" && (
              <MonthGrid
                currentDate={currentDate}
                bookings={bookings}
                onSelectBooking={(b) => setSelectedBooking(b)}
                onOpenBooking={(dateStr, hour) => handleOpenNewBooking(dateStr, hour)}
                onSelectDay={(dateStr) => {
                  setSelectedDateStr(dateStr);
                  const [y, m, d] = dateStr.split("-").map(Number);
                  setCurrentDate(new Date(y, m - 1, d));
                  setViewMode("day");
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODALS                                                             */}
      {/* ------------------------------------------------------------------ */}
      {/* 1. Detail / Inspect Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onEdit={(b) => handleEditBooking(b)}
        onDelete={handleDeleteBooking}
      />

      {/* 2. Create / Edit Booking Modal */}
      <CreateBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingBooking(null);
        }}
        initialDate={createInitialDate}
        initialHour={createInitialHour}
        editingBooking={editingBooking}
        onSave={handleSaveBooking}
      />
    </div>
  );
}
