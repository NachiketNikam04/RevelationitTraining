import { Router } from "express";
import { StudentSchedulingController } from "../controllers/StudentSchedulingController";
import { verifyStudent } from "../middleware/studentAuth";

const router = Router();

/**
 * @route   POST /api/schedules/request-otp
 * @desc    Request a 6-digit OTP for interview scheduling if email is allowed
 * @access  Public
 */
router.post("/request-otp", StudentSchedulingController.requestOtp);

/**
 * @route   POST /api/schedules/verify-otp
 * @desc    Verify OTP and issue 5-hour JWT set as HTTP-only cookie
 * @access  Public
 */
router.post("/verify-otp", StudentSchedulingController.verifyOtp);

/**
 * @route   GET /api/schedules/calendar-events
 * @desc    Public calendar schedule showing ONLY student_name, booking_date, start_time, and end_time
 * @access  Public
 */
router.get("/calendar-events", StudentSchedulingController.getCalendarEvents);

/**
 * @route   POST /api/schedules/book
 * @desc    Book an interview slot with repository overlap validation
 * @access  Protected (5-hour Student JWT)
 */
router.post("/book", verifyStudent, StudentSchedulingController.book);

export default router;
