"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Loader2,
  ArrowRight,
  PhoneCall,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export function EnrollmentModal({
  isOpen,
  onClose,
  defaultCourse = "Software Testing (Manual + Automation SDET)",
}: EnrollmentModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    course: defaultCourse,
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update pre-filled course when defaultCourse prop changes or modal opens
  useEffect(() => {
    if (defaultCourse) {
      setFormData((prev) => ({
        ...prev,
        course: defaultCourse,
      }));
    }
  }, [defaultCourse, isOpen]);

  // Handle closing and reset state cleanly
  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      setIsSubmitted(false);
      setIsLoading(false);
      setErrorMessage("");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        course: defaultCourse || "Software Testing (Manual + Automation SDET)",
        message: "",
      });
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        course: formData.course.trim(),
        message: formData.message.trim(),
      };

      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || "Failed to submit enrollment application.");
      }
    } catch (err: any) {
      console.error("[EnrollmentModal] Submit Error:", err);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleModalClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
            aria-hidden="true"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-100 overflow-hidden my-8"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-orange via-brand-blue to-purple-600" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleModalClose}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              /* Success State Screen */
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Check className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Application Received</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-dark">
                  Enrollment Request Sent!
                </h3>
                <p className="text-brand-muted mt-2 text-sm leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. We have received your enrollment interest for <strong>{formData.course}</strong>. Our admissions counselor will contact you shortly at <strong>{formData.email}</strong> or on WhatsApp.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/917558339190?text=Hello%2C%20I%20have%20submitted%20my%20enrollment%20for%20Revelation%20IT%20Training."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-all active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant WhatsApp Connect</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="bg-gray-100 hover:bg-gray-200 text-brand-dark px-5 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Form State Screen */
              <div>
                {/* Modal Header */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider rounded-full mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Enrollment</span>
                  </div>
                  <h2 className="text-2xl font-bold text-brand-dark tracking-tight">
                    Enroll in Training Batch
                  </h2>
                  <p className="text-brand-muted text-xs sm:text-sm mt-1">
                    Fill out the form below and an admissions counselor will confirm your batch seat.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-[11px] font-bold uppercase tracking-wide text-brand-dark mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. John Doe"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[11px] font-bold uppercase tracking-wide text-brand-dark mb-1.5"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-bold uppercase tracking-wide text-brand-dark mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full transition-all shadow-2xs"
                    />
                  </div>

                  {/* Course / Batch of Interest */}
                  <div>
                    <label
                      htmlFor="course"
                      className="block text-[11px] font-bold uppercase tracking-wide text-brand-dark mb-1.5"
                    >
                      Selected Course / Batch
                    </label>
                    <input
                      id="course"
                      type="text"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      placeholder="Course or Batch name"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full transition-all shadow-2xs font-semibold"
                    />
                  </div>

                  {/* Message / Notes */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-[11px] font-bold uppercase tracking-wide text-brand-dark mb-1.5"
                    >
                      Message / Questions (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Any specific questions regarding schedule, fees, or placement assistance..."
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-brand-dark focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full transition-all shadow-2xs resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-dark hover:bg-black text-white py-3.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 active:scale-98 shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Enrollment Application</span>
                        <ArrowRight className="w-4 h-4 text-brand-orange" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-gray-400 pt-1">
                    🔒 We respect your privacy. No spam guaranteed.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default EnrollmentModal;
