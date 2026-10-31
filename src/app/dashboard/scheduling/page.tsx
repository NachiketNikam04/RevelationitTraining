"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Mail,
  Building2,
  User,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Search,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Filter,
  Check,
  CalendarCheck,
  Users,
} from "lucide-react";

// Types
interface AllowedEmail {
  id: number;
  email: string;
  created_at: string;
}

interface InterviewBooking {
  id: number;
  student_name: string;
  student_email: string;
  company_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export const dynamic = "force-dynamic";

export default function AdminSchedulingDashboard() {
  // State: Data
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [bookings, setBookings] = useState<InterviewBooking[]>([]);

  // State: Loaders
  const [isLoadingEmails, setIsLoadingEmails] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [deletingEmailId, setDeletingEmailId] = useState<number | null>(null);

  // State: Whitelist Input & Search
  const [newEmail, setNewEmail] = useState("");
  const [emailSearchQuery, setEmailSearchQuery] = useState("");

  // State: Bookings Filter & Search
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");

  // State: Modal for Booking Edit / Create
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form fields for Booking Modal
  const [bookingFormData, setBookingFormData] = useState({
    student_name: "",
    student_email: "",
    company_name: "",
    booking_date: "",
    start_time: "10:00",
    end_time: "11:00",
  });

  // State: Delete Confirmation Modal
  const [bookingToDelete, setBookingToDelete] = useState<InterviewBooking | null>(null);
  const [isDeletingBooking, setIsDeletingBooking] = useState(false);

  // State: Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast Helper
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
  // API Fetchers
  // ---------------------------------------------------------------------------
  const fetchAllowedEmails = useCallback(async () => {
    setIsLoadingEmails(true);
    try {
      const res = await fetch("/api/admin/schedule-emails", {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAllowedEmails(data.data || []);
      } else {
        addToast("error", data.error || "Failed to load allowed email list.");
      }
    } catch (err: any) {
      console.error("Error loading allowed emails:", err);
      addToast("error", "Unable to connect to server for allowed emails.");
    } finally {
      setIsLoadingEmails(false);
    }
  }, [addToast]);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBookings(data.data || []);
      } else {
        addToast("error", data.error || "Failed to load interview bookings.");
      }
    } catch (err: any) {
      console.error("Error loading bookings:", err);
      addToast("error", "Unable to connect to server for bookings.");
    } finally {
      setIsLoadingBookings(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAllowedEmails();
    fetchBookings();
  }, [fetchAllowedEmails, fetchBookings]);

  // ---------------------------------------------------------------------------
  // Whitelist Actions
  // ---------------------------------------------------------------------------
  async function handleAddEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) {
      addToast("error", "Please provide a valid email address.");
      return;
    }

    setIsSubmittingEmail(true);
    try {
      const res = await fetch("/api/admin/schedule-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast("success", `Added ${newEmail.trim().toLowerCase()} to whitelist.`);
        setNewEmail("");
        setAllowedEmails((prev) => [data.data, ...prev]);
      } else {
        addToast("error", data.error || "Failed to add email.");
      }
    } catch (err: any) {
      console.error("Error adding email:", err);
      addToast("error", "Server communication error.");
    } finally {
      setIsSubmittingEmail(false);
    }
  }

  async function handleDeleteEmail(id: number, emailStr: string) {
    if (!confirm(`Are you sure you want to remove ${emailStr} from allowed schedule emails?`)) {
      return;
    }

    setDeletingEmailId(id);
    try {
      const res = await fetch(`/api/admin/schedule-emails/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast("success", `Removed ${emailStr} from whitelist.`);
        setAllowedEmails((prev) => prev.filter((item) => item.id !== id));
      } else {
        addToast("error", data.error || "Failed to delete email.");
      }
    } catch (err: any) {
      console.error("Error deleting email:", err);
      addToast("error", "Failed to delete email record.");
    } finally {
      setDeletingEmailId(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Bookings Actions
  // ---------------------------------------------------------------------------
  function openCreateBookingModal() {
    setModalMode("create");
    setEditingBookingId(null);
    setBookingFormData({
      student_name: "",
      student_email: allowedEmails[0]?.email || "",
      company_name: "",
      booking_date: new Date().toISOString().split("T")[0],
      start_time: "10:00",
      end_time: "11:00",
    });
    setModalError(null);
    setIsBookingModalOpen(true);
  }

  function openEditBookingModal(booking: InterviewBooking) {
    setModalMode("edit");
    setEditingBookingId(booking.id);
    // Format times from HH:MM:SS to HH:MM if necessary
    const formatTimeForInput = (t: string) => {
      if (!t) return "";
      const parts = t.split(":");
      return `${parts[0] || "00"}:${parts[1] || "00"}`;
    };

    setBookingFormData({
      student_name: booking.student_name,
      student_email: booking.student_email,
      company_name: booking.company_name,
      booking_date: booking.booking_date,
      start_time: formatTimeForInput(booking.start_time),
      end_time: formatTimeForInput(booking.end_time),
    });
    setModalError(null);
    setIsBookingModalOpen(true);
  }

  async function handleSaveBooking(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);

    // Basic Validation
    if (!bookingFormData.student_name.trim()) {
      setModalError("Student name is required.");
      return;
    }
    if (!bookingFormData.student_email.trim()) {
      setModalError("Student email is required.");
      return;
    }
    if (!bookingFormData.company_name.trim()) {
      setModalError("Company name is required.");
      return;
    }
    if (!bookingFormData.booking_date) {
      setModalError("Booking date is required.");
      return;
    }
    if (!bookingFormData.start_time || !bookingFormData.end_time) {
      setModalError("Both start and end time are required.");
      return;
    }

    if (bookingFormData.start_time >= bookingFormData.end_time) {
      setModalError("Start time must precede end time.");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/admin/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingFormData),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          addToast("success", "Interview booking successfully scheduled!");
          setBookings((prev) => [data.data, ...prev]);
          setIsBookingModalOpen(false);
        } else {
          setModalError(data.error || "Failed to schedule booking.");
          addToast("error", data.error || "Failed to schedule booking.");
        }
      } else if (modalMode === "edit" && editingBookingId) {
        const res = await fetch(`/api/admin/bookings/${editingBookingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingFormData),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          addToast("success", "Interview booking successfully updated!");
          setBookings((prev) =>
            prev.map((b) => (b.id === editingBookingId ? data.data : b))
          );
          setIsBookingModalOpen(false);
        } else {
          setModalError(data.error || "Failed to update booking.");
          addToast("error", data.error || "Failed to update booking.");
        }
      }
    } catch (err: any) {
      console.error("Booking save error:", err);
      setModalError("Network communication error.");
      addToast("error", "Could not connect to database.");
    } finally {
      setIsSubmittingBooking(false);
    }
  }

  async function handleConfirmDeleteBooking() {
    if (!bookingToDelete) return;

    setIsDeletingBooking(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        addToast(
          "success",
          `Cancelled interview with ${bookingToDelete.company_name} for ${bookingToDelete.student_name}.`
        );
        setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
        setBookingToDelete(null);
      } else {
        addToast("error", data.error || "Failed to delete booking.");
      }
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      addToast("error", "Server communication error.");
    } finally {
      setIsDeletingBooking(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Filtered Computations
  // ---------------------------------------------------------------------------
  const filteredEmails = useMemo(() => {
    if (!emailSearchQuery.trim()) return allowedEmails;
    const q = emailSearchQuery.toLowerCase();
    return allowedEmails.filter((item) => item.email.toLowerCase().includes(q));
  }, [allowedEmails, emailSearchQuery]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        !bookingSearchQuery.trim() ||
        b.student_name.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
        b.student_email.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
        b.company_name.toLowerCase().includes(bookingSearchQuery.toLowerCase());

      const matchesDate =
        !selectedDateFilter || b.booking_date === selectedDateFilter;

      return matchesSearch && matchesDate;
    });
  }, [bookings, bookingSearchQuery, selectedDateFilter]);

  // Format Time for Display: "10:00:00" -> "10:00 AM"
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h || "0", 10);
    const minute = m || "00";
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  // Format Date for Display: "2026-11-05" -> "Nov 5, 2026"
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const [year, month, day] = dateStr.split("-");
      if (!year || !month || !day) return dateStr;
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Toast Notification Container                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-300 transform translate-y-0 ${
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
      {/* Header & Metric Highlights                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight">
            Interview Scheduling Dashboard
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Manage authorized student emails, review upcoming interviews, and modify schedules.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-brand-dark text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Open Interactive Calendar Grid"
          >
            <Calendar className="w-4 h-4 text-brand-orange" />
            <span>Interactive Calendar Grid</span>
          </Link>
          <button
            onClick={() => {
              fetchAllowedEmails();
              fetchBookings();
              addToast("info", "Syncing latest records...");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-brand-dark text-xs sm:text-sm font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-brand-muted" />
            <span>Refresh</span>
          </button>
          <button
            onClick={openCreateBookingModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-xs sm:text-sm font-bold hover:bg-brand-orange/90 transition-all shadow-sm shadow-brand-orange/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Whitelisted Students
            </p>
            <p className="text-2xl font-black text-brand-dark mt-1">
              {allowedEmails.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Total Bookings
            </p>
            <p className="text-2xl font-black text-brand-dark mt-1">
              {bookings.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              Upcoming Slots
            </p>
            <p className="text-2xl font-black text-brand-dark mt-1">
              {
                bookings.filter((b) => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  return b.booking_date >= todayStr;
                }).length
              }
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: Email Whitelist Management                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">
                Email Whitelist Management
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                Only students in this whitelist can request verification OTPs and self-schedule interviews.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full self-start md:self-auto border border-blue-200">
            {allowedEmails.length} Allowed Emails
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add Email Form */}
          <form onSubmit={handleAddEmail} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter student email (e.g. rahul.sharma@gmail.com)..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isSubmittingEmail}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all disabled:bg-gray-50"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingEmail || !newEmail.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isSubmittingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Allowed Email</span>
                </>
              )}
            </button>
          </form>

          {/* Search Filter for Allowed Emails */}
          {allowedEmails.length > 5 && (
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search whitelisted emails..."
                value={emailSearchQuery}
                onChange={(e) => setEmailSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-hidden focus:border-brand-orange transition-all"
              />
              {emailSearchQuery && (
                <button
                  onClick={() => setEmailSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Allowed Emails Table / List */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {isLoadingEmails ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-brand-muted">
                <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
                <span className="text-sm">Loading allowed emails...</span>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">No Allowed Emails Found</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
                  {emailSearchQuery
                    ? "No emails matched your search keyword."
                    : "Add student emails using the input field above so they can schedule company interviews."}
                </p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50/80 sticky top-0 text-[11px] font-bold text-brand-muted uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student Email</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Added On</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {filteredEmails.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/70 transition-colors group"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-semibold text-brand-dark font-mono text-xs sm:text-sm">
                              {item.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-brand-muted hidden sm:table-cell">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteEmail(item.id, item.email)}
                            disabled={deletingEmailId === item.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200 disabled:opacity-50"
                            title="Delete this email"
                          >
                            {deletingEmailId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: Bookings Management                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-dark">
                Bookings Management
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted">
                Complete log of booked student interviews. Click Edit to reschedule or change details.
              </p>
            </div>
          </div>
          <button
            onClick={openCreateBookingModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all self-start md:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Booking</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls & Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student name, company, or email..."
                value={bookingSearchQuery}
                onChange={(e) => setBookingSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-brand-orange transition-all"
              />
              {bookingSearchQuery && (
                <button
                  onClick={() => setBookingSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <input
                  type="date"
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-brand-orange transition-all text-brand-dark"
                />
              </div>
              {selectedDateFilter && (
                <button
                  onClick={() => setSelectedDateFilter("")}
                  className="p-2 text-xs text-brand-muted hover:text-brand-dark bg-gray-100 rounded-xl transition-colors"
                  title="Clear Date Filter"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bookings Data Table */}
          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            {isLoadingBookings ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-brand-muted">
                <Loader2 className="w-7 h-7 animate-spin text-brand-orange" />
                <span className="text-sm">Loading interview bookings...</span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-brand-dark">No Interview Bookings Found</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto">
                  {bookingSearchQuery || selectedDateFilter
                    ? "No bookings match your current search or date filter."
                    : "No interviews have been scheduled yet. Click 'Add Manual Booking' to schedule one."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-gray-50/80 text-[11px] font-bold text-brand-muted uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Company</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Time Slot</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center shrink-0">
                            {booking.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-brand-dark block">
                              {booking.student_name}
                            </span>
                            <span className="text-[11px] text-brand-muted sm:hidden">
                              {booking.student_email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Student Email */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-gray-700">
                          {booking.student_email}
                        </span>
                      </td>

                      {/* Company Name */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{booking.company_name}</span>
                        </div>
                      </td>

                      {/* Booking Date */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-brand-dark font-medium">
                          <Calendar className="w-3.5 h-3.5 text-brand-muted" />
                          <span>{formatDateDisplay(booking.booking_date)}</span>
                        </div>
                      </td>

                      {/* Time Slot */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-brand-dark font-mono font-medium bg-gray-100/70 px-2 py-1 rounded-md">
                          <Clock className="w-3.5 h-3.5 text-brand-muted" />
                          <span>
                            {formatTimeDisplay(booking.start_time)} -{" "}
                            {formatTimeDisplay(booking.end_time)}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditBookingModal(booking)}
                            className="p-1.5 rounded-lg text-brand-dark hover:bg-gray-100 transition-colors"
                            title="Edit / Reschedule Booking"
                          >
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookingToDelete(booking)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Cancel / Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: Edit or Create Booking                                      */}
      {/* ------------------------------------------------------------------ */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 transform transition-all duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">
                    {modalMode === "edit" ? "Edit Interview Booking" : "New Interview Booking"}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    {modalMode === "edit"
                      ? "Reschedule or modify candidate information"
                      : "Schedule a confirmed student slot manually"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBooking} className="mt-5 space-y-4">
              {modalError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Student Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priyanshu Sharma"
                  value={bookingFormData.student_name}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, student_name: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Student Email *
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={bookingFormData.student_email}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, student_email: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Infosys, TCS, Wipro, Google"
                  value={bookingFormData.company_name}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, company_name: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              {/* Booking Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Interview Date *
                </label>
                <input
                  type="date"
                  value={bookingFormData.booking_date}
                  onChange={(e) =>
                    setBookingFormData({ ...bookingFormData, booking_date: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={bookingFormData.start_time}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, start_time: e.target.value })
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
                    value={bookingFormData.end_time}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, end_time: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  disabled={isSubmittingBooking}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-brand-orange/90 transition-all disabled:opacity-50 shadow-sm shadow-brand-orange/20"
                >
                  {isSubmittingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{modalMode === "edit" ? "Save Changes" : "Create Booking"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: Delete Booking Confirmation                                 */}
      {/* ------------------------------------------------------------------ */}
      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark">
              Cancel Interview Booking?
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">
              Are you sure you want to cancel the interview for{" "}
              <strong className="text-brand-dark">{bookingToDelete.student_name}</strong> with{" "}
              <strong className="text-brand-dark">{bookingToDelete.company_name}</strong> on{" "}
              <strong className="text-brand-dark">{formatDateDisplay(bookingToDelete.booking_date)}</strong>?
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-brand-muted font-mono">
              Slot: {formatTimeDisplay(bookingToDelete.start_time)} - {formatTimeDisplay(bookingToDelete.end_time)}
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setBookingToDelete(null)}
                disabled={isDeletingBooking}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-brand-dark hover:bg-gray-100 transition-colors"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteBooking}
                disabled={isDeletingBooking}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-all disabled:opacity-50 shadow-sm shadow-rose-600/20"
              >
                {isDeletingBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Interview</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
