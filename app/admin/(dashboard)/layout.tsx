import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { supabase } = await requireAdmin();
  const { count: newEnquiryCount } = await supabase
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return <AdminShell newEnquiryCount={newEnquiryCount ?? 0}>{children}</AdminShell>;
}
