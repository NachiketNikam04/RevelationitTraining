import { pool, initDbSchema } from "../config/db";
import { AllowedScheduleEmail } from "../types/scheduling";

export class AllowedEmailRepository {
  /**
   * Retrieves all allowed student scheduling emails ordered by creation date.
   */
  public static async findAll(): Promise<AllowedScheduleEmail[]> {
    await initDbSchema();
    const query = `
      SELECT id, email, created_at 
      FROM allowed_schedule_emails 
      ORDER BY created_at DESC;
    `;
    const result = await pool.query<AllowedScheduleEmail>(query);
    return result.rows;
  }

  /**
   * Finds an allowed email record by email address (case-insensitive).
   */
  public static async findByEmail(email: string): Promise<AllowedScheduleEmail | null> {
    await initDbSchema();
    const query = `
      SELECT id, email, created_at 
      FROM allowed_schedule_emails 
      WHERE LOWER(email) = LOWER($1) 
      LIMIT 1;
    `;
    const result = await pool.query<AllowedScheduleEmail>(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Finds an allowed email record by its primary key ID.
   */
  public static async findById(id: number): Promise<AllowedScheduleEmail | null> {
    await initDbSchema();
    const query = `
      SELECT id, email, created_at 
      FROM allowed_schedule_emails 
      WHERE id = $1 
      LIMIT 1;
    `;
    const result = await pool.query<AllowedScheduleEmail>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Inserts a new allowed student email address (stored lowercased).
   */
  public static async create(email: string): Promise<AllowedScheduleEmail> {
    await initDbSchema();
    const query = `
      INSERT INTO allowed_schedule_emails (email)
      VALUES (LOWER($1))
      RETURNING id, email, created_at;
    `;
    const result = await pool.query<AllowedScheduleEmail>(query, [email]);
    return result.rows[0];
  }

  /**
   * Deletes an email record by its primary key ID.
   */
  public static async deleteById(id: number): Promise<boolean> {
    await initDbSchema();
    const query = `
      DELETE FROM allowed_schedule_emails 
      WHERE id = $1 
      RETURNING id;
    `;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Deletes an email record by its email string (case-insensitive).
   */
  public static async deleteByEmail(email: string): Promise<boolean> {
    await initDbSchema();
    const query = `
      DELETE FROM allowed_schedule_emails 
      WHERE LOWER(email) = LOWER($1) 
      RETURNING id;
    `;
    const result = await pool.query(query, [email]);
    return (result.rowCount ?? 0) > 0;
  }
}
