"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  PhoneCall,
  MapPin,
  Check,
  Send,
  MessageSquare,
  Clock,
  Building,
} from "lucide-react";

export function ContactSection() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    course: "Software Testing & Automation Bootcamp",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fullName && formData.email && formData.phone) {
      setFormSubmitted(true);
    }
  };

  return (
    <section className="bg-brand-bg pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      {/* ========================================================================= */}
      {/* Header Section */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]
">
          <span>GET IN TOUCH</span>
        </div>

        <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
          Let&apos;s start your <span className="text-brand-blue">IT</span> journey.
        </h1>

        <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4 max-w-2xl mx-auto">
          Have questions about our courses, batches, or placement guarantees? Our
          team is ready to help you every step of the way.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* Split Layout Container */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* ========================================================================= */}
        {/* A. Left Column: Direct Contact & Team (col-span-12 lg:col-span-5) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            {/* Direct Connect Cards */}
            {/* Direct Connect Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/917558339190?text=Hello%2C%20I%20have%20an%20inquiry%20regarding%20Revelation%20IT%20Training%20courses."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366]/10 p-4 rounded-2xl hover:bg-[#25D366]/20 transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#25D366] shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[16px] md:text-lg font-bold text-brand-dark group-hover:text-emerald-700 transition-colors">
                    Chat with us
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5 truncate">
                    Typically replies in minutes.
                  </p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:placement@revelationittraining.com"
                className="bg-brand-blue/10 p-4 rounded-2xl hover:bg-brand-blue/20 transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-blue shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[16px] md:text-lg font-bold text-brand-dark group-hover:text-brand-blue transition-colors">
                    Email Us
                  </h3>
                  <p className="text-xs text-brand-muted mt-0.5 font-mono truncate">
                    placement@revelationittraining.com
                  </p>
                </div>
              </a>
            </div>

            {/* Team Contact Cards */}
            <div className="mb-8">
              <h2 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-4">
                Talk to our experts
              </h2>

              {/* Card 1: Ashish Jaiswal */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-[18px]">AJ</span>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-[16px]">
                    Aashish Jaiswal
                  </h4>
                  <p className="text-[14px] text-brand-muted">
                    Admissions Director
                  </p>
                </div>
                <a
                  href="tel:+919579173145"
                  aria-label="Call Ashish Jaiswal"
                  className="w-10 h-10 rounded-full bg-brand-bg hover:bg-brand-orange hover:text-white flex items-center justify-center text-brand-dark transition-colors ml-auto shadow-2xs flex-shrink-0"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>

              {/* Card 2: Pranav Patil */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-white font-bold text-[18px]">PP</span>
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-[16px]">
                    Pranav Patil
                  </h4>
                  <p className="text-[14px] text-brand-muted">
                    Student Coordinator
                  </p>
                </div>
                <a
                  href="tel:+917558339190"
                  aria-label="Call Pranav Patil"
                  className="w-10 h-10 rounded-full bg-brand-bg hover:bg-brand-orange hover:text-white flex items-center justify-center text-brand-dark transition-colors ml-auto shadow-2xs flex-shrink-0"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Pune Campus Location Box */}
            <div className="mt-0.5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0 mt-5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark text-[16px]">
                    Pune Office
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
                    603, White Square, Hinjewadi-Wakad Road, Bridge, near Wakad, Maharashtra 411057
                  </p>
                  <p className="text-xs text-brand-blue font-semibold mt-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mon - Sun • 9:00 AM - 8:00 PM IST</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Embedded Google Map */}
            <div className="mt-5 w-full h-64 sm:h-[320px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 relative">
              <iframe
                src="https://maps.google.com/maps?q=White%20Square,%20Hinjewadi-Wakad%20Road,%20Wakad,%20Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* B. Right Column: The Query Form (col-span-12 lg:col-span-7) */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-7 relative"
        >
          {/* Decorative ambient glow behind form */}
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-brand-orange/10 blur-3xl rounded-full pointer-events-none -z-10" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-brand-blue/10 blur-3xl rounded-full pointer-events-none -z-10" />

          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 relative">
            {formSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-dark">
                  Message Sent Successfully!
                </h3>
                <p className="text-brand-muted mt-3 text-base leading-relaxed max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. We have received your query
                  and our counselor will get back to you shortly at{" "}
                  <strong>{formData.email}</strong> or on WhatsApp.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/917558339190?text=Hello%2C%20I%20just%20sent%20a%20contact%20query%20on%20the%20website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-6 py-3.5 rounded-full font-bold text-sm inline-flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant WhatsApp Connect</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        fullName: "",
                        phone: "",
                        email: "",
                        course: "Software Testing & Automation Bootcamp",
                        message: "",
                      });
                    }}
                    className="text-brand-dark bg-gray-100 hover:bg-gray-200 px-6 py-3.5 rounded-full font-semibold text-sm transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-[28px] md:text-[32px] font-bold text-brand-dark mb-2">
                  Contact Us
                </h2>
                <p className="text-brand-muted text-[15px] md:text-[16px] font-normal leading-[1.6] mb-8">
                  Fill out the form below and an admissions counselor will contact you soon.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Top Row: Full Name & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-[12px] font-bold uppercase tracking-wide text-brand-dark mb-2"
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
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full text-sm text-brand-dark transition-colors shadow-2xs"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[12px] font-bold uppercase tracking-wide text-brand-dark mb-2"
                      >
                        Phone / WhatsApp Number *
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
                        className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full text-sm text-brand-dark transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address */}
                  <div className="mb-6">
                    <label
                      htmlFor="email"
                      className="block text-[12px] font-bold uppercase tracking-wide text-brand-dark mb-2"
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
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full text-sm text-brand-dark transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Row 3: Course of Interest */}
                  <div className="mb-6">
                    <label
                      htmlFor="course"
                      className="block text-[12px] font-bold uppercase tracking-wide text-brand-dark mb-2"
                    >
                      Course of Interest
                    </label>
                    <select
                      id="course"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full text-sm text-brand-dark transition-colors shadow-2xs cursor-pointer"
                    >
                      <option value="Software Testing with Selinium Automation">
                        Software Testing with Selinium Automation
                      </option>
                      <option value="Software Testing with Playwright Automation">
                        Software Testing with Playwright Automation
                      </option>
                      <option value="Only Placement Support">
                        Only Placement Support
                      </option>
                    </select>
                  </div>

                  {/* Row 4: Your Message */}
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-[12px] font-bold uppercase tracking-wide text-brand-dark mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we help you reach your career goals?"
                      className="h-32 resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none w-full text-sm text-brand-dark transition-colors shadow-2xs"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex justify-center items-center gap-2 active:scale-98 shadow-md cursor-pointer text-sm sm:text-base"
                  >
                    <span>Send Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    🔒 We respect your privacy. No unsolicited emails or calls.
                  </p>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
