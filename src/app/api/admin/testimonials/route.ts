import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, name, company, rating, testimonial_text, created_at FROM testimonials ORDER BY created_at DESC;"
    );
    return NextResponse.json({ success: true, testimonials: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/testimonials] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDbSchema();
    const body = await request.json();
    const { name, company, rating = 5, testimonial_text } = body;

    if (!name || !company || !testimonial_text) {
      return NextResponse.json(
        { success: false, error: "Student name, company, and testimony are required." },
        { status: 400 }
      );
    }

    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));

    const query = `
      INSERT INTO testimonials (name, company, rating, testimonial_text)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, company, rating, testimonial_text, created_at;
    `;
    const result = await pool.query(query, [
      name.trim(),
      company.trim(),
      numRating,
      testimonial_text.trim(),
    ]);

    return NextResponse.json({ success: true, testimonial: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("[API /api/admin/testimonials] POST Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
