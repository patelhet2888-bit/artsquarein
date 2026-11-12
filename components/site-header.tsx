import Link from "next/link";
import { Instagram, Menu } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <>
      <div className="announcement"><span>Discover the beauty of handmade art</span><span className="announcement-dot" aria-hidden="true">✦</span><span>Customized orders available</span></div>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Art Square home">
          <span className="brand-mark" aria-hidden="true">A<span>S</span></span>
          <span className="brand-copy"><strong>ART SQUARE</strong><small>WHERE ART MEETS ELEGANCE</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}</nav>
        <div className="header-actions"><a className="icon-link" href="https://www.instagram.com/art_square_in/" aria-label="Visit Art Square on Instagram" target="_blank" rel="noreferrer"><Instagram size={19} strokeWidth={1.5} /></a><Link className="header-enquire" href="/contact">Enquire <span aria-hidden="true">↗</span></Link></div>
        <details className="mobile-nav"><summary aria-label="Open navigation"><Menu size={23} strokeWidth={1.5} /></summary><nav aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/contact">Enquire about a piece</Link></nav></details>
      </header>
    </>
  );
}
