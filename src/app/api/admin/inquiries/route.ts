import { NextRequest, NextResponse } from "next/server";
import { InquiryController } from "@/backend/controllers/InquiryController";

export async function GET() {
  try {
    const result = await InquiryController.fetchInquiries();
    return NextResponse.json(result.data, { status: result.status });
  } catch (error: any) {
    console.error("[API /api/admin/inquiries] GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    const result = await InquiryController.updateStatus(Number(id), status);
    return NextResponse.json(result.data, { status: result.status });
  } catch (error: any) {
    console.error("[API /api/admin/inquiries] PATCH Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const result = await InquiryController.deleteInquiry(Number(id));
    return NextResponse.json(result.data, { status: result.status });
  } catch (error: any) {
    console.error("[API /api/admin/inquiries] DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry." },
      { status: 500 }
    );
  }
}
