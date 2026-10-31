import { NextRequest, NextResponse } from "next/server";
import { pool, initDbSchema } from "@/backend/config/db";
import fs from "fs";
import path from "path";

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
    console.error("[API /api/admin/companies] GET Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDbSchema();

    let companyName = "Hiring Partner";
    let logoUrl = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      companyName = (formData.get("company_name") as string) || "Hiring Partner";
      const directLogoUrl = formData.get("logo_url") as string | null;

      if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
        // Destination Directory in public/uploads/companies
        const uploadDir = path.join(process.cwd(), "public", "uploads", "companies");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        // Generate safe unique filename
        const originalName = file.name || "logo.png";
        const ext = path.extname(originalName) || ".png";
        const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueFilename = `${Date.now()}-${baseName}${ext}`;
        const fullFilePath = path.join(uploadDir, uniqueFilename);

        // Write file to filesystem
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(fullFilePath, buffer);

        // Relative web path for the browser
        logoUrl = `/uploads/companies/${uniqueFilename}`;
      } else if (directLogoUrl && directLogoUrl.trim()) {
        logoUrl = directLogoUrl.trim();
      } else {
        return NextResponse.json(
          { success: false, error: "Please select an image file to upload." },
          { status: 400 }
        );
      }
    } else {
      // JSON payload support
      const body = await request.json();
      companyName = body.company_name || "Hiring Partner";
      logoUrl = body.logo_url || "";

      if (!logoUrl) {
        return NextResponse.json(
          { success: false, error: "Logo URL or image file is required." },
          { status: 400 }
        );
      }
    }

    // Save record to database
    const query = `
      INSERT INTO companies (company_name, logo_url)
      VALUES ($1, $2)
      RETURNING id, company_name, logo_url, created_at;
    `;
    const result = await pool.query(query, [companyName.trim(), logoUrl.trim()]);

    return NextResponse.json(
      { success: true, company: result.rows[0] },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/admin/companies] POST Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to upload company logo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await initDbSchema();

    let id: string | number | null = null;
    let companyName: string | null = null;
    let newLogoUrl: string | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      id = formData.get("id") as string;
      companyName = formData.get("company_name") as string | null;
      const file = formData.get("file") as File | null;
      const directLogoUrl = formData.get("logo_url") as string | null;

      if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "companies");
        await fs.promises.mkdir(uploadDir, { recursive: true });

        const originalName = file.name || "logo.png";
        const ext = path.extname(originalName) || ".png";
        const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueFilename = `${Date.now()}-${baseName}${ext}`;
        const fullFilePath = path.join(uploadDir, uniqueFilename);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.promises.writeFile(fullFilePath, buffer);

        newLogoUrl = `/uploads/companies/${uniqueFilename}`;
      } else if (directLogoUrl && directLogoUrl.trim()) {
        newLogoUrl = directLogoUrl.trim();
      }
    } else {
      const body = await request.json();
      id = body.id;
      companyName = body.company_name;
      newLogoUrl = body.logo_url;
    }

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Valid company ID is required for updates." },
        { status: 400 }
      );
    }

    // Check existing company
    const existing = await pool.query("SELECT * FROM companies WHERE id = $1 LIMIT 1;", [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Company record not found." },
        { status: 404 }
      );
    }

    const currentCompany = existing.rows[0];
    const finalCompanyName = companyName?.trim() || currentCompany.company_name;
    const finalLogoUrl = newLogoUrl?.trim() || currentCompany.logo_url;

    // If new logo was uploaded, remove old local file if different
    if (
      newLogoUrl &&
      currentCompany.logo_url &&
      currentCompany.logo_url !== newLogoUrl &&
      currentCompany.logo_url.startsWith("/uploads/companies/")
    ) {
      const oldDiskPath = path.join(process.cwd(), "public", currentCompany.logo_url);
      if (fs.existsSync(oldDiskPath)) {
        try {
          await fs.promises.unlink(oldDiskPath);
        } catch (unlinkErr) {
          console.warn("Could not remove old logo file:", unlinkErr);
        }
      }
    }

    const updateQuery = `
      UPDATE companies
      SET company_name = $1, logo_url = $2
      WHERE id = $3
      RETURNING id, company_name, logo_url, created_at;
    `;
    const result = await pool.query(updateQuery, [finalCompanyName, finalLogoUrl, id]);

    return NextResponse.json(
      { success: true, company: result.rows[0] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/admin/companies] PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await initDbSchema();
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // Ignore JSON parse errors if body is empty
      }
    }

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, error: "Valid company ID is required." },
        { status: 400 }
      );
    }

    // Fetch existing company record to locate file
    const existing = await pool.query("SELECT * FROM companies WHERE id = $1 LIMIT 1;", [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Company record not found." },
        { status: 404 }
      );
    }

    const company = existing.rows[0];
    const logoUrl = company.logo_url;

    // Remove local file if it resides in /uploads/companies
    if (logoUrl && typeof logoUrl === "string" && logoUrl.startsWith("/uploads/companies/")) {
      const diskPath = path.join(process.cwd(), "public", logoUrl);
      if (fs.existsSync(diskPath)) {
        try {
          await fs.promises.unlink(diskPath);
        } catch (unlinkErr) {
          console.warn("Could not delete file from disk:", diskPath, unlinkErr);
        }
      }
    }

    // Delete record from PostgreSQL
    await pool.query("DELETE FROM companies WHERE id = $1;", [id]);

    return NextResponse.json(
      { success: true, message: "Company logo deleted successfully." },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[API /api/admin/companies] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete company" },
      { status: 500 }
    );
  }
}
