import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await dataService.getStopById(params.id);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "STOP_NOT_FOUND",
            message: `Bus stop '${params.id}' was not found`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: "Bus stop details and incoming buses retrieved",
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
