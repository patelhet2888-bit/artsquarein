"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, ImagePlus } from "lucide-react";
import type { ProductCollection } from "@/lib/products";
import type { SiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

const maxImageSize = 4 * 1024 * 1024;

type FormResult = { ok?: boolean; saved?: boolean; error?: string };

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
      const artworkType = String(fields.get("category") ?? "Other").trim();
      const desiredDesign = String(fields.get("design") ?? "").trim();
      const dimensions = String(fields.get("dimensions") ?? "").trim();
      const material = String(fields.get("material") ?? "").trim();
      const color = String(fields.get("color") ?? "").trim();
      const quantity = String(fields.get("quantity") ?? "1").trim();
      const message = String(fields.get("details") ?? "").trim();
      const additionalDetails = [
        `Artwork type: ${artworkType}`,
        `Desired design: ${desiredDesign}`,
        dimensions ? `Dimensions: ${dimensions}` : undefined,
        material ? `Material preference: ${material}` : undefined,
        color ? `Preferred colour: ${color}` : undefined,
        `Quantity: ${quantity}`,
        referenceUrl ? `Private reference image (link expires in 7 days): ${referenceUrl}` : undefined,
      ].filter((detail): detail is string => Boolean(detail));

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country,
          whatsappNumber: phone,
          subject: `Custom artwork request: ${artworkType}`,
          enquiryType: "Custom Artwork Request",
          message,
          additionalDetails,
          productReference,
          website: fields.get("website"),
        }),
      });
      const result = await response.json() as FormResult;

      const whatsappMessage = [
        `Hello ${settings.brandName},`,
        "I have submitted a custom artwork request through your website.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Country: ${country}`,
        phone ? `WhatsApp: ${phone}` : undefined,
        productReference ? `Product name or ID: ${productReference}` : undefined,
        ...additionalDetails,
        "",
        message,
      ].filter(Boolean).join("\n");

      if (result.saved) {
        setWhatsappHref(whatsappLink(whatsappMessage, settings.whatsappNumber));
        setIsSaved(true);
        setStatus(result.error ?? "Your enquiry was saved, but no email notification was sent.");
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error ?? "We couldn’t save your enquiry. Please try again.");

      setIsSaved(true);
      setStatus("Thank you. ART SQUARE has received your custom order enquiry.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="order-form" onSubmit={handleSubmit}>
    <div className="form-honeypot" aria-hidden="true"><label htmlFor="custom-order-website">Leave this field empty</label><input id="custom-order-website" name="website" autoComplete="off" tabIndex={-1} /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="custom-order-name">Customer name</label><input id="custom-order-name" name="name" autoComplete="name" required maxLength={120} /></div>
      <div className="field"><label htmlFor="custom-order-email">Email address</label><input id="custom-order-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="custom-order-country">Country</label><input id="custom-order-country" name="country" autoComplete="country-name" required minLength={2} maxLength={80} /></div>
      <div className="field"><label htmlFor="custom-order-phone">WhatsApp contact</label><input id="custom-order-phone" name="phone" type="tel" autoComplete="tel" pattern="[+]?[0-9 ()-]{6,32}" maxLength={32} placeholder="Include country code" required title="Enter a WhatsApp number with at least 6 digits." /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="custom-order-type">Artwork type</label><select id="custom-order-type" name="category" defaultValue={categories[0]?.name ?? "Other"}><option>Other</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></div>
      <div className="field"><label htmlFor="custom-order-product">Product name or ID <span>(optional)</span></label><input id="custom-order-product" name="productReference" maxLength={180} placeholder="For example, AS-001" /></div>
    </div>
    <div className="field"><label htmlFor="custom-order-design">Desired design</label><input id="custom-order-design" name="design" required maxLength={300} placeholder="Describe the style or idea you have in mind" /></div>
    <div className="form-row">
      <div className="field"><label htmlFor="custom-order-dimensions">Dimensions <span>(optional)</span></label><input id="custom-order-dimensions" name="dimensions" maxLength={120} placeholder="For example, 30 × 40 cm" /></div>
      <div className="field"><label htmlFor="custom-order-material">Material preference <span>(optional)</span></label><input id="custom-order-material" name="material" maxLength={120} placeholder="If you have one in mind" /></div>
    </div>
    <div className="form-row">
      <div className="field"><label htmlFor="custom-order-color">Preferred colour <span>(optional)</span></label><input id="custom-order-color" name="color" maxLength={80} placeholder="Share a colour or palette" /></div>
      <div className="field"><label htmlFor="custom-order-quantity">Quantity</label><input id="custom-order-quantity" name="quantity" type="number" min={1} max={99} step={1} defaultValue={1} required /></div>
    </div>
    <div className="field"><label htmlFor="custom-order-details">Customization description</label><textarea id="custom-order-details" name="details" rows={5} required minLength={3} maxLength={3000} placeholder="Tell us about the occasion, personal touches and any other requirements." /></div>
    <div className="field"><label htmlFor="custom-order-reference"><ImagePlus size={15} aria-hidden="true" /> Reference image <span>(optional)</span></label><input id="custom-order-reference" name="reference" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="reference-note" /><small id="reference-note">JPEG, PNG or WebP · up to 4 MB · stored privately; the share link expires after 7 days.</small></div>
    <button className="button button-dark" type="submit" disabled={isSubmitting || isSaved}>{isSubmitting ? "Saving…" : isSaved ? "Saved · email unavailable" : "Send custom order enquiry"} <ArrowUpRight size={16} /></button>
    <p className={`form-note${isSaved ? " is-warning" : ""}`} aria-live="polite" role={isSaved ? "alert" : "status"}>{status || "Your custom order request will be saved to our secure inbox. Automatic email notifications are not configured; use WhatsApp for urgent requests."}</p>
    {whatsappHref && <a className="button-primary form-whatsapp-link" href={whatsappHref} target="_blank" rel="noreferrer">Continue to WhatsApp <ArrowUpRight size={16} /></a>}
  </form>;
}
