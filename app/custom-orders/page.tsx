import type { Metadata } from "next";
import Image from "next/image";
import { CustomOrderForm } from "@/components/custom-order-form";
import { getCatalog } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Custom Orders & Handmade Gifting",
  description: "Share your custom ART SQUARE idea, preferred design, dimensions and optional reference image. Your enquiry is saved securely.",
};

export default async function CustomOrdersPage() {
  const [{ categories, products }, settings] = await Promise.all([getCatalog(), getSiteSettings()]);
  const referenceImage = products.find((product) => product.images[0])?.images[0];
  return <main id="main-content" className="page-main custom-orders-page">
    <header className="page-hero"><span className="eyebrow">A piece made personal</span><h1>Something just<br /><em>for you.</em></h1><p>Tell us about the occasion, colours and details you have in mind. We’ll discuss the possibilities, price and availability with you before you decide.</p></header>
    <div className="custom-order-layout">
      <div className="custom-order-intro">{referenceImage && <div className="custom-order-image"><Image src={referenceImage.src} alt={referenceImage.alt} fill sizes="(max-width: 760px) 100vw, 42vw" /></div>}<span className="eyebrow">Tell us your idea</span><h2>Thoughtful details.<br /><em>Your way.</em></h2><p>Include a reference image if you have one. It is stored privately and its signed link expires after seven days. Enquiries are saved securely, but email notifications are not currently configured.</p></div>
      <div className="custom-order-form-wrap"><CustomOrderForm categories={categories} settings={settings} /></div>
    </div>
  </main>;
}
