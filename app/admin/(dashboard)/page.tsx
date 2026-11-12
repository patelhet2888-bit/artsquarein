import Link from "next/link";
import { ArrowUpRight, Inbox, Layers3, Package, Settings2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [productsResult, categoriesResult, newEnquiriesResult, mediaResult, recentResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id, name, email, product_name_snapshot, product_code_snapshot, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Products", value: productsResult.count ?? 0, href: "/admin/products", icon: Package },
    { label: "Collections", value: categoriesResult.count ?? 0, href: "/admin/categories", icon: Layers3 },
    { label: "New enquiries", value: newEnquiriesResult.count ?? 0, href: "/admin/enquiries", icon: Inbox },
    { label: "Media assets", value: mediaResult.count ?? 0, href: "/admin/media", icon: Settings2 },
  ];

  return <section>
    <div className="admin-page-heading"><div><span className="admin-kicker">OVERVIEW</span><h1>Good to see you.</h1><p>Your catalogue and customer enquiries, all in one place.</p></div><Link className="admin-button" href="/">View storefront <ArrowUpRight size={14} /></Link></div>
    <div className="admin-stat-grid">{stats.map(({ label, value, href, icon: Icon }) => <Link className="admin-stat-card" key={label} href={href}><span>{label}</span><strong>{value}</strong><Icon className="admin-stat-icon" size={16} aria-hidden="true" /></Link>)}</div>
    <section className="admin-panel"><div className="admin-panel-heading"><h2>Recent enquiries</h2><Link className="admin-row-link" href="/admin/enquiries">Open inbox <ArrowUpRight size={13} /></Link></div>
      {recentResult.data?.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Customer</th><th>Interested in</th><th>Status</th><th>Received</th></tr></thead><tbody>{recentResult.data.map((enquiry) => <tr key={enquiry.id}><td><strong>{enquiry.name}</strong><small>{enquiry.email}</small></td><td>{enquiry.product_name_snapshot || "General enquiry"}{enquiry.product_code_snapshot ? ` · ${enquiry.product_code_snapshot}` : ""}</td><td><span className={`admin-status is-${enquiry.status}`}>{enquiry.status}</span></td><td>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(enquiry.created_at))}</td></tr>)}</tbody></table></div> : <p className="admin-empty">No enquiries yet. New customer messages will appear here.</p>}
    </section>
    <div className="admin-quick-links"><Link href="/admin/products/new">Add a product <ArrowUpRight size={14} /></Link><Link href="/admin/media">Upload photographs <ArrowUpRight size={14} /></Link><Link href="/admin/settings">Edit homepage content <ArrowUpRight size={14} /></Link></div>
  </section>;
}
