"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Quote,
  Star,
  Building2,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function TestimonialEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const testimonialId = resolvedParams.id;
  const router = useRouter();

  const isNew = testimonialId === "new";

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    rating: 5,
    testimonial_text: "",
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setIsLoading(false);
      return;
    }

    async function loadTestimonial() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`/api/admin/testimonials/${testimonialId}`);
        const data = await res.json();
        if (res.ok && data.success && data.testimonial) {
          setFormData({
            name: data.testimonial.name || "",
            company: data.testimonial.company || "",
            rating: data.testimonial.rating || 5,
            testimonial_text: data.testimonial.testimonial_text || "",
          });
        } else {
          setErrorMessage(data.error || "Failed to load testimonial details.");
        }
      } catch (err: any) {
        console.error("Error loading testimonial:", err);
        setErrorMessage("Network error fetching testimonial.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTestimonial();
  }, [testimonialId, isNew]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) || 5 : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const endpoint = isNew
        ? "/api/admin/testimonials"
        : `/api/admin/testimonials/${testimonialId}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/testimonials");
        }, 800);
      } else {
        setErrorMessage(data.error || "Failed to save testimonial.");
      }
    } catch (err: any) {
      console.error("Error saving testimonial:", err);
      setErrorMessage("Network error saving testimonial.");
    } finally {
      setIsSaving(false);
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center">
        <Loader2 className="w-10 h-10 text-brand-orange animate-spin mx-auto mb-4" />
        <h3 className="text-[18px] font-bold text-brand-dark">Loading Testimonial...</h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard/testimonials"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-muted hover:text-brand-dark transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Testimonials</span>
          </Link>

          <h1 className="text-[32px] font-bold text-brand-dark leading-tight">
            {isNew ? "Add New Testimonial" : "Edit Testimonial"}
          </h1>
          <p className="text-brand-muted text-[14px] mt-1">
            {isNew
              ? "Publish a new student review and placement outcome."
              : `Updating testimonial for ${formData.name || "Student"}`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className={`px-6 py-3 rounded-xl font-bold text-[14px] flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer ${
            saveSuccess
              ? "bg-green-600 text-white shadow-green-600/25"
              : "bg-brand-orange hover:bg-[#e06b24] text-white shadow-brand-orange/25"
          } disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved! Redirecting...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Testimonial</span>
            </>
          )}
        </button>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[14px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm space-y-8"
      >
        {/* Visual Live Preview Card */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Live Preview Card
          </span>
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-xs flex items-center justify-center border border-brand-orange/20">
                  {getInitials(formData.name)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-dark">
                    {formData.name || "Student Name"}
                  </h4>
                  <p className="text-xs text-brand-muted">
                    Placed at {formData.company || "Company Name"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-brand-orange">
                {[...Array(formData.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                ))}
              </div>
            </div>

            <p className="text-xs text-brand-dark leading-relaxed italic">
              &ldquo;{formData.testimonial_text || "The review text will be previewed here in real-time as you type..."}&rdquo;
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-[13px] font-bold text-brand-dark mb-2"
              >
                Student Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-[13px] font-bold text-brand-dark mb-2"
              >
                Placed At / Company Name *
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={formData.company}
                onChange={handleInputChange}
                placeholder="e.g. TechFlow / Capgemini"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-[13px] font-bold text-brand-dark mb-2"
            >
              Rating (1 to 5 Stars) *
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold cursor-pointer"
            >
              <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
              <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
              <option value={3}>⭐⭐⭐ 3 Stars (Good)</option>
              <option value={2}>⭐⭐ 2 Stars (Fair)</option>
              <option value={1}>⭐ 1 Star (Needs Improvement)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="testimonial_text"
              className="block text-[13px] font-bold text-brand-dark mb-2"
            >
              Testimony / Student Review *
            </label>
            <textarea
              id="testimonial_text"
              name="testimonial_text"
              rows={5}
              required
              value={formData.testimonial_text}
              onChange={handleInputChange}
              placeholder="e.g. The hands-on automation projects were game-changing. I walked into my interviews with actual code to show, not just theory."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link
            href="/dashboard/testimonials"
            className="text-[14px] font-bold text-brand-muted hover:text-brand-dark transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-[#e06b24] text-white font-bold text-[14px] flex items-center gap-2 transition-all shadow-md shadow-brand-orange/25 active:scale-95 cursor-pointer disabled:opacity-70"
          >
            {isSaving ? "Saving..." : isNew ? "Create Testimonial" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
