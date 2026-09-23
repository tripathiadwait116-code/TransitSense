import { NextRequest, NextResponse } from "next/server";
import { busUpdateSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/auth";
import { dataService } from "@/lib/dataService";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = busUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0]?.message },
        },
        { status: 400 }
      );
    }

    if (parsed.data.status) {
      await dataService.updateBusStatus(params.id, parsed.data.status);
    }

    const updated = await dataService.getBusById(params.id);

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Bus ${params.id} updated successfully`,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    // Soft deactivate bus
    await dataService.updateBusStatus(params.id, "INACTIVE");

    return NextResponse.json({
      success: true,
      data: null,
      message: `Bus ${params.id} deactivated successfully`,
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
