import { redirect } from "next/navigation";
import { AdminPasswordUpdateForm } from "@/components/admin/admin-password-update-form";
import { isAuthorizedAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/admin/login?error=auth_required");
  if (!isAuthorizedAdminEmail(user.email) || !user.email_confirmed_at) {
    redirect("/admin/login?error=access_denied");
  }

  return <main className="admin-login-page"><AdminPasswordUpdateForm /></main>;
}
