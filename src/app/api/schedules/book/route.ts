import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { StudentSchedulingService } from "@/backend/services/StudentSchedulingService";
import { StudentAuthPayload } from "@/backend/types/scheduling";

const JWT_SECRET = process.env.JWT_SECRET || "revelation_it_training_jwt_secret_key_2026_secure_random";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { success: false, error: "Authentication required. Please verify your OTP to book." },
        { status: 401 }
      );
    }

    let decoded: StudentAuthPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as StudentAuthPayload;
      if (decoded.role !== "student" || !decoded.email) {
        return NextResponse.json(
          { success: false, error: "Forbidden. Student access required." },
          { status: 403 }
        );
      }
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired session. Please authenticate again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const booking = await StudentSchedulingService.book(decoded.email, body);

    return NextResponse.json(
      {
        success: true,
        message: "Interview booking confirmed successfully.",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to book interview slot." },
      { status }
    );
  }
}
