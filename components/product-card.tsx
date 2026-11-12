"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Heart, ShoppingBag, X } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useShop } from "@/components/shop-provider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.includes(product.id);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (quickViewOpen && !dialog.open) dialog.showModal();
    if (!quickViewOpen && dialog.open) dialog.close();
  }, [quickViewOpen]);

  return <article className="product-card">
    <div className="product-card-image">
      <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
        <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 25vw" priority={priority} />
      </Link>
      <button className={`product-heart${isWishlisted ? " is-active" : ""}`} type="button" aria-label={`${isWishlisted ? "Remove from" : "Add to"} wishlist: ${product.name}`} aria-pressed={isWishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={17} fill={isWishlisted ? "currentColor" : "none"} /></button>
      <button className="product-card-arrow" type="button" aria-label={`Quick view ${product.name}`} onClick={() => setQuickViewOpen(true)}><ArrowUpRight size={18} /></button>
    </div>
    <div className="product-card-copy">
      <span className="eyebrow">{product.category} <span aria-hidden="true">·</span> {product.id}</span>
      <h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
      <p>{formatPrice(product.price)} <span aria-hidden="true">·</span> Handmade</p>
      <div className="product-card-actions">
        <button className="button-primary" type="button" onClick={() => addToCart(product.id)}><ShoppingBag size={14} /> Add to enquiry bag</button>
        <button className="product-quick-link" type="button" onClick={() => setQuickViewOpen(true)}>Quick view</button>
      </div>
    </div>
    {quickViewOpen && <dialog ref={dialogRef} className="quick-view-dialog" aria-labelledby={`quick-view-${product.id}`} onCancel={(event) => { event.preventDefault(); setQuickViewOpen(false); }} onClose={() => { if (quickViewOpen) setQuickViewOpen(false); }}>
      <section className="quick-view">
        <button className="icon-button quick-view-close" type="button" aria-label="Close quick view" onClick={() => setQuickViewOpen(false)}><X size={19} /></button>
        <div className="quick-view-image"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 700px) 90vw, 45vw" /></div>
        <div className="quick-view-copy"><span className="eyebrow">{product.category} · {product.id}</span><h2 id={`quick-view-${product.id}`}>{product.name}</h2><p>{product.description}</p><strong>{formatPrice(product.price)}</strong><p className="quick-view-note">Please enquire for confirmed materials, dimensions and availability.</p><div className="quick-view-actions"><button className="button-primary" type="button" onClick={() => { addToCart(product.id); setQuickViewOpen(false); }}><ShoppingBag size={15} /> Add to enquiry bag</button><Link className="text-action" href={`/product/${product.slug}`} onClick={() => setQuickViewOpen(false)}>View full details <span aria-hidden="true">↗</span></Link></div></div>
      </section>
    </dialog>}
  </article>;
}
