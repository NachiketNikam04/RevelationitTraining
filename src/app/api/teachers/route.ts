import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, name, role, bio, skills, image_url, linkedin_url, twitter_url, created_at FROM teachers ORDER BY created_at ASC;"
    );

    return NextResponse.json(
      { success: true, teachers: result.rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/teachers] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
