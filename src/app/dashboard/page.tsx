"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  RotateCw,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Trash2,
  MessageSquare,
  X,
  Download,
  AlertCircle,
} from "lucide-react";

interface InquiryRecord {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  course_interest?: string | null;
  message?: string | null;
  status: string;
  created_at: string;
}

export default function CourseRequestsPage() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  // Fetch inquiries from API
  async function loadInquiries() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
      } else {
        setError(data.error || "Failed to load inquiries.");
      }
    } catch (err: any) {
      console.error("Error fetching inquiries:", err);
      setError("Unable to connect to server. Please verify database connection.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  // Update inquiry status
  async function handleStatusChange(id: number, newStatus: string) {
    setIsUpdating(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert("Failed to update status: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setIsUpdating(null);
    }
  }

  // Delete inquiry
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } else {
        alert("Failed to delete inquiry.");
      }
    } catch (err) {
      alert("Failed to delete inquiry.");
    }
  }

  // Export CSV
  function handleExportCSV() {
    if (inquiries.length === 0) return;
    const headers = ["ID", "Full Name", "Email", "Phone", "Course Interest", "Status", "Created At", "Message"];
    const rows = inquiries.map((item) => [
      item.id,
      `"${item.full_name.replace(/"/g, '""')}"`,
      item.email,
      item.phone || "",
      `"${(item.course_interest || "").replace(/"/g, '""')}"`,
      item.status,
      new Date(item.created_at).toLocaleString(),
      `"${(item.message || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `course_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered dataset
  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.phone && item.phone.includes(searchQuery)) ||
      (item.course_interest && item.course_interest.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || item.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate quick metrics
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status.toLowerCase() === "new").length;
  const contactedCount = inquiries.filter((i) => i.status.toLowerCase() === "contacted").length;
  const enrolledCount = inquiries.filter((i) => i.status.toLowerCase() === "enrolled").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lead Stream</span>
          </div>
          <h1 className="text-[36px] font-bold text-brand-dark leading-tight tracking-tight">
            Course Requests
          </h1>
          <p className="text-[15px] text-brand-muted mt-1">
            Real-time student counseling requests, course enrollments, and inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadInquiries}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-brand-dark font-bold text-[14px] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          >
            <RotateCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-orange" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={inquiries.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-[14px] hover:bg-black transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-[12px] font-bold text-brand-muted uppercase tracking-wider">
            Total Requests
          </p>
          <p className="text-[28px] font-black text-brand-dark mt-1">{totalCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-[12px] font-bold text-green-600 uppercase tracking-wider">
            New Leads
          </p>
          <p className="text-[28px] font-black text-green-600 mt-1">{newCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-[12px] font-bold text-blue-600 uppercase tracking-wider">
            Contacted
          </p>
          <p className="text-[28px] font-black text-blue-600 mt-1">{contactedCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
          <p className="text-[12px] font-bold text-purple-600 uppercase tracking-wider">
            Enrolled
          </p>
          <p className="text-[28px] font-black text-purple-600 mt-1">{enrolledCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "New", "Contacted", "Enrolled", "Archived"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter.toLowerCase() === status.toLowerCase()
                  ? "bg-brand-orange text-white shadow-2xs"
                  : "bg-gray-100 text-brand-muted hover:bg-gray-200 hover:text-brand-dark"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <RotateCw className="w-8 h-8 text-brand-orange animate-spin mb-3" />
            <p className="text-[15px] font-bold text-brand-dark">Loading Course Requests...</p>
            <p className="text-[13px] text-brand-muted mt-1">Connecting to NeonDB database</p>
          </div>
        ) : error ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
            <p className="text-[16px] font-bold text-brand-dark">Error loading inquiries</p>
            <p className="text-[14px] text-brand-muted mt-1 max-w-md">{error}</p>
            <button
              type="button"
              onClick={loadInquiries}
              className="mt-4 px-5 py-2 rounded-xl bg-brand-orange text-white font-bold text-[14px] shadow-xs hover:bg-[#e06b24] transition-all"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 px-6 flex flex-col items-center justify-center text-center">
            <Inbox className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-[18px] font-bold text-brand-dark">No inquiries found</h3>
            <p className="text-[14px] text-brand-muted mt-1 max-w-sm">
              {searchQuery || statusFilter !== "ALL"
                ? "No course requests match your current search or filter criteria."
                : "Student inquiries submitted through the website form will appear here in real time."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4">
                    Student Name
                  </th>
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4">
                    Contact Info
                  </th>
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4">
                    Course Interest
                  </th>
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4">
                    Date Received
                  </th>
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4">
                    Status
                  </th>
                  <th className="text-[12px] font-bold uppercase tracking-wider text-brand-muted px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInquiries.map((inquiry) => {
                  const statusLower = (inquiry.status || "new").toLowerCase();
                  const dateFormatted = new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={inquiry.id}
                      className="hover:bg-gray-50/75 transition-colors group cursor-pointer"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      {/* Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-orange/10 text-brand-orange font-bold text-[14px] flex items-center justify-center shrink-0">
                            {inquiry.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-brand-dark leading-tight">
                              {inquiry.full_name}
                            </p>
                            {inquiry.message && (
                              <p className="text-[12px] text-brand-muted truncate max-w-xs mt-0.5">
                                &ldquo;{inquiry.message}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-[13px]" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-brand-dark hover:text-brand-blue flex items-center gap-1.5 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{inquiry.email}</span>
                          </a>
                          {inquiry.phone && (
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="text-brand-muted hover:text-brand-dark flex items-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{inquiry.phone}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Course Interest */}
                      <td className="px-6 py-4">
                        <span className="inline-block bg-orange-50 text-brand-orange text-[12px] font-bold px-2.5 py-1 rounded-lg border border-orange-100">
                          {inquiry.course_interest || "General Inquiry"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] text-brand-muted">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inquiry.status}
                          disabled={isUpdating === inquiry.id}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className={`text-[11px] font-bold uppercase px-3 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-brand-blue cursor-pointer transition-all ${
                            statusLower === "new"
                              ? "bg-green-100 text-green-700"
                              : statusLower === "contacted"
                              ? "bg-blue-100 text-blue-700"
                              : statusLower === "enrolled"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-dark hover:bg-gray-100 transition-colors"
                            title="View Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-gray-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-brand-dark flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6 pr-8">
              <span className="text-[12px] font-bold uppercase tracking-wider text-brand-orange">
                Inquiry Details #{selectedInquiry.id}
              </span>
              <h3 className="text-[24px] font-bold text-brand-dark mt-1 leading-tight">
                {selectedInquiry.full_name}
              </h3>
              <p className="text-[13px] text-brand-muted mt-1">
                Received on {new Date(selectedInquiry.created_at).toLocaleString()}
              </p>
            </div>

            {/* Information Grid */}
            <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 text-[14px]">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-brand-muted block">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-bold text-brand-blue hover:underline"
                >
                  {selectedInquiry.email}
                </a>
              </div>

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-brand-muted block">
                  Phone Number
                </span>
                <span className="font-bold text-brand-dark">
                  {selectedInquiry.phone || "Not provided"}
                </span>
              </div>

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-brand-muted block">
                  Course / Cohort Interest
                </span>
                <span className="font-bold text-brand-orange">
                  {selectedInquiry.course_interest || "General Counseling"}
                </span>
              </div>

              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-brand-muted block mb-1">
                  Message / Notes
                </span>
                <p className="text-brand-dark bg-white p-3.5 rounded-xl border border-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message || "No additional message provided."}
                </p>
              </div>
            </div>

            {/* Status Change in Modal */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-brand-dark">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="text-[12px] font-bold uppercase px-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 text-brand-dark"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding your inquiry at Revelation IT Training`}
                  className="px-4 py-2 rounded-xl bg-brand-orange text-white font-bold text-[13px] hover:bg-[#e06b24] transition-colors"
                >
                  Reply Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
