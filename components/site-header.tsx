"use client";

import Link from "next/link";
import { Heart, Instagram, Menu, Search } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import type { SiteSettings } from "@/lib/site-settings";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/about" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const announcementParts = settings.announcementText.split("·").map((part) => part.trim()).filter(Boolean);

  return <>
    <div className="announcement" aria-label="Store announcement">
      <span>{announcementParts[0] ?? settings.tagline}</span>
      {announcementParts.length > 1 && <><span className="announcement-dot" aria-hidden="true">✦</span><span>{announcementParts.slice(1).join(" · ")}</span></>}
    </div>
    <header className="site-header">
      <BrandLogo size="header" imageUrl={settings.logoImageUrl} brandName={settings.brandName} />
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <div className="header-actions">
        <a className="icon-link instagram-link" href={settings.instagramUrl} aria-label={`Visit ${settings.brandName} on Instagram`} target="_blank" rel="noreferrer"><Instagram size={18} strokeWidth={1.5} /></a>
        <Link className="icon-link" href="/shop" aria-label="Search products"><Search size={18} strokeWidth={1.5} /></Link>
        <Link className="icon-link" href="/wishlist" aria-label="View wishlist"><Heart size={18} strokeWidth={1.5} /></Link>
        <Link className="header-enquire" href="/contact">Enquire <span aria-hidden="true">↗</span></Link>
      </div>
      <details className="mobile-nav"><summary aria-label="Open navigation"><Menu size={23} strokeWidth={1.5} /></summary><nav aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/wishlist">Wishlist</Link><Link href="/contact">Enquire about a piece</Link></nav></details>
    </header>
  </>;
}
