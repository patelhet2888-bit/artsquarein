"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];

export function AdminEnquiryManager({ enquiries: initialEnquiries }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draftStatuses, setDraftStatuses] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const visible = useMemo(() => enquiries.filter((item) => {
    const matchesQuery = `${item.name} ${item.email} ${item.product_name_snapshot} ${item.product_code_snapshot}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    return matchesQuery && (filter === "all" || item.status === filter);
  }), [enquiries, query, filter]);

  async function saveStatus(item: Enquiry) {
    const status = draftStatuses[item.id] ?? item.status;
    setBusyId(item.id);
    setMessage("");
    const { error } = await createClient().from("enquiries").update({ status }).eq("id", item.id);
    if (error) setMessage("Could not update the enquiry status.");
    else {
      setEnquiries((current) => current.map((row) => row.id === item.id ? { ...row, status } : row));
      setDraftStatuses((current) => { const next = { ...current }; delete next[item.id]; return next; });
      setMessage("Enquiry status updated.");
    }
    setBusyId("");
  }

  return <>
    <div className="admin-toolbar"><label className="admin-field admin-search-label"><span className="sr-only">Search enquiries</span><input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or product" /></label><label className="admin-field admin-search-label"><span className="sr-only">Filter enquiries by status</span><select className="admin-search" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><span className="admin-result-count">{visible.length} enquiries</span></div>
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <div className="admin-enquiry-list">{visible.map((item) => <article className="admin-panel admin-enquiry-card" key={item.id}>
      <div className="admin-enquiry-summary"><div><span className="admin-kicker">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</span><h2>{item.name}</h2><p>{item.product_name_snapshot || "General enquiry"}{item.product_code_snapshot ? ` · ${item.product_code_snapshot}` : ""}</p></div><span className={`admin-status is-${item.status}`}>{item.status}</span></div>
      <div className="admin-enquiry-contact"><span>{item.country}</span><a href={`mailto:${item.email}`}><Mail size={13} /> {item.email}</a><a href={`https://wa.me/${item.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={13} /> {item.whatsapp_number} <ArrowUpRight size={12} /></a></div>
      <details className="admin-enquiry-message"><summary>Read customer message</summary><p>{item.message}</p></details>
      <div className="admin-enquiry-actions"><label className="admin-field"><span>Status</span><select value={draftStatuses[item.id] ?? item.status} onChange={(event) => setDraftStatuses((current) => ({ ...current, [item.id]: event.target.value }))}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><button className="admin-button admin-button-small" type="button" disabled={busyId === item.id || (draftStatuses[item.id] ?? item.status) === item.status} onClick={() => saveStatus(item)}>{busyId === item.id ? "Saving…" : "Save status"}</button></div>
    </article>)}</div>
    {!visible.length && <div className="admin-panel admin-empty">No enquiries match this view.</div>}
  </>;
}
