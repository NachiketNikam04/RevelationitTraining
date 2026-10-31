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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDbSchema();
    const { id } = await params;

    if (id === "new" || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT id, slug, title, content, image_url, created_at FROM blogs WHERE id = $1 LIMIT 1;",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, blog: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/blogs/[id]] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch blog article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDbSchema();
    const { id } = await params;

    if (id === "new" || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const existingRes = await pool.query("SELECT * FROM blogs WHERE id = $1 LIMIT 1;", [id]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog article not found" },
        { status: 404 }
      );
    }
    const currentBlog = existingRes.rows[0];

    const contentType = request.headers.get("content-type") || "";
    let title = currentBlog.title;
    let slug = currentBlog.slug;
    let content = currentBlog.content;
    let imageUrl = currentBlog.image_url;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      if (formData.has("title")) title = (formData.get("title") as string) || "";
      if (formData.has("content")) content = (formData.get("content") as string) || "";
      if (formData.has("slug") && (formData.get("slug") as string).trim()) {
        slug = generateSlug(formData.get("slug") as string);
      }

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

        // Delete old disk file if present
        if (currentBlog.image_url && currentBlog.image_url.startsWith("/uploads/blogs/")) {
          const oldDiskPath = path.join(process.cwd(), "public", currentBlog.image_url);
          if (fs.existsSync(oldDiskPath)) {
            try {
              await fs.promises.unlink(oldDiskPath);
            } catch (err) {
              console.warn("Could not delete old blog image:", oldDiskPath, err);
            }
          }
        }

        imageUrl = `/uploads/blogs/${uniqueFilename}`;
      } else if (formData.has("image_url")) {
        imageUrl = (formData.get("image_url") as string) || imageUrl;
      }
    } else {
      const body = await request.json();
      if (body.title !== undefined) title = body.title;
      if (body.content !== undefined) content = body.content;
      if (body.slug !== undefined && body.slug.trim()) slug = generateSlug(body.slug);
      if (body.image_url !== undefined) imageUrl = body.image_url;
    }

    // Check slug collision with other articles
    const collisionCheck = await pool.query(
      "SELECT id FROM blogs WHERE slug = $1 AND id != $2 LIMIT 1;",
      [slug, id]
    );
    if (collisionCheck.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const query = `
      UPDATE blogs
      SET title = $1, slug = $2, content = $3, image_url = $4
      WHERE id = $5
      RETURNING id, slug, title, content, image_url, created_at;
    `;

    const result = await pool.query(query, [
      title.trim(),
      slug.trim(),
      content.trim(),
      imageUrl.trim(),
      id,
    ]);

    return NextResponse.json({ success: true, blog: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/blogs/[id]] PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update blog article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDbSchema();
    const { id } = await params;

    if (id === "new" || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Invalid blog ID" },
        { status: 400 }
      );
    }

    const existingRes = await pool.query("SELECT * FROM blogs WHERE id = $1 LIMIT 1;", [id]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Blog article not found" },
        { status: 404 }
      );
    }

    const blog = existingRes.rows[0];
    const imageUrl = blog.image_url;

    if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("/uploads/blogs/")) {
      const diskPath = path.join(process.cwd(), "public", imageUrl);
      if (fs.existsSync(diskPath)) {
        try {
          await fs.promises.unlink(diskPath);
        } catch (unlinkErr) {
          console.warn("Could not delete file from disk:", diskPath, unlinkErr);
        }
      }
    }

    await pool.query("DELETE FROM blogs WHERE id = $1;", [id]);

    return NextResponse.json(
      { success: true, message: "Blog article deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/blogs/[id]] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete blog article" },
      { status: 500 }
    );
  }
}
