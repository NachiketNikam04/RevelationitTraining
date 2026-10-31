import { NextRequest, NextResponse } from "next/server";
import { InquiryController } from "@/backend/controllers/InquiryController";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await InquiryController.submitInquiry(body);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error: any) {
    console.error("[API /api/inquiries] Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 500 }
    );
  }
}
