import jwt from "jsonwebtoken";
import { AllowedEmailRepository } from "../repositories/AllowedEmailRepository";
import { ScheduleOtpRepository } from "../repositories/ScheduleOtpRepository";
import { InterviewBookingRepository } from "../repositories/InterviewBookingRepository";
import { EmailService } from "./EmailService";
import {
  CalendarEvent,
  InterviewBooking,
  StudentBookDTO,
  StudentAuthPayload,
} from "../types/scheduling";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export class StudentSchedulingService {
  /**
   * Validates if an email is authorized, generates a 6-digit OTP,
   * saves it with a 10-minute expiry, and dispatches it via Nodemailer.
   */
  public static async requestOtp(email: string): Promise<{ success: boolean; message: string }> {
    if (!email || !email.trim()) {
      const error: any = new Error("Email address is required.");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const error: any = new Error("Invalid email address format.");
      error.statusCode = 400;
      throw error;
    }

    // 1. Verify existence in allowed_schedule_emails
    const allowed = await AllowedEmailRepository.findByEmail(normalizedEmail);
    if (!allowed) {
      const error: any = new Error(
        "This email is not authorized for interview scheduling. Please contact your coordinator."
      );
      error.statusCode = 403;
      throw error;
    }

    // 2. Generate cryptographically simple 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in database with 10-minute validity
    await ScheduleOtpRepository.createOtp(normalizedEmail, otpCode, 10);

    // 4. Send OTP email via Nodemailer
    const subject = "Your Verification Code for Interview Scheduling - Revelation IT";
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { background-color: #ffffff; max-width: 520px; margin: 0 auto; border-radius: 16px; border: 1px solid #e2e8f0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 12px; margin-bottom: 4px; }
          .subtitle { font-size: 14px; color: #64748b; }
          .otp-container { background: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; border: 1px dashed #cbd5e1; }
          .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #0f172a; font-family: monospace; }
          .expiry { font-size: 13px; color: #e11d48; margin-top: 8px; font-weight: 500; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 class="title">Interview Scheduling Verification</h2>
            <p class="subtitle">Revelation IT Training Placement Cell</p>
          </div>
          <p>Hello,</p>
          <p>You requested a one-time passcode to schedule your company interview. Use the verification code below to authenticate:</p>
          
          <div class="otp-container">
            <div class="otp-code">${otpCode}</div>
            <div class="expiry">Expires in 10 minutes</div>
          </div>

          <p style="font-size: 14px; color: #475569;">If you did not request this verification code, please ignore this email or reach out to our placement support team.</p>
          
          <div class="footer">
            &copy; ${new Date().getFullYear()} Revelation IT Training. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResult = await EmailService.sendNotification(normalizedEmail, subject, html);
    if (!emailResult.success) {
      console.warn(`[StudentSchedulingService] Email dispatch failed: ${emailResult.error}`);
    }

    return {
      success: true,
      message: "A 6-digit verification code has been sent to your email. It will expire in 10 minutes.",
    };
  }

  /**
   * Validates OTP code, marks it used/deleted, and returns a 5-hour signed JWT.
   */
  public static async verifyOtp(
    email: string,
    otpCode: string
  ): Promise<{ success: boolean; token: string; email: string }> {
    if (!email?.trim() || !otpCode?.trim()) {
      const error: any = new Error("Both email and OTP code are required.");
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    // 1. Verify OTP in database (unexpired and matching)
    const validOtpRecord = await ScheduleOtpRepository.findValidOtp(normalizedEmail, cleanOtp);
    if (!validOtpRecord) {
      const error: any = new Error("Invalid or expired OTP code. Please request a new code.");
      error.statusCode = 400;
      throw error;
    }

    // 2. Invalidate / delete OTP immediately so it cannot be reused
    await ScheduleOtpRepository.deleteOtp(normalizedEmail);

    // 3. Issue a JWT token with a 5-hour expiration
    const payload: StudentAuthPayload = {
      email: normalizedEmail,
      role: "student",
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "5h",
    });

    return {
      success: true,
      token,
      email: normalizedEmail,
    };
  }

  /**
   * Fetches public calendar events containing ONLY non-sensitive slot information:
   * student_name, booking_date, start_time, and end_time.
   */
  public static async getCalendarEvents(): Promise<CalendarEvent[]> {
    return await InterviewBookingRepository.findCalendarEvents();
  }

  /**
   * Validates booking parameters, executes the critical slot overlap check,
   * and creates the interview booking record.
   */
  public static async book(
    studentEmail: string,
    dto: StudentBookDTO
  ): Promise<InterviewBooking> {
    const studentName = (dto.student_name || dto.name || "").trim();
    const companyName = (dto.company_name || dto.company || "").trim();
    const bookingDate = (dto.booking_date || dto.date || "").trim();
    const startTime = (dto.start_time || "").trim();
    const endTime = (dto.end_time || "").trim();

    // 1. Required field validations
    if (!studentName) {
      const error: any = new Error("Student name is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!companyName) {
      const error: any = new Error("Company name is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!bookingDate) {
      const error: any = new Error("Booking date is required.");
      error.statusCode = 400;
      throw error;
    }

    if (!startTime || !endTime) {
      const error: any = new Error("Both start_time and end_time are required.");
      error.statusCode = 400;
      throw error;
    }

    // 2. Date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingDate)) {
      const error: any = new Error("Invalid date format. Expected YYYY-MM-DD.");
      error.statusCode = 400;
      throw error;
    }

    // 3. Time ordering validation: start_time < end_time
    const toSeconds = (t: string) => {
      const parts = t.split(":").map(Number);
      return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    };

    if (toSeconds(startTime) >= toSeconds(endTime)) {
      const error: any = new Error("Invalid time slot: start_time must precede end_time.");
      error.statusCode = 400;
      throw error;
    }

    // 4. Double check student authorization
    const isAllowed = await AllowedEmailRepository.findByEmail(studentEmail);
    if (!isAllowed) {
      const error: any = new Error("Your email is no longer in the allowed scheduling list.");
      error.statusCode = 403;
      throw error;
    }

    // 5. CRITICAL OVERLAP CHECK
    // Reject the booking if the requested date matches an existing record AND:
    // (requested_start_time < existing_end_time AND requested_end_time > existing_start_time)
    const hasCollision = await InterviewBookingRepository.checkOverlap(
      bookingDate,
      startTime,
      endTime
    );

    if (hasCollision) {
      const error: any = new Error(
        "The requested time slot overlaps with an existing interview schedule. Please choose a different slot."
      );
      error.statusCode = 409;
      throw error;
    }

    // 6. Insert booking record
    const newBooking = await InterviewBookingRepository.create({
      student_name: studentName,
      student_email: studentEmail.toLowerCase(),
      company_name: companyName,
      booking_date: bookingDate,
      start_time: startTime,
      end_time: endTime,
    });

    // 7. Optional notification email
    const subject = `Interview Confirmed: ${companyName} - ${studentName}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #1e293b;">
        <h2>Interview Slot Confirmed</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>Your interview has been booked successfully with the following details:</p>
        <ul>
          <li><strong>Company:</strong> ${companyName}</li>
          <li><strong>Date:</strong> ${bookingDate}</li>
          <li><strong>Slot:</strong> ${startTime} - ${endTime}</li>
          <li><strong>Registered Email:</strong> ${studentEmail}</li>
        </ul>
        <p>Please make sure you are prepared 10 minutes prior to your scheduled time.</p>
        <p style="margin-top: 20px; font-size: 13px; color: #64748b;">Revelation IT Training Placement Team</p>
      </div>
    `;
    EmailService.sendNotification(studentEmail, subject, html).catch((err) => {
      console.warn("[StudentSchedulingService] Confirmation email warning:", err);
    });

    return newBooking;
  }
}
