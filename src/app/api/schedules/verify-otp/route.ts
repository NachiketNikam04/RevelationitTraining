import { NextRequest, NextResponse } from "next/server";
import { StudentSchedulingService } from "@/backend/services/StudentSchedulingService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;
    const code = body.otp || body.otp_code;

    const result = await StudentSchedulingService.verifyOtp(email, code);

    const response = NextResponse.json(
      {
        success: true,
        message: "OTP successfully verified.",
        token: result.token,
        email: result.email,
        expiresIn: "5h",
      },
      { status: 200 }
    );

    // Set 5-hour HTTP-only cookie
    response.cookies.set({
      name: "schedule_token",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 60, // 5 hours in seconds
      path: "/",
    });

    return response;
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP code." },
      { status }
    );
  }
}
