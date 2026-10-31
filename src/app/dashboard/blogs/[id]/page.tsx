"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Eye,
  Calendar
} from "lucide-react";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  image_url: string;
}

export default function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const isNew = resolvedParams.id === "new";

  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
    image_url: "",
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

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/admin/blogs/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.blog) {
          const b = data.blog;
          setFormData({
            title: b.title || "",
            slug: b.slug || "",
            content: b.content || "",
            image_url: b.image_url || "",
          });
        } else {
          setError(data.error || "Blog article not found");
        }
      } catch (err) {
        console.error("Fetch blog error:", err);
        setError("Failed to load blog article");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [isNew, resolvedParams.id]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isNew
        ? val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        : prev.slug,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
    }
  };

  const displayImage =
    filePreview ||
    formData.image_url ||
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in both Blog Title and Content.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const body = new FormData();
      body.append("title", formData.title.trim());
      body.append("slug", formData.slug.trim());
      body.append("content", formData.content.trim());

      if (selectedFile) {
        body.append("file", selectedFile);
      } else if (formData.image_url) {
        body.append("image_url", formData.image_url.trim());
      }

      const endpoint = isNew
        ? "/api/admin/blogs"
        : `/api/admin/blogs/${resolvedParams.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        body,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          isNew ? "Blog article created and published!" : "Blog article updated successfully!"
        );
        setTimeout(() => {
          router.push("/dashboard/blogs");
        }, 1200);
      } else {
        setError(data.error || "Failed to save blog article.");
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
        <p className="text-sm text-brand-muted font-medium">Loading blog article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/blogs"
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-brand-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[11px] font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{isNew ? "New Publication" : "Edit Article"}</span>
            </div>
            <h1 className="text-[26px] md:text-[32px] font-black text-brand-dark leading-tight">
              {isNew ? "Create Blog Article" : `Edit: ${formData.title || "Untitled"}`}
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
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isNew ? "Publish Article" : "Save Changes"}</span>
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

      {/* Main Layout: Form (7 cols) and Live Reading Mockup (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/80 p-6 md:p-8 space-y-6 shadow-xs"
        >
          {/* Article Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Article Content
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Blog Heading (Title) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Cracking the CDAC C-CAT: A Complete Preparation Strategy"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-semibold text-brand-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                URL Slug / Permalink
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-mono bg-gray-100 px-3 py-2.5 rounded-xl border border-gray-200">
                  /blog/
                </span>
                <input
                  type="text"
                  placeholder="custom-article-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Article Body (Paragraphs) <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={12}
                placeholder="Write your article paragraphs here. Separate sections and thoughts by adding a blank line between paragraphs..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full min-h-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Tip: Press Enter twice to create clean, readable paragraphs on the frontend reader.
              </p>
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-dark border-b border-gray-100 pb-2">
              Featured Cover Image
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Upload Cover Image from Computer
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-brand-orange/50 rounded-2xl p-4 text-center transition-colors bg-gray-50/50">
                  <input
                    type="file"
                    id="blog-cover-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="blog-cover-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-7 h-7 text-brand-orange" />
                    <span className="text-xs font-bold text-brand-dark">
                      {selectedFile ? selectedFile.name : "Click to select or drag cover image here"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      High-resolution horizontal images recommended (Max 5MB)
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Or External Cover Image URL
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
        </form>

        {/* Live Reader Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-brand-dark font-bold text-sm border-b border-gray-100 pb-3">
              <Eye className="w-4 h-4 text-brand-orange" />
              <span>Article Reading Preview</span>
            </div>

            {/* Cover Image */}
            <div className="relative w-full aspect-video rounded-2xl bg-gray-100 overflow-hidden shadow-xs border border-gray-100">
              <Image
                src={displayImage}
                alt={formData.title || "Blog Preview"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-brand-orange text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Technical Guide
              </div>
            </div>

            {/* Title & Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>&bull;</span>
                <span>{Math.max(1, Math.round(formData.content.split(/\s+/).filter(Boolean).length / 180))} min read</span>
              </div>

              <h2 className="text-xl font-bold text-brand-dark leading-tight">
                {formData.title || "Your Blog Post Heading Will Appear Here"}
              </h2>
            </div>

            {/* Content Preview */}
            <div className="space-y-3 pt-2 text-xs text-gray-600 leading-relaxed max-h-64 overflow-y-auto border-t border-gray-100">
              {formData.content ? (
                formData.content
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, idx) => (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))
              ) : (
                <p className="text-gray-400 italic">
                  Start typing in the article editor to preview how your formatted paragraphs will render for students and readers...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
