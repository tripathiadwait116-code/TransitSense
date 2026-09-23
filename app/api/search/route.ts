import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    if (!q) {
      return NextResponse.json({
        success: true,
        data: { buses: [], routes: [], stops: [] },
      });
    }

    const [allBuses, allRoutes, allStops] = await Promise.all([
      dataService.getBuses({ search: q }),
      dataService.getRoutes(),
      dataService.getStops({ search: q }),
    ]);

    const matchingRoutes = allRoutes.filter(
      (r) =>
        r.routeNumber.toLowerCase().includes(q) ||
        r.routeName.toLowerCase().includes(q) ||
        r.startPoint.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q)
    );

    return NextResponse.json({
      success: true,
      data: {
        buses: allBuses.slice(0, 8),
        routes: matchingRoutes.slice(0, 8),
        stops: allStops.slice(0, 8),
      },
      message: "Search completed successfully",
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
