import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, slug, title, content, image_url, created_at FROM blogs ORDER BY created_at DESC;"
    );

    return NextResponse.json(
      { success: true, blogs: result.rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/blogs] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
