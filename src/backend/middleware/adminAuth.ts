import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export interface AuthenticatedAdminRequest extends Request {
  admin?: {
    id: number;
    username: string;
    role: string;
  };
}

export function verifyAdmin(
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const cookieToken = (req as any).cookies?.admin_token;

  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (cookieToken) {
    token = cookieToken;
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: "Authentication required. Bearer token missing in Authorization header.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== "admin") {
      res.status(403).json({
        success: false,
        error: "Forbidden. Admin privileges required.",
      });
      return;
    }

    req.admin = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: "Invalid or expired authorization token.",
    });
  }
}
