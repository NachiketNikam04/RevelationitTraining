import { pool, initDbSchema } from "../config/db";
import { ScheduleOtp } from "../types/scheduling";

export class ScheduleOtpRepository {
  /**
   * Generates and stores a new OTP for the allowed email with a 10-minute expiration.
   * Cleans up any prior OTPs for the same email.
   */
  public static async createOtp(
    email: string,
    otpCode: string,
    expiryMinutes: number = 10
  ): Promise<ScheduleOtp> {
    await initDbSchema();

    const normalizedEmail = email.trim().toLowerCase();

    // Invalidate/delete any previous OTP records for this email
    await pool.query(
      "DELETE FROM schedule_otps WHERE LOWER(email) = $1;",
      [normalizedEmail]
    );

    // Insert new OTP with parameterised interval
    const query = `
      INSERT INTO schedule_otps (email, otp_code, expires_at)
      VALUES ($1, $2, NOW() + ($3 || ' minutes')::INTERVAL)
      RETURNING id, email, otp_code, expires_at, created_at;
    `;
    const result = await pool.query<ScheduleOtp>(query, [
      normalizedEmail,
      otpCode,
      expiryMinutes.toString(),
    ]);

    return result.rows[0];
  }

  /**
   * Finds an active, unexpired OTP for the provided email and OTP code.
   */
  public static async findValidOtp(
    email: string,
    otpCode: string
  ): Promise<ScheduleOtp | null> {
    await initDbSchema();

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    const query = `
      SELECT id, email, otp_code, expires_at, created_at
      FROM schedule_otps
      WHERE LOWER(email) = $1
        AND otp_code = $2
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await pool.query<ScheduleOtp>(query, [normalizedEmail, cleanOtp]);
    return result.rows[0] || null;
  }

  /**
   * Deletes all OTPs associated with the specified email (used upon successful verification).
   */
  public static async deleteOtp(email: string): Promise<void> {
    await initDbSchema();

    const normalizedEmail = email.trim().toLowerCase();
    await pool.query("DELETE FROM schedule_otps WHERE LOWER(email) = $1;", [
      normalizedEmail,
    ]);
  }
}
