"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Inbox,
  BookOpen,
  Calendar,
  Clock,
  Building2,
  Users,
  Quote,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Course Requests", href: "/dashboard", icon: Inbox },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Interviews", href: "/dashboard/scheduling", icon: Clock },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Teachers", href: "/dashboard/teachers", icon: Users },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: Quote },
  { label: "Blogs", href: "/dashboard/blogs", icon: FileText },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleSignOut() {
    document.cookie =
      "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin-secure");
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row text-brand-dark">
      {/* Mobile Header Bar */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-black text-[14px]">
            R
          </div>
          <span className="text-[18px] font-black text-brand-dark">
            Revelation Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-brand-dark transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Backdrop on Mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 lg:z-auto w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col justify-between transform transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Brand Area */}
          <div className="px-6 py-8 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black text-[16px] shadow-sm shadow-brand-orange/30">
                R
              </div>
              <div>
                <h1 className="text-[18px] font-black text-brand-dark leading-none">
                  Revelation Admin
                </h1>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mt-1">
                  Control Center
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 px-4 py-6 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all ${
                    isActive
                      ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25"
                      : "text-brand-muted hover:bg-brand-bg hover:text-brand-dark"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brand-muted"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex flex-col gap-2">
          <div className="px-3 py-2 flex items-center gap-2.5 rounded-xl bg-white border border-gray-100 shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-bold text-brand-dark truncate leading-tight">
                admin@RiT.com
              </p>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                Active Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-brand-muted hover:text-brand-dark hover:bg-white border border-transparent hover:border-gray-200 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-6 md:p-10 lg:p-12 flex-1">{children}</main>
      </div>
    </div>
  );
}
