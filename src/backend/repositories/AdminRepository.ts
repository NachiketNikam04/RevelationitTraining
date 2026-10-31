import { pool } from "../config/db";

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at?: Date;
}

export class AdminRepository {
  /**
   * Finds an admin record by username.
   */
  public static async findByUsername(username: string): Promise<AdminUser | null> {
    const query = `SELECT * FROM admins WHERE username = $1 LIMIT 1;`;
    try {
      const result = await pool.query<AdminUser>(query, [username]);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      console.error("[AdminRepository] Error finding admin by username:", error);
      throw error;
    }
  }

  /**
   * Creates a new admin user record.
   */
  public static async createAdmin(
    username: string,
    passwordHash: string
  ): Promise<AdminUser> {
    const query = `
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      RETURNING *;
    `;
    try {
      const result = await pool.query<AdminUser>(query, [username, passwordHash]);
      return result.rows[0];
    } catch (error) {
      console.error("[AdminRepository] Error creating admin:", error);
      throw error;
    }
  }
}
