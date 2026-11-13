import type { Metadata } from "next";
import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact ART SQUARE",
  description: "Send ART SQUARE a message about handmade creations, custom artwork, pricing or shipping.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappHref = whatsappLink(`Hello ${settings.brandName}, I would like to make an enquiry.`, settings.whatsappNumber);

  return <main id="main-content" className="page-main contact-page">
    <header className="page-hero">
      <span className="eyebrow">Every good thing starts with a conversation</span>
      <h1>We Would Love to<br /><em>Hear From You.</em></h1>
      <p>Have questions about our handmade creations? Interested in a customized artwork? Send us a message and our team will get back to you.</p>
    </header>
    <div className="contact-delivery-warning" role="status">Enquiries are saved securely, but email notifications are not configured yet. For urgent requests, please contact us on WhatsApp.</div>
    <div className="contact-layout">
      <aside className="contact-aside">
        <span className="eyebrow">We’re right here</span>
        <h2>A real person,<br /><em>always.</em></h2>
        <p>Choose the channel that works best for you. Custom creations and international enquiries are welcome.</p>
        <a className="contact-link" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> <span><strong>WhatsApp</strong><small>+91 99980 32506</small></span></a>
        <a className="contact-link" href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={18} /> <span><strong>Instagram</strong><small>{settings.instagramUrl.replace(/^https?:\/\/(www\.)?/, "")}</small></span></a>
        {settings.contactEmail && <a className="contact-link" href={`mailto:${settings.contactEmail}`}><Mail size={18} /> <span><strong>Email</strong><small>{settings.contactEmail}</small></span></a>}
        <span className="contact-footnote">Worldwide enquiries welcome. Shipping details shared on request.</span>
      </aside>
      <div className="contact-form-wrap">
        <div className="form-title"><span className="eyebrow">A note to our studio</span><h2>How can we <em>help?</em></h2><p>Share a little about what you are looking for and we’ll take it from there.</p></div>
        <ContactForm settings={settings} />
        <p className="contact-custom-order-link">Planning something personal? <Link href="/custom-orders">Tell us about your custom order <span aria-hidden="true">→</span></Link></p>
      </div>
    </div>
  </main>;
}
