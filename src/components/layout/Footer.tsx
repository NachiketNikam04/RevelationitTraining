"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Facebook01Icon from "@hugeicons/core-free-icons/Facebook01Icon";
import InstagramIcon from "@hugeicons/core-free-icons/InstagramIcon";
import Linkedin02Icon from "@hugeicons/core-free-icons/Linkedin02Icon";
import NewTwitterIcon from "@hugeicons/core-free-icons/NewTwitterIcon";
import { Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  }

  const exploreLinks = [
    { label: "Courses", href: "/courses" },
    { label: "Upcoming Batches", href: "/batches" },
    { label: "Placements", href: "/contact" },
    { label: "About the team", href: "/about" },
    { label: "Our curriculum", href: "/courses/software-testing-bootcamp" },
  ];

  const discoverLinks = [
    { label: "Success Stories", href: "/about" },
    { label: "Career Guide", href: "/blog" },
    { label: "Open roles", href: "/contact" },
    { label: "Partnerships", href: "/contact" },
  ];

  const resourcesLinks = [
    { label: "Interview QA", href: "/blog" },
    { label: "Mock Tests", href: "/courses/software-testing-bootcamp" },
    { label: "Resume Library", href: "/about" },
    { label: "Free Consultation", href: "/contact" },
  ];

  return (
    <footer className="bg-brand-bg pt-12 md:pt-16 pb-8 md:pb-10 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - 5 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 border-b border-gray-100 pb-10 md:pb-12">
          {/* Col 1 (Explore - col-span-1) */}
          <div className="lg:col-span-1">
            <h4 className="text-brand-dark font-bold mb-6 text-[16px] tracking-tight">
              Explore
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-brand-muted hover:text-brand-orange transition-colors text-[15px] block font-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 (Discover - col-span-1) */}
          <div className="lg:col-span-1">
            <h4 className="text-brand-dark font-bold mb-6 text-[16px] tracking-tight">
              Discover
            </h4>
            <ul className="space-y-3">
              {discoverLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-brand-muted hover:text-brand-orange transition-colors text-[15px] block font-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 (Resources - col-span-1) */}
          <div className="lg:col-span-1">
            <h4 className="text-brand-dark font-bold mb-6 text-[16px] tracking-tight">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourcesLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-brand-muted hover:text-brand-orange transition-colors text-[15px] block font-normal"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 & 5 (Newsletter - col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-brand-dark font-bold mb-2 text-[18px] tracking-tight">
              Stay in the loop
            </h4>
            <p className="text-brand-muted text-[15px] md:text-[16px] font-normal leading-[1.6] mb-4 max-w-sm">
              Monthly QA trends, new courses, and exclusive tech resources.
            </p>

            {/* Newsletter Input Field */}
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-full mt-2">
                <Check className="w-4 h-4" />
                <span>Thank you for subscribing! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex mt-4 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-gray-50 border border-gray-200 rounded-l-full px-5 py-3 w-full focus:outline-none focus:border-brand-blue text-sm text-brand-dark placeholder:text-gray-400 shadow-2xs"
                />
                <button
                  type="submit"
                  className="bg-brand-blue text-white rounded-r-full px-6 py-3 hover:bg-[#0c8cb3] transition-colors font-semibold text-sm whitespace-nowrap shadow-xs active:scale-[0.98]"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-gray-400 mt-3">
              By subscribing, you agree to receive occasional updates.
            </p>
          </div>
        </div>

        {/* Footer Middle Bar (Logo & Socials) */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
          {/* Company Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="relative w-32 h-12 md:w-40 md:h-14 flex items-center justify-start">
              <Image
                src="/logo-icon.png"
                alt="Revelation IT Training"
                width={180}
                height={180}
                className="object-contain scale-[1.4] origin-left translate-y-1.5 md:translate-y-2"
              />
            </div>
          </Link>

          {/* Social Icons using @hugeicons/react */}
          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:text-brand-dark transition-colors p-1"
            >
              <HugeiconsIcon icon={NewTwitterIcon} size={20} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-brand-dark transition-colors p-1"
            >
              <HugeiconsIcon icon={Facebook01Icon} size={20} />
            </a>
            <a
              href="https://www.instagram.com/revelationitplacement?stkn=NHRuMHJxY3NpbDBo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-brand-dark transition-colors p-1"
            >
              <HugeiconsIcon icon={InstagramIcon} size={20} />
            </a>
            <a
              href="https://lnkd.in/p/dc2DeW2D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-brand-dark transition-colors p-1"
            >
              <HugeiconsIcon icon={Linkedin02Icon} size={20} />
            </a>
          </div>
        </div>

        {/* Bottom-most row (Legal & Copyright) */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-8 pt-8 border-t border-gray-100 text-xs text-gray-400 gap-4">
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-brand-dark transition-colors">
              Privacy policy
            </a>
            <a href="#terms" className="hover:text-brand-dark transition-colors">
              Terms of service
            </a>
            <a href="#cookies" className="hover:text-brand-dark transition-colors">
              Cookie policy
            </a>
          </div>

          <div>
            &copy; 2026 Revelation IT Training. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}