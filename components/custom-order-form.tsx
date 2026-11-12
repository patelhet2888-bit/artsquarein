"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import type { ProductCollection } from "@/lib/products";
import type { SiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

const maxImageSize = 4 * 1024 * 1024;

export function CustomOrderForm({ categories, settings }: { categories: ProductCollection[]; settings: SiteSettings }) {
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

    const reference = fields.get("reference");
    let referenceUrl = "";
    if (reference instanceof File && reference.size > 0) {
      if (reference.size > maxImageSize) {
        setStatus("Choose an image smaller than 4 MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(reference.type)) {
        setStatus("Choose a JPEG, PNG, or WebP image.");
        return;
      }
    }

    setWhatsappHref("");
    setIsSaved(false);
    setIsSubmitting(true);
    setStatus(reference instanceof File && reference.size > 0 ? "Uploading your reference image securely…" : "Saving your enquiry…");

    try {
      if (reference instanceof File && reference.size > 0) {
        const upload = new FormData();
        upload.append("reference", reference);
        upload.append("website", "");
        const response = await fetch("/api/order-reference", { method: "POST", body: upload });
        const result = await response.json() as { signedUrl?: string; error?: string };
        if (!response.ok || !result.signedUrl) throw new Error(result.error ?? "The reference image could not be uploaded.");
        referenceUrl = result.signedUrl;
      }

      const name = String(fields.get("name") ?? "").trim();
      const email = String(fields.get("email") ?? "").trim().toLowerCase();
      const country = String(fields.get("country") ?? "").trim();
      const phone = String(fields.get("phone") ?? "").trim();
      const productReference = String(fields.get("productReference") ?? "").trim();
      const message = [
        `Product category: ${fields.get("category") || "General enquiry"}`,
        `Preferred colour: ${fields.get("color") || "Open to suggestions"}`,
        `Quantity: ${fields.get("quantity") || "1"}`,
        `Customization requirements: ${String(fields.get("details") ?? "").trim()}`,
        referenceUrl ? `Private reference image (link expires in 7 days): ${referenceUrl}` : undefined,
        "Please share pricing, availability and delivery details.",
      ].filter(Boolean).join("\n");

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          whatsappNumber: phone,
          productReference,
          message,
          website: fields.get("website"),
        }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "We couldn’t save your enquiry. Please try again.");

      const whatsappMessage = [
        `Hello ${settings.brandName},`,
        "I have submitted an enquiry through your website.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Country: ${country}`,
        `WhatsApp: ${phone}`,
        productReference ? `Product name or ID: ${productReference}` : undefined,
        message,
      ].filter(Boolean).join("\n");
      setWhatsappHref(whatsappLink(whatsappMessage, settings.whatsappNumber));
      setIsSaved(true);
      setStatus("Your enquiry has been saved. You can also continue the conversation on WhatsApp.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="order-form" onSubmit={handleSubmit}>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" autoComplete="off" tabIndex={-1} /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required maxLength={120} /></div>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="country">Country or region</label><input id="country" name="country" autoComplete="country-name" required minLength={2} maxLength={80} /></div>
      <div className="field"><label htmlFor="phone">WhatsApp number</label><input id="phone" name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={32} pattern="[+]?[0-9 ()-]{6,32}" title="Enter a phone number with country code, using digits, spaces, +, parentheses or hyphens." placeholder="Include country code" /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="productReference">Product name or ID <span>(optional)</span></label><input id="productReference" name="productReference" maxLength={180} placeholder="For example, AS-001 or Money Tree Art" /></div>
      <div className="field"><label htmlFor="category">Product category</label><select id="category" name="category" defaultValue={categories[0]?.name ?? "General enquiry"}><option>General enquiry</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="color">Preferred colour</label><input id="color" name="color" maxLength={80} placeholder="Share a colour or palette" /></div>
      <div className="field"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min={1} max={99} step={1} defaultValue={1} required /></div>
    </div>
    <div className="field"><label htmlFor="details">Message</label><textarea id="details" name="details" rows={5} required minLength={3} maxLength={3000} placeholder="Tell us what you are looking for, including any occasion or personal touches." /></div>
    <div className="field"><label htmlFor="reference"><ImagePlus size={15} aria-hidden="true" /> Reference image <span>(optional)</span></label><input id="reference" name="reference" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="reference-note" /><small id="reference-note">JPEG, PNG or WebP · up to 4 MB · stored privately; the share link expires after 7 days.</small></div>
    <button className="button button-dark" type="submit" disabled={isSubmitting || isSaved}>{isSubmitting ? "Saving…" : isSaved ? "Enquiry saved" : "Send enquiry"} <ArrowUpRight size={16} /></button>
    <p className="form-note" aria-live="polite">{status || "Your enquiry is saved securely. WhatsApp opens only if you choose to continue there."}</p>
    {whatsappHref && <a className="button-primary form-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowUpRight size={16} /></a>}
  </form>;
}
