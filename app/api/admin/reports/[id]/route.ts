import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { dataService } from "@/lib/dataService";
import { z } from "zod";

const patchReportSchema = z.object({
  status: z.enum(["PENDING", "IN_REVIEW", "RESOLVED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = patchReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid status value" },
        },
        { status: 400 }
      );
    }

    const updated = await dataService.updateReportStatus(params.id, parsed.data.status);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "REPORT_NOT_FOUND", message: "Report not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Report status updated to ${parsed.data.status}`,
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
