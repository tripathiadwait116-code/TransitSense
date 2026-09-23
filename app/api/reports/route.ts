import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";
import { reportCreateSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const reports = await dataService.getReports();
    return NextResponse.json({
      success: true,
      data: reports,
      message: "Reports retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const parsed = reportCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0]?.message || "Invalid report data",
          },
        },
        { status: 400 }
      );
    }

    const { category, busNumber, routeId, description, contactEmail } = parsed.data;

    const report = await dataService.createReport({
      userId: session?.id || null,
      category,
      busNumber,
      routeId,
      description,
      contactEmail: contactEmail || (session?.email ?? null),
    });

    return NextResponse.json({
      success: true,
      data: report,
      message: "Grievance report submitted successfully. Tracking Reference: " + report.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message },
      },
      { status: 500 }
    );
  }
}
