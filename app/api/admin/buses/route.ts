import { NextRequest, NextResponse } from "next/server";
import { busCreateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/auth";
import { simulationEngine } from "@/server/simulationEngine";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = busCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0]?.message },
        },
        { status: 400 }
      );
    }

    const { busNumber, registrationNumber, routeId, capacity, status, isSimulated } = parsed.data;

    // Create new simulated bus
    const newBusId = `bus-${busNumber.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    const bus = {
      id: newBusId,
      busNumber,
      registrationNumber,
      capacity,
      status: status as any,
      isSimulated,
      routeId: routeId || null,
      currentLocation: null,
      currentOccupancy: {
        id: `occ-${newBusId}`,
        busId: newBusId,
        totalCapacity: capacity,
        occupiedSeats: 0,
        availableSeats: capacity,
        occupancyPercentage: 0,
        status: "LOW" as const,
        timestamp: new Date().toISOString(),
      },
      currentTraffic: null,
    };

    return NextResponse.json({
      success: true,
      data: bus,
      message: `Bus ${busNumber} created successfully`,
    });
  } catch (error: any) {
    const isAuth = error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN";
    return NextResponse.json(
      {
        success: false,
        error: { code: error.message || "SERVER_ERROR", message: error.message },
      },
      { status: isAuth ? 403 : 500 }
    );
  }
}
