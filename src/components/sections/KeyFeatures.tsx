"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import Award01Icon from "@hugeicons/core-free-icons/Award01Icon";
import Briefcase01Icon from "@hugeicons/core-free-icons/Briefcase01Icon";
import TeacherIcon from "@hugeicons/core-free-icons/TeacherIcon";
import SourceCodeSquareIcon from "@hugeicons/core-free-icons/SourceCodeSquareIcon";
import Target01Icon from "@hugeicons/core-free-icons/Target01Icon";

export interface FeatureItem {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: unknown;
  linkText: string;
  linkHref: string;
}

const features: FeatureItem[] = [
  {
    id: "feature-1",
    number: "01",
    title: "100% Placement Assistance",
    description:
      "Your success is our bottom line. We bridge the gap between training and employment through direct tie-ups with leading tech enterprises. Backed by 1-on-1 career coaching, real-time mock interviews, and continuous job referrals, our placement team works with you every step of the way until you land the role and compensation you deserve.",
    icon: Award01Icon,
    linkText: "Learn more",
    linkHref: "/courses/software-testing-bootcamp",
  },
  {
    id: "feature-2",
    number: "02",
    title: "Live Corporate Projects",
    description:
      "Build real world automation frameworks for live web and microservice applications rather than theoretical scenarios. Gain hands-on testing experience across core industry verticals, including FinTech, E-Commerce, and Healthcare platforms. Master sprint cycles, API validation, and end-to-end regression to stand out as a versatile QA engineer.",
    icon: Briefcase01Icon,
    linkText: "Learn more",
    linkHref: "/courses",
  },
  {
    id: "feature-3",
    number: "03",
    title: "Industry Expert Mentors",
    description:
      "Learn directly from QA Leads and Automation Architects currently working in top-tier IT companies.",
    icon: TeacherIcon,
    linkText: "Learn more",
    linkHref: "/about",
  },
  {
    id: "feature-4",
    number: "04",
    title: "Modern Tech Stack",
    description:
      "Master the tools that matter today: Industry level functional testing, Selenium + Java, Playwright + JavaScript, Postman and REST Assured for API Testing, CI/CD pipelines, Gitlab and many more.",
    icon: SourceCodeSquareIcon,
    linkText: "Learn more",
    linkHref: "/courses",
  },
  {
    id: "feature-5",
    number: "05",
    title: "Interview Mastery",
    description:
      "Rigorous mock interviews, ATS friendly resume building, Live interview support and HR/Manager round preparation.",
    icon: Target01Icon,
    linkText: "Learn more",
    linkHref: "/contact",
  },
];

export function KeyFeatures() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section className="bg-brand-bg py-12 md:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            <span>WHY CHOOSE US</span>
          </div>

          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
            The Revelation <span className="text-brand-blue">Advantage</span>
          </h2>

          <p className="text-brand-muted mt-4 text-[16px] md:text-[18px] font-normal leading-[1.7] max-w-2xl mx-auto">
            Hover over each pillar to explore how our specialized mentorship
            powers high-impact tech careers.
          </p>
        </div>

        {/* Horizontal Hover Accordion Row Container */}
        <div className="flex flex-col md:flex-row w-full h-auto md:h-[500px] gap-4">
          {features.map((item, index) => {
            const isExpanded = activeIdx === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIdx(index)}
                onClick={() => setActiveIdx(index)}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] bg-white ${
                  isExpanded
                    ? "flex-[4.5] shadow-xl border-brand-blue/30 ring-1 ring-brand-blue/20 min-h-[340px] md:min-h-0"
                    : "flex-1 shadow-sm border-gray-200 hover:border-gray-300 hover:shadow-md min-h-[90px] md:min-h-0"
                } border`}
              >
                {/* Subtle soft background tint on active card */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isExpanded
                      ? "opacity-100 bg-gradient-to-br from-brand-orange/[0.03] via-transparent to-brand-blue/[0.04]"
                      : "opacity-0"
                  }`}
                />

                {/* A. Minimized Content (Light Theme) */}
                <div
                  className={`absolute inset-0 flex flex-row md:flex-col items-center justify-between px-6 py-4 md:py-8 transition-opacity duration-300 pointer-events-none ${
                    isExpanded ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-brand-muted">
                    {item.number}
                  </span>

                  {/* Vertical Headline for Desktop / Horizontal on Mobile */}
                  <span className="md:[writing-mode:vertical-rl] md:rotate-180 text-[18px] md:text-[20px] font-bold text-brand-muted whitespace-nowrap tracking-wide select-none">
                    {item.title}
                  </span>

                  <span className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>

                {/* B. Expanded Content (Light Theme) */}
                <div
                  className={`relative md:absolute inset-0 p-6 sm:p-8 flex flex-col justify-between h-full transition-all duration-500 delay-100 ${
                    isExpanded
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none hidden md:flex"
                  }`}
                >
                  {/* Top: Bright Icon Container & Number Badge */}
                  <div className="flex items-center justify-between">
                    <div className="text-brand-orange bg-brand-orange/10 p-3.5 rounded-xl inline-block shadow-xs border border-brand-orange/20">
                      <HugeiconsIcon icon={item.icon as never} size={28} />
                    </div>

                    <span className="font-mono text-xs font-bold text-brand-muted px-3 py-1 rounded-full bg-gray-100 border border-gray-200">
                      {item.number} / 05
                    </span>
                  </div>

                  {/* Center Content: Full Title, Description & Action Link */}
                  <div className="my-auto pt-6">
                    <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-2 tracking-tight">
                      {item.title}
                    </h3>

                    <p className="text-brand-muted mt-2 text-[15px] md:text-[16px] font-normal leading-[1.6] max-w-sm">
                      {item.description}
                    </p>

                    <Link
                      href={item.linkHref}
                      className="text-brand-blue mt-8 inline-flex items-center gap-2 font-semibold hover:text-brand-orange transition-colors group/link"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>

                  {/* Bottom Accent Pill */}
                  <div className="w-12 h-1 rounded-full bg-brand-orange/50" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}