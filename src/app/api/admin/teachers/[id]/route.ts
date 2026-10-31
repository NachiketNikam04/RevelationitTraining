import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDbSchema();
    const { id } = await params;

    if (id === "new" || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Invalid teacher ID" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT id, name, role, bio, skills, image_url, linkedin_url, twitter_url, created_at FROM teachers WHERE id = $1 LIMIT 1;",
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, teacher: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/teachers/[id]] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch teacher" },
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
        { success: false, error: "Invalid teacher ID" },
        { status: 400 }
      );
    }

    const existingRes = await pool.query("SELECT * FROM teachers WHERE id = $1 LIMIT 1;", [id]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }
    const currentTeacher = existingRes.rows[0];

    const contentType = request.headers.get("content-type") || "";
    let name = currentTeacher.name;
    let role = currentTeacher.role;
    let bio = currentTeacher.bio;
    let skillsJson = JSON.stringify(currentTeacher.skills || []);
    let imageUrl = currentTeacher.image_url;
    let linkedinUrl = currentTeacher.linkedin_url;
    let twitterUrl = currentTeacher.twitter_url;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      if (formData.has("name")) name = (formData.get("name") as string) || "";
      if (formData.has("role")) role = (formData.get("role") as string) || "";
      if (formData.has("bio")) bio = (formData.get("bio") as string) || "";
      if (formData.has("linkedin_url")) linkedinUrl = (formData.get("linkedin_url") as string) || "";
      if (formData.has("twitter_url")) twitterUrl = (formData.get("twitter_url") as string) || "";
      
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

        if (currentTeacher.image_url && currentTeacher.image_url.startsWith("/uploads/teachers/")) {
          const oldDiskPath = path.join(process.cwd(), "public", currentTeacher.image_url);
          if (fs.existsSync(oldDiskPath)) {
            try {
              await fs.promises.unlink(oldDiskPath);
            } catch (err) {
              console.warn("Could not delete old file from disk:", oldDiskPath, err);
            }
          }
        }

        imageUrl = `/uploads/teachers/${uniqueFilename}`;
      } else if (formData.has("image_url")) {
        imageUrl = (formData.get("image_url") as string) || imageUrl;
      }
    } else {
      const body = await request.json();
      if (body.name !== undefined) name = body.name;
      if (body.role !== undefined) role = body.role;
      if (body.bio !== undefined) bio = body.bio;
      if (body.image_url !== undefined) imageUrl = body.image_url;
      if (body.linkedin_url !== undefined) linkedinUrl = body.linkedin_url;
      if (body.twitter_url !== undefined) twitterUrl = body.twitter_url;

      if (Array.isArray(body.skills)) {
        skillsJson = JSON.stringify(body.skills);
      } else if (typeof body.skills === "string") {
        skillsJson = JSON.stringify(body.skills.split(",").map((s: string) => s.trim()).filter(Boolean));
      }
    }

    const query = `
      UPDATE teachers
      SET name = $1, role = $2, bio = $3, skills = $4, image_url = $5, linkedin_url = $6, twitter_url = $7
      WHERE id = $8
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
      id,
    ]);

    return NextResponse.json({ success: true, teacher: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/teachers/[id]] PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update teacher profile" },
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
        { success: false, error: "Invalid teacher ID" },
        { status: 400 }
      );
    }

    const existingRes = await pool.query("SELECT * FROM teachers WHERE id = $1 LIMIT 1;", [id]);
    if (existingRes.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Teacher not found" },
        { status: 404 }
      );
    }

    const teacher = existingRes.rows[0];
    const imageUrl = teacher.image_url;

    if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("/uploads/teachers/")) {
      const diskPath = path.join(process.cwd(), "public", imageUrl);
      if (fs.existsSync(diskPath)) {
        try {
          await fs.promises.unlink(diskPath);
        } catch (unlinkErr) {
          console.warn("Could not delete file from disk:", diskPath, unlinkErr);
        }
      }
    }

    await pool.query("DELETE FROM teachers WHERE id = $1;", [id]);

    return NextResponse.json(
      { success: true, message: "Teacher deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/teachers/[id]] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete teacher" },
      { status: 500 }
    );
  }
}
