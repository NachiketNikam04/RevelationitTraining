"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Quote,
  Plus,
  Search,
  Star,
  Building2,
  Trash2,
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  rating: number;
  testimonial_text: string;
  created_at: string;
}

export default function TestimonialsDashboardPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadTestimonials() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.testimonials || []);
      } else {
        setErrorMessage(data.error || "Failed to load testimonials.");
      }
    } catch (err: any) {
      console.error("Error loading testimonials:", err);
      setErrorMessage("Could not connect to database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setSuccessMessage(`Testimonial from "${name}" was deleted.`);
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        setErrorMessage(data.error || "Failed to delete testimonial.");
      }
    } catch (err: any) {
      console.error("Error deleting testimonial:", err);
      setErrorMessage("Network error while deleting testimonial.");
    } finally {
      setDeletingId(null);
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

  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.testimonial_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5" />
            <span>Success Stories</span>
          </div>
          <h1 className="text-[32px] font-bold text-brand-dark leading-tight tracking-tight">
            Student Testimonials
          </h1>
          <p className="text-[14px] text-brand-muted mt-1">
            Manage student reviews, corporate placements, and star ratings across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadTestimonials}
            disabled={isLoading}
            className="p-3 rounded-xl bg-white border border-gray-200 text-brand-muted hover:text-brand-dark hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/dashboard/testimonials/new"
            className="px-5 py-3 rounded-xl bg-brand-orange hover:bg-[#e06b24] text-white font-bold text-[14px] flex items-center gap-2 transition-all shadow-md shadow-brand-orange/25 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-[14px] flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[14px] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search testimonials by student name, company, or keywords..."
          className="w-full bg-transparent border-none text-[14px] text-brand-dark placeholder:text-gray-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-brand-muted hover:text-brand-dark px-2 py-1 bg-gray-100 rounded-md cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-brand-dark">Loading Testimonials...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Quote className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark">No Testimonials Found</h3>
            <p className="text-sm text-brand-muted max-w-sm mx-auto">
              {searchQuery
                ? "No reviews match your search query."
                : "No student testimonials have been added yet. Click 'Add Testimonial' to create your first story."}
            </p>
            {!searchQuery && (
              <div className="pt-2">
                <Link
                  href="/dashboard/testimonials/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#e06b24]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Testimonial</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[12px] uppercase font-bold text-brand-muted tracking-wider">
                  <th className="py-4 px-6">Student</th>
                  <th className="py-4 px-6">Company / Placement</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Testimony Excerpt</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[14px]">
                {filteredTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold text-xs shrink-0 border border-brand-orange/20">
                          {getInitials(t.name)}
                        </div>
                        <div>
                          <span className="font-bold text-brand-dark block">{t.name}</span>
                          <span className="text-[11px] text-brand-muted">ID #{t.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-brand-dark font-semibold">
                        <Building2 className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>{t.company}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-brand-orange">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-brand-muted text-xs line-clamp-2 leading-relaxed">
                        &ldquo;{t.testimonial_text}&rdquo;
                      </p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/testimonials/${t.id}`}
                          className="p-2 rounded-xl text-gray-500 hover:text-brand-dark hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Edit Testimonial"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={deletingId === t.id}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Testimonial"
                        >
                          {deletingId === t.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
