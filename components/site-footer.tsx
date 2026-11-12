import Link from "next/link";
import { ArrowUpRight, Instagram } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL;
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><BrandLogo size="footer" /><p>Thoughtfully handmade art for the spaces and rituals that make a home.</p><span className="footer-tagline">WHERE ART MEETS ELEGANCE</span></div><div className="footer-column"><h2>Explore</h2><Link href="/shop">All creations</Link><Link href="/collections">Collections</Link><Link href="/about">Our story</Link><Link href="/custom-orders">Custom orders</Link><Link href="/wishlist">Wishlist</Link></div><div className="footer-column"><h2>Get in touch</h2><a href="https://wa.me/919054934190" target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={14} /></a><a href="https://www.instagram.com/art_square_in/" target="_blank" rel="noreferrer">Instagram <Instagram size={14} /></a>{businessEmail && <a href={`mailto:${businessEmail}`}>{businessEmail}</a>}<span>Worldwide enquiries welcome</span><span>Shipping details on enquiry</span></div><div className="footer-column"><h2>Information</h2><Link href="/privacy">Privacy</Link><Link href="/shipping">Shipping & enquiries</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ART SQUARE. Made with intention.</span><span>Handmade in India</span></div></footer>;
}
