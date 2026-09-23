import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const route = await dataService.getRouteById(params.id);

    if (!route) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ROUTE_NOT_FOUND",
            message: `Route '${params.id}' was not found`,
          },
        },
        { status: 404 }
      );
    }

    const busesOnRoute = await dataService.getBuses({ routeId: route.id });

    return NextResponse.json({
      success: true,
      data: {
        ...route,
        buses: busesOnRoute,
      },
      message: "Route details retrieved successfully",
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
