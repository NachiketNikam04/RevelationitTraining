"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useVelocity,
  useTransform,
  useSpring,
  animate,
  PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";

export interface TestimonialItem {
  id: string | number;
  name: string;
  company: string;
  rating?: number;
  testimonial_text: string;
}

const defaultTestimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    company: "TechFlow",
    rating: 5,
    testimonial_text:
      "The hands-on automation projects were game-changing. I walked into my interviews with actual code to show, not just theory.",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    company: "NexaTech",
    rating: 5,
    testimonial_text:
      "I stopped worrying about my non-IT background. The instructors broke down Java and Selenium so clearly that I was writing test scripts in weeks.",
  },
  {
    id: 3,
    name: "Priya Sharma",
    company: "FinScale",
    rating: 5,
    testimonial_text:
      "The mock interviews were brutal but exactly what I needed. By the time I had my real HR round, I was completely fearless.",
  },
  {
    id: 4,
    name: "Amit Patel",
    company: "CloudWave",
    rating: 5,
    testimonial_text:
      "Getting 100% placement support isn't a gimmick here. The team actively pushed my resume until I secured my offer.",
  },
  {
    id: 5,
    name: "David Chen",
    company: "AutoCorp",
    rating: 5,
    testimonial_text:
      "The 24/7 cloud lab access and real-time defect triage sessions gave me the confidence of a seasoned 3-year engineer.",
  },
  {
    id: 6,
    name: "Neha Verma",
    company: "GlobalSys",
    rating: 5,
    testimonial_text:
      "From manual test design to building full CI/CD pipelines in Jenkins, Revelation IT covered every single question asked in my MNC interview.",
  },
];

export function Testimonials({
  initialTestimonials,
}: {
  initialTestimonials?: TestimonialItem[];
}) {
  const [items, setItems] = useState<TestimonialItem[]>(
    initialTestimonials && initialTestimonials.length > 0
      ? initialTestimonials
      : defaultTestimonials
  );

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setItems(data.testimonials);
        }
      } catch (err) {
        console.error("Error fetching dynamic testimonials:", err);
      }
    }

    if (!initialTestimonials || initialTestimonials.length === 0) {
      fetchTestimonials();
    }
  }, [initialTestimonials]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Motion value for 1:1 drag position
  const x = useMotionValue(0);

  // Velocity-driven pendulum tilt for inertial swinging
  const xVelocity = useVelocity(x);
  const rawRotation = useTransform(xVelocity, [-1500, 1500], [7, -7]);
  const rotation = useSpring(rawRotation, { stiffness: 350, damping: 25 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive card dimension setup
  const isMobile = windowWidth < 768;
  const cardWidth = isMobile ? 320 : 400;
  const gap = 32;
  const halfCardWidth = cardWidth / 2;

  // Window resize handler
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smoothly spring to target position whenever activeIndex changes
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;
    const target = windowWidth / 2 - activeIndex * (cardWidth + gap) - halfCardWidth;
    const controls = animate(x, target, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
    return () => controls.stop();
  }, [activeIndex, windowWidth, cardWidth, gap, halfCardWidth, x, items.length]);

  function getTargetX(index: number, width: number) {
    return width / 2 - index * (cardWidth + gap) - halfCardWidth;
  }

  // Auto-play timer: advances every 5000ms, paused during hover or dragging
  useEffect(() => {
    if (isHovered || isDragging || items.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging, items.length]);

  // Drag physics & snap calculation
  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    setIsDragging(false);

    const currentX = x.get();
    const zeroX = windowWidth / 2 - halfCardWidth;
    const offset = zeroX - currentX;
    const rawIndex = offset / (cardWidth + gap);

    let newIndex = Math.round(rawIndex);
    if (info.velocity.x < -300) {
      newIndex = Math.ceil(rawIndex);
    } else if (info.velocity.x > 300) {
      newIndex = Math.floor(rawIndex);
    }

    const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));
    setActiveIndex(clampedIndex);
  }

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }

  const getInitials = (name: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (items.length === 0) {
    return null;
  }

  const current = items[Math.min(activeIndex, items.length - 1)] || items[0];

  return (
    <section className="bg-brand-bg py-12 md:py-16 overflow-hidden relative select-none">
      {/* 1. Header Group & Typography */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        <div className="pl-6 md:pl-12">
          <span className="text-brand-orange uppercase tracking-[0.2em] text-[13px] md:text-[14px] font-bold block">
            IN THEIR WORDS
          </span>
          <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark mt-2 tracking-tight">
            Hear from our <span className="text-brand-blue">Successful</span> students
          </h2>
        </div>

        {/* Slide Counter: Absolute positioned on the far right */}
        <div className="absolute right-6 md:right-12 top-0 text-brand-orange font-medium font-mono text-sm sm:text-base">
          {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </div>
      </div>

      {/* 2. The Hanger & Carousel Area */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full overflow-hidden pt-12 pb-6"
      >
        {/* Main Horizontal Track */}
        <div className="absolute w-full h-[1px] bg-gray-300 top-12 z-0 pointer-events-none" />

        {/* Draggable Motion Container */}
        <motion.div
          drag="x"
          dragConstraints={{
            left: getTargetX(items.length - 1, windowWidth) - 100,
            right: getTargetX(0, windowWidth) + 100,
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="flex gap-8 items-start cursor-grab active:cursor-grabbing w-max"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={item.id}
                style={{
                  rotate: rotation,
                  transformOrigin: "50% 0%",
                  width: `${cardWidth}px`,
                }}
                className="relative shrink-0 pt-12"
              >
                {/* Mechanical Joint on the horizontal track */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-bg flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                </div>

                {/* Vertical Thread */}
                <div className="absolute top-0 left-1/2 w-[1px] h-12 bg-gray-300 -translate-x-1/2 z-0 pointer-events-none" />

                {/* Review Card */}
                <div
                  onClick={() => setActiveIndex(index)}
                  className={`relative z-10 bg-white rounded-xl shadow-xs border border-gray-100 p-8 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "scale-100 opacity-100 shadow-lg border-gray-200"
                      : "scale-95 opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* Top Row: Number & Stars */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm font-semibold">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-center gap-1 text-brand-orange">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <HugeiconsIcon
                          key={i}
                          icon={StarIcon}
                          size={16}
                          className="fill-brand-orange text-brand-orange"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-brand-dark text-[15px] md:text-[16px] font-normal leading-[1.6] mt-4 mb-6 line-clamp-4">
                    &ldquo;{item.testimonial_text}&rdquo;
                  </p>

                  {/* Company Logo / Label */}
                  <div className="text-gray-500 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide border-t border-gray-50 pt-4">
                    <Building2 className="w-4 h-4 text-brand-blue" />
                    <span>{item.company}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* 3. Dynamic Author Profile & Navigation Below Cards */}
      <div className="mt-8 max-w-xl mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Author Name */}
            <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark">
              {current.name}
            </h3>

            {/* Role & Company */}
            <p className="text-[14px] text-brand-muted mt-0.5 font-medium">
              Placed at <span className="font-semibold text-brand-dark">{current.company}</span>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 4. Ultra-Refined Minimalist Buttons */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Testimonial"
            className="w-10 h-10 bg-transparent flex items-center justify-center text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all duration-300 mx-3 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          {/* Thin vertical separator line */}
          <div className="w-12 h-[1px] bg-gray-300"></div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Testimonial"
            className="w-10 h-10 bg-transparent flex items-center justify-center text-gray-400 hover:text-brand-dark hover:border-brand-dark transition-all duration-300 mx-3 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
