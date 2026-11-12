import type { Metadata } from "next";
import { AdminEnquiryManager } from "@/components/admin/admin-enquiry-manager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Enquiries · Admin", robots: { index: false, follow: false } };

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, name, email, country, whatsapp_number, product_id, product_name_snapshot, product_code_snapshot, message, status, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(150);

  return <section>
    <div className="admin-page-heading"><div><span className="admin-kicker">CUSTOMER MESSAGES</span><h1>Enquiries</h1><p>Review customer details and follow each message from new to closed.</p></div></div>
    <AdminEnquiryManager enquiries={enquiries ?? []} />
  </section>;
}
