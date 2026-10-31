import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, name, role, bio, skills, image_url, linkedin_url, twitter_url, created_at FROM teachers ORDER BY created_at ASC;"
    );
    return NextResponse.json({ success: true, teachers: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/teachers] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDbSchema();
    
    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let role = "";
    let bio = "";
    let skillsJson = "[]";
    let imageUrl = "";
    let linkedinUrl = "";
    let twitterUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      role = (formData.get("role") as string) || "";
      bio = (formData.get("bio") as string) || "";
      linkedinUrl = (formData.get("linkedin_url") as string) || "";
      twitterUrl = (formData.get("twitter_url") as string) || "";
      
      const rawSkills = formData.get("skills");
      if (typeof rawSkills === "string") {
        try {
          const parsed = JSON.parse(rawSkills);
          skillsJson = Array.isArray(parsed) ? JSON.stringify(parsed) : JSON.stringify(rawSkills.split(",").map(s => s.trim()).filter(Boolean));
        } catch {
          skillsJson = JSON.stringify(rawSkills.split(",").map(s => s.trim()).filter(Boolean));
        }
      }

      const file = formData.get("file") as File | null;
      if (file && typeof file === "object" && file.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "teachers");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const originalName = file.name || "teacher.jpg";
        const ext = path.extname(originalName) || ".jpg";
        const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueFilename = `${Date.now()}-${baseName}${ext}`;
        const fullFilePath = path.join(uploadDir, uniqueFilename);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(fullFilePath, buffer);

        imageUrl = `/uploads/teachers/${uniqueFilename}`;
      } else {
        imageUrl = (formData.get("image_url") as string) || "";
      }
    } else {
      const body = await request.json();
      name = body.name || "";
      role = body.role || "";
      bio = body.bio || "";
      imageUrl = body.image_url || "";
      linkedinUrl = body.linkedin_url || "";
      twitterUrl = body.twitter_url || "";

      if (Array.isArray(body.skills)) {
        skillsJson = JSON.stringify(body.skills);
      } else if (typeof body.skills === "string") {
        skillsJson = JSON.stringify(body.skills.split(",").map((s: string) => s.trim()).filter(Boolean));
      }
    }

    if (!name.trim() || !role.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and role are required." },
        { status: 400 }
      );
    }

    if (!imageUrl.trim()) {
      imageUrl = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80";
    }

    const query = `
      INSERT INTO teachers (name, role, bio, skills, image_url, linkedin_url, twitter_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, role, bio, skills, image_url, linkedin_url, twitter_url, created_at;
    `;

    const result = await pool.query(query, [
      name.trim(),
      role.trim(),
      bio.trim(),
      skillsJson,
      imageUrl.trim(),
      linkedinUrl.trim(),
      twitterUrl.trim(),
    ]);

    return NextResponse.json({ success: true, teacher: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("[API /api/admin/teachers] POST Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create teacher profile" },
      { status: 500 }
    );
  }
}
