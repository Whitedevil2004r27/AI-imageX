import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!authError) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch or create user profile
        const { data: userData, error: dbError } = await supabase.from("users").upsert({
          id: user.id,
          email: user.email!,
          role: "clinician"
        }, { onConflict: "id" }).select("role").single();

        if (dbError) {
          console.error("OAuth profile sync failed:", dbError);
        }
        
        const response = NextResponse.redirect(`${requestUrl.origin}${next}`);
        
        // Set role cookie for middleware consistency
        response.cookies.set("user-role", userData?.role || "clinician", {
          path: "/",
          maxAge: 604800,
          sameSite: "lax",
        });

        return response;
      }
    } else {
      console.error("OAuth exchange failed:", authError);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/login?error=OAuth exchange failed. Please try again.`);
}
