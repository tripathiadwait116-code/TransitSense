import { NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const stats = await dataService.getAdminStats();

    return NextResponse.json({
      success: true,
      data: stats,
      message: "Admin statistics retrieved",
    });
  } catch (error: any) {
    const isAuth = error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.message || "FORBIDDEN",
          message: isAuth ? "Administrative privileges required" : error.message,
        },
      },
      { status: error.message === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}
