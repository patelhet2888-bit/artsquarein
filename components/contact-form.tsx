"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { ENQUIRY_TYPES } from "@/lib/enquiries";
import type { SiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

type FormResult = {
  ok?: boolean;
  saved?: boolean;
  error?: string;
};

export function ContactForm({ settings }: { settings: Pick<SiteSettings, "brandName" | "whatsappNumber"> }) {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [whatsappHref, setWhatsappHref] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const fields = new FormData(form);
    if (String(fields.get("website") ?? "").trim()) return;

    const name = String(fields.get("name") ?? "").trim();
    const email = String(fields.get("email") ?? "").trim().toLowerCase();
    const country = String(fields.get("country") ?? "").trim();
    const whatsappNumber = String(fields.get("whatsappNumber") ?? "").trim();
    const subject = String(fields.get("subject") ?? "").trim();
    const enquiryType = String(fields.get("enquiryType") ?? "General Enquiry");
    const message = String(fields.get("message") ?? "").trim();

    setWhatsappHref("");
    setIsSaved(false);
    setIsSubmitting(true);
    setStatus("Sending your enquiry securely…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, country, whatsappNumber, subject, enquiryType, message, website: fields.get("website") }),
      });
      const result = await response.json() as FormResult;

      if (result.saved) {
        const whatsappMessage = [
          `Hello ${settings.brandName},`,
          "I have submitted an enquiry through your website.",
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Country: ${country}`,
          whatsappNumber ? `WhatsApp: ${whatsappNumber}` : undefined,
          `Type: ${enquiryType}`,
          `Subject: ${subject}`,
          "",
          message,
        ].filter(Boolean).join("\n");
        setWhatsappHref(whatsappLink(whatsappMessage, settings.whatsappNumber));
        setIsSaved(true);
        setStatus(result.error ?? "Your enquiry was saved, but no email notification was sent.");
        return;
      }

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "We couldn’t send your enquiry. Please try again.");
      }

      setIsSaved(true);
      setStatus("Thank you. ART SQUARE has received your enquiry.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="order-form contact-form" onSubmit={handleSubmit}>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" autoComplete="off" tabIndex={-1} /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="contact-name">Customer full name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} /></div>
      <div className="field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="contact-country">Country</label><input id="contact-country" name="country" autoComplete="country-name" required minLength={2} maxLength={80} /></div>
      <div className="field"><label htmlFor="contact-whatsapp">WhatsApp number <span>(optional)</span></label><input id="contact-whatsapp" name="whatsappNumber" type="tel" autoComplete="tel" pattern="([+]?[0-9 ()-]{6,32})?" maxLength={32} placeholder="Include country code" /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" name="subject" required minLength={3} maxLength={160} /></div>
      <div className="field"><label htmlFor="contact-enquiry-type">Enquiry type</label><select id="contact-enquiry-type" name="enquiryType" defaultValue="General Enquiry" required>{ENQUIRY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
    </div>
    <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={6} required minLength={3} maxLength={3000} placeholder="Tell us how we can help." /></div>
    <button className="button button-dark" type="submit" disabled={isSubmitting || isSaved}>{isSubmitting ? "Sending…" : isSaved ? "Saved · email not sent" : "Send message"} <ArrowUpRight size={16} /></button>
    <p className={`form-note${isSaved ? " is-warning" : ""}`} aria-live="polite" role={isSaved ? "alert" : "status"}>{status || "Your enquiry is saved securely. Email notifications are currently unavailable; use WhatsApp for urgent requests."}</p>
    {whatsappHref && <a className="button-primary form-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowUpRight size={16} /></a>}
  </form>;
}
