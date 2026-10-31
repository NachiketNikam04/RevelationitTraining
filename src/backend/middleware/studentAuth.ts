import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StudentAuthPayload } from "../types/scheduling";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export interface AuthenticatedStudentRequest extends Request {
  student?: StudentAuthPayload;
}

/**
 * Middleware that authenticates incoming requests using a 5-hour Student JWT
 * provided via the Authorization Bearer header or the HTTP-only cookie.
 */
export function verifyStudent(
  req: AuthenticatedStudentRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const cookieHeader = req.headers.cookie;
  const cookieToken =
    (req as any).cookies?.schedule_token ||
    (req as any).cookies?.student_token;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (cookieToken) {
    token = cookieToken;
  } else if (cookieHeader) {
    // Fallback cookie string parsing if cookie-parser is not active
    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, str) => {
      const [k, v] = str.trim().split("=");
      if (k && v) acc[k] = decodeURIComponent(v);
      return acc;
    }, {});
    token = cookies["schedule_token"] || cookies["student_token"];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Authentication required. Please verify your OTP to obtain access.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as StudentAuthPayload;

    if (decoded.role !== "student" || !decoded.email) {
      res.status(403).json({
        success: false,
        error: "Forbidden. Student access privileges required.",
      });
      return;
    }

    req.student = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired session token. Please verify OTP again.",
    });
  }
}
