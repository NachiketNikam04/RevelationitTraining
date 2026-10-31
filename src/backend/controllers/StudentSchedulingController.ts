import { Request, Response } from "express";
import { StudentSchedulingService } from "../services/StudentSchedulingService";
import { AuthenticatedStudentRequest } from "../middleware/studentAuth";

export class StudentSchedulingController {
  /**
   * POST /api/schedules/request-otp
   * Accepts email, verifies allowed status, generates 6-digit OTP, stores with 10-minute expiry, and emails it.
   */
  public static async requestOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await StudentSchedulingService.requestOtp(email);
      res.status(200).json(result);
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: error.message || "Failed to process OTP request.",
      });
    }
  }

  /**
   * POST /api/schedules/verify-otp
   * Validates OTP code, issues a 5-hour JWT, and sets it as an HTTP-only cookie.
   */
  public static async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, otp_code } = req.body;
      const code = otp || otp_code;

      const result = await StudentSchedulingService.verifyOtp(email, code);

      // Set JWT as an HTTP-only cookie with a 5-hour duration
      res.cookie("schedule_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "OTP successfully verified.",
        token: result.token,
        email: result.email,
        expiresIn: "5h",
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: error.message || "Failed to verify OTP code.",
      });
    }
  }

  /**
   * GET /api/schedules/calendar-events
   * Returns all bookings, strictly masking sensitive student email and company info.
   * ONLY exposes student_name, booking_date, start_time, and end_time.
   */
  public static async getCalendarEvents(req: Request, res: Response): Promise<void> {
    try {
      const events = await StudentSchedulingService.getCalendarEvents();
      res.status(200).json({
        success: true,
        data: events,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: error.message || "Failed to fetch calendar events.",
      });
    }
  }

  /**
   * POST /api/schedules/book
   * Protected by 5-hour JWT. Validates overlap in repository and creates interview booking.
   */
  public static async book(req: AuthenticatedStudentRequest, res: Response): Promise<void> {
    try {
      const studentEmail = req.student?.email;
      if (!studentEmail) {
        res.status(401).json({
          success: false,
          error: "Unauthorized student session.",
        });
        return;
      }

      const booking = await StudentSchedulingService.book(studentEmail, req.body);

      res.status(201).json({
        success: true,
        message: "Interview booking confirmed successfully.",
        data: booking,
      });
    } catch (error: any) {
      const status = error.statusCode || 500;
      res.status(status).json({
        success: false,
        error: error.message || "Failed to book interview slot.",
      });
    }
  }
}
