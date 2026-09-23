import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

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

    return NextResponse.json({
      success: true,
      data: bus.currentOccupancy || {
        busId: bus.id,
        totalCapacity: bus.capacity,
        occupiedSeats: Math.round(bus.capacity * 0.5),
        availableSeats: Math.round(bus.capacity * 0.5),
        occupancyPercentage: 50,
        status: "MODERATE",
        timestamp: new Date().toISOString(),
      },
      message: "Occupancy retrieved successfully",
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
