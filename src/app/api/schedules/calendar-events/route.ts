import { NextResponse } from "next/server";
import { StudentSchedulingService } from "@/backend/services/StudentSchedulingService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await StudentSchedulingService.getCalendarEvents();
    return NextResponse.json(
      {
        success: true,
        data: events,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch calendar events." },
      { status }
    );
  }
}
