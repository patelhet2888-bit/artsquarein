import type { Metadata } from "next";
import Image from "next/image";
import { CustomOrderForm } from "@/components/custom-order-form";

export const metadata: Metadata = {
  title: "Custom Orders & Handmade Gifting",
  description: "Share your custom ART SQUARE idea, preferred colour, quantity and optional reference image. Enquire directly via WhatsApp.",
};

export default function CustomOrdersPage() {
  return <main id="main-content" className="page-main custom-orders-page">
    <header className="page-hero"><span className="eyebrow">A piece made personal</span><h1>Something just<br /><em>for you.</em></h1><p>Tell us about the occasion, colours and details you have in mind. We’ll discuss the possibilities, price and availability with you before you decide.</p></header>
    <div className="custom-order-layout">
      <div className="custom-order-intro"><div className="custom-order-image"><Image src="/images/products/pink-pooja-thali-closeup.webp" alt="Close-up of a pink floral pooja thali from the ART SQUARE catalogue" fill sizes="(max-width: 760px) 100vw, 42vw" /></div><span className="eyebrow">Tell us your idea</span><h2>Thoughtful details.<br /><em>Your way.</em></h2><p>Include a reference image if you have one. Its private link is shared only in your WhatsApp enquiry and expires after seven days.</p></div>
      <div className="custom-order-form-wrap"><CustomOrderForm /></div>
    </div>
  </main>;
}
