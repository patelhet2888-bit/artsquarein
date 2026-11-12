import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How ART SQUARE handles newsletter sign-ups, product enquiries and private custom-order reference images.",
};

export default function PrivacyPage() {
  return <main id="main-content" className="page-main legal-page"><header className="page-hero"><span className="eyebrow">Your information, handled with care</span><h1>Privacy &<br /><em>your choices.</em></h1><p>Last updated: November 2026</p></header><section className="legal-copy"><h2>Information you choose to share</h2><p>Product and custom-order forms prepare a message for WhatsApp. The website does not send your name, email, phone number or design brief until you choose to continue and send that message in WhatsApp.</p><h2>Reference images</h2><p>If you attach a reference image, it is uploaded to a private ART SQUARE storage bucket. The form creates a signed link that is included in the WhatsApp message you choose to send. That link expires after seven days. The image is not publicly browsable; it remains in private storage until the store operator removes it. Contact ART SQUARE if you would like an uploaded image removed.</p><h2>Newsletter</h2><p>If you subscribe, your email address is stored by the site’s connected database so ART SQUARE can manage the sign-up. You may request removal through WhatsApp.</p><h2>Third-party services</h2><p>WhatsApp and Instagram are external services with their own privacy policies. Following a link to either service is your choice.</p><h2>Questions</h2><p>For privacy questions or removal requests, contact ART SQUARE on WhatsApp at <a href="https://wa.me/919054934190" target="_blank" rel="noreferrer">+91 90549 34190</a>.</p></section></main>;
}
