import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartDrawer } from "@/components/cart-drawer";
import { ShopProvider } from "@/components/shop-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsquarein.com"),
  title: { default: "ART SQUARE — Where Art Meets Elegance", template: "%s | ART SQUARE" },
  description: "Discover handmade Indian art, resin pooja décor, mandala and mirror-work wall art, clocks, tree-of-life creations and custom gifting from ART SQUARE.",
  openGraph: { title: "ART SQUARE — Where Art Meets Elegance", description: "Handcrafted art and home décor, made to be treasured.", type: "website", images: [{ url: "/logo/art-square-logo.png", width: 1254, height: 1254, alt: "Official ART SQUARE gold logo" }] },
  twitter: { card: "summary_large_image", title: "ART SQUARE — Where Art Meets Elegance", description: "Handcrafted Indian art and home décor.", images: ["/logo/art-square-logo.png"] },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#F8F5EF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ShopProvider><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader />{children}<SiteFooter /><WhatsAppFloat /><CartDrawer /></ShopProvider></body></html>;
}
