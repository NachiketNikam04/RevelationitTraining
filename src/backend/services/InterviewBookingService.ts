import { InterviewBookingRepository } from "../repositories/InterviewBookingRepository";
import { AllowedEmailRepository } from "../repositories/AllowedEmailRepository";
import {
  InterviewBooking,
  CreateBookingDTO,
  UpdateBookingDTO,
  BookingFilters,
} from "../types/scheduling";

export class InterviewBookingService {
  /**
   * Retrieves all bookings with optional date or email filters.
   */
  public static async getAllBookings(filters?: BookingFilters): Promise<InterviewBooking[]> {
    return await InterviewBookingRepository.findAll(filters);
  }

  /**
   * Retrieves a single booking by ID.
   */
  public static async getBookingById(id: number): Promise<InterviewBooking> {
    const booking = await InterviewBookingRepository.findById(id);
    if (!booking) {
      const error: any = new Error(`Interview booking with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }
    return booking;
  }

  /**
   * Validates and creates a manual interview booking.
   */
  public static async createBooking(data: CreateBookingDTO): Promise<InterviewBooking> {
    const { student_name, student_email, company_name, booking_date, start_time, end_time } = data;

    // 1. Required field validations
    if (
      !student_name?.trim() ||
      !student_email?.trim() ||
      !company_name?.trim() ||
      !booking_date?.trim() ||
      !start_time?.trim() ||
      !end_time?.trim()
    ) {
      const error: any = new Error(
        "All booking fields (student_name, student_email, company_name, booking_date, start_time, end_time) are required."
      );
      error.statusCode = 400;
      throw error;
    }

    // 2. Validate time logical order
    if (start_time >= end_time) {
      const error: any = new Error("Interview start_time must be strictly before end_time.");
      error.statusCode = 400;
      throw error;
    }

    // 3. Foreign key rule: student_email must be authorized in allowed_schedule_emails
    const isAllowed = await AllowedEmailRepository.findByEmail(student_email.trim());
    if (!isAllowed) {
      const error: any = new Error(
        `Student email '${student_email}' is not in the allowed scheduling list.`
      );
      error.statusCode = 400;
      throw error;
    }

    // 4. Check for overlapping slot collision on booking date
    const hasCollision = await InterviewBookingRepository.hasSlotCollision(
      booking_date,
      start_time,
      end_time
    );
    if (hasCollision) {
      const error: any = new Error(
        `Timeslot ${start_time} - ${end_time} on ${booking_date} is already booked.`
      );
      error.statusCode = 409;
      throw error;
    }

    return await InterviewBookingRepository.create({
      student_name: student_name.trim(),
      student_email: student_email.trim().toLowerCase(),
      company_name: company_name.trim(),
      booking_date,
      start_time,
      end_time,
    });
  }

  /**
   * Updates an existing interview booking.
   */
  public static async updateBooking(id: number, data: UpdateBookingDTO): Promise<InterviewBooking> {
    const existing = await InterviewBookingRepository.findById(id);
    if (!existing) {
      const error: any = new Error(`Interview booking with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }

    const targetDate = data.booking_date || existing.booking_date;
    const targetStart = data.start_time || existing.start_time;
    const targetEnd = data.end_time || existing.end_time;

    if (targetStart >= targetEnd) {
      const error: any = new Error("Interview start_time must precede end_time.");
      error.statusCode = 400;
      throw error;
    }

    if (data.student_email) {
      const isAllowed = await AllowedEmailRepository.findByEmail(data.student_email.trim());
      if (!isAllowed) {
        const error: any = new Error(
          `Student email '${data.student_email}' is not in the allowed scheduling list.`
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // Check collision if date/time changed
    const hasCollision = await InterviewBookingRepository.hasSlotCollision(
      targetDate,
      targetStart,
      targetEnd,
      id
    );
    if (hasCollision) {
      const error: any = new Error(
        `Timeslot ${targetStart} - ${targetEnd} on ${targetDate} is already booked.`
      );
      error.statusCode = 409;
      throw error;
    }

    const updated = await InterviewBookingRepository.update(id, data);
    return updated!;
  }

  /**
   * Deletes a booking by ID.
   */
  public static async deleteBooking(id: number): Promise<void> {
    const deleted = await InterviewBookingRepository.deleteById(id);
    if (!deleted) {
      const error: any = new Error(`Interview booking with ID ${id} not found.`);
      error.statusCode = 404;
      throw error;
    }
  }
}
