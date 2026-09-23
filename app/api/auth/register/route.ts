import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { dataService } from "@/lib/dataService";
import { hashPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0]?.message || "Invalid input",
          },
        },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const existing = await dataService.findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_EXISTS",
            message: "An account with this email address already exists",
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await dataService.createUser({
      name,
      email,
      passwordHash,
      role: "PASSENGER",
    });

    const sessionPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
    };

    const token = createSessionToken(sessionPayload);

    const res = NextResponse.json({
      success: true,
      data: { user: sessionPayload },
      message: "Registered successfully",
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Registration failed" },
      },
      { status: 500 }
    );
  }
}
