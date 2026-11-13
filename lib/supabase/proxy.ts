import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedAdminEmail } from "@/lib/admin-access";
import type { Database } from "@/lib/supabase/database.types";

function isProtectedAdminPage(pathname: string) {
  return (pathname === "/admin" || pathname.startsWith("/admin/")) && pathname !== "/admin/login";
}

function isAdminApi(pathname: string) {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const protectedPage = isProtectedAdminPage(pathname);
  const adminApi = isAdminApi(pathname);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (adminApi) return NextResponse.json({ error: "Authentication service unavailable." }, { status: 503 });
    if (protectedPage) return NextResponse.redirect(new URL("/admin/login?error=auth_unavailable", request.url));
    return supabaseResponse;
  }

  const supabase = createServerClient<Database, "public">(url, key, {
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  const authorized = !error && Boolean(user?.email_confirmed_at) && isAuthorizedAdminEmail(user?.email);

  if (adminApi) {
    if (!user || error) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    if (!authorized) return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  if (protectedPage) {
    if (!user || error) return NextResponse.redirect(new URL("/admin/login", request.url));
    if (!authorized) return NextResponse.redirect(new URL("/admin/login?error=access_denied", request.url));
  }

  return supabaseResponse;
}
