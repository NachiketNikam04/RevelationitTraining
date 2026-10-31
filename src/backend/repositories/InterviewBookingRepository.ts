import { pool, initDbSchema } from "../config/db";
import {
  InterviewBooking,
  CalendarEvent,
  CreateBookingDTO,
  UpdateBookingDTO,
  BookingFilters,
} from "../types/scheduling";

export class InterviewBookingRepository {
  /**
   * Retrieves all interview bookings, optionally filtered by date or email.
   */
  public static async findAll(filters?: BookingFilters): Promise<InterviewBooking[]> {
    await initDbSchema();

    let query = `
      SELECT id, student_name, student_email, company_name, 
             TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
             start_time, end_time, created_at
      FROM interview_bookings
      WHERE 1=1
    `;
    const values: any[] = [];

    if (filters?.date) {
      values.push(filters.date);
      query += ` AND booking_date = $${values.length}`;
    }

    if (filters?.email) {
      values.push(filters.email.toLowerCase());
      query += ` AND LOWER(student_email) = $${values.length}`;
    }

    query += ` ORDER BY booking_date DESC, start_time ASC;`;

    const result = await pool.query<InterviewBooking>(query, values);
    return result.rows;
  }

  /**
   * Retrieves a single booking by ID.
   */
  public static async findById(id: number): Promise<InterviewBooking | null> {
    await initDbSchema();

    const query = `
      SELECT id, student_name, student_email, company_name, 
             TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date,
             start_time, end_time, created_at
      FROM interview_bookings
      WHERE id = $1
      LIMIT 1;
    `;
    const result = await pool.query<InterviewBooking>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Fetches public calendar events containing ONLY non-sensitive slot information:
   * student_name, booking_date, start_time, and end_time.
   */
  public static async findCalendarEvents(): Promise<CalendarEvent[]> {
    await initDbSchema();

    const query = `
      SELECT student_name, 
             TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date, 
             start_time, 
             end_time
      FROM interview_bookings
      ORDER BY booking_date ASC, start_time ASC;
    `;
    const result = await pool.query<CalendarEvent>(query);
    return result.rows;
  }

  /**
   * Checks for overlapping times before booking insertion.
   * Rejects the booking if the requested date matches an existing record AND:
   * (requested_start_time < existing_end_time AND requested_end_time > existing_start_time)
   */
  public static async checkOverlap(
    date: string,
    requestedStartTime: string,
    requestedEndTime: string,
    excludeBookingId?: number
  ): Promise<boolean> {
    await initDbSchema();

    const query = `
      SELECT id, student_name, booking_date, start_time, end_time 
      FROM interview_bookings
      WHERE booking_date = $1
        AND ($2::TIME < end_time AND $3::TIME > start_time)
        AND ($4::INT IS NULL OR id != $4)
      LIMIT 1;
    `;
    const values = [date, requestedStartTime, requestedEndTime, excludeBookingId || null];
    const result = await pool.query(query, values);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Checks for overlapping interview bookings for the same date and time range.
   * Two slots (S1, E1) and (S2, E2) overlap if: NOT (E1 <= S2 OR S1 >= E2)
   */
  public static async hasSlotCollision(
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: number
  ): Promise<boolean> {
    await initDbSchema();

    const query = `
      SELECT id FROM interview_bookings
      WHERE booking_date = $1
        AND NOT (end_time <= $2::TIME OR start_time >= $3::TIME)
        AND ($4::INT IS NULL OR id != $4)
      LIMIT 1;
    `;
    const result = await pool.query(query, [date, startTime, endTime, excludeId || null]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Inserts a new booking.
   */
  public static async create(data: CreateBookingDTO): Promise<InterviewBooking> {
    await initDbSchema();

    const query = `
      INSERT INTO interview_bookings 
        (student_name, student_email, company_name, booking_date, start_time, end_time)
      VALUES 
        ($1, LOWER($2), $3, $4, $5, $6)
      RETURNING id, student_name, student_email, company_name, 
                TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date, 
                start_time, end_time, created_at;
    `;
    const values = [
      data.student_name,
      data.student_email,
      data.company_name,
      data.booking_date,
      data.start_time,
      data.end_time,
    ];
    const result = await pool.query<InterviewBooking>(query, values);
    return result.rows[0];
  }

  /**
   * Updates an existing interview booking.
   */
  public static async update(id: number, data: UpdateBookingDTO): Promise<InterviewBooking | null> {
    await initDbSchema();

    const query = `
      UPDATE interview_bookings
      SET 
        student_name = COALESCE($1, student_name),
        student_email = COALESCE(LOWER($2), student_email),
        company_name = COALESCE($3, company_name),
        booking_date = COALESCE($4, booking_date),
        start_time = COALESCE($5, start_time),
        end_time = COALESCE($6, end_time)
      WHERE id = $7
      RETURNING id, student_name, student_email, company_name, 
                TO_CHAR(booking_date, 'YYYY-MM-DD') AS booking_date, 
                start_time, end_time, created_at;
    `;
    const values = [
      data.student_name || null,
      data.student_email || null,
      data.company_name || null,
      data.booking_date || null,
      data.start_time || null,
      data.end_time || null,
      id,
    ];
    const result = await pool.query<InterviewBooking>(query, values);
    return result.rows[0] || null;
  }

  /**
   * Deletes a booking by ID.
   */
  public static async deleteById(id: number): Promise<boolean> {
    await initDbSchema();

    const query = `
      DELETE FROM interview_bookings 
      WHERE id = $1 
      RETURNING id;
    `;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
