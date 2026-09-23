import { NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET() {
  try {
    const routes = await dataService.getRoutes();

    return NextResponse.json({
      success: true,
      data: routes,
      message: "Routes retrieved successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to retrieve routes" },
      },
      { status: 500 }
    );
  }
}
