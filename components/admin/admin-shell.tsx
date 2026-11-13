"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Media library", href: "/admin/media" },
  { label: "Enquiries", href: "/admin/enquiries" },
  { label: "Site settings", href: "/admin/settings" },
];

export function AdminShell({ children, newEnquiryCount = 0 }: { children: ReactNode; newEnquiryCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    setIsSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/" className="admin-brand" aria-label="ART SQUARE storefront">
        <span className="admin-brand-mark">AS</span>
        <span><strong>ART SQUARE</strong><small>STUDIO ADMIN</small></span>
      </Link>
      <nav className="admin-navigation" aria-label="Admin navigation">
        {navigation.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const hasNewEnquiries = item.href === "/admin/enquiries" && newEnquiryCount > 0;
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} aria-label={hasNewEnquiries ? `${item.label}, ${newEnquiryCount} new` : item.label} className={active ? "is-active" : undefined}><span>{item.label}</span>{hasNewEnquiries && <span className="admin-nav-count" aria-hidden="true">{newEnquiryCount > 99 ? "99+" : newEnquiryCount}</span>}</Link>;
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <Link href="/" target="_blank" rel="noreferrer">View storefront</Link>
        <button type="button" onClick={signOut} disabled={isSigningOut}>{isSigningOut ? "Signing out…" : "Sign out"}</button>
      </div>
    </aside>
    <div className="admin-main">
      <header className="admin-topbar"><div><span className="admin-kicker">STUDIO CONTROL ROOM</span><p>Manage the pieces, stories and enquiries behind ART SQUARE.</p></div><span className="admin-live-indicator"><i aria-hidden="true" /> Supabase connected</span></header>
      <div className="admin-content">{children}</div>
    </div>
  </div>;
}
