"use client";

import Link from "next/link";
import { Heart, Instagram, Menu, Search, ShoppingBag } from "lucide-react";
import { useShop } from "@/components/shop-provider";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/about" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const { cartCount, openCart } = useShop();

  return <>
    <div className="announcement"><span>Handcrafted with Love</span><span className="announcement-dot" aria-hidden="true">✦</span><span>Custom Creations Available</span></div>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="ART SQUARE home">
        <span className="brand-mark" aria-hidden="true">A<span>S</span></span>
        <span className="brand-copy"><strong>ART SQUARE</strong><small>WHERE ART MEETS ELEGANCE</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
      <div className="header-actions">
        <a className="icon-link instagram-link" href="https://www.instagram.com/art_square_in/" aria-label="Visit ART SQUARE on Instagram" target="_blank" rel="noreferrer"><Instagram size={18} strokeWidth={1.5} /></a>
        <Link className="icon-link" href="/shop" aria-label="Search products"><Search size={18} strokeWidth={1.5} /></Link>
        <Link className="icon-link" href="/wishlist" aria-label="View wishlist"><Heart size={18} strokeWidth={1.5} /></Link>
        <button className="icon-link cart-trigger" type="button" aria-label={`Open enquiry bag, ${cartCount} items`} onClick={openCart}><ShoppingBag size={18} strokeWidth={1.5} />{cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}</button>
        <Link className="header-enquire" href="/contact">Enquire <span aria-hidden="true">↗</span></Link>
      </div>
      <details className="mobile-nav"><summary aria-label="Open navigation"><Menu size={23} strokeWidth={1.5} /></summary><nav aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/wishlist">Wishlist</Link><Link href="/contact">Enquire about a piece</Link></nav></details>
    </header>
  </>;
}
