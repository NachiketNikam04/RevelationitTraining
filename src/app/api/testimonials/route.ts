import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, name, company, rating, testimonial_text, created_at FROM testimonials ORDER BY created_at DESC;"
    );
    return NextResponse.json({ success: true, testimonials: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/testimonials] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
