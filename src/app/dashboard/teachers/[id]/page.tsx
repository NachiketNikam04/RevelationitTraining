"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  User, 
  Briefcase, 
  Sparkles, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import Linkedin02Icon from "@hugeicons/core-free-icons/Linkedin02Icon";
import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";

interface TeacherFormData {
  name: string;
  role: string;
  bio: string;
  skills: string;
  image_url: string;
  linkedin_url: string;
  twitter_url: string;
}

export default function TeacherEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";

  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    role: "",
    bio: "",
    skills: "",
    image_url: "",
    linkedin_url: "",
    twitter_url: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setIsLoading(false);
      return;
    }

    const fetchTeacher = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/teachers/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.teacher) {
          const t = data.teacher;
          let formattedSkills = "";
          if (Array.isArray(t.skills)) {
            formattedSkills = t.skills.join(", ");
          } else if (typeof t.skills === "string") {
            try {
              const p = JSON.parse(t.skills);
              formattedSkills = Array.isArray(p) ? p.join(", ") : t.skills;
            } catch {
              formattedSkills = t.skills;
            }
          }

          setFormData({
            name: t.name || "",
            role: t.role || "",
            bio: t.bio || "",
            skills: formattedSkills,
            image_url: t.image_url || "",
            linkedin_url: t.linkedin_url || "",
            twitter_url: t.twitter_url || "",
          });
        } else {
          setError(data.error || "Teacher profile not found");
        }
      } catch (err) {
        console.error("Fetch teacher error:", err);
        setError("Failed to load teacher data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [isNew, resolvedParams.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    }
  };

  const parsedSkillsList = formData.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const displayImage =
    filePreview ||
    formData.image_url ||
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      setError("Please fill in both Full Name and Role / Designation.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const body = new FormData();
      body.append("name", formData.name.trim());
      body.append("role", formData.role.trim());
      body.append("bio", formData.bio.trim());
      body.append("skills", formData.skills.trim());
      body.append("linkedin_url", formData.linkedin_url.trim());
      body.append("twitter_url", formData.twitter_url.trim());

      if (selectedFile) {
        body.append("file", selectedFile);
      } else if (formData.image_url) {
        body.append("image_url", formData.image_url.trim());
      }

      const endpoint = isNew
        ? "/api/admin/teachers"
        : `/api/admin/teachers/${resolvedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        body,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          isNew ? "Mentor profile created successfully!" : "Mentor profile updated successfully!"
        );
        setTimeout(() => {
          router.push("/dashboard/teachers");
        }, 1200);
      } else {
        setError(data.error || "Failed to save mentor profile.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err?.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-brand-orange animate-spin mx-auto" />
        <p className="text-sm text-brand-muted font-medium">Loading mentor profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/teachers"
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-brand-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{isNew ? "Create Profile" : "Edit Profile"}</span>
            </div>
            <h1 className="text-[26px] md:text-[32px] font-black text-brand-dark leading-tight">
              {isNew ? "Add New Mentor" : `Edit Mentor: ${formData.name || "Profile"}`}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange text-white font-bold text-sm hover:bg-brand-orange/90 shadow-md shadow-brand-orange/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Create Mentor" : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error / Success Banners */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Main Grid: Form Left, Live Card Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (7 Cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 space-y-6 shadow-xs"
        >
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Mentor Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Role / Designation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead QA Automation Expert"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Biography / Experience Overview
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="e.g. 10+ years of experience architecting enterprise test frameworks and mentoring SDETs at top tech firms."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Skills & Expertise Badges
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Comma-Separated Skills
              </label>
              <input
                type="text"
                placeholder="e.g. Selenium 4, Java, TestNG, Jenkins, CI/CD"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Type skills separated by commas. They will automatically be displayed as pill badges.
              </p>

              {parsedSkillsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {parsedSkillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-800 font-bold text-[11px] uppercase tracking-wide shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Profile Photo
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Upload Photo from Computer
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-brand-orange/50 rounded-2xl p-4 text-center transition-colors bg-gray-50/50">
                  <input
                    type="file"
                    id="teacher-photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="teacher-photo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-7 h-7 text-brand-orange" />
                    <span className="text-xs font-bold text-brand-dark">
                      {selectedFile ? selectedFile.name : "Click to select or drag photo here"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      PNG, JPG, WEBP recommended (Max 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Or Image URL (Fallback / External)
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Social Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Live Preview Container (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 text-brand-dark font-bold text-sm">
              <Eye className="w-4 h-4 text-brand-orange" />
              <span>Live Card Hover Preview</span>
            </div>

            {/* Exact replication of Team card with interactive hover */}
            <div className="relative group overflow-hidden rounded-2xl bg-gray-50 aspect-[4/5] cursor-pointer shadow-lg shadow-black/5 hover:shadow-2xl transition-all duration-300">
              <Image
                src={displayImage}
                alt={formData.name || "Mentor Preview"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
              />

              {/* Persistent Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Default State Text (Bottom Aligned) */}
              <div className="absolute bottom-0 inset-x-0 p-6 z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-1 tracking-tight">
                  {formData.name || "Mentor Name"}
                </h3>
                <p className="text-brand-orange font-bold text-[14px]">
                  {formData.role || "Specialization / Role"}
                </p>
              </div>

              {/* Hover Reveal Content Panel */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 bg-black/85 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex flex-col justify-end">
                <div>
                  <h3 className="text-[22px] font-bold leading-[1.3] text-white mb-1 tracking-tight">
                    {formData.name || "Mentor Name"}
                  </h3>
                  <p className="text-brand-orange font-bold text-[14px]">
                    {formData.role || "Specialization / Role"}
                  </p>
                </div>

                <p className="text-gray-200 text-[14px] font-normal leading-[1.6] mt-2">
                  {formData.bio || "Instructor bio and background will appear here on hover."}
                </p>

                {/* Tech Stack Pills */}
                {parsedSkillsList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {parsedSkillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[12px] font-bold uppercase tracking-wide"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Clickable Social Icons */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/15">
                  {formData.linkedin_url && (
                    <div className="text-white hover:text-brand-blue transition-colors p-1">
                      <HugeiconsIcon icon={Linkedin02Icon} size={18} />
                    </div>
                  )}
                  {formData.twitter_url && (
                    <div className="text-white hover:text-brand-blue transition-colors p-1">
                      <HugeiconsIcon icon={NewTwitterIcon} size={18} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-brand-muted mt-3 italic">
              Hover over the card to preview the full slide-up details animation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
