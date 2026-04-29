import { NextRequest } from "next/server";

// POST /api/auth/signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // In production: call supabase.auth.signUp({ email, password, options: { data: { full_name } } })
    // Demo: return mock success
    const userId = `usr_${Math.random().toString(36).substr(2, 12)}`;

    return new Response(
      JSON.stringify({
        user_id: userId,
        email,
        confirmation_needed: true,
        message: "Verification email dispatched to your clinical mailbox.",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Signup failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
