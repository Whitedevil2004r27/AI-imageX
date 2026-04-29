import { NextRequest } from "next/server";

// POST /api/auth/refresh
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return new Response(
        JSON.stringify({ error: "Refresh token required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // In production: call supabase.auth.refreshSession({ refresh_token })
    const newAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refreshed_${Date.now()}`;
    const newRefreshToken = `refresh_${Math.random().toString(36).substr(2, 24)}`;

    return new Response(
      JSON.stringify({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: 86400,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Token refresh failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
