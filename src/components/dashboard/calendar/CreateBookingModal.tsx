"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Building2,
  Mail,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialHour?: number;
  editingBooking?: InterviewBooking | null;
  onSave: (data: {
    student_name: string;
    student_email: string;
    company_name: string;
    booking_date: string;
    start_time: string;
    end_time: string;
  }, editId?: number) => Promise<{ success: boolean; error?: string; isConflict?: boolean }>;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  initialDate,
  initialHour = 10,
  editingBooking,
  onSave,
}: CreateBookingModalProps) {
  const isEdit = Boolean(editingBooking);

  const [formData, setFormData] = useState({
    student_name: "",
    student_email: "",
    company_name: "",
    booking_date: new Date().toISOString().split("T")[0],
    start_time: "10:00",
    end_time: "11:00",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConflict, setIsConflict] = useState(false);

  // Initialize form when opening
  useEffect(() => {
    if (editingBooking) {
      const formatTime = (t: string) => {
        if (!t) return "10:00";
        const parts = t.split(":");
        return `${parts[0] || "10"}:${parts[1] || "00"}`;
      };

      setFormData({
        student_name: editingBooking.student_name,
        student_email: editingBooking.student_email,
        company_name: editingBooking.company_name,
        booking_date: editingBooking.booking_date,
        start_time: formatTime(editingBooking.start_time),
        end_time: formatTime(editingBooking.end_time),
      });
    } else {
      const startH = String(initialHour || 10).padStart(2, "0");
      const endH = String((initialHour || 10) + 1).padStart(2, "0");

      setFormData({
        student_name: "",
        student_email: "",
        company_name: "",
        booking_date: initialDate || new Date().toISOString().split("T")[0],
        start_time: `${startH}:00`,
        end_time: `${endH}:00`,
      });
    }
    setErrorMessage(null);
    setIsConflict(false);
  }, [editingBooking, initialDate, initialHour, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsConflict(false);

    // Validation
    if (!formData.student_name.trim()) {
      setErrorMessage("Student name is required.");
      return;
    }
    if (!formData.student_email.trim()) {
      setErrorMessage("Student email is required.");
      return;
    }
    if (!formData.company_name.trim()) {
      setErrorMessage("Company name is required.");
      return;
    }
    if (!formData.booking_date) {
      setErrorMessage("Interview date is required.");
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      setErrorMessage("Both start time and end time are required.");
      return;
    }
    if (formData.start_time >= formData.end_time) {
      setErrorMessage("Start time must precede end time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSave(formData, editingBooking?.id);
      if (result.success) {
        onClose();
      } else {
        setErrorMessage(result.error || "Failed to save booking.");
        setIsConflict(Boolean(result.isConflict));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 transform transition-all duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-dark">
                {isEdit ? "Edit Interview Slot" : "Schedule New Interview"}
              </h3>
              <p className="text-xs text-brand-muted">
                {isEdit ? "Reschedule or update details" : "Reserve an interview time block"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Conflict Banner */}
        {errorMessage && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              isConflict
                ? "bg-amber-50 border-amber-300 text-amber-900"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            {isConflict ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              {isConflict && (
                <strong className="block font-bold mb-0.5">
                  Slot Collision Warning (HTTP 409)
                </strong>
              )}
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Candidate Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
              Candidate Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.student_name}
                onChange={(e) =>
                  setFormData({ ...formData, student_name: e.target.value })
                }
                required
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          {/* Candidate Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
              Candidate Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="student@example.com"
                value={formData.student_email}
                onChange={(e) =>
                  setFormData({ ...formData, student_email: e.target.value })
                }
                required
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
              Hiring Company *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Infosys, TCS, Wipro, Google"
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                required
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
              Interview Date *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={formData.booking_date}
                onChange={(e) =>
                  setFormData({ ...formData, booking_date: e.target.value })
                }
                required
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 font-mono"
              />
            </div>
          </div>

          {/* Time Slot (Start & End) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-muted mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono focus:outline-hidden focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-brand-dark hover:bg-gray-100 border border-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-orange text-white hover:bg-brand-orange/90 transition-all shadow-sm shadow-brand-orange/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? "Update Slot" : "Confirm Slot"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
