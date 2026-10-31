"use client";

import React, { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";

export interface BlogPost {
  id: string | number;
  type: "featured" | "standard";
  category: string;
  title: string;
  description?: string;
  date: string;
  readTime: string;
  image: string;
  href: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: "post-1",
    type: "featured",
    category: "Career Guide",
    title: "Cracking the CDAC C-CAT: A Complete Preparation Strategy",
    description:
      "A comprehensive roadmap to acing your exams, mastering the fundamentals, and securing your spot in the upcoming batch with expert tips and practice routines.",
    date: "Oct 2026",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    href: "/blog/cracking-cdac-ccat",
  },
  {
    id: "post-2",
    type: "standard",
    category: "Automation",
    title: "The Future of QA: Top 10 Automation Testing Tools to Master in 2026",
    description:
      "A comprehensive breakdown of Playwright, Selenium 4, AI-driven test generators, and cloud CI/CD pipelines reshaping modern software quality assurance.",
    date: "Sept 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    href: "/blog/the-future-of-qa-top-10-automation-testing-tools-to-master-in-2026",
  },
  {
    id: "post-3",
    type: "standard",
    category: "Success Stories",
    title: "How I Transitioned from Manual Testing to Automation Lead in 6 Months",
    description:
      "A step-by-step personal journey of mastering Java, Selenium WebDriver, and CI/CD pipelines to triple compensation.",
    date: "Aug 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    href: "/blog/manual-testing-to-automation-lead",
  },
];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
          const mapped: BlogPost[] = data.blogs.slice(0, 3).map((b: any, idx: number) => {
            const words = b.content ? b.content.split(/\s+/).filter(Boolean).length : 0;
            const readTime = `${Math.max(1, Math.round(words / 180))} min read`;
            let dateStr = "Recent";
            try {
              dateStr = new Date(b.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });
            } catch {}

            return {
              id: b.id,
              type: idx === 0 ? "featured" : "standard",
              category: idx === 0 ? "Featured" : "Technical Guide",
              title: b.title,
              description: b.content.replace(/\n+/g, " ").slice(0, 160) + "...",
              date: dateStr,
              readTime,
              image: b.image_url,
              href: `/blog/${b.slug}`,
            };
          });
          setPosts(mapped);
        }
      } catch (err) {
        console.warn("Could not load dynamic blogs, using fallback:", err);
      }
    };

    loadBlogs();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const featuredPost = posts[0] || fallbackPosts[0];
  const standardPosts = posts.length > 1 ? posts.slice(1) : fallbackPosts.slice(1);

  return (
    <section id="blogs" className="bg-brand-bg py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Container */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
              <span>LATEST INSIGHTS</span>
            </div>

            <h2 className="text-[36px] md:text-[44px] font-bold leading-[1.2] text-brand-dark tracking-tight mt-2">
              Tech Hub &amp; <span className="text-brand-blue">Career</span> Resources
            </h2>

            <p className="text-brand-muted mt-4 max-w-2xl text-[16px] md:text-[18px] font-normal leading-[1.7]">
              Expert advice, industry trends, and interview tips to help you
              dominate the QA landscape.
            </p>
          </div>

          {/* Header Action: View All Articles */}
          <div className="flex-shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-brand-blue text-brand-blue font-semibold text-sm hover:bg-brand-blue hover:text-white transition-all duration-200 group active:scale-[0.98]"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Magazine Grid Layout with Framer Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
        >
          {/* A. Featured Post Card */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer min-h-[420px] lg:min-h-[520px] bg-brand-dark flex flex-col justify-end p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10 hover:shadow-2xl transition-all duration-300 border border-brand-dark/10"
          >
            <Link href={featuredPost.href} className="absolute inset-0 z-30" aria-label={featuredPost.title} />

            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-brand-orange text-white px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide shadow-xs">
                  {featuredPost.category}
                </span>

                <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featuredPost.date}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>

              <h3 className="text-[28px] md:text-[32px] font-bold leading-[1.3] text-white mb-3 tracking-tight group-hover:text-brand-orange transition-colors">
                {featuredPost.title}
              </h3>

              {featuredPost.description && (
                <p className="text-gray-300 text-[15px] md:text-[16px] font-normal leading-[1.6] mb-6 line-clamp-2 max-w-2xl">
                  {featuredPost.description}
                </p>
              )}

              <div className="inline-flex items-center gap-2 text-white font-semibold text-sm sm:text-base group-hover:text-brand-orange transition-colors">
                <span>Read Article</span>
                <span className="transform transition-transform duration-200 group-hover:translate-x-2">
                  <HugeiconsIcon icon={ArrowRight02Icon} size={18} />
                </span>
              </div>
            </div>
          </motion.div>

          {/* B. Standard Post Cards */}
          {standardPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              className="lg:col-span-1 relative flex flex-col group cursor-pointer bg-white rounded-2xl p-5 sm:p-6 border border-brand-dark/8 shadow-xs hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300"
            >
              <Link href={post.href} className="absolute inset-0 z-30" aria-label={post.title} />

              <div className="overflow-hidden rounded-xl h-[200px] sm:h-[220px] mb-4 relative">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white font-medium">
                  {post.readTime}
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-brand-blue text-[12px] font-bold uppercase tracking-wide mb-2">
                  {post.category}
                </span>

                <h4 className="text-[22px] font-bold leading-[1.3] text-brand-dark group-hover:text-brand-blue transition-colors mb-2">
                  {post.title}
                </h4>

                {post.description && (
                  <p className="text-brand-muted text-[15px] md:text-[16px] font-normal leading-[1.6] mb-4 line-clamp-2">
                    {post.description}
                  </p>
                )}

                <div className="mt-auto pt-2">
                  <span className="text-brand-orange text-sm font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                    <span>Read Article</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
