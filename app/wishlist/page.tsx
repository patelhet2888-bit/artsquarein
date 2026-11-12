"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useShop } from "@/components/shop-provider";
import { products } from "@/lib/products";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  return <main id="main-content" className="page-main wishlist-page">
    <header className="page-hero"><span className="eyebrow">Your saved pieces</span><h1>A little list of<br /><em>lovely things.</em></h1><p>Save creations you would like to ask ART SQUARE about.</p></header>
    {savedProducts.length ? <div className="product-grid wishlist-grid">{savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state wishlist-empty"><Heart size={23} strokeWidth={1.3} /><h2>Your wishlist is waiting.</h2><p>Tap the heart on a product to keep it close while you browse.</p><Link className="button-primary" href="/shop">Browse the collection <span aria-hidden="true">↗</span></Link></div>}
  </main>;
}
