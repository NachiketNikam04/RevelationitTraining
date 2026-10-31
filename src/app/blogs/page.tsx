import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { pool, initDbSchema } from "@/backend/config/db";
import { Calendar, Clock, ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog & Insights | Revelation IT Training",
  description:
    "Expert tutorials, QA test frameworks, career roadmaps, and software development insights.",
};

interface BlogItem {
  id: number;
  slug: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

async function getBlogs(): Promise<BlogItem[]> {
  try {
    await initDbSchema();
    const res = await pool.query(
      "SELECT id, slug, title, content, image_url, created_at FROM blogs ORDER BY created_at DESC;"
    );
    return res.rows;
  } catch (error) {
    console.error("Error loading blogs from database:", error);
    return [];
  }
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(text: string) {
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return `${Math.max(1, Math.round(words / 180))} min read`;
}

export default async function BlogArchivePage() {
  const blogs = await getBlogs();
  const featuredBlog = blogs[0];
  const regularBlogs = blogs.slice(1);

  return (
    <main className="w-full flex flex-col bg-brand-bg relative min-h-screen text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      <Navbar />
      <BackgroundTexture />

      {/* 1. Header & Featured Hero Card */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 text-brand-orange text-[13px] md:text-[14px] font-bold uppercase tracking-[0.2em]">
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

        {/* Featured Blog Card */}
        {featuredBlog && (
          <Link
            href={`/blog/${featuredBlog.slug}`}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-brand-dark rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-brand-dark/20 block"
          >
            {/* Left: Cover Image */}
            <div className="relative w-full h-72 sm:h-96 lg:h-full overflow-hidden">
              <Image
                src={featuredBlog.image_url}
                alt={featuredBlog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none" />

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
                  {estimateReadTime(featuredBlog.content)}
                </span>
              </div>

              <h2 className="text-[28px] md:text-[32px] font-bold leading-[1.3] text-white mb-4 group-hover:text-brand-blue transition-colors">
                {featuredBlog.title}
              </h2>

              <p className="text-gray-400 text-[15px] md:text-[16px] font-normal leading-[1.6] mb-8 line-clamp-3">
                {featuredBlog.content.replace(/\n+/g, " ").slice(0, 160)}...
              </p>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Published {formatDate(featuredBlog.created_at)}</span>
                </div>

                <div className="text-brand-orange font-bold inline-flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform text-sm sm:text-base">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

      {/* 2. Bento Grid of Remaining Blogs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 w-full">
        <div className="border-b border-gray-200/80 pb-4 mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-dark">Latest Technical Articles</h2>
          <span className="text-xs text-brand-muted font-semibold">
            {blogs.length} articles published
          </span>
        </div>

        {regularBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-xl hover:border-brand-blue/30 transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-xs"
              >
                {/* Image Container */}
                <div className="w-full h-48 sm:h-52 rounded-2xl bg-gray-100 overflow-hidden mb-5 relative border border-brand-dark/5">
                  <Image
                    src={blog.image_url}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide text-brand-dark shadow-2xs border border-brand-dark/5">
                    Tutorial
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="text-xs text-brand-muted font-medium mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    {formatDate(blog.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {estimateReadTime(blog.content)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-[20px] font-bold leading-[1.3] text-brand-dark mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-brand-muted text-[14px] md:text-[15px] font-normal leading-[1.6] line-clamp-2 mb-6">
                  {blog.content.replace(/\n+/g, " ").slice(0, 100)}...
                </p>

                {/* Card Bottom Link */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-brand-orange">
                  <span>Read Article</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        ) : !featuredBlog ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-brand-orange mx-auto mb-3" />
            <h3 className="text-xl font-bold text-brand-dark">No Articles Published Yet</h3>
            <p className="text-brand-muted text-sm mt-2 max-w-md mx-auto">
              Our engineering team is crafting comprehensive guides and tutorials. Check back soon!
            </p>
          </div>
        ) : null}
      </section>

      <Footer />
      <FloatingActions />
    </main>
  );
}
