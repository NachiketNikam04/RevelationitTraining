import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(`
      SELECT 
        id, 
        slug, 
        title, 
        short_description, 
        duration_mode, 
        category, 
        card_image_url, 
        placement_guarantee, 
        tech_stack, 
        card_features, 
        status,
        created_at 
      FROM courses 
      WHERE status = 'Published' 
      ORDER BY id ASC;
    `);

    return NextResponse.json(
      { success: true, courses: result.rows },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/courses] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
