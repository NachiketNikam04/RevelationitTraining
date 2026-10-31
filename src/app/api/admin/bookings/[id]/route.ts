import { NextRequest, NextResponse } from "next/server";
import { InterviewBookingService } from "@/backend/services/InterviewBookingService";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const booking = await InterviewBookingService.getBookingById(parseInt(id, 10));
    return NextResponse.json({ success: true, data: booking }, { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch booking." },
      { status }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = await InterviewBookingService.updateBooking(parseInt(id, 10), body);
    return NextResponse.json(
      {
        success: true,
        message: "Interview booking successfully updated.",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update booking." },
      { status }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await InterviewBookingService.deleteBooking(parseInt(id, 10));
    return NextResponse.json(
      { success: true, message: "Interview booking successfully deleted." },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete booking." },
      { status }
    );
  }
}
