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
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 });
    }

    const query = "SELECT * FROM courses WHERE id = $1 LIMIT 1;";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, course: result.rows[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/courses/[id]] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch course" },
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
      return NextResponse.json({ success: false, error: "Invalid course ID" }, { status: 400 });
    }

    const body = await request.json();

    const {
      // Tab 1: Landing Page fields
      subject,
      title,
      short_description,
      long_description,
      duration_mode,
      projects_count,
      accreditation_text,
      next_batch_text,
      accelerate_heading,
      accelerate_description,
      accelerate_bullets,

      // Course Card Info fields
      category,
      card_image_url,
      placement_guarantee,
      card_features,

      // Tab 2: Course Overview fields
      overview_eyebrow,
      overview_heading,
      overview_description,
      tech_stack,
      outcome_title,
      outcome_text,
      overview_image_url,
      overview_badge_line1,
      overview_badge_line2,

      // Tab 3: Key Features fields
      advantages_eyebrow,
      advantages_heading,
      advantages_description,
      six_key_features,

      // Tab 4: Target Audiences fields
      pathways_eyebrow,
      pathways_heading,
      tailored_pathways,

      // Tab 5: Comparison Table fields
      comparison_eyebrow,
      comparison_heading,
      comparison_description,
      comparison_table,

      // Tab 6: Course Curriculum fields
      syllabus_eyebrow,
      syllabus_heading,
      syllabus_description,
      syllabus_pdf_url,
      curriculum,

      // Tab 7: Course Batches & Enrollment fields
      batches_eyebrow,
      batches_heading,
      batches_description,
      batch_options,

      // Tab 8: Guidance & Mentorship fields
      guidance_eyebrow,
      guidance_title,
      guidance_description,

      // Tab 9: Certification fields
      cert_eyebrow,
      cert_heading,
      cert_description,
      cert_image_url,
      cert_features,
    } = body;

    // 1. Database Fail-safe (Run before UPDATE to ensure all columns exist)
    const alterQuery = `
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS short_description TEXT,
      ADD COLUMN IF NOT EXISTS long_description TEXT,
      ADD COLUMN IF NOT EXISTS projects_count VARCHAR(50),
      ADD COLUMN IF NOT EXISTS accreditation_text VARCHAR(255),
      ADD COLUMN IF NOT EXISTS next_batch_text VARCHAR(100),
      ADD COLUMN IF NOT EXISTS accelerate_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS accelerate_description TEXT,
      ADD COLUMN IF NOT EXISTS accelerate_bullets JSONB,
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS card_image_url TEXT,
      ADD COLUMN IF NOT EXISTS placement_guarantee VARCHAR(100),
      ADD COLUMN IF NOT EXISTS card_features JSONB,
      ADD COLUMN IF NOT EXISTS overview_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS overview_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS overview_description TEXT,
      ADD COLUMN IF NOT EXISTS tech_stack JSONB,
      ADD COLUMN IF NOT EXISTS outcome_title VARCHAR(100),
      ADD COLUMN IF NOT EXISTS outcome_text TEXT,
      ADD COLUMN IF NOT EXISTS overview_image_url TEXT,
      ADD COLUMN IF NOT EXISTS overview_badge_line1 VARCHAR(100),
      ADD COLUMN IF NOT EXISTS overview_badge_line2 VARCHAR(100),
      ADD COLUMN IF NOT EXISTS advantages_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS advantages_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS advantages_description TEXT,
      ADD COLUMN IF NOT EXISTS six_key_features JSONB,
      ADD COLUMN IF NOT EXISTS pathways_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS pathways_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS tailored_pathways JSONB,
      ADD COLUMN IF NOT EXISTS comparison_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS comparison_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS comparison_description TEXT,
      ADD COLUMN IF NOT EXISTS comparison_table JSONB,
      ADD COLUMN IF NOT EXISTS syllabus_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS syllabus_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS syllabus_description TEXT,
      ADD COLUMN IF NOT EXISTS syllabus_pdf_url TEXT,
      ADD COLUMN IF NOT EXISTS curriculum JSONB,
      ADD COLUMN IF NOT EXISTS batches_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS batches_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS batches_description TEXT,
      ADD COLUMN IF NOT EXISTS batch_options JSONB,
      ADD COLUMN IF NOT EXISTS guidance_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS guidance_title VARCHAR(255),
      ADD COLUMN IF NOT EXISTS guidance_description TEXT,
      ADD COLUMN IF NOT EXISTS cert_eyebrow VARCHAR(100),
      ADD COLUMN IF NOT EXISTS cert_heading VARCHAR(255),
      ADD COLUMN IF NOT EXISTS cert_description TEXT,
      ADD COLUMN IF NOT EXISTS cert_image_url TEXT,
      ADD COLUMN IF NOT EXISTS cert_features JSONB;
    `;
    await pool.query(alterQuery);

    // 2. Format JSONB arrays safely
    const formattedBullets = Array.isArray(accelerate_bullets)
      ? JSON.stringify(accelerate_bullets)
      : typeof accelerate_bullets === "string"
      ? accelerate_bullets
      : JSON.stringify([]);

    const formattedTechStack = Array.isArray(tech_stack)
      ? JSON.stringify(tech_stack)
      : typeof tech_stack === "string"
      ? tech_stack
      : JSON.stringify([]);

    const formattedCardFeatures = Array.isArray(card_features)
      ? JSON.stringify(card_features)
      : typeof card_features === "string"
      ? card_features
      : JSON.stringify([]);

    const formattedSixKeyFeatures = Array.isArray(six_key_features)
      ? JSON.stringify(six_key_features)
      : typeof six_key_features === "string"
      ? six_key_features
      : JSON.stringify([]);

    const formattedTailoredPathways = Array.isArray(tailored_pathways)
      ? JSON.stringify(tailored_pathways)
      : typeof tailored_pathways === "string"
      ? tailored_pathways
      : JSON.stringify([]);

    const formattedComparisonTable = Array.isArray(comparison_table)
      ? JSON.stringify(comparison_table)
      : typeof comparison_table === "string"
      ? comparison_table
      : JSON.stringify([]);

    const formattedBatchOptions = Array.isArray(batch_options)
      ? JSON.stringify(batch_options)
      : typeof batch_options === "string"
      ? batch_options
      : JSON.stringify([]);

    const formattedCertFeatures = Array.isArray(cert_features)
      ? JSON.stringify(cert_features)
      : typeof cert_features === "string"
      ? cert_features
      : JSON.stringify([]);

    const formattedCurriculum = Array.isArray(curriculum)
      ? JSON.stringify(curriculum)
      : typeof curriculum === "string"
      ? curriculum
      : JSON.stringify([]);

    // 3. Execute update for all fields across all tabs
    const updateQuery = `
      UPDATE courses
      SET subject = $1,
          title = $2,
          short_description = $3,
          long_description = $4,
          duration_mode = $5,
          projects_count = $6,
          accreditation_text = $7,
          next_batch_text = $8,
          accelerate_heading = $9,
          accelerate_description = $10,
          accelerate_bullets = $11,
          category = $12,
          card_image_url = $13,
          placement_guarantee = $14,
          card_features = $15,
          overview_eyebrow = $16,
          overview_heading = $17,
          overview_description = $18,
          tech_stack = $19,
          outcome_title = $20,
          outcome_text = $21,
          overview_image_url = $22,
          overview_badge_line1 = $23,
          overview_badge_line2 = $24,
          advantages_eyebrow = $25,
          advantages_heading = $26,
          advantages_description = $27,
          six_key_features = $28,
          pathways_eyebrow = $29,
          pathways_heading = $30,
          tailored_pathways = $31,
          comparison_eyebrow = $32,
          comparison_heading = $33,
          comparison_description = $34,
          comparison_table = $35,
          syllabus_eyebrow = $36,
          syllabus_heading = $37,
          syllabus_description = $38,
          syllabus_pdf_url = $39,
          curriculum = $40,
          batches_eyebrow = $41,
          batches_heading = $42,
          batches_description = $43,
          batch_options = $44,
          guidance_eyebrow = $45,
          guidance_title = $46,
          guidance_description = $47,
          cert_eyebrow = $48,
          cert_heading = $49,
          cert_description = $50,
          cert_image_url = $51,
          cert_features = $52
      WHERE id = $53
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [
      subject ?? "",
      title ?? "",
      short_description ?? "",
      long_description ?? "",
      duration_mode ?? "",
      projects_count ?? "",
      accreditation_text ?? "",
      next_batch_text ?? "",
      accelerate_heading ?? "",
      accelerate_description ?? "",
      formattedBullets,
      category ?? "",
      card_image_url ?? "",
      placement_guarantee ?? "",
      formattedCardFeatures,
      overview_eyebrow ?? "",
      overview_heading ?? "",
      overview_description ?? "",
      formattedTechStack,
      outcome_title ?? "",
      outcome_text ?? "",
      overview_image_url ?? "",
      overview_badge_line1 ?? "",
      overview_badge_line2 ?? "",
      advantages_eyebrow ?? "",
      advantages_heading ?? "",
      advantages_description ?? "",
      formattedSixKeyFeatures,
      pathways_eyebrow ?? "",
      pathways_heading ?? "",
      formattedTailoredPathways,
      comparison_eyebrow ?? "",
      comparison_heading ?? "",
      comparison_description ?? "",
      formattedComparisonTable,
      syllabus_eyebrow ?? "",
      syllabus_heading ?? "",
      syllabus_description ?? "",
      syllabus_pdf_url ?? "",
      formattedCurriculum,
      batches_eyebrow ?? "",
      batches_heading ?? "",
      batches_description ?? "",
      formattedBatchOptions,
      guidance_eyebrow ?? "",
      guidance_title ?? "",
      guidance_description ?? "",
      cert_eyebrow ?? "",
      cert_heading ?? "",
      cert_description ?? "",
      cert_image_url ?? "",
      formattedCertFeatures,
      id,
    ]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Course not found to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Course data updated successfully!",
        course: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/admin/courses/[id]] PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update course" },
      { status: 500 }
    );
  }
}
