import type { Metadata } from "next";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { CustomOrderForm } from "@/components/custom-order-form";
import { getCategories } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contact & Custom Orders", description: "Ask ART SQUARE about a piece, availability, shipping or a personal handmade creation. We reply on WhatsApp." };

export default async function ContactPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);
  const whatsappHref = whatsappLink(`Hello ${settings.brandName}, I would like to make an enquiry.`, settings.whatsappNumber);
  return <main id="main-content" className="page-main contact-page"><header className="page-hero"><span className="eyebrow">Every good thing starts with a conversation</span><h1>Tell us what<br /><em>you’re dreaming of.</em></h1><p>Ask about a piece, availability, shipping to your country or a handmade creation made more personal.</p></header><div className="contact-layout"><aside className="contact-aside"><span className="eyebrow">We’re right here</span><h2>A real person,<br /><em>always.</em></h2><p>Send your enquiry securely, then choose whether to continue the conversation on WhatsApp.</p><a className="contact-link" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> <span><strong>WhatsApp</strong><small>+{settings.whatsappNumber}</small></span></a><a className="contact-link" href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> <span><strong>Instagram</strong><small>{settings.instagramUrl.replace(/^https?:\/\/(www\.)?/, "")}</small></span></a>{settings.contactEmail && <a className="contact-link" href={`mailto:${settings.contactEmail}`}><Mail size={18} /> <span><strong>Email</strong><small>{settings.contactEmail}</small></span></a>}<span className="contact-footnote">Worldwide enquiries welcome. Shipping details shared on request.</span></aside><div className="contact-form-wrap"><div className="form-title"><span className="eyebrow">Custom orders & product enquiries</span><h2>Let’s make it <em>meaningful.</em></h2><p>Share the product name or ID, your location, and what you are imagining.</p></div><CustomOrderForm categories={categories} settings={settings} /></div></div></main>;
}
