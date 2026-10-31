"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function BatchesHero() {
  return (
    <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      {/* Left Column (Text) */}
      <div className="flex flex-col items-start text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em] mb-2">
          <span>SCHEDULE &amp; TIMINGS</span>
        </div>

        <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
          Find the perfect schedule for your <span className="text-brand-blue">IT Career</span> transition.
        </h1>

        <p className="text-[16px] md:text-[18px] font-normal leading-[1.7] text-brand-muted max-w-xl">
          Whether you are a working professional needing weekend classes or a
          full-time student preferring immersive offline sessions, we have a batch
          for you.
        </p>

        <a
          href="#batches-list"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-brand-dark font-bold text-[14px] hover:border-brand-blue hover:text-brand-blue transition-colors shadow-sm cursor-pointer"
        >
          <span>View Available Seats</span>
          <ArrowDown className="w-4 h-4" />
        </a>
      </div>

      {/* Right Column: The "Live Status" Widget */}
      <div className="relative flex items-center justify-center">
        {/* Decorative Depth Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-blue/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full max-w-lg mx-auto bg-white rounded-[2rem] p-6 sm:p-7 shadow-2xl border border-gray-100 flex flex-col gap-6"
        >
          {/* Top Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[12px] font-bold tracking-[0.2em] text-brand-dark">
              SEAT AVAILABILITY
            </span>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-[12px] font-bold text-green-600 uppercase tracking-wide">
                Live Updates
              </span>
            </div>
          </div>

          {/* 3-Batch Tracking List */}
          <div className="flex flex-col gap-5">
            {/* Batch Item 1: Weekday Online */}
            <div>
              <div className="flex justify-between text-[14px] font-bold text-brand-dark mb-2">
                <span>Weekday Batch (Online)</span>
                <span className="text-brand-orange font-bold">85% Booked</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-orange rounded-full w-[85%]"></div>
              </div>
              <p className="text-[12px] text-brand-muted mt-1 font-normal">
                Only 4 seats remaining.
              </p>
            </div>

            {/* Batch Item 2: Weekend Online */}
            <div>
              <div className="flex justify-between text-[14px] font-bold text-brand-dark mb-2">
                <span>Weekend Batch (Online)</span>
                <span className="text-brand-blue font-bold">45% Booked</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full w-[45%]"></div>
              </div>
              <p className="text-[12px] text-brand-muted mt-1 font-normal">
                Ideal for working professionals.
              </p>
            </div>

            {/* Batch Item 3: Offline Classroom */}
            <div>
              <div className="flex justify-between text-[14px] font-bold text-brand-dark mb-2">
                <span>Pune/Pimpri-Chinchwad Campus</span>
                <span className="text-red-500 font-bold">95% Booked</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[95%]"></div>
              </div>
              <p className="text-[12px] font-bold text-red-500 mt-1">
                Last 2 seats available!
              </p>
            </div>
          </div>

          {/* Integrated Countdown Timer */}
          <div className="mt-2 bg-brand-bg border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[13px] font-bold text-brand-dark text-center sm:text-left">
              Next batch kicks off in:
            </span>

            <div className="flex gap-3">
              {/* Days */}
              <div className="bg-white shadow-xs border border-gray-100 rounded-lg px-3 py-2 text-center flex flex-col min-w-[50px]">
                <span className="text-[18px] font-black text-brand-dark leading-none">
                  14
                </span>
                <span className="text-[9px] uppercase font-bold text-brand-muted mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="bg-white shadow-xs border border-gray-100 rounded-lg px-3 py-2 text-center flex flex-col min-w-[50px]">
                <span className="text-[18px] font-black text-brand-dark leading-none">
                  08
                </span>
                <span className="text-[9px] uppercase font-bold text-brand-muted mt-1">
                  Hours
                </span>
              </div>

              {/* Mins */}
              <div className="bg-white shadow-xs border border-gray-100 rounded-lg px-3 py-2 text-center flex flex-col min-w-[50px]">
                <span className="text-[18px] font-black text-brand-dark leading-none">
                  45
                </span>
                <span className="text-[9px] uppercase font-bold text-brand-muted mt-1">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
