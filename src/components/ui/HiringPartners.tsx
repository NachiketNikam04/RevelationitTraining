"use client";

import React, { useState, useEffect } from "react";

export interface CompanyPartner {
  id: number;
  company_name: string;
  logo_url: string;
}

// Fallback curated marquee data in case database has no uploaded logos yet
const fallbackPartners = [
  { name: "Infosys", symbol: "INF", color: "text-sky-600" },
  { name: "Wipro", symbol: "WIP", color: "text-green-600" },
  { name: "TCS", symbol: "TCS", color: "text-amber-600" },
  { name: "Capgemini", symbol: "CAP", color: "text-blue-500" },
  { name: "Accenture", symbol: ">", color: "text-purple-500" },
  { name: "Cognizant", symbol: "CTS", color: "text-indigo-600" },
  { name: "Tech Mahindra", symbol: "TM", color: "text-red-600" },
  { name: "LTIMindtree", symbol: "LTI", color: "text-blue-600" },
  { name: "Hexaware", symbol: "HX", color: "text-teal-600" },
  { name: "Persistent", symbol: "PS", color: "text-orange-600" },
];

export function HiringPartners() {
  const [companies, setCompanies] = useState<CompanyPartner[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies", {
          cache: "no-store",
          headers: { Pragma: "no-cache" },
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        }
      } catch (err) {
        console.error("Error fetching hiring partners:", err);
      } finally {
        setHasLoaded(true);
      }
    }
    fetchCompanies();
  }, []);

  const hasDbLogos = companies.length > 0;

  // Build sufficient items for an infinite loop with CSS -50% translateX marquee
  let displayItems: (CompanyPartner | (typeof fallbackPartners)[0])[] = [];

  if (hasDbLogos) {
    let repeated = [...companies];
    while (repeated.length < 16) {
      repeated = [...repeated, ...companies];
    }
    displayItems = [...repeated, ...repeated];
  } else {
    let repeatedFallback = [...fallbackPartners];
    while (repeatedFallback.length < 16) {
      repeatedFallback = [...repeatedFallback, ...fallbackPartners];
    }
    displayItems = [...repeatedFallback, ...repeatedFallback];
  }

  return (
    <section className="bg-brand-bg py-12 md:py-16 overflow-hidden relative">
      {/* Soft gradient edge fade masks for seamless marquee appearance */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-brand-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-brand-bg to-transparent z-10 pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
          <span>OUR HIRING PARTNERS</span>
        </div>

        <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
          Top Tech <span className="text-brand-blue">Companies</span> Hire our Graduates.
        </h2>

        <p className="text-brand-muted mt-4 max-w-2xl mx-auto text-[16px] md:text-[18px] font-normal leading-[1.7]">
          Our alumni are actively shaping the future of QA and automation at industry-leading organizations.
        </p>
      </div>

      {/* Infinite Marquee Track */}
      <div className="overflow-hidden flex w-full">
        <div className="animate-scroll-left flex items-center">
          {displayItems.map((item: any, idx: number) => {
            if (hasDbLogos) {
              return (
                <div
                  key={`company-${item.id}-${idx}`}
                  className="flex items-center justify-center mx-6 md:mx-10 shrink-0 select-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.logo_url}
                    alt={item.company_name}
                    width={140}
                    height={56}
                    loading="lazy"
                    className="h-10 md:h-14 w-auto object-contain"
                    style={{ width: "auto" }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                    }}
                  />
                </div>
              );
            }

            return (
              <div
                key={`fallback-${item.name}-${idx}`}
                className="flex items-center justify-center mx-6 md:mx-10 shrink-0 select-none"
              >
                <span className="text-base md:text-lg font-bold text-brand-dark/70 hover:text-brand-dark transition-colors">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HiringPartners;
