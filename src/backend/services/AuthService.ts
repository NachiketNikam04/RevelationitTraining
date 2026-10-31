import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AdminRepository, AdminUser } from "../repositories/AdminRepository";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export interface AuthSuccessPayload {
  token: string;
  user: {
    id: number;
    username: string;
    role: "admin";
  };
}

export class AuthService {
  /**
   * Verifies admin credentials and returns a signed JWT if valid.
   */
  public static async verifyAdmin(
    username: string,
    plainTextPassword: string
  ): Promise<AuthSuccessPayload | null> {
    if (!username || !plainTextPassword) {
      return null;
    }

    // 1. Fetch the admin from repository
    const admin: AdminUser | null = await AdminRepository.findByUsername(username);
    if (!admin) {
      return null;
    }

    // 2. Verify hashed password with bcryptjs
    const isPasswordValid = await bcrypt.compare(plainTextPassword, admin.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    // 3. Sign JWT token valid for 8 hours
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
    };
  }
}
