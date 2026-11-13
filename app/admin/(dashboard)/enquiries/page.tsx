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
    <div className="admin-page-heading"><div><span className="admin-kicker">CUSTOMER MESSAGES</span><h1>Enquiries</h1><p>Search and manage customer messages, delivery status and follow-up.</p></div></div>
    <div className="admin-email-warning" role="status"><strong>Email notifications are not configured.</strong> Enquiries submitted now are saved in this inbox, but no email is sent to the business account.</div>
    <AdminEnquiryManager enquiries={enquiries ?? []} />
  </section>;
}
