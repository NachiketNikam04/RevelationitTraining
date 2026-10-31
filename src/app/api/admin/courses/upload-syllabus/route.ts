import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Please select a PDF file to upload." },
        { status: 400 }
      );
    }

    // Destination Directory in public/uploads/syllabuses
    const uploadDir = path.join(process.cwd(), "public", "uploads", "syllabuses");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Generate safe unique filename
    const originalName = file.name || "syllabus.pdf";
    const ext = path.extname(originalName) || ".pdf";
    const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFilename = `${Date.now()}-${baseName}${ext}`;
    const fullFilePath = path.join(uploadDir, uniqueFilename);

    // Write file to filesystem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(fullFilePath, buffer);

    // Return the relative URL
    const relativeUrl = `/uploads/syllabuses/${uniqueFilename}`;

    return NextResponse.json(
      {
        success: true,
        message: "Syllabus PDF uploaded successfully!",
        file_url: relativeUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/courses/upload-syllabus] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to upload syllabus PDF." },
      { status: 500 }
    );
  }
}
