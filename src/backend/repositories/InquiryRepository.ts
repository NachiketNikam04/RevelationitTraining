import { pool, initDbSchema } from "../config/db";

export interface Inquiry {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  course_interest?: string | null;
  message?: string | null;
  status: string;
  created_at: Date;
}

export interface CreateInquiryDTO {
  full_name: string;
  email: string;
  phone?: string;
  course_interest?: string;
  message?: string;
  status?: string;
}

export class InquiryRepository {
  /**
   * Inserts a new record into the inquiries table and returns it.
   */
  public static async createInquiry(data: CreateInquiryDTO): Promise<Inquiry> {
    await initDbSchema();
    const query = `
      INSERT INTO inquiries (full_name, email, phone, course_interest, message, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      data.full_name,
      data.email,
      data.phone || null,
      data.course_interest || "General Inquiry",
      data.message || null,
      data.status || "New",
    ];

    try {
      const result = await pool.query<Inquiry>(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("[InquiryRepository] Error creating inquiry:", error);
      throw error;
    }
  }

  /**
   * Selects all records ordered by created_at DESC.
   */
  public static async getAllInquiries(): Promise<Inquiry[]> {
    await initDbSchema();
    const query = `
      SELECT * FROM inquiries 
      ORDER BY created_at DESC;
    `;

    try {
      const result = await pool.query<Inquiry>(query);
      return result.rows;
    } catch (error) {
      console.error("[InquiryRepository] Error fetching all inquiries:", error);
      throw error;
    }
  }

  /**
   * Updates status of an inquiry record.
   */
  public static async updateStatus(id: number, status: string): Promise<Inquiry | null> {
    await initDbSchema();
    const query = `
      UPDATE inquiries
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;

    try {
      const result = await pool.query<Inquiry>(query, [status, id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[InquiryRepository] Error updating inquiry status:", error);
      throw error;
    }
  }

  /**
   * Deletes an inquiry record by ID.
   */
  public static async deleteInquiry(id: number): Promise<boolean> {
    await initDbSchema();
    const query = `DELETE FROM inquiries WHERE id = $1;`;
    try {
      const result = await pool.query(query, [id]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("[InquiryRepository] Error deleting inquiry:", error);
      throw error;
    }
  }
}
