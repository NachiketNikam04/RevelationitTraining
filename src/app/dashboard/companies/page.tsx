"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Building2,
  Upload,
  Trash2,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ImageIcon,
  X,
} from "lucide-react";

interface Company {
  id: number;
  company_name: string;
  logo_url: string;
  created_at: string;
}

export default function CompaniesDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadCompanies() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/companies", {
        cache: "no-store",
        headers: { Pragma: "no-cache" },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCompanies(data.companies || []);
      } else {
        setErrorMessage(data.error || "Failed to load hiring partners.");
      }
    } catch (err: any) {
      console.error("Error loading companies:", err);
      setErrorMessage("Could not connect to database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (!companyName) {
      const baseName = file.name.split(".")[0]?.replace(/[^a-zA-Z0-9 ]/g, " ");
      if (baseName) {
        setCompanyName(baseName.trim());
      }
    }
  }

  function handleClearFile() {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage("Please select a logo image file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("company_name", companyName.trim() || "Hiring Partner");

      const res = await fetch("/api/admin/companies", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success && data.company) {
        setCompanies((prev) => [data.company, ...prev]);
        setSuccessMessage(`Logo for "${data.company.company_name}" uploaded successfully!`);
        setCompanyName("");
        handleClearFile();
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        setErrorMessage(data.error || "Failed to upload company logo.");
      }
    } catch (err: any) {
      console.error("Error uploading logo:", err);
      setErrorMessage("Network error while uploading logo.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Are you sure you want to delete the logo for "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/companies?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCompanies((prev) => prev.filter((c) => c.id !== id));
        setSuccessMessage(`Logo for "${name}" was removed.`);
        setTimeout(() => setSuccessMessage(null), 3500);
      } else {
        setErrorMessage(data.error || "Failed to delete company logo.");
      }
    } catch (err: any) {
      console.error("Error deleting company logo:", err);
      setErrorMessage("Network error while deleting logo.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Network</span>
          </div>
          <h1 className="text-[32px] font-bold text-brand-dark leading-tight tracking-tight">
            Hiring Partners &amp; Companies
          </h1>
          <p className="text-[14px] text-brand-muted mt-1">
            Upload and organize hiring partner logos. These logos appear in dynamic marquees globally across all courses and batch pages.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCompanies}
          disabled={isLoading}
          className="p-3 rounded-xl bg-white border border-gray-200 text-brand-muted hover:text-brand-dark hover:bg-gray-50 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Refresh list"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
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

      {/* Upload Card */}
      <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-200 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-[20px] font-bold text-brand-dark">Upload New Hiring Partner</h2>
          <p className="text-[13px] text-brand-muted mt-0.5">
            Logos are saved locally to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-brand-orange">public/uploads/companies/</code> and served dynamically.
          </p>
        </div>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <label htmlFor="company_name" className="block text-xs font-bold text-brand-dark mb-2">
              Company / Partner Name *
            </label>
            <input
              id="company_name"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Infosys, Capgemini, TCS"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-brand-dark focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-2xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-dark mb-2">
              Company Logo (Image File) *
            </label>
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl px-4 py-3 text-xs text-brand-dark font-medium cursor-pointer transition-colors shadow-2xs truncate"
              >
                <span className="truncate">
                  {selectedFile ? selectedFile.name : "Choose logo image..."}
                </span>
                <Upload className="w-4 h-4 text-brand-orange shrink-0 ml-2" />
              </label>
            </div>
          </div>

          <div className="flex items-end gap-3 pt-6 md:pt-0">
            {previewUrl && (
              <div className="w-16 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1.5 flex items-center justify-center relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-600 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer shadow-xs"
                  title="Remove selected file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="flex-1 py-3 px-6 rounded-xl bg-brand-orange hover:bg-[#e06b24] text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-orange/25 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Uploaded Logos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-brand-dark flex items-center gap-2">
            <span>Active Partner Logos</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-extrabold">
              {companies.length}
            </span>
          </h3>
        </div>

        {isLoading ? (
          <div className="bg-white p-16 rounded-[2rem] border border-gray-200 text-center">
            <Loader2 className="w-8 h-8 text-brand-orange animate-spin mx-auto mb-3" />
            <p className="text-sm font-bold text-brand-dark">Loading hiring partner logos...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white p-16 rounded-[2rem] border border-gray-200 text-center space-y-3">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-lg font-bold text-brand-dark">No Company Logos Uploaded</h3>
            <p className="text-sm text-brand-muted max-w-sm mx-auto">
              Upload your first corporate hiring partner logo above to showcase placement records.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between items-center text-center shadow-2xs hover:shadow-md hover:border-gray-300 transition-all relative group"
              >
                {/* Delete Trigger */}
                <button
                  type="button"
                  onClick={() => handleDelete(company.id, company.company_name)}
                  disabled={deletingId === company.id}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-2xs"
                  title="Delete Logo"
                >
                  {deletingId === company.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Logo Image */}
                <div className="w-full h-20 flex items-center justify-center p-2 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.logo_url}
                    alt={company.company_name}
                    className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Company Name */}
                <div className="w-full border-t border-gray-100 pt-2">
                  <span className="font-bold text-xs text-brand-dark block truncate">
                    {company.company_name}
                  </span>
                  <span className="text-[10px] text-brand-muted block font-mono mt-0.5">
                    ID #{company.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
