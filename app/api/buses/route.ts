import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const routeId = searchParams.get("routeId") || undefined;
    const status = searchParams.get("status") || undefined;

    const buses = await dataService.getBuses({ search, routeId, status });

    return NextResponse.json({
      success: true,
      data: buses,
      message: "Buses retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to retrieve buses" },
      },
      { status: 500 }
    );
  }
}
