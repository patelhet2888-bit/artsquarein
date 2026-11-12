"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import { categories } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

const maxImageSize = 4 * 1024 * 1024;

export function CustomOrderForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    setStatus(reference instanceof File && reference.size > 0 ? "Uploading your reference image securely…" : "Preparing your enquiry…");

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

      const lines = [
        "Hello ART SQUARE,",
        "I would like to enquire about a custom creation.",
        "",
        `Name: ${fields.get("name")}`,
        `Email: ${fields.get("email")}`,
        `WhatsApp: ${fields.get("phone")}`,
        `Product category: ${fields.get("category")}`,
        `Preferred colour: ${fields.get("color") || "Open to suggestions"}`,
        `Quantity: ${fields.get("quantity")}`,
        `Customization requirements: ${fields.get("details")}`,
        referenceUrl ? `Reference image (private link, expires in 7 days): ${referenceUrl}` : undefined,
        "",
        "Please share pricing, availability and delivery details.",
      ].filter(Boolean);
      setWhatsappHref(whatsappLink(lines.join("\n")));
      setStatus(referenceUrl ? "Your private reference link is ready. Continue to WhatsApp to send the enquiry." : "Your enquiry is ready. Continue to WhatsApp to send the message.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="order-form" onSubmit={handleSubmit}>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" autoComplete="off" tabIndex={-1} /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required maxLength={100} /></div>
      <div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="phone">WhatsApp number</label><input id="phone" name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={25} pattern="\\+?[0-9 ()-]{6,25}" title="Enter a phone number with country code, using digits, spaces, +, parentheses or hyphens." placeholder="Include country code" /></div>
      <div className="field"><label htmlFor="category">Product category</label><select id="category" name="category" defaultValue={categories[0].name} required>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="color">Preferred colour</label><input id="color" name="color" maxLength={80} placeholder="Share a colour or palette" /></div>
      <div className="field"><label htmlFor="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min={1} max={99} step={1} defaultValue={1} required /></div>
    </div>
    <div className="field"><label htmlFor="details">Customization requirements</label><textarea id="details" name="details" rows={5} required minLength={12} maxLength={1200} placeholder="Colours, occasion, personal touches — tell us what matters to you." /></div>
    <div className="field"><label htmlFor="reference"><ImagePlus size={15} aria-hidden="true" /> Reference image <span>(optional)</span></label><input id="reference" name="reference" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="reference-note" /><small id="reference-note">JPEG, PNG or WebP · up to 4 MB · stored privately; the share link expires after 7 days.</small></div>
    <button className="button button-dark" type="submit" disabled={isSubmitting}>{isSubmitting ? "Preparing…" : "Prepare my enquiry"} <ArrowUpRight size={16} /></button>
    <p className="form-note" aria-live="polite">{status || "Your details are not sent until you choose to continue to WhatsApp."}</p>
    {whatsappHref && <a className="button-primary form-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowUpRight size={16} /></a>}
  </form>;
}
