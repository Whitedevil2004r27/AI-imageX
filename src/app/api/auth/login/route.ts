import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // In production: call supabase.auth.signInWithPassword({ email, password })
    // Demo: return mock JWT
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_${Date.now()}`;
    const refreshToken = `refresh_${Math.random().toString(36).substr(2, 24)}`;

    const response = NextResponse.json(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: "usr_demo_001",
          email,
          role: "clinician",
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie for JWT
    response.cookies.set("sb-access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    response.cookies.set("user-role", "clinician", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Login failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
