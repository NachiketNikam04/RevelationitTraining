import { NextRequest, NextResponse } from "next/server";
import { AllowedEmailService } from "@/backend/services/AllowedEmailService";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await AllowedEmailService.deleteEmail(id);
    return NextResponse.json(
      { success: true, message: "Allowed email successfully removed." },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete email record." },
      { status }
    );
  }
}
