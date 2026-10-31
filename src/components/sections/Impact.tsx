"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import Image from "next/image";
import { Users, Building2, Trophy, Video, TrendingUp } from "lucide-react";

export interface StatItem {
  id: string;
  target: number;
  prefix?: string;
  suffix?: string;
  subtitle: string;
  variant?: "standard" | "image";
  ringColor?: "brand-orange" | "brand-blue" | "brand-purple";
  progress?: number;
  bgImage?: string;
  icon?: React.ElementType;
  iconColor?: string;
}

const defaultStats: StatItem[] = [
  {
    id: "stat-1",
    target: 1000,
    suffix: "+",
    subtitle: "Student Trained for Industries",
    variant: "image",
    bgImage: "https://images.unsplash.com/photo-1573165231977-3f0e27806045?w=800&auto=format&fit=crop&q=80 // Group of South Asian students",
    icon: Users,
    iconColor: "bg-blue-500 shadow-blue-900/30",
  },
  {
    id: "stat-2",
    target: 100,
    suffix: "+",
    subtitle: "Hiring Partners",
    variant: "image",
    bgImage: "https://images.unsplash.com/photo-1638262052640-82e94d64664a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGFuZCUyMHNoYWtlfGVufDB8fDB8fHww", // Corporate handshake
    icon: Building2,
    iconColor: "bg-purple-500 shadow-purple-900/30",
  },
  {
    id: "stat-3",
    target: 500,
    suffix: "+",
    subtitle: "Students Placed",
    variant: "image",
    bgImage: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&auto=format&fit=crop&q=80", // Confident Indian male IT professional
    icon: Trophy,
    iconColor: "bg-emerald-500 shadow-emerald-900/30",
  },
  {
    id: "stat-4",
    target: 100,
    suffix: "%",
    subtitle: "Live Interview Support",
    variant: "image",
    bgImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZXJ2aWV3fGVufDB8fDB8fHww", // Indian professional on a video call/laptop
    icon: Video,
    iconColor: "bg-brand-orange shadow-orange-900/30",
  },
];

const colorMap = {
  "brand-orange": {
    stroke: "#f77c34",
    text: "text-brand-orange",
    bg: "bg-brand-orange/10",
  },
  "brand-blue": {
    stroke: "#0fa8d6",
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
  },
  "brand-purple": {
    stroke: "#8b5cf6",
    text: "text-purple-600",
    bg: "bg-purple-500/10",
  },
};

function StatCard({ stat, isInView }: { stat: StatItem; isInView: boolean }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, stat.target, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (val) => {
        if (numberRef.current) {
          numberRef.current.textContent = Number.isInteger(stat.target)
            ? Math.round(val).toLocaleString()
            : val.toFixed(1);
        }
      },
    });

    return () => controls.stop();
  }, [isInView, stat.target]);

  // SVG Progress Ring calculations
  const radius = 22;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const targetProgress = stat.progress ?? 0;
  const targetOffset = circumference - (circumference * targetProgress) / 100;
  const activeColor = colorMap[stat.ringColor || "brand-orange"];

  if (stat.variant === "image") {
    return (
      <div className="relative group rounded-[28px] overflow-hidden p-6 sm:p-7 min-h-[230px] sm:min-h-[250px] flex flex-col justify-between shadow-lg shadow-black/10 border border-brand-dark/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* Background Image with Handshake */}
        {stat.bgImage && (
          <Image
            src={stat.bgImage}
            alt={stat.subtitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Dark Gradient Overlay for optimal legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/45 pointer-events-none" />

        {/* Top Left: Dynamic Icon Box */}
        <div className="relative z-10 self-start">
          <div className={`w-10 h-10 rounded-xl ${stat.iconColor || 'bg-[#10b981] shadow-emerald-900/30'} flex items-center justify-center text-white shadow-md`}>
            {stat.icon ? <stat.icon className="w-5 h-5" /> : <TrendingUp className="w-5 h-5"/>}
          </div>
        </div>

        {/* Bottom Left: Large White Number & Subtitle */}
        <div className="relative z-10 text-white mt-auto">
          <div className="flex items-baseline text-[44px] md:text-[52px] font-black tracking-tight">
            {stat.prefix && <span>{stat.prefix}</span>}
            <span ref={numberRef}>0</span>
            {stat.suffix && <span className="ml-0.5">{stat.suffix}</span>}
          </div>
          <p className="mt-2 text-[15px] md:text-[16px] font-normal leading-[1.6] text-gray-200">
            {stat.subtitle}
          </p>
        </div>
      </div>
    );
  }

  // Standard White Card with SVG Progress Ring
  return (
    <div className="relative group rounded-[28px] bg-white p-6 sm:p-7 min-h-[230px] sm:min-h-[250px] flex flex-col justify-between border border-brand-dark/8 shadow-md shadow-brand-dark/[0.04] transition-all duration-300 hover:shadow-xl hover:shadow-brand-dark/10 hover:-translate-y-1 hover:border-brand-dark/20">
      {/* Top Right: Circular SVG Progress Ring */}
      <div className="self-end relative">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg
            className="w-14 h-14 -rotate-90"
            viewBox="0 0 56 56"
            aria-hidden="true"
          >
            {/* Background Track */}
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Animated Progress Stroke */}
            <motion.circle
              cx="28"
              cy="28"
              r={radius}
              stroke={activeColor.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={
                isInView
                  ? { strokeDashoffset: targetOffset }
                  : { strokeDashoffset: circumference }
              }
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>
          {/* Inner Percentage Label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold font-heading text-brand-dark">
              {targetProgress}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Left: Large Number & Subtitle */}
      <div className="mt-auto">
        <div className="flex items-baseline text-[44px] md:text-[52px] font-black text-brand-dark tracking-tight">
          {stat.prefix && <span>{stat.prefix}</span>}
          <span ref={numberRef}>0</span>
          {stat.suffix && <span className="ml-0.5">{stat.suffix}</span>}
        </div>
        <p className="mt-2 text-[15px] md:text-[16px] font-normal leading-[1.6] text-brand-muted">
          {stat.subtitle}
        </p>
      </div>
    </div>
  );
}

export function Impact({ stats = defaultStats }: { stats?: StatItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
            IMPACT
          </span>
        </div>
        <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight">
          Delivering Measurable <br></br><span className="text-brand-blue">Business</span> Impact
        </h2>
      </div>

      {/* 4-Column Bento-style Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 auto-rows-[420px]"
      >
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} isInView={isInView} />
        ))}
      </motion.div>
    </section>
  );
}