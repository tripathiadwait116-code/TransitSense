import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";
import { calculateETA } from "@/server/etaEngine";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bus = await dataService.getBusById(params.id);

    if (!bus) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BUS_NOT_FOUND", message: "Bus not found" },
        },
        { status: 404 }
      );
    }

    const route = bus.routeId ? await dataService.getRouteById(bus.routeId) : null;
    const distanceKm = bus.currentLocation?.distanceToNextKm || 2.0;
    const speed = bus.currentLocation?.speed || 28;
    const trafficCondition = route?.trafficCondition || "LOW";

    const eta = calculateETA({
      distanceKm,
      currentSpeedKmh: speed,
      trafficCondition,
      trafficDelayMinutes: route?.delayMinutes,
    });

    return NextResponse.json({
      success: true,
      data: {
        busId: bus.id,
        busNumber: bus.busNumber,
        nextStopName: bus.currentLocation?.nextStopName || "Next Transit Stop",
        distanceToNextKm: distanceKm,
        etaMinutes: eta.estimatedMinutes,
        trafficDelayMinutes: eta.trafficDelayMinutes,
        trafficCondition,
        isSimulated: true,
        calculationDetails: eta,
      },
      message: "ETA calculated successfully",
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
