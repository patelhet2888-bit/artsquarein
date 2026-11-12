import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import type { SiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><BrandLogo size="footer" imageUrl={settings.logoImageUrl} brandName={settings.brandName} /><p>Thoughtfully handmade art for the spaces and rituals that make a home.</p><span className="footer-tagline">{settings.tagline}</span></div><div className="footer-column"><h2>Explore</h2><Link href="/shop">All creations</Link><Link href="/collections">Collections</Link><Link href="/about">Our story</Link><Link href="/custom-orders">Custom orders</Link><Link href="/wishlist">Wishlist</Link></div><div className="footer-column"><h2>Get in touch</h2><a href={whatsappLink(`Hello ${settings.brandName}, I would like to enquire about your handmade art.`, settings.whatsappNumber)} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a><a href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram <Instagram size={14} /></a>{settings.contactEmail && <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>}<span>Worldwide enquiries welcome</span><span>Shipping details on request</span></div><div className="footer-column"><h2>Information</h2><Link href="/privacy">Privacy</Link><Link href="/shipping">Shipping & enquiries</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.brandName}. Made with intention.</span><span>Handmade in India</span></div></footer>;
}
