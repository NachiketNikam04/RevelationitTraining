"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Loader2, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

interface ModalContextType {
  isOpen: boolean;
  openModal: (title?: string) => void;
  closeModal: () => void;
  modalTitle: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Book Free Career Counseling");

  function openModal(title?: string) {
    if (title) setModalTitle(title);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalTitle }}>
      {children}
      <GlobalFormModal isOpen={isOpen} onClose={closeModal} title={modalTitle} />
    </ModalContext.Provider>
  );
}

export function useFormModal() {
  const context = useContext(ModalContext);
  if (!context) {
    return {
      isOpen: false,
      openModal: () => {},
      closeModal: () => {},
      modalTitle: "",
    };
  }
  return context;
}

export interface GlobalFormModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
}

export function GlobalFormModal({
  isOpen = false,
  onClose,
  title = "Book Free Career Counseling",
}: GlobalFormModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "QA Automation Bootcamp",
    message: "",
  });

  // Handle closing with clean state reset after modal exit transition (300ms)
  function handleClose() {
    if (onClose) {
      onClose();
    }
    setTimeout(() => {
      setIsSubmitted(false);
      setIsLoading(false);
      setErrorMessage("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        interest: "QA Automation Bootcamp",
        message: "",
      });
    }, 300);
  }

  // Handle form submission to /api/inquiries
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        course_interest: formData.interest,
        message: formData.message.trim(),
      };

      const res = await fetch("/api/inquiries", {
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
        setErrorMessage(data.error || "Failed to submit request. Please try again.");
      }
    } catch (error: any) {
      console.error("[GlobalFormModal] Submission error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
            aria-hidden="true"
          />

          {/* Modal Container Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden my-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Close Button (Always visible) */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-brand-dark flex items-center justify-center transition-colors z-20 cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body: Conditional Rendering for Form vs Success State */}
            {!isSubmitted ? (
              /* ========================================================================= */
              /* A. FORM STATE */
              /* ========================================================================= */
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6 pr-8">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Quick Enrollment</span>
                  </div>
                  <h2 className="text-[24px] sm:text-[28px] font-bold text-brand-dark leading-[1.2] tracking-tight">
                    {title}
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-brand-muted mt-1.5 font-normal">
                    Fill in your details below and our senior career counselor will get in touch.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="modal-name"
                      className="block text-[13px] font-bold text-brand-dark mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="modal-name"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    />
                  </div>

                  {/* Contact Info (2 Cols: Email & Phone) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="modal-email"
                        className="block text-[13px] font-bold text-brand-dark mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="modal-phone"
                        className="block text-[13px] font-bold text-brand-dark mb-1.5"
                      >
                        Phone Number *
                      </label>
                      <input
                        id="modal-phone"
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Preferred Batch / Track */}
                  <div>
                    <label
                      htmlFor="modal-interest"
                      className="block text-[13px] font-bold text-brand-dark mb-1.5"
                    >
                      Preferred Track / Cohort
                    </label>
                    <select
                      id="modal-interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
                    >
                      <option value="QA Automation Bootcamp">
                        Complete Software Testing &amp; Automation Bootcamp
                      </option>
                      <option value="October Weekday Batch (Online)">
                        October Weekday Batch (Live Online)
                      </option>
                      <option value="October Weekend Batch (Online)">
                        October Weekend Batch (Live Online)
                      </option>
                      <option value="Offline Classroom Pune Campus">
                        Offline Classroom (Pune / Pimpri-Chinchwad)
                      </option>
                      <option value="General Career Counseling">
                        1-on-1 Free Profile Evaluation
                      </option>
                    </select>
                  </div>

                  {/* Questions / Note */}
                  <div>
                    <label
                      htmlFor="modal-message"
                      className="block text-[13px] font-bold text-brand-dark mb-1.5"
                    >
                      Questions / Note (Optional)
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any specific questions regarding curriculum, fees, or placement?"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs resize-none"
                    />
                  </div>

                  {/* Submit Button with Loading State */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-brand-orange hover:bg-[#e06b24] text-white py-3.5 px-6 rounded-xl font-bold text-[15px] shadow-lg shadow-brand-orange/25 hover:shadow-xl hover:shadow-brand-orange/35 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    🔒 Your personal details are safe. We will never share or spam your email.
                  </p>
                </form>
              </div>
            ) : (
              /* ========================================================================= */
              /* B. SUCCESS STATE */
              /* ========================================================================= */
              <div className="flex flex-col items-center justify-center text-center py-10 px-8">
                {/* Animated Spring Pop-in Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                >
                  <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
                </motion.div>

                {/* Typography */}
                <h3 className="text-[28px] font-bold text-brand-dark mb-3 tracking-tight">
                  Request Received!
                </h3>

                <p className="text-[16px] text-brand-muted mb-8 leading-relaxed max-w-sm font-normal">
                  Our senior career counselor will connect with you shortly.
                </p>

                {/* Dismiss Button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-8 py-3 bg-gray-100 text-brand-dark rounded-full font-bold hover:bg-gray-200 transition-colors cursor-pointer shadow-xs active:scale-95 text-[15px]"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
