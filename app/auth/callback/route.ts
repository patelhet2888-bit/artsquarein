import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const requestedPath = searchParams.get("next") ?? "/admin";
  const safePath = requestedPath.startsWith("/") && !requestedPath.startsWith("//") && !requestedPath.includes("\\")
    ? requestedPath
    : "/admin";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safePath, origin));
  }

  return NextResponse.redirect(new URL("/admin/login?error=auth_callback", origin));
}
