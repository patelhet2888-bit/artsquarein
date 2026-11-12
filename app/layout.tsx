import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsquarein.com"),
  title: { default: "ART SQUARE — Where Art Meets Elegance", template: "%s | ART SQUARE" },
  description: "Discover thoughtfully handcrafted Indian art and home décor by ART SQUARE. Handmade resin art, pooja décor, wall art, clocks and custom creations. Enquire on WhatsApp.",
  openGraph: { title: "ART SQUARE — Where Art Meets Elegance", description: "Thoughtfully handcrafted Indian art and home décor, made to be treasured.", type: "website", images: [{ url: "/products/money-tree-display.jpeg", width: 1200, height: 1200, alt: "Handcrafted money tree art by ART SQUARE" }] },
  twitter: { card: "summary_large_image", title: "ART SQUARE — Where Art Meets Elegance", description: "Handcrafted Indian art and home décor." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#F8F5EF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /><WhatsAppFloat /></body></html>;
}
