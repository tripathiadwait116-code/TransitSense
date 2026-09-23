import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const radiusStr = searchParams.get("radiusKm");

    const lat = latStr ? parseFloat(latStr) : undefined;
    const lng = lngStr ? parseFloat(lngStr) : undefined;
    const radiusKm = radiusStr ? parseFloat(radiusStr) : undefined;

    const stops = await dataService.getStops({ search, lat, lng, radiusKm });

    return NextResponse.json({
      success: true,
      data: stops,
      message: "Stops retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to retrieve stops" },
      },
      { status: 500 }
    );
  }
}
