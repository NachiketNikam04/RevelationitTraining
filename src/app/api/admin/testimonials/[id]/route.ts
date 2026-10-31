import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDbSchema();
    const { id } = await params;

    if (id === "new" || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: "Invalid testimonial ID" }, { status: 400 });
    }

    const result = await pool.query("SELECT * FROM testimonials WHERE id = $1 LIMIT 1;", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/testimonials/[id]] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch testimonial" },
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
      return NextResponse.json({ success: false, error: "Invalid testimonial ID" }, { status: 400 });
    }

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
      UPDATE testimonials
      SET name = $1, company = $2, rating = $3, testimonial_text = $4
      WHERE id = $5
      RETURNING id, name, company, rating, testimonial_text, created_at;
    `;
    const result = await pool.query(query, [
      name.trim(),
      company.trim(),
      numRating,
      testimonial_text.trim(),
      id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Testimonial not found to update" }, { status: 404 });
    }

    return NextResponse.json({ success: true, testimonial: result.rows[0] }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/testimonials/[id]] PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update testimonial" },
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
      return NextResponse.json({ success: false, error: "Invalid testimonial ID" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM testimonials WHERE id = $1 RETURNING id;", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("[API /api/admin/testimonials/[id]] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
