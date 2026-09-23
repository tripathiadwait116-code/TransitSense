import { NextRequest, NextResponse } from "next/server";
import { simulationEngine } from "@/server/simulationEngine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const deltaSeconds = parseInt(searchParams.get("delta") || "5", 10);

    simulationEngine.stepSimulation(deltaSeconds);
    const buses = simulationEngine.getAllSimulatedBuses();

    return NextResponse.json({
      success: true,
      data: {
        steppedSeconds: deltaSeconds,
        busesCount: buses.length,
        timestamp: new Date().toISOString(),
      },
      message: "Simulation stepped successfully",
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
  return GET(req);
}
