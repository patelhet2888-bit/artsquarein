import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./admin/admin.css";
import { ShopProvider } from "@/components/shop-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteOrigin } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = `${settings.tagline}. Discover handmade Indian art and home décor from ${settings.brandName}.`;
  const logo = settings.logoImageUrl ?? "/logo/art-square-logo.png";

  return {
    metadataBase: new URL(getSiteOrigin()),
    title: { default: `${settings.brandName} — ${settings.tagline}`, template: `%s | ${settings.brandName}` },
    description,
    openGraph: { title: `${settings.brandName} — ${settings.tagline}`, description, type: "website", images: [{ url: logo, width: 1254, height: 1254, alt: `${settings.brandName} logo` }] },
    twitter: { card: "summary_large_image", title: `${settings.brandName} — ${settings.tagline}`, description, images: [logo] },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#F8F5EF", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  return <html lang="en"><body><ShopProvider whatsappNumber={settings.whatsappNumber}><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader settings={settings} />{children}<SiteFooter settings={settings} /><WhatsAppFloat whatsappNumber={settings.whatsappNumber} brandName={settings.brandName} /></ShopProvider></body></html>;
}
