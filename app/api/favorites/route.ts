import { NextRequest, NextResponse } from "next/server";
import { dataService } from "@/lib/dataService";
import { favoriteCreateSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Login required to access favorites" },
        },
        { status: 401 }
      );
    }

    const favs = await dataService.getFavorites(session.id);

    // Hydrate targets
    const hydrated = await Promise.all(
      favs.map(async (f) => {
        let details: any = null;
        if (f.targetType === "BUS") {
          details = await dataService.getBusById(f.targetId);
        } else if (f.targetType === "ROUTE") {
          details = await dataService.getRouteById(f.targetId);
        } else if (f.targetType === "STOP") {
          const stopData = await dataService.getStopById(f.targetId);
          details = stopData?.stop || null;
        }
        return {
          ...f,
          details,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: hydrated,
      message: "Favorites retrieved",
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
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Login required to save favorites" },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = favoriteCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0]?.message },
        },
        { status: 400 }
      );
    }

    const { targetType, targetId } = parsed.data;
    const fav = await dataService.addFavorite(session.id, targetType, targetId);

    return NextResponse.json({
      success: true,
      data: fav,
      message: "Added to favorites",
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Login required" },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("targetType") as any;
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BAD_REQUEST", message: "Missing targetType or targetId" },
        },
        { status: 400 }
      );
    }

    await dataService.removeFavorite(session.id, targetType, targetId);

    return NextResponse.json({
      success: true,
      data: null,
      message: "Removed from favorites",
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
