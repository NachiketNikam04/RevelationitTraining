import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { StudentAuthPayload } from "@/backend/types/scheduling";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("schedule_token")?.value;

    let token: string | undefined;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as StudentAuthPayload;
    if (decoded.role !== "student" || !decoded.email) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      email: decoded.email,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
