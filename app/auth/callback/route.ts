import { isAuthorizedAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const requestedPath = searchParams.get("next") ?? "/admin";
  const safePath = requestedPath === "/auth/update-password" || requestedPath === "/admin"
    ? requestedPath
    : "/admin";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && isAuthorizedAdminEmail(data.user?.email) && data.user?.email_confirmed_at) {
      return NextResponse.redirect(new URL(safePath, origin));
    }
    if (!error) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login?error=access_denied", origin));
    }
  }

  return NextResponse.redirect(new URL("/admin/login?error=auth_callback", origin));
}
