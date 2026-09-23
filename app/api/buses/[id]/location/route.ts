import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";
import { busLocationUpdateSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bus = await dataService.getBusById(params.id);

    if (!bus || !bus.currentLocation) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "LOCATION_UNAVAILABLE",
            message: "Live telemetry coordinates currently unavailable for this bus",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bus.currentLocation,
      message: "Bus location retrieved",
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = busLocationUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0]?.message || "Invalid location payload",
          },
        },
        { status: 400 }
      );
    }

    const { latitude, longitude, speed, heading } = parsed.data;
    const bus = await dataService.getBusById(params.id);

    if (!bus) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BUS_NOT_FOUND", message: "Target bus not found" },
        },
        { status: 404 }
      );
    }

    await dataService.updateBusLocation(bus.id, latitude, longitude, speed, heading);

    return NextResponse.json({
      success: true,
      data: {
        busId: bus.id,
        latitude,
        longitude,
        speed,
        heading,
        serverTimestamp: new Date().toISOString(),
      },
      message: "Bus location updated successfully",
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
