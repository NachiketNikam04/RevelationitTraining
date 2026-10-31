import { NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await initDbSchema();
    const result = await pool.query(
      "SELECT id, company_name, logo_url, created_at FROM companies ORDER BY created_at DESC;"
    );
    return NextResponse.json(
      { success: true, companies: result.rows },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/companies] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

