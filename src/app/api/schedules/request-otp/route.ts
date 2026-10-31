import { NextRequest, NextResponse } from "next/server";
import { StudentSchedulingService } from "@/backend/services/StudentSchedulingService";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    const result = await StudentSchedulingService.requestOtp(email);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process OTP request." },
      { status }
    );
  }
}
