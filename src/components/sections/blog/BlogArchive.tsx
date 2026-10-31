"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  BookOpen,
  ArrowUpRight,
  Search,
} from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: "Engineering & Dev" | "QA Automation" | "Tech Interviews" | "Success Stories" | "Career Guide";
  image: string;
}

const allPosts: BlogPost[] = [
  {
    id: "1",
    slug: "building-scalable-backend-architectures",
    title: "Building Scalable Backend Architectures with Spring Boot and Node.js",
    excerpt:
      "Learn the core principles of high-throughput distributed microservices, caching layers with Redis, and async message queues.",
    date: "Oct 12, 2026",
    readTime: "6 min read",
    category: "Engineering & Dev",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    slug: "react-vs-traditional-uis",
    title: "React vs. Traditional UIs: What Tech Recruiters are Looking For",
    excerpt:
      "Explore modern component patterns, state management benchmarks, and what top hiring managers assess in frontend interviews.",
    date: "Oct 05, 2026",
    readTime: "4 min read",
    category: "Engineering & Dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    slug: "manual-testing-to-automation-lead",
    title: "How I Transitioned from Manual Testing to Automation Lead in 6 Months",
    excerpt:
      "A step-by-step personal journey of mastering Java, Selenium WebDriver, and CI/CD pipelines to triple compensation.",
    date: "Sep 28, 2026",
    readTime: "8 min read",
    category: "Success Stories",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    slug: "controller-service-repository-cheat-sheet",
    title: "The Ultimate Controller-Service-Repository Pattern Cheat Sheet",
    excerpt:
      "Clean architecture design guidelines for organizing business logic, database transactions, and API endpoints effectively.",
    date: "Sep 15, 2026",
    readTime: "5 min read",
    category: "Engineering & Dev",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    slug: "top-5-automation-frameworks-2027",
    title: "Top 5 Automation Frameworks to Master Before 2027",
    excerpt:
      "From Selenium 4 and Playwright to REST Assured and Cypress: an objective comparison of modern test automation toolsets.",
    date: "Sep 10, 2026",
    readTime: "7 min read",
    category: "QA Automation",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    slug: "mastering-technical-hr-round",
    title: "Mastering the Technical HR Round: Questions You Must Prepare For",
    excerpt:
      "How to handle behavioral scenario questions, salary negotiation strategies, and technical aptitude assessments with ease.",
    date: "Sep 02, 2026",
    readTime: "5 min read",
    category: "Tech Interviews",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
  },
];

export function BlogArchive() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "View All" },
    { id: "Engineering & Dev", label: "Engineering & Dev" },
    { id: "QA Automation", label: "QA Automation" },
    { id: "Tech Interviews", label: "Tech Interviews" },
    { id: "Success Stories", label: "Success Stories" },
  ];

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col bg-brand-bg">
      {/* ========================================================================= */}
      {/* 1. Page Header & Featured Spotlight */}
      {/* ========================================================================= */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]
">
            <span>INSIGHTS &amp; RESOURCES</span>
          </div>

          <h1 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
            The Revelation Tech <span className="text-brand-blue">Blogs</span>
          </h1>

          <p className="text-brand-muted text-[16px] md:text-[18px] font-normal leading-[1.7] mt-4 max-w-2xl mx-auto">
            Expert tutorials, career advice, and industry trends to keep you ahead
            of the curve in software testing and development.
          </p>
        </div>

        {/* Featured Spotlight Post (Hero Card) */}
        <Link
          href="/blog/cracking-cdac-ccat"
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-brand-dark rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-brand-dark/20 block"
        >
          {/* Left: Image */}
          <div className="relative w-full h-72 sm:h-96 lg:h-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80"
              alt="Students collaborating and studying for technical exams"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none" />

            {/* Featured Badge */}
            <div className="absolute top-6 left-6 bg-brand-orange text-white text-[12px] font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full shadow-md">
              ⭐ Featured Article
            </div>
          </div>

          {/* Right: Content */}
          <div className="p-8 sm:p-10 lg:p-16 flex flex-col justify-center text-white">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-blue/20 text-brand-blue px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide w-fit">
                Career Guide
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                7 min read
              </span>
            </div>

            <h2 className="text-[28px] md:text-[32px] font-bold leading-[1.3] text-white mb-4 group-hover:text-brand-blue transition-colors">
              Cracking the CDAC C-CAT: A Complete Preparation Strategy
            </h2>

            <p className="text-gray-400 text-[15px] md:text-[16px] font-normal leading-[1.6] mb-8 font-normal">
              A comprehensive roadmap to acing your exams, mastering the
              fundamentals, and securing your spot in the upcoming batch with
              expert tips and practice routines.
            </p>

            <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                <span>Published Oct 18, 2026</span>
              </div>

              <div className="text-brand-orange font-bold inline-flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform text-sm sm:text-base">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ========================================================================= */}
      {/* 2. Category Filter Bar & Search */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="py-6 border-y border-gray-200/60 mb-10 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Pills */}
          <div className="flex gap-2.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    isActive
                      ? "bg-brand-dark text-white shadow-sm"
                      : "bg-white border border-gray-200 text-brand-muted hover:border-brand-dark hover:text-brand-dark"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles & tutorials..."
              className="bg-white border border-gray-200 rounded-full pl-11 pr-5 py-2.5 w-full text-xs sm:text-sm text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-colors shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. The Bento Grid (Standard Posts) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 w-full">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08, ease: "easeOut" }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-xs"
                >
                  {/* Image Container */}
                  <div className="w-full h-48 sm:h-52 rounded-2xl bg-gray-100 overflow-hidden mb-5 relative border border-brand-dark/5">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Category Pill on Image */}
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide text-brand-dark shadow-2xs border border-brand-dark/5">
                      {post.category}
                    </div>
                  </div>

                  {/* Date & Read Time */}
                  <div className="text-xs text-brand-muted font-medium mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[22px] font-bold leading-[1.3] text-brand-dark mb-2 group-hover:text-brand-blue transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-brand-muted text-[15px] md:text-[16px] font-normal leading-[1.6] line-clamp-2 mb-6 font-normal">
                    {post.excerpt}
                  </p>

                  {/* Card Bottom Link */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-brand-dark">
              No matching articles found
            </h3>
            <p className="text-brand-muted text-sm mt-2">
              Try adjusting your search query or selecting &quot;View All&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 bg-brand-dark text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
