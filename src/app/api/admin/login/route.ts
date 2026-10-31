import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/backend/controllers/AuthController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await AuthController.login(body);

    if (result.status !== 200 || !result.token) {
      return NextResponse.json(result.data, { status: result.status });
    }

    // Create 200 response with secure HTTP-only cookie
    const response = NextResponse.json(result.data, { status: 200 });

    response.cookies.set({
      name: "admin_session",
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
    });

    return response;
  } catch (error: any) {
    console.error("[API /api/admin/login] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred during login.",
      },
      { status: 500 }
    );
  }
}
