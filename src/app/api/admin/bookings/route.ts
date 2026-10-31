import { NextRequest, NextResponse } from "next/server";
import { InterviewBookingService } from "@/backend/services/InterviewBookingService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || undefined;
    const email = searchParams.get("student_email") || undefined;

    const bookings = await InterviewBookingService.getAllBookings({ date, email });
    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch bookings." },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newBooking = await InterviewBookingService.createBooking(body);
    return NextResponse.json(
      {
        success: true,
        message: "Interview booking successfully created.",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create booking." },
      { status }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required." },
        { status: 400 }
      );
    }

    await InterviewBookingService.deleteBooking(parseInt(id, 10));
    return NextResponse.json(
      { success: true, message: "Interview booking successfully cancelled/deleted." },
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
