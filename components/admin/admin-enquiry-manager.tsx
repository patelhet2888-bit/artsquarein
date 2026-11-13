"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle, Trash2 } from "lucide-react";
import { ENQUIRY_TYPES, parseEnquiryDetails } from "@/lib/enquiries";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];
type DeliveryFilter = "all" | "Pending" | "Sent" | "Failed" | "Unknown";

function displayStatus(status: string) {
  return status === "closed" ? "completed" : status;
}

export function AdminEnquiryManager({ enquiries: initialEnquiries }: { enquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>("all");
  const [draftStatuses, setDraftStatuses] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const visible = useMemo(() => enquiries.filter((item) => {
    const details = parseEnquiryDetails(item.message);
    const searchText = `${item.name} ${item.email} ${item.country} ${item.product_name_snapshot} ${item.product_code_snapshot} ${details?.subject ?? ""} ${details?.enquiryType ?? ""} ${details?.message ?? item.message}`.toLocaleLowerCase();
    const matchesQuery = searchText.includes(query.trim().toLocaleLowerCase());
    const matchesStatus = statusFilter === "all" || displayStatus(item.status) === statusFilter;
    const matchesType = typeFilter === "all" || details?.enquiryType === typeFilter;
    const matchesDelivery = deliveryFilter === "all" || (details?.emailDeliveryStatus ?? "Unknown") === deliveryFilter;
    return matchesQuery && matchesStatus && matchesType && matchesDelivery;
  }), [enquiries, query, statusFilter, typeFilter, deliveryFilter]);

  async function saveStatus(item: Enquiry) {
    const selectedStatus = draftStatuses[item.id] ?? displayStatus(item.status);
    const status = selectedStatus === "completed" ? "closed" : selectedStatus;
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

  async function deleteEnquiry(item: Enquiry) {
    if (!window.confirm(`Delete the enquiry from ${item.name}? This cannot be undone.`)) return;
    setBusyId(item.id);
    setMessage("");
    const { error } = await createClient().from("enquiries").delete().eq("id", item.id);
    if (error) setMessage("Could not delete the enquiry.");
    else {
      setEnquiries((current) => current.filter((row) => row.id !== item.id));
      setMessage("Enquiry deleted.");
    }
    setBusyId("");
  }

  return <>
    <div className="admin-toolbar admin-enquiry-filters">
      <label className="admin-field admin-search-label"><span className="sr-only">Search enquiries</span><input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, subject or product" /></label>
      <label className="admin-field admin-search-label"><span className="sr-only">Filter enquiries by status</span><select className="admin-search" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="completed">Completed</option></select></label>
      <label className="admin-field admin-search-label"><span className="sr-only">Filter enquiries by type</span><select className="admin-search" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All enquiry types</option>{ENQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
      <label className="admin-field admin-search-label"><span className="sr-only">Filter by email delivery status</span><select className="admin-search" value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value as DeliveryFilter)}><option value="all">All email statuses</option><option value="Pending">Pending</option><option value="Sent">Sent</option><option value="Failed">Failed</option><option value="Unknown">Unknown</option></select></label>
      <span className="admin-result-count">{visible.length} enquiries</span>
    </div>
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <div className="admin-enquiry-list">{visible.map((item) => {
      const details = parseEnquiryDetails(item.message);
      const status = displayStatus(item.status);
      const deliveryStatus = details?.emailDeliveryStatus ?? "Unknown";
      const replySubject = details?.subject ? `Re: ${details.subject}` : "Re: Your ART SQUARE enquiry";
      const messageText = details?.message ?? item.message;

      return <article className="admin-panel admin-enquiry-card" key={item.id}>
        <div className="admin-enquiry-summary">
          <div><span className="admin-kicker">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.created_at))}</span><h2>{item.name}</h2><p>{details?.subject ?? item.product_name_snapshot ?? "Customer enquiry"}</p></div>
          <div className="admin-enquiry-badges"><span className={`admin-status is-${status}`}>{status === "completed" ? "Completed" : status}</span><span className={`admin-delivery-status is-${deliveryStatus.toLowerCase()}`}>Email: {deliveryStatus}</span></div>
        </div>
        <div className="admin-enquiry-meta"><span>{details?.enquiryType ?? "Legacy enquiry"}</span>{item.product_name_snapshot && <span>{item.product_name_snapshot}{item.product_code_snapshot ? ` · ${item.product_code_snapshot}` : ""}</span>}</div>
        <div className="admin-enquiry-contact"><span>{item.country}</span><a href={`mailto:${item.email}?subject=${encodeURIComponent(replySubject)}`}><Mail size={13} /> Reply to {item.email}</a>{item.whatsapp_number && <a href={`https://wa.me/${item.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={13} /> WhatsApp <ArrowUpRight size={12} /></a>}</div>
        {details?.emailDeliveryNote && <p className="admin-email-delivery-note">{details.emailDeliveryNote}</p>}
        <details className="admin-enquiry-message"><summary>View complete enquiry</summary>
          {details?.product && <dl className="admin-product-details"><div><dt>Product</dt><dd>{details.product.name} · {details.product.productCode}</dd></div><div><dt>Price</dt><dd>{details.product.price ?? "Not listed"}</dd></div><div><dt>Product page</dt><dd><a href={details.product.url} target="_blank" rel="noreferrer">Open product page <ArrowUpRight size={12} /></a></dd></div></dl>}
          {details?.additionalDetails.length ? <ul className="admin-enquiry-extra">{details.additionalDetails.map((detail, index) => <li key={`${item.id}-detail-${index}`}>{detail}</li>)}</ul> : null}
          <p>{messageText}</p>
        </details>
        <div className="admin-enquiry-actions">
          <label className="admin-field"><span>Enquiry status</span><select value={draftStatuses[item.id] ?? status} onChange={(event) => setDraftStatuses((current) => ({ ...current, [item.id]: event.target.value }))}><option value="new">New</option><option value="contacted">Contacted</option><option value="completed">Completed</option></select></label>
          <button className="admin-button admin-button-small" type="button" disabled={busyId === item.id || (draftStatuses[item.id] ?? status) === status} onClick={() => saveStatus(item)}>{busyId === item.id ? "Saving…" : "Save status"}</button>
          <button className="admin-button admin-button-small admin-button-danger" type="button" disabled={busyId === item.id} onClick={() => deleteEnquiry(item)}><Trash2 size={13} /> Delete</button>
        </div>
      </article>;
    })}</div>
    {!visible.length && <div className="admin-panel admin-empty">No enquiries match this view.</div>}
  </>;
}
