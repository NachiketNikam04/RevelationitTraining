import { NextResponse } from 'next/server';
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET() {
  try {
    await initDbSchema();
    // Fetch all courses, ordered by newest first
    const query = `
      SELECT id, title, subject, slug, status, created_at 
      FROM courses 
      ORDER BY created_at DESC;
    `;
    const result = await pool.query(query);
    
    return NextResponse.json({ success: true, courses: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDbSchema();
    const body = await request.json();
    const {
      title,
      subject,
      slug,
      status = 'Published',
      short_description,
      long_description,
      duration_mode,
      projects_count,
      accreditation_text,
      next_batch_text,
      accelerate_heading,
      accelerate_description,
      accelerate_bullets,
      category,
      card_image_url,
      placement_guarantee,
      card_features,
      overview_eyebrow,
      overview_heading,
      overview_description,
      tech_stack,
      outcome_title,
      outcome_text,
      overview_image_url,
      overview_badge_line1,
      overview_badge_line2,
      advantages_eyebrow,
      advantages_heading,
      advantages_description,
      six_key_features,
      pathways_eyebrow,
      pathways_heading,
      tailored_pathways,
      comparison_eyebrow,
      comparison_heading,
      comparison_description,
      comparison_table,
      syllabus_eyebrow,
      syllabus_heading,
      syllabus_description,
      syllabus_pdf_url,
      curriculum,
      batches_eyebrow,
      batches_heading,
      batches_description,
      batch_options,
      guidance_eyebrow,
      guidance_title,
      guidance_description,
      cert_eyebrow,
      cert_heading,
      cert_description,
      cert_image_url,
      cert_features,
    } = body;

    const generatedSlug =
      slug ||
      (title
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : `course-${Date.now()}`);

    const formatJson = (val: any) =>
      Array.isArray(val) ? JSON.stringify(val) : typeof val === "string" ? val : JSON.stringify([]);

    const query = `
      INSERT INTO courses (
        title, subject, slug, status,
        short_description, long_description, duration_mode, projects_count, accreditation_text, next_batch_text,
        accelerate_heading, accelerate_description, accelerate_bullets,
        category, card_image_url, placement_guarantee, card_features,
        overview_eyebrow, overview_heading, overview_description, tech_stack, outcome_title, outcome_text,
        overview_image_url, overview_badge_line1, overview_badge_line2,
        advantages_eyebrow, advantages_heading, advantages_description, six_key_features,
        pathways_eyebrow, pathways_heading, tailored_pathways,
        comparison_eyebrow, comparison_heading, comparison_description, comparison_table,
        syllabus_eyebrow, syllabus_heading, syllabus_description, syllabus_pdf_url, curriculum,
        batches_eyebrow, batches_heading, batches_description, batch_options,
        guidance_eyebrow, guidance_title, guidance_description,
        cert_eyebrow, cert_heading, cert_description, cert_image_url, cert_features
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
        $51, $52, $53
      )
      RETURNING *;
    `;

    const result = await pool.query(query, [
      title || "Untitled Course",
      subject || "",
      generatedSlug,
      status,
      short_description || "",
      long_description || "",
      duration_mode || "",
      projects_count || "",
      accreditation_text || "",
      next_batch_text || "",
      accelerate_heading || "",
      accelerate_description || "",
      formatJson(accelerate_bullets),
      category || "",
      card_image_url || "",
      placement_guarantee || "",
      formatJson(card_features),
      overview_eyebrow || "COURSE OVERVIEW",
      overview_heading || "What you will learn & master.",
      overview_description || "",
      formatJson(tech_stack),
      outcome_title || "",
      outcome_text || "",
      overview_image_url || "",
      overview_badge_line1 || "",
      overview_badge_line2 || "",
      advantages_eyebrow || "PROGRAM ADVANTAGES",
      advantages_heading || "Why this is India's most effective QA program.",
      advantages_description || "",
      formatJson(six_key_features),
      pathways_eyebrow || "WHO IS THIS FOR",
      pathways_heading || "Tailored learning tracks for your background.",
      formatJson(tailored_pathways),
      comparison_eyebrow || "WHY CHOOSE US",
      comparison_heading || "The Revelation IT Difference.",
      comparison_description || "",
      formatJson(comparison_table),
      syllabus_eyebrow || "COMPREHENSIVE SYLLABUS",
      syllabus_heading || "Curriculum designed for the modern industry.",
      syllabus_description || "",
      syllabus_pdf_url || "",
      formatJson(curriculum),
      batches_eyebrow || "BATCH TIMINGS & ENROLLMENT",
      batches_heading || "Choose the batch that fits your schedule.",
      batches_description || "",
      formatJson(batch_options),
      guidance_eyebrow || "1-ON-1 CAREER GUIDANCE",
      guidance_title || "Not sure if Software Testing is right for you?",
      guidance_description || "",
      cert_eyebrow || "ACCREDITED & RECOGNIZED",
      cert_heading || "Industry-Recognized QA Certification.",
      cert_description || "",
      cert_image_url || "",
      formatJson(cert_features),
    ]);

    return NextResponse.json({ success: true, course: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating course:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to create course" }, { status: 500 });
  }
}
