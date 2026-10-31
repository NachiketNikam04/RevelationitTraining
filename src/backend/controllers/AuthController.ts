import { AuthService } from "../services/AuthService";

export interface LoginRequestBody {
  username?: string;
  adminId?: string;
  password?: string;
}

export class AuthController {
  /**
   * Handles admin login request verification.
   */
  public static async login(body: LoginRequestBody) {
    const username = body.username || body.adminId;
    const password = body.password;

    if (!username || !password) {
      return {
        status: 400,
        data: {
          success: false,
          error: "Username / Admin ID and password are required.",
        },
      };
    }

    const authResult = await AuthService.verifyAdmin(username, password);

    if (!authResult) {
      return {
        status: 401,
        data: {
          success: false,
          error: "Invalid admin credentials.",
        },
      };
    }

    return {
      status: 200,
      data: {
        success: true,
        message: "Authentication successful.",
        user: authResult.user,
      },
      token: authResult.token,
    };
  }
}
