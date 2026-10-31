import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, slug, title, content, image_url, created_at FROM blogs ORDER BY created_at DESC;"
    );
    return NextResponse.json({ success: true, blogs: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/blogs] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDbSchema();

    const contentType = request.headers.get("content-type") || "";
    let title = "";
    let slug = "";
    let content = "";
    let imageUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = (formData.get("title") as string) || "";
      content = (formData.get("content") as string) || "";
      const customSlug = (formData.get("slug") as string) || "";
      slug = customSlug.trim() ? generateSlug(customSlug) : generateSlug(title);

      const file = formData.get("file") as File | null;
      if (file && typeof file === "object" && file.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const originalName = file.name || "blog-cover.jpg";
        const ext = path.extname(originalName) || ".jpg";
        const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueFilename = `${Date.now()}-${baseName}${ext}`;
        const fullFilePath = path.join(uploadDir, uniqueFilename);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(fullFilePath, buffer);

        imageUrl = `/uploads/blogs/${uniqueFilename}`;
      } else {
        imageUrl = (formData.get("image_url") as string) || "";
      }
    } else {
      const body = await request.json();
      title = body.title || "";
      content = body.content || "";
      slug = body.slug ? generateSlug(body.slug) : generateSlug(title);
      imageUrl = body.image_url || "";
    }

    if (!title.trim() || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Title and content are required." },
        { status: 400 }
      );
    }

    if (!imageUrl.trim()) {
      imageUrl = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80";
    }

    if (!slug) {
      slug = `blog-${Date.now()}`;
    }

    // Ensure slug uniqueness
    const existingSlug = await pool.query("SELECT id FROM blogs WHERE slug = $1 LIMIT 1;", [slug]);
    if (existingSlug.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const query = `
      INSERT INTO blogs (slug, title, content, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, slug, title, content, image_url, created_at;
    `;

    const result = await pool.query(query, [
      slug.trim(),
      title.trim(),
      content.trim(),
      imageUrl.trim(),
    ]);

    return NextResponse.json({ success: true, blog: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("[API /api/admin/blogs] POST Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create blog article" },
      { status: 500 }
    );
  }
}
