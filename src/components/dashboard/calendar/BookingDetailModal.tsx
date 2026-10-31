"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Mail,
  User,
  Building2,
  Trash2,
  Edit3,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { InterviewBooking } from "@/backend/types/scheduling";

interface BookingDetailModalProps {
  booking: InterviewBooking | null;
  onClose: () => void;
  onEdit: (booking: InterviewBooking) => void;
  onDelete: (id: number) => Promise<void>;
}

export function BookingDetailModal({
  booking,
  onClose,
  onEdit,
  onDelete,
}: BookingDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!booking) return null;

  const formatTimeSlot = (startTime: string, endTime: string) => {
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

  const formatDate = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  async function handleDelete() {
    if (!booking) return;
    setIsDeleting(true);
    try {
      await onDelete(booking.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 transform transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-black text-sm">
              {booking.student_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-dark">
                {booking.student_name}
              </h3>
              <p className="text-xs text-brand-muted">Interview Booking Details</p>
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

        {/* Content */}
        {!showConfirmDelete ? (
          <div className="py-4 space-y-3.5">
            {/* Company */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <Building2 className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
                  Company
                </span>
                <span className="text-sm font-bold text-purple-950">
                  {booking.company_name}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <Mail className="w-4 h-4 text-brand-muted shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Candidate Email
                </span>
                <span className="text-xs font-mono text-brand-dark font-semibold">
                  {booking.student_email}
                </span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100">
                <Calendar className="w-4 h-4 text-brand-orange shrink-0 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Date
                </span>
                <span className="text-xs font-bold text-brand-dark">
                  {formatDate(booking.booking_date)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                <Clock className="w-4 h-4 text-brand-blue shrink-0 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Time Slot
                </span>
                <span className="text-xs font-bold text-brand-dark font-mono">
                  {formatTimeSlot(booking.start_time, booking.end_time)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel Slot</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(booking);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-dark text-white hover:bg-black transition-all shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Booking</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Delete Confirmation */
          <div className="py-4 space-y-4">
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900">
                  Confirm Cancellation
                </h4>
                <p className="text-xs text-rose-700 mt-1">
                  Are you sure you want to cancel the interview for{" "}
                  <strong>{booking.student_name}</strong> with{" "}
                  <strong>{booking.company_name}</strong>?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-dark border border-gray-200 hover:bg-gray-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel Interview</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
