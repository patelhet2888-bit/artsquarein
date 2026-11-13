"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/products";
import type { SiteSettings } from "@/lib/site-settings";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

type FormResult = {
  ok?: boolean;
  saved?: boolean;
  error?: string;
};

export function ProductEnquiryForm({ product, productUrl, settings }: {
  product: Product;
  productUrl: string;
  settings: Pick<SiteSettings, "brandName" | "whatsappNumber">;
}) {
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
    const customization = String(fields.get("customization") ?? "").trim();
    const message = String(fields.get("message") ?? "").trim();
    const subject = `Product enquiry: ${product.name}`;

    setWhatsappHref("");
    setIsSaved(false);
    setIsSubmitting(true);
    setStatus("Sending your product enquiry securely…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          whatsappNumber,
          subject,
          enquiryType: "Product Enquiry",
          message,
          additionalDetails: customization ? [`Customization requirements: ${customization}`] : [],
          productReference: product.id,
          website: fields.get("website"),
        }),
      });
      const result = await response.json() as FormResult;

      if (result.saved) {
        const whatsappMessage = [
          `Hello ${settings.brandName},`,
          "I have submitted a product enquiry through your website.",
          "",
          `Customer: ${name}`,
          `Email: ${email}`,
          `Country: ${country}`,
          whatsappNumber ? `WhatsApp: ${whatsappNumber}` : undefined,
          `Product: ${product.name}`,
          `Product ID: ${product.id}`,
          `Product code: ${product.productCode}`,
          `Product URL: ${productUrl}`,
          `Price: ${formatPrice(product.price)}`,
          customization ? `Customization requirements: ${customization}` : undefined,
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
      setStatus("Thank you. ART SQUARE has received your product enquiry.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="order-form product-enquiry-form" onSubmit={handleSubmit}>
    <p className="product-enquiry-summary"><strong>{product.name}</strong><span>{product.productCode} · {formatPrice(product.price)}</span></p>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="product-enquiry-website">Leave this field empty</label><input id="product-enquiry-website" name="website" autoComplete="off" tabIndex={-1} /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="product-enquiry-name">Your name</label><input id="product-enquiry-name" name="name" autoComplete="name" required maxLength={120} /></div>
      <div className="field"><label htmlFor="product-enquiry-email">Email address</label><input id="product-enquiry-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="product-enquiry-country">Country</label><input id="product-enquiry-country" name="country" autoComplete="country-name" required minLength={2} maxLength={80} /></div>
      <div className="field"><label htmlFor="product-enquiry-whatsapp">WhatsApp number <span>(optional)</span></label><input id="product-enquiry-whatsapp" name="whatsappNumber" type="tel" autoComplete="tel" pattern="([+]?[0-9 ()-]{6,32})?" maxLength={32} /></div>
    </div>
    <div className="field"><label htmlFor="product-enquiry-customization">Customization requirements <span>(optional)</span></label><input id="product-enquiry-customization" name="customization" maxLength={500} placeholder="Size, colour, personalization or other details" /></div>
    <div className="field"><label htmlFor="product-enquiry-message">Message</label><textarea id="product-enquiry-message" name="message" rows={4} required minLength={3} maxLength={3000} placeholder="Ask about price, availability or shipping." /></div>
    <button className="button button-dark" type="submit" disabled={isSubmitting || isSaved}>{isSubmitting ? "Sending…" : isSaved ? "Saved · email not sent" : "Send product enquiry"} <ArrowUpRight size={16} /></button>
    <p className={`form-note${isSaved ? " is-warning" : ""}`} aria-live="polite" role={isSaved ? "alert" : "status"}>{status || "Email notifications are currently unavailable. Your enquiry will be saved and you can follow up on WhatsApp."}</p>
    {whatsappHref && <a className="button-primary form-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowUpRight size={16} /></a>}
  </form>;
}
