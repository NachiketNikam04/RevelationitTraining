import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { pool, initDbSchema } from "@/backend/config/db";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getBlogBySlug(slug: string) {
  try {
    await initDbSchema();
    const res = await pool.query(
      "SELECT id, slug, title, content, image_url, created_at FROM blogs WHERE slug = $1 LIMIT 1;",
      [slug]
    );
    return res.rows[0] || null;
  } catch (error) {
    console.error("Error loading blog by slug:", error);
    return null;
  }
}

async function getRecentBlogs(excludeId: number) {
  try {
    const res = await pool.query(
      "SELECT id, slug, title, image_url, created_at FROM blogs WHERE id != $1 ORDER BY created_at DESC LIMIT 3;",
      [excludeId]
    );
    return res.rows;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Revelation IT Training",
    };
  }

  return {
    title: `${blog.title} | Revelation IT Training`,
    description: blog.content.slice(0, 160),
  };
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const recentBlogs = await getRecentBlogs(blog.id);
  const paragraphs = blog.content.split(/\n+/).filter((p: string) => p.trim().length > 0);
  const words = blog.content.split(/\s+/).filter(Boolean).length;
  const readTime = `${Math.max(1, Math.round(words / 180))} min read`;

  return (
    <main className="relative min-h-screen bg-brand-bg text-brand-dark overflow-x-clip selection:bg-brand-orange/20 selection:text-brand-orange">
      <Navbar />
      <BackgroundTexture />

      {/* Article Header & Hero Section */}
      <article className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Category Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[12px] font-bold uppercase tracking-wider">
            Technical Insight
          </span>
          <div className="flex items-center gap-3 text-xs text-brand-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
              {formatDate(blog.created_at)}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-black text-brand-dark leading-[1.2] tracking-tight mb-8">
          {blog.title}
        </h1>

        {/* Featured Hero Cover Image */}
        <div className="relative w-full aspect-video sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-10 border border-brand-dark/10">
          <Image
            src={blog.image_url}
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-lg max-w-none text-gray-800 space-y-6">
          {paragraphs.map((para: string, idx: number) => (
            <p
              key={idx}
              className="text-[17px] md:text-[18px] leading-[1.8] font-normal text-gray-800 whitespace-pre-line"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Author / Revelation IT Footer Card */}
        <div className="mt-12 p-6 md:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md shadow-brand-orange/20">
            R
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-brand-dark">Revelation IT Training Editorial</h4>
            <p className="text-xs text-brand-muted leading-relaxed">
              Curated tutorials and career resources crafted by seasoned SDETs, architects, and faculty mentors at Revelation IT.
            </p>
          </div>
        </div>

        {/* More Articles Call to Action */}
        {recentBlogs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200/80">
            <h3 className="text-2xl font-bold text-brand-dark mb-6">More Articles You Might Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentBlogs.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-brand-blue/40 shadow-2xs hover:shadow-md transition-all group"
                >
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="250px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-brand-dark line-clamp-2 group-hover:text-brand-blue transition-colors">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
      <FloatingActions />
    </main>
  );
}
