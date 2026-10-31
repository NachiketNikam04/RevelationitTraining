import { NextRequest, NextResponse } from "next/server";
import { AllowedEmailService } from "@/backend/services/AllowedEmailService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const emails = await AllowedEmailService.getAllEmails();
    return NextResponse.json({ success: true, data: emails }, { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch allowed emails." },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    const newRecord = await AllowedEmailService.addEmail(email);
    return NextResponse.json(
      {
        success: true,
        message: "Email successfully added to allowed scheduling list.",
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add email." },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Email record ID is required." },
        { status: 400 }
      );
    }

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
