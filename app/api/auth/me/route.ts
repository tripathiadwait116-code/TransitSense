import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({
        success: false,
        data: null,
        message: "Not authenticated",
      });
    }

    return NextResponse.json({
      success: true,
      data: { user: session },
      message: "Current session retrieved",
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
