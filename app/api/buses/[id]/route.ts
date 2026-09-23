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
          error: {
            code: "BUS_NOT_FOUND",
            message: `Bus with identifier '${params.id}' was not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bus,
      message: "Bus retrieved successfully",
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
