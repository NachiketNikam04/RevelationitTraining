"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  User,
  Building2,
  Mail,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  AlertTriangle,
  CalendarCheck,
  Lock,
} from "lucide-react";

interface CalendarEvent {
  student_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

// Color scheme for event cards in the popover matching the admin palette
const POPUP_CARD_THEMES = [
  {
    bg: "bg-[#fff7ed]",
    border: "border-l-4 border-l-[#f77c34] border-orange-200/90",
    avatarBg: "bg-[#f77c34] text-white",
  },
  {
    bg: "bg-[#f0f9ff]",
    border: "border-l-4 border-l-[#0fa8d6] border-sky-200/90",
    avatarBg: "bg-[#0fa8d6] text-white",
  },
  {
    bg: "bg-[#f0fdf4]",
    border: "border-l-4 border-l-emerald-500 border-emerald-200/90",
    avatarBg: "bg-emerald-600 text-white",
  },
  {
    bg: "bg-[#fffbeb]",
    border: "border-l-4 border-l-amber-500 border-amber-200/90",
    avatarBg: "bg-amber-600 text-white",
  },
  {
    bg: "bg-[#faf5ff]",
    border: "border-l-4 border-l-purple-500 border-purple-200/90",
    avatarBg: "bg-purple-600 text-white",
  },
];

const getInitials = (name: string) => {
  if (!name) return "S";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
};

export const dynamic = "force-dynamic";

export default function StudentSchedulingPage() {
  // ---------------------------------------------------------------------------
  // Authentication & Session State
  // ---------------------------------------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // OTP Login Flow State
  const [authStep, setAuthStep] = useState<"email" | "otp">("email");
  const [inputEmail, setInputEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // ---------------------------------------------------------------------------
  // Calendar State
  // ---------------------------------------------------------------------------
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [activePopoverDate, setActivePopoverDate] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Booking Modal State
  // ---------------------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isConflictError, setIsConflictError] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    company: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "10:00",
    end_time: "11:00",
  });

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
  // Check Existing Session on Mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/schedules/me", {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        const data = await res.json();
        if (res.ok && data.authenticated && data.email) {
          setIsAuthenticated(true);
          setStudentEmail(data.email);
        }
      } catch (err) {
        console.warn("Session check warning:", err);
      } finally {
        setIsCheckingSession(false);
      }
    }
    checkSession();
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (authStep === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [authStep, countdown]);

  // Prevent background scroll only when the booking modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isModalOpen]);

  // Click-outside listener to dismiss the inline floating popover
  useEffect(() => {
    if (!activePopoverDate) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setActivePopoverDate(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activePopoverDate]);

  // ---------------------------------------------------------------------------
  // Fetch Calendar Events
  // ---------------------------------------------------------------------------
  const fetchCalendarEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const res = await fetch("/api/schedules/calendar-events", {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.data || []);
      } else {
        addToast("error", data.error || "Failed to load calendar events.");
      }
    } catch (err: any) {
      console.error("Calendar fetch error:", err);
      addToast("error", "Unable to load calendar schedules.");
    } finally {
      setIsLoadingEvents(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCalendarEvents();
    }
  }, [isAuthenticated, fetchCalendarEvents]);

  // ---------------------------------------------------------------------------
  // Authentication Actions
  // ---------------------------------------------------------------------------
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);

    const emailTrimmed = inputEmail.trim();
    if (!emailTrimmed) {
      setAuthError("Please enter your registered student email.");
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const res = await fetch("/api/schedules/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setAuthStep("otp");
        setCountdown(600); // 10 minutes
        addToast("success", "Verification code sent to your email!");
      } else {
        setAuthError(
          data.error || "This email is not authorized. Please contact your coordinator."
        );
        addToast("error", data.error || "Authorization failed.");
      }
    } catch (err) {
      console.error("OTP request error:", err);
      setAuthError("Network error. Please try again.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);

    const cleanOtp = otpCode.trim();
    if (!cleanOtp) {
      setAuthError("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmittingAuth(true);
    try {
      const res = await fetch("/api/schedules/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputEmail.trim(), otp: cleanOtp }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setStudentEmail(data.email || inputEmail.trim());
        addToast("success", "Welcome! Successfully verified.");
      } else {
        setAuthError(data.error || "Invalid or expired OTP code.");
        addToast("error", data.error || "Verification failed.");
      }
    } catch (err) {
      console.error("OTP verify error:", err);
      setAuthError("Verification failed due to a network error.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/schedules/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setStudentEmail("");
      setAuthStep("email");
      setInputEmail("");
      setOtpCode("");
      addToast("info", "You have been logged out.");
    }
  }

  // ---------------------------------------------------------------------------
  // Booking Action
  // ---------------------------------------------------------------------------
  function openBookingModal(prefilledDate?: string) {
    const todayStr = new Date().toISOString().split("T")[0];
    const targetDate = prefilledDate || selectedDate || todayStr;

    setBookingForm({
      name: "",
      company: "",
      date: targetDate,
      start_time: "10:00",
      end_time: "11:00",
    });
    setBookingError(null);
    setIsConflictError(false);
    setIsModalOpen(true);
  }

  async function handleSubmitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingError(null);
    setIsConflictError(false);

    // Client Validations
    if (!bookingForm.name.trim()) {
      setBookingError("Your full name is required.");
      return;
    }
    if (!bookingForm.company.trim()) {
      setBookingError("Company name is required.");
      return;
    }
    if (!bookingForm.date) {
      setBookingError("Interview date is required.");
      return;
    }
    if (!bookingForm.start_time || !bookingForm.end_time) {
      setBookingError("Both start time and end time are required.");
      return;
    }
    if (bookingForm.start_time >= bookingForm.end_time) {
      setBookingError("Start time must precede end time.");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await fetch("/api/schedules/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingForm.name.trim(),
          company: bookingForm.company.trim(),
          date: bookingForm.date,
          start_time: bookingForm.start_time,
          end_time: bookingForm.end_time,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Clean HTTP 409 Conflict Handling
        setIsConflictError(true);
        const conflictMsg =
          data.error ||
          "This time slot overlaps with an existing interview schedule. Please choose a different time slot or date.";
        setBookingError(conflictMsg);
        addToast("error", "Slot Collision: This time slot is already taken.");
        return;
      }

      if (res.ok && data.success) {
        addToast("success", "Your interview has been booked successfully!");
        setIsModalOpen(false);
        fetchCalendarEvents();
      } else {
        setBookingError(data.error || "Failed to book interview slot.");
        addToast("error", data.error || "Booking failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError("Network communication error. Please try again.");
      addToast("error", "Network connection failed.");
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Calendar Computations (Month Grid)
  // ---------------------------------------------------------------------------
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const monthName = currentMonthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      dateString: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: CalendarEvent[];
    }> = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, d);
      const dateString = prevDate.toISOString().split("T")[0];
      days.push({
        dateString,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: false,
        events: events.filter((ev) => ev.booking_date === dateString),
      });
    }

    // Current month days
    const todayStr = new Date().toISOString().split("T")[0];
    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(year, month, d);
      // Format as YYYY-MM-DD
      const mm = String(month + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateString = `${year}-${mm}-${dd}`;
      days.push({
        dateString,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        events: events.filter((ev) => ev.booking_date === dateString),
      });
    }

    // Next month padding to fill a complete 35 or 42 grid
    const totalSlots = Math.ceil(days.length / 7) * 7;
    const remaining = totalSlots - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateString = nextDate.toISOString().split("T")[0];
      days.push({
        dateString,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: false,
        events: events.filter((ev) => ev.booking_date === dateString),
      });
    }

    return days;
  }, [year, month, events]);

  // Selected date events for agenda
  const selectedDateEvents = useMemo(() => {
    return events.filter((ev) => ev.booking_date === selectedDate);
  }, [events, selectedDate]);


  // Format Time Display (e.g. 10:00:00 -> 10:00 AM)
  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h || "0", 10);
    const minute = m || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Format Date (e.g. 2026-11-05 -> Thursday, Nov 5, 2026)
  const formatDateHeader = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // ---------------------------------------------------------------------------
  // Render: Loading State
  // ---------------------------------------------------------------------------
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          <p className="text-sm font-semibold text-brand-muted">
            Checking session authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAFAF8] flex flex-col selection:bg-brand-orange/20 selection:text-brand-orange">
      {/* ------------------------------------------------------------------ */}
      {/* Toast Notification Container (Blank Canvas top-right position)    */}
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
              <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Content Area                                                  */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 w-full flex flex-col">
        {/* ---------------------------------------------------------------- */}
        {/* VIEW 1: Centered OTP Login Flow with Minimalist Background Art   */}
        {/* ---------------------------------------------------------------- */}
        {!isAuthenticated ? (
          <div className="flex-1 relative w-full flex items-center justify-center min-h-screen p-4 sm:p-6 overflow-hidden">
            {/* ------------------------------------------------------------ */}
            {/* LARGE SOFT BACKGROUND BLOBS / AMBIENT GLOWS (No white voids) */}
            {/* ------------------------------------------------------------ */}
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-brand-orange/5 blur-3xl pointer-events-none z-0 hidden lg:block" />
            <div className="absolute -bottom-36 -right-36 w-[650px] h-[650px] rounded-full bg-brand-orange/5 blur-3xl pointer-events-none z-0 hidden lg:block" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full bg-gray-100/70 blur-3xl pointer-events-none z-0 hidden lg:block" />

            {/* ------------------------------------------------------------ */}
            {/* FLOATING GEOMETRY ACCENTS (Top, Edges, Ambient Accents)      */}
            {/* ------------------------------------------------------------ */}

            {/* Top-Left: Minimal Line-art Chat Bubble & Floating Dots */}
            <div className="absolute left-[8%] xl:left-[14%] top-12 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="125"
                height="95"
                viewBox="0 0 125 95"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[105px] xl:w-[125px] h-auto"
              >
                <path
                  d="M20 12 H88 C96.8366 12 104 19.1634 104 28 V50 C104 58.8366 96.8366 66 88 66 H46 L28 80 V66 H20 C11.1634 66 4 58.8366 4 50 V28 C4 19.1634 11.1634 12 20 12 Z"
                  fill="#ffffff"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <circle cx="38" cy="40" r="3.5" fill="#f77c34" />
                <circle cx="54" cy="40" r="3.5" fill="#111827" />
                <circle cx="70" cy="40" r="3.5" fill="#0fa8d6" />
                <path
                  d="M112 14 L120 22 M120 14 L112 22"
                  stroke="#f77c34"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Top-Right: Geometric Sparkle, Orbit Ring & Zig-Zag */}
            <div className="absolute right-[8%] xl:right-[14%] top-12 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="140"
                height="105"
                viewBox="0 0 140 105"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[115px] xl:w-[140px] h-auto"
              >
                <path
                  d="M35 15 C35 25 45 35 55 35 C45 35 35 45 35 55 C35 45 25 35 15 35 C25 35 35 25 35 15 Z"
                  fill="#fff7ed"
                  stroke="#f77c34"
                  strokeWidth="2"
                />
                <circle
                  cx="85"
                  cy="45"
                  r="16"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="97" cy="35" r="3.5" fill="#f77c34" />
                <circle cx="70" cy="20" r="2.5" fill="#111827" opacity="0.4" />
                <circle cx="115" cy="70" r="3.5" fill="#111827" opacity="0.3" />
                <path
                  d="M70 85 L78 75 L86 85 L94 75 L102 85"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Top-Center Floating Accents (Above Central Card) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="180"
                height="50"
                viewBox="0 0 180 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[180px] h-auto"
              >
                <circle cx="30" cy="25" r="8" stroke="#111827" strokeWidth="2" fill="none" opacity="0.4" />
                <circle cx="30" cy="25" r="2.5" fill="#f77c34" />
                <path d="M85 20 L95 30 M95 20 L85 30" stroke="#f77c34" strokeWidth="2" strokeLinecap="round" />
                <circle cx="150" cy="25" r="5" fill="#ffffff" stroke="#111827" strokeWidth="2" />
                <circle cx="150" cy="25" r="1.5" fill="#111827" />
                <line x1="60" y1="25" x2="70" y2="25" stroke="#111827" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                <line x1="110" y1="25" x2="120" y2="25" stroke="#111827" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
              </svg>
            </div>

            {/* Left Edge: Vertical Sawtooth & Rings */}
            <div className="absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="60"
                height="180"
                viewBox="0 0 60 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[50px] xl:w-[60px] h-auto"
              >
                <path
                  d="M25 15 L35 25 L25 35 L35 45 L25 55 L35 65"
                  stroke="#f77c34"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="30"
                  cy="95"
                  r="12"
                  stroke="#111827"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="3 3"
                  opacity="0.4"
                />
                <circle cx="30" cy="95" r="3" fill="#f77c34" />
                <path
                  d="M22 135 L38 135 M30 127 L30 143"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <circle cx="30" cy="165" r="4" fill="#0fa8d6" opacity="0.6" />
              </svg>
            </div>

            {/* Right Edge: Geometry Accents, 'X' Marks & Dots */}
            <div className="absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="60"
                height="180"
                viewBox="0 0 60 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[50px] xl:w-[60px] h-auto"
              >
                <rect
                  x="18"
                  y="15"
                  width="24"
                  height="24"
                  rx="6"
                  fill="#fff7ed"
                  stroke="#f77c34"
                  strokeWidth="2"
                  transform="rotate(45 30 27)"
                />
                <path
                  d="M22 80 L38 96 M38 80 L22 96"
                  stroke="#111827"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <circle cx="30" cy="125" r="3.5" fill="#f77c34" />
                <circle cx="30" cy="145" r="2.5" fill="#111827" opacity="0.5" />
                <circle cx="30" cy="165" r="4" fill="#ffffff" stroke="#111827" strokeWidth="2" />
              </svg>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* SCALED-UP OVERLAPPING MAIN ILLUSTRATIONS                     */}
            {/* ------------------------------------------------------------ */}

            {/* Right Side (Sliding behind the central login card from right-[12%]) */}
            <div className="absolute right-[3%] xl:right-[11%] 2xl:right-[14%] bottom-2 xl:bottom-6 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="460"
                height="380"
                viewBox="0 0 460 380"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[360px] xl:w-[460px] 2xl:w-[520px] h-auto"
              >
                <defs>
                  <pattern
                    id="right-orange-dots-dense"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="8" cy="8" r="2.5" fill="#f77c34" />
                  </pattern>
                  <pattern
                    id="diagonal-stripes"
                    x="0"
                    y="0"
                    width="10"
                    height="10"
                    patternTransform="rotate(45)"
                    patternUnits="userSpaceOnUse"
                  >
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#111827" strokeWidth="1.5" opacity="0.15" />
                  </pattern>
                </defs>

                {/* Floor ground line extending under central card */}
                <line x1="20" y1="330" x2="440" y2="330" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="160" y1="340" x2="350" y2="340" stroke="#111827" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

                {/* Large Decorative Block with Dotted Pattern */}
                <rect x="290" y="190" width="125" height="140" rx="14" fill="#ffffff" stroke="#111827" strokeWidth="2.5" />
                <rect x="298" y="198" width="109" height="124" rx="10" fill="url(#right-orange-dots-dense)" />

                {/* Secondary Striped Geometric Accent Block */}
                <rect x="360" y="140" width="60" height="60" rx="10" fill="url(#diagonal-stripes)" stroke="#111827" strokeWidth="2" />
                <circle cx="390" cy="170" r="12" fill="#ffffff" stroke="#f77c34" strokeWidth="2" />
                <circle cx="390" cy="170" r="4" fill="#f77c34" />

                {/* Main Seating Geometric Block */}
                <rect x="130" y="160" width="155" height="170" rx="14" fill="#ffffff" stroke="#111827" strokeWidth="2.5" />
                <line x1="130" y1="210" x2="285" y2="210" stroke="#111827" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.35" />
                <circle cx="150" cy="185" r="4" fill="#f77c34" />
                <circle cx="166" cy="185" r="3" fill="#111827" opacity="0.5" />

                {/* Person sitting on the geometric block */}
                {/* Legs (reaching leftward underneath central card) */}
                <path
                  d="M170 160 C170 195, 115 200, 100 245 L100 325 L80 325"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M190 160 C190 205, 140 215, 128 270 L128 328 L108 328"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.65"
                />

                {/* Torso & Head */}
                <path
                  d="M195 160 C195 125, 210 90, 230 75"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle
                  cx="240"
                  cy="45"
                  r="20"
                  fill="#ffffff"
                  stroke="#111827"
                  strokeWidth="3"
                />
                <path
                  d="M225 40 C229 28, 250 26, 258 38"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Arms & Hands on Laptop */}
                <path
                  d="M218 95 L195 125 L165 122"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Laptop on lap */}
                <line
                  x1="140"
                  y1="130"
                  x2="185"
                  y2="130"
                  stroke="#111827"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <line
                  x1="144"
                  y1="129"
                  x2="132"
                  y2="96"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <polygon points="132,96 144,129 140,129 128,97" fill="#111827" />
                <path
                  d="M125 102 L110 98"
                  stroke="#f77c34"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />

                {/* Coffee Mug on Block */}
                <rect x="250" y="142" width="16" height="18" rx="3" fill="#ffffff" stroke="#111827" strokeWidth="2" />
                <path d="M266 146 C270 146, 272 152, 266 156" stroke="#111827" strokeWidth="1.5" fill="none" />
                <path d="M255 136 C255 132, 259 130, 259 126" stroke="#f77c34" strokeWidth="1.5" strokeLinecap="round" />

                {/* Floating Sparkles & Accents */}
                <path d="M75 80 L81 86 M81 80 L75 86" stroke="#f77c34" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="280" cy="110" r="4.5" fill="#f77c34" />
                <circle cx="340" cy="120" r="3" fill="#111827" opacity="0.4" />
                <circle cx="70" cy="140" r="3.5" fill="#0fa8d6" opacity="0.7" />
              </svg>
            </div>

            {/* Left Side (Sliding behind the central login card from left-[12%]) */}
            <div className="absolute left-[3%] xl:left-[11%] 2xl:left-[14%] bottom-2 xl:bottom-6 z-20 hidden lg:block pointer-events-none select-none">
              <svg
                width="420"
                height="360"
                viewBox="0 0 420 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[340px] xl:w-[420px] 2xl:w-[480px] h-auto"
              >
                <defs>
                  <pattern
                    id="left-orange-dots-dense"
                    x="0"
                    y="0"
                    width="15"
                    height="15"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="7.5" cy="7.5" r="2.5" fill="#f77c34" />
                  </pattern>
                </defs>

                {/* Dotted Orange Rectangle */}
                <rect
                  x="30"
                  y="110"
                  width="130"
                  height="175"
                  rx="16"
                  fill="#ffffff"
                  stroke="#111827"
                  strokeWidth="2.5"
                />
                <rect
                  x="40"
                  y="120"
                  width="110"
                  height="155"
                  rx="10"
                  fill="url(#left-orange-dots-dense)"
                />

                {/* Secondary Geometric Pill / Block */}
                <rect x="20" y="60" width="75" height="35" rx="17.5" fill="#fff7ed" stroke="#f77c34" strokeWidth="2" />
                <circle cx="37" cy="77.5" r="4" fill="#f77c34" />
                <circle cx="55" cy="77.5" r="4" fill="#f77c34" opacity="0.5" />
                <circle cx="73" cy="77.5" r="4" fill="#f77c34" opacity="0.25" />

                {/* White Square with Upward Line-Art Arrow (tucking behind the central card) */}
                <g transform="translate(135, 50)">
                  <rect
                    x="4"
                    y="4"
                    width="118"
                    height="118"
                    rx="20"
                    fill="#111827"
                    opacity="0.06"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="118"
                    height="118"
                    rx="20"
                    fill="#ffffff"
                    stroke="#111827"
                    strokeWidth="2.5"
                  />
                  {/* Orange dashed halo circle behind arrow */}
                  <circle
                    cx="59"
                    cy="48"
                    r="18"
                    fill="#fff7ed"
                    stroke="#f77c34"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Upward Line-art Arrow */}
                  <path
                    d="M59 86 L59 34"
                    stroke="#111827"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M44 48 L59 34 L74 48"
                    stroke="#111827"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="59" cy="94" r="3" fill="#f77c34" />
                </g>

                {/* Scattered Squiggly Lines */}
                {/* Bottom long wavy line */}
                <path
                  d="M45 320 Q 75 300, 105 320 T 165 320 T 225 320 T 285 320"
                  stroke="#111827"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Orange dynamic vertical squiggle */}
                <path
                  d="M15 90 Q 32 65, 20 40 T 36 15"
                  stroke="#f77c34"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Top sweeping curve */}
                <path
                  d="M280 40 Q 310 20, 335 45 T 365 35"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.7"
                />
                {/* Second squiggle wave */}
                <path
                  d="M220 220 Q 240 205, 260 220 T 300 220"
                  stroke="#f77c34"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Geometric Cross Accent */}
                <g transform="translate(300, 140)">
                  <line x1="0" y1="-10" x2="0" y2="10" stroke="#f77c34" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-10" y1="0" x2="10" y2="0" stroke="#f77c34" strokeWidth="3" strokeLinecap="round" />
                </g>
                <g transform="translate(350, 90)">
                  <line x1="-6" y1="-6" x2="6" y2="6" stroke="#111827" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  <line x1="6" y1="-6" x2="-6" y2="6" stroke="#111827" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                </g>

                {/* Floating accent circles & hollow rings */}
                <circle cx="270" cy="240" r="5" fill="#111827" opacity="0.6" />
                <circle cx="300" cy="275" r="3.5" fill="#f77c34" />
                <circle cx="340" cy="210" r="8" stroke="#111827" strokeWidth="2" fill="none" opacity="0.4" />
                <circle cx="20" cy="220" r="4" fill="#111827" opacity="0.3" />
              </svg>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* CENTRAL LOGIN CARD (High Z-Index & Strong Drop Shadow)       */}
            {/* ------------------------------------------------------------ */}
            <div className="relative z-40 max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100/90">
              {/* Website Logo & Title */}
<div className="text-center mb-5">
  {/* Apply a negative bottom margin to aggressively pull the heading up */}
  <div className="flex items-center justify-center -mb-6"> 
    <Image
      src="/logo-icon.png"
      alt="Revelation IT Training Logo"
      width={140}
      height={46}
      className="w-32 sm:w-36 h-auto object-contain mx-auto"
      priority
    />
  </div>
  {/* Student Interview Portal heading will be right here */}
                <h1 className="text-2xl font-black text-brand-dark tracking-tight">
                  Student Interview Portal
                </h1>
                <p className="text-xs sm:text-sm text-brand-muted mt-1.5 leading-relaxed">
                  {authStep === "email"
                    ? "Enter your whitelisted student email to receive a secure login code."
                    : `Enter the 6-digit code sent to ${inputEmail}`}
                </p>
              </div>

              {/* Error Notice */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              {/* Step 1: Email Form */}
              {authStep === "email" && (
                <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      Registered Student Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="e.g. rahul.sharma@gmail.com"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        required
                        disabled={isSubmittingAuth}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-mono disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth || !inputEmail.trim()}
                    className="w-full py-3 px-5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAuth ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Email...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-brand-muted">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Protected student interview scheduling session</span>
                  </div>
                </form>
              )}

              {/* Step 2: OTP Verification Form */}
              {authStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted">
                        6-Digit Passcode
                      </label>
                      <span className="text-xs font-mono text-brand-orange font-semibold">
                        {Math.floor(countdown / 60)}:
                        {String(countdown % 60).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                        }
                        required
                        disabled={isSubmittingAuth}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-lg tracking-widest font-mono text-center font-bold text-brand-dark focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth || otpCode.length < 6}
                    className="w-full py-3 px-5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingAuth ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Validating OTP...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Open Schedule</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep("email");
                        setOtpCode("");
                        setAuthError(null);
                      }}
                      className="text-brand-muted hover:text-brand-dark transition-colors"
                    >
                      &larr; Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={isSubmittingAuth || countdown > 540}
                      className="font-semibold text-brand-orange hover:underline disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------------------- */
          /* VIEW 2: Authenticated Calendar Schedule View                     */
          /* ---------------------------------------------------------------- */
          <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
            {/* Top Control & Welcome Bar */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Authenticated Candidate</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-brand-dark tracking-tight">
                  Interview Scheduling Calendar
                </h1>
                <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
                  Signed in as <strong className="text-brand-dark font-mono">{studentEmail}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    fetchCalendarEvents();
                    addToast("info", "Refreshed live calendar bookings.");
                  }}
                  className="p-2.5 rounded-xl border border-gray-200 text-brand-dark hover:bg-gray-50 transition-colors shadow-xs"
                  title="Refresh Slots"
                >
                  <RefreshCw className="w-4 h-4 text-brand-muted" />
                </button>

                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs sm:text-sm font-bold hover:bg-brand-orange/90 transition-all shadow-sm shadow-brand-orange/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book a Slot</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Main Grid & Side Agenda */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid Container (2 Cols on Desktop) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs relative">
                {/* Month Navigator Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-brand-dark">
                      {monthName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthDate(new Date(year, month - 1, 1))
                      }
                      className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentMonthDate(new Date())}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-dark hover:bg-gray-100 border border-gray-200 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonthDate(new Date(year, month + 1, 1))
                      }
                      className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Names Header */}
                <div className="grid grid-cols-7 border-b border-gray-100 text-center bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-brand-muted py-2.5">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Day Grid Cells - Isolated Blocks in a darker background */}
                <div className="p-3 sm:p-4 bg-gray-50/90 border-b border-gray-200/80 rounded-b-2xl relative">
                  <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {calendarDays.map((day, idx) => {
                      const isCurrentMonth = day.isCurrentMonth;
                      const isSelected = day.dateString === selectedDate;
                      const hasEvents = day.events.length > 0;
                      const isPopoverActive = activePopoverDate === day.dateString;
                      const isActiveOrSelected = isSelected || isPopoverActive;
                      const colIdx = idx % 7;
                      const rowIdx = Math.floor(idx / 7);

                      // Edge Detection:
                      // Horizontal: Right-side columns (col 4, 5, 6 - Thu, Fri, Sat) anchor right to expand left
                      const isRightEdge = colIdx >= 4;
                      // Vertical: Bottom rows (row 3, 4, 5) anchor bottom to expand upwards, preventing clipping
                      const isBottomRow = rowIdx >= 3;

                      const verticalPlacement = isBottomRow ? "bottom-0" : "top-0";
                      const horizontalPlacement = isRightEdge
                        ? "right-[110%]"
                        : "left-[110%]";
                      const transformOrigin = isBottomRow
                        ? isRightEdge
                          ? "origin-bottom-right"
                          : "origin-bottom-left"
                        : isRightEdge
                        ? "origin-top-right"
                        : "origin-top-left";

                      const popoverPlacement = `${verticalPlacement} ${horizontalPlacement} ${transformOrigin}`;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedDate(day.dateString);
                            if (hasEvents) {
                              setActivePopoverDate((prev) =>
                                prev === day.dateString ? null : day.dateString
                              );
                            } else {
                              setActivePopoverDate(null);
                            }
                          }}
                          className={`relative min-h-[95px] sm:min-h-[115px] p-2.5 sm:p-3 cursor-pointer transition-all duration-200 flex flex-col justify-between rounded-xl group ${
                            isPopoverActive
                              ? "z-[60] bg-white scale-[1.02] ring-2 ring-brand-orange border border-brand-orange/30 shadow-[0_8px_30px_rgb(247,124,52,0.3)]"
                              : isActiveOrSelected
                              ? "z-20 bg-white scale-[1.02] ring-2 ring-brand-orange border border-brand-orange/30 shadow-[0_8px_30px_rgb(247,124,52,0.3)]"
                              : !isCurrentMonth
                              ? "z-10 bg-gray-200 text-gray-500 border border-gray-300/60 shadow-xs opacity-80 hover:bg-gray-200/90"
                              : "z-10 bg-white border border-gray-100 shadow-[0_4px_16px_rgb(247,124,52,0.08)] hover:shadow-[0_8px_24px_rgb(247,124,52,0.18)] hover:border-brand-orange/20"
                          }`}
                        >
                          {/* Floating Inline Popover for Scheduled Slots */}
                          {hasEvents && isPopoverActive && (
                            <div
                              ref={popoverRef}
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute z-[60] w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 cursor-default flex flex-col text-left transition-all duration-200 animate-in fade-in zoom-in-95 ${popoverPlacement}`}
                            >
                              {/* Popover Header */}
                              <div className="p-3.5 sm:p-4 pb-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-brand-dark">
                                      {formatDateHeader(day.dateString)}
                                    </h4>
                                    <p className="text-[10px] text-brand-muted">
                                      Scheduled Interviews
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/80 text-brand-orange font-mono">
                                    {day.events.length}{" "}
                                    {day.events.length === 1 ? "Slot" : "Slots"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActivePopoverDate(null);
                                    }}
                                    className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                    title="Close"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Popover Content Area: scrolls internally without scrolling the entire page */}
                              <div className="p-3 sm:p-3.5 max-h-60 overflow-y-auto space-y-2.5 flex-1">
                                {day.events.map((ev, evIdx) => {
                                  const theme =
                                    POPUP_CARD_THEMES[
                                      evIdx % POPUP_CARD_THEMES.length
                                    ];
                                  const initials = getInitials(ev.student_name);

                                  return (
                                    <div
                                      key={evIdx}
                                      className="bg-white rounded-xl shadow-xs border border-gray-100 p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-sm hover:border-gray-200"
                                    >
                                      {/* Candidate Initials & Student Name */}
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div
                                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 shadow-2xs ${theme.avatarBg}`}
                                          >
                                            {initials}
                                          </div>
                                          <span className="font-bold text-xs text-brand-dark truncate">
                                            {ev.student_name}
                                          </span>
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0">
                                          Booked
                                        </span>
                                      </div>

                                      {/* Time Slot */}
                                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-100 text-[11px] font-mono">
                                        <div className="flex items-center gap-1.5 text-brand-muted">
                                          <Clock className="w-3 h-3 text-brand-orange shrink-0" />
                                          <span className="font-semibold text-brand-dark">
                                            {formatTime(ev.start_time)} -{" "}
                                            {formatTime(ev.end_time)}
                                          </span>
                                        </div>
                                        <span className="text-[9px] text-brand-muted font-sans font-medium">
                                          Confirmed
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Popover Footer */}
                              <div className="p-3 border-t border-gray-100 bg-gray-50/70 rounded-b-2xl flex items-center justify-between shrink-0">
                                <span className="text-[11px] text-brand-muted">
                                  Need another time?
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const dateToBook = day.dateString;
                                    setActivePopoverDate(null);
                                    openBookingModal(dateToBook);
                                  }}
                                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-brand-orange text-white hover:bg-brand-orange/90 transition-all shadow-xs flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Book This Day</span>
                                </button>
                              </div>
                            </div>
                          )}
                          {/* Day Number Header */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                                day.isToday
                                  ? "bg-brand-orange text-white shadow-xs"
                                  : isActiveOrSelected
                                  ? "bg-brand-orange/20 text-brand-orange font-black"
                                  : isCurrentMonth
                                  ? "text-brand-dark"
                                  : "text-gray-500 font-medium"
                              }`}
                            >
                              {day.dayNumber}
                            </span>

                            {hasEvents && (
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange border border-brand-orange/30 font-mono"
                                title={`${day.events.length} slot(s) booked`}
                              >
                                {day.events.length}
                              </span>
                            )}
                          </div>

                          {/* Events Preview Chips inside the Cell with Colored Student Names */}
                          <div className="space-y-1 mt-1 overflow-hidden">
                            {day.events.slice(0, 2).map((ev, evIdx) => {
                              const nameColor =
                                evIdx % 2 === 0
                                  ? "text-brand-orange"
                                  : "text-brand-blue";
                              return (
                                <div
                                  key={evIdx}
                                  className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-50/90 hover:bg-orange-50/50 border border-gray-200/60 truncate shadow-2xs transition-colors flex items-center justify-between gap-1"
                                  title={`${ev.student_name} (${formatTime(ev.start_time)} - ${formatTime(ev.end_time)})`}
                                >
                                  <span className={`font-semibold truncate ${nameColor}`}>
                                    {ev.student_name}
                                  </span>
                                  <span className="text-gray-400 font-mono text-[9px] shrink-0">
                                    {formatTime(ev.start_time)}
                                  </span>
                                </div>
                              );
                            })}
                            {day.events.length > 2 && (
                              <div className="text-[9px] font-bold text-brand-orange pl-1">
                                +{day.events.length - 2} more
                              </div>
                            )}
                          </div>

                          {/* Quick Book Trigger */}
                          <div
                            className={`transition-opacity flex justify-end ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openBookingModal(day.dateString);
                              }}
                              className="text-[10px] font-bold text-brand-orange hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>+ Slot</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Side Agenda: Selected Day's Schedule Details */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                        Selected Date
                      </span>
                      <h3 className="text-base font-bold text-brand-dark mt-0.5">
                        {formatDateHeader(selectedDate)}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => openBookingModal(selectedDate)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-brand-orange/90 transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                    </button>
                  </div>

                  {/* Selected Day Slots List */}
                  <div className="mt-5 space-y-3">
                    {isLoadingEvents ? (
                      <div className="py-12 flex flex-col items-center justify-center gap-2 text-brand-muted">
                        <Loader2 className="w-5 h-5 animate-spin text-brand-orange" />
                        <span className="text-xs">Loading slots...</span>
                      </div>
                    ) : selectedDateEvents.length === 0 ? (
                      <div className="py-12 px-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-brand-dark">
                          Open Schedule
                        </h4>
                        <p className="text-xs text-brand-muted mt-1">
                          No interviews are currently booked for this day. Click above to reserve your preferred slot!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <p className="text-xs font-semibold text-brand-muted">
                          Existing Reserved Slots ({selectedDateEvents.length}):
                        </p>
                        {selectedDateEvents.map((ev, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                                {ev.student_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-brand-dark">
                                  {ev.student_name}
                                </h5>
                                <div className="flex items-center gap-1.5 text-[11px] text-brand-muted font-mono mt-0.5">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {formatTime(ev.start_time)} - {formatTime(ev.end_time)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-amber-100/80 text-amber-800 border border-amber-200">
                              Booked
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-brand-muted flex items-start gap-2">
                  <Lock className="w-4 h-4 text-brand-muted shrink-0 mt-0.5" />
                  <span>
                    Privacy Protected: Candidate contact details and recruiting companies are strictly confidential and visible only to placement administrators.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* ---------------------------------------------------------------- */}
        {/* MODAL: Book a Slot Form                                          */}
        {/* ---------------------------------------------------------------- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 transform transition-all duration-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-dark">
                      Book Interview Slot
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Schedule your company interview slot
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conflict or Generic Error Banner */}
              {bookingError && (
                <div
                  className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    isConflictError
                      ? "bg-amber-50 border-amber-300 text-amber-900"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isConflictError ? "text-amber-600" : "text-rose-600"
                    }`}
                  />
                  <div>
                    {isConflictError && (
                      <strong className="block font-bold mb-0.5">
                        Slot Collision Detected (HTTP 409)
                      </strong>
                    )}
                    <span>{bookingError}</span>
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <form onSubmit={handleSubmitBooking} className="mt-5 space-y-4">
                {/* Candidate Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={bookingForm.name}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, name: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                    Hiring Company Name *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Infosys, TCS, Wipro, Google"
                      value={bookingForm.company}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, company: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </div>
                </div>

                {/* Interview Date */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                    Interview Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, date: e.target.value })
                      }
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 font-mono"
                    />
                  </div>
                </div>

                {/* Time Range: Start & End */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={bookingForm.start_time}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, start_time: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={bookingForm.end_time}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, end_time: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                    />
                  </div>
                </div>

                {/* -------------------------------------------------------- */}
                {/* Important UI Detail: EXACT REQUIRED TEXT                 */}
                {/* -------------------------------------------------------- */}
                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-amber-800 text-xs leading-relaxed">
                  Note: Once saved, only an admin can change or cancel your slot.
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmittingBooking}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/90 transition-all shadow-sm shadow-brand-orange/20 disabled:opacity-50"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <span>Confirm & Book Slot</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
