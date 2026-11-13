import "server-only";

import { redirect } from "next/navigation";
import { isAuthorizedAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/admin/login");
  if (!isAuthorizedAdminEmail(user.email) || !user.email_confirmed_at) {
    redirect("/admin/login?error=access_denied");
  }

  return { supabase, user };
}
