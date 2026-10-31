"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Search, 
  AlertCircle,
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import Linkedin02Icon from "@hugeicons/core-free-icons/Linkedin02Icon";
import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";

interface Teacher {
  id: number;
  name: string;
  role: string;
  bio: string;
  skills: string[] | string;
  image_url: string;
  linkedin_url?: string;
  twitter_url?: string;
  created_at: string;
}

export default function TeachersDashboardPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/teachers");
      const data = await res.json();
      if (data.success && Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
      }
    } catch (err) {
      console.error("Failed to load teachers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
        setDeleteModalId(null);
        showToast("Mentor profile deleted successfully.");
      } else {
        alert(data.error || "Failed to delete teacher");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error while deleting teacher.");
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    const skillsStr = Array.isArray(t.skills) ? t.skills.join(" ") : String(t.skills || "");
    return (
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      (t.bio && t.bio.toLowerCase().includes(q)) ||
      skillsStr.toLowerCase().includes(q)
    );
  });

  const parseSkills = (skills: string[] | string): string[] => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Faculty & Mentors</span>
          </div>
          <h1 className="text-[32px] md:text-[38px] font-black text-brand-dark leading-tight tracking-tight">
            Instructors & Mentors
          </h1>
          <p className="text-[15px] text-brand-muted mt-1">
            Manage your dynamic team of instructors, tech leads, bio details, skills badges, and social links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTeachers}
            disabled={isLoading}
            className="p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-brand-dark transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/dashboard/teachers/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-orange text-white font-bold text-[14px] hover:bg-brand-orange/90 shadow-md shadow-brand-orange/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Mentor</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, bio, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-brand-muted">
          Showing {filteredTeachers.length} of {teachers.length} mentors
        </div>
      </div>

      {/* Teachers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-6 border border-gray-200 animate-pulse space-y-4"
            >
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl" />
              <div className="h-6 bg-gray-100 rounded-md w-3/4" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
              <div className="h-16 bg-gray-100 rounded-md w-full" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-gray-200 text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange mx-auto flex items-center justify-center font-black text-2xl mb-4">
            👨‍🏫
          </div>
          <h3 className="text-xl font-bold text-brand-dark">No Mentors Found</h3>
          <p className="text-sm text-brand-muted max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery
              ? "No faculty profiles match your current search filter."
              : "You have not added any instructors or mentors yet."}
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/teachers/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange/90 shadow-md shadow-brand-orange/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Mentor</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => {
            const skillsList = parseSkills(teacher.skills);
            return (
              <div
                key={teacher.id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Photo & Basic Info */}
                <div>
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={teacher.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"}
                      alt={teacher.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-lg font-bold leading-tight">{teacher.name}</h3>
                      <p className="text-brand-orange text-xs font-semibold">{teacher.role}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {/* Bio */}
                    <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                      {teacher.bio || "No biography provided yet."}
                    </p>

                    {/* Skills Badges */}
                    {skillsList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skillsList.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[11px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Social Links */}
                    <div className="flex items-center gap-3 pt-2 text-gray-400">
                      {teacher.linkedin_url && (
                        <a
                          href={teacher.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-blue transition-colors"
                          title="LinkedIn Profile"
                        >
                          <HugeiconsIcon icon={Linkedin02Icon} size={16} />
                        </a>
                      )}
                      {teacher.twitter_url && (
                        <a
                          href={teacher.twitter_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-dark transition-colors"
                          title="Twitter / X Profile"
                        >
                          <HugeiconsIcon icon={NewTwitterIcon} size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    ID #{teacher.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/teachers/${teacher.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-brand-dark text-xs font-bold hover:bg-gray-100 transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => setDeleteModalId(teacher.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-brand-dark">Delete Mentor Profile?</h3>
              <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                Are you sure you want to delete this instructor? If this mentor has an uploaded image, it will also be permanently removed from disk.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalId(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteModalId)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 font-bold text-sm text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
