"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "All Courses", href: "/courses" },
  { label: "Batches", href: "/batches" },
  { label: "Blogs", href: "/blog" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Side (Logo) */}
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition-opacity"
        >
          <div className="relative w-32 h-12 md:w-40 md:h-14 flex items-center justify-start">
            <Image
              src="/logo-icon.png"
              alt="Revelation IT Training"
              width={180}
              height={180}
              className="object-contain scale-[1.4] origin-left translate-y-1.5 md:translate-y-2"
              priority
            />
          </div>
        </Link>

        {/* Center (Navigation Links for Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-muted hover:text-brand-blue transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-blue hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side (Action CTA) */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="bg-brand-orange text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-brand-orange/25 hover:bg-[#e06b24] transition-all text-sm font-bold shadow-xs active:scale-95 inline-flex items-center gap-1.5 group"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl text-brand-dark hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-dark" />
            ) : (
              <Menu className="w-6 h-6 text-brand-dark" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-brand-dark hover:text-brand-blue py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-gray-100">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-brand-orange text-white px-5 py-3 rounded-full hover:bg-[#e06b24] transition-all text-sm font-bold shadow-md shadow-brand-orange/20 text-center flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}