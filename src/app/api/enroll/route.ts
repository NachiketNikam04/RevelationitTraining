import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { pool, initDbSchema } from "@/backend/config/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fullName = (body.fullName || body.full_name || body.name || "").trim();
    const email = (body.email || "").trim();
    const phone = (body.phone || "").trim();
    const course = (body.course || body.course_interest || body.batch || "Software Testing & Automation").trim();
    const message = (body.message || "").trim();

    // Validation
    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone / WhatsApp number is required." },
        { status: 400 }
      );
    }

    // 1. Persist lead in PostgreSQL Database (inquiries table)
    try {
      await initDbSchema();
      await pool.query(
        `INSERT INTO inquiries (full_name, email, phone, course_interest, message, status)
         VALUES ($1, $2, $3, $4, $5, 'New')`,
        [fullName, email, phone, course, message]
      );
    } catch (dbError) {
      console.error("[API /api/enroll] Database persistence warning:", dbError);
      // Non-blocking: proceed with SMTP dispatch
    }

    // 2. Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 || true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recipientEmail = "placement@revelationittraining.com";
    const senderEmail = process.env.SMTP_USER || "placement@revelationittraining.com";
    const currentTimestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 3. Construct HTML Email Template
    const mailOptions = {
      from: `"Revelation IT Enrollment" <${senderEmail}>`,
      to: `${recipientEmail}, ${senderEmail}`,
      replyTo: email,
      subject: `🔥 New Batch Enrollment Application: ${fullName} (${course})`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 24px 12px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); }
            .header { background: #0b1120; padding: 28px 24px; text-align: center; }
            .header-logo { color: #ff5722; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
            .header-sub { color: #9ca3af; font-size: 13px; margin: 6px 0 0 0; }
            .body { padding: 32px 24px; color: #1f2937; }
            .lead-pill { display: inline-block; background: #fff7ed; color: #ea580c; font-size: 12px; font-weight: 800; padding: 4px 14px; border-radius: 9999px; border: 1px solid #ffedd5; text-transform: uppercase; margin-bottom: 20px; }
            .table-wrap { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .table-wrap td { padding: 12px 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
            .lbl { color: #6b7280; font-weight: 600; width: 35%; }
            .val { color: #111827; font-weight: 700; }
            .val-hl { color: #ea580c; font-weight: 800; }
            .msg-box { background: #f8fafc; border-left: 4px solid #ff5722; padding: 14px 16px; border-radius: 8px; margin-top: 8px; color: #334155; font-size: 14px; line-height: 1.6; }
            .btn-action { display: inline-block; background: #ff5722; color: #ffffff !important; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; text-decoration: none; margin-top: 24px; }
            .footer { background: #f9fafb; padding: 20px 24px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 class="header-logo">Revelation IT Training</h1>
              <p class="header-sub">Direct Student Batch Enrollment Application</p>
            </div>
            <div class="body">
              <span class="lead-pill">🎯 New Enrollment Application</span>
              <table class="table-wrap">
                <tr>
                  <td class="lbl">Student Name</td>
                  <td class="val">${fullName}</td>
                </tr>
                <tr>
                  <td class="lbl">Phone / WhatsApp</td>
                  <td class="val"><a href="tel:${phone}" style="color: #2563eb; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td class="lbl">Email Address</td>
                  <td class="val"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td class="lbl">Selected Course / Batch</td>
                  <td class="val-hl">${course}</td>
                </tr>
                <tr>
                  <td class="lbl">Application Timestamp</td>
                  <td class="val" style="color: #6b7280; font-weight: normal;">${currentTimestamp}</td>
                </tr>
              </table>

              <div style="margin-top: 22px;">
                <div style="font-size: 12px; font-weight: 800; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Student Message / Requirements:</div>
                <div class="msg-box">
                  ${message ? message.replace(/\n/g, "<br/>") : "<em>No special notes provided.</em>"}
                </div>
              </div>

              <div style="text-align: center; margin-top: 28px;">
                <a class="btn-action" href="mailto:${email}?subject=Confirmation%20of%20Enrollment%20-%20Revelation%20IT%20Training">Reply to Student Email</a>
              </div>
            </div>
            <div class="footer">
              This lead was generated automatically from the Revelation IT Training website modal.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // 4. Dispatch Email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("[API /api/enroll] SMTP credentials missing in environment variables. Email dispatch bypassed.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your enrollment application has been received successfully! Our admissions counselor will contact you shortly.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[API /api/enroll] Submission Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process enrollment application.",
      },
      { status: 500 }
    );
  }
}
