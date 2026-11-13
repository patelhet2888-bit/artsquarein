"use client";

import { useState } from "react";
import { Heart, Mail, MessageCircle } from "lucide-react";
import { ProductEnquiryForm } from "@/components/product-enquiry-form";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useShop } from "@/components/shop-provider";
import { productEnquiryMessage, whatsappLink } from "@/lib/whatsapp";

export function ProductActions({ product, productUrl }: { product: Product; productUrl: string }) {
  const [quantity, setQuantity] = useState(1);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const { toggleWishlist, wishlist, whatsappNumber } = useShop();
  const isWishlisted = wishlist.includes(product.id);
  const enquiryHref = whatsappLink(productEnquiryMessage(product, quantity, productUrl), whatsappNumber);

  return <div className="product-actions">
    <div className="product-action-row">
      <label className="quantity-field" htmlFor={`quantity-${product.id}`}><span>Enquiry quantity</span><input id={`quantity-${product.id}`} type="number" min={1} max={99} step={1} value={quantity} onChange={(event) => setQuantity(Math.min(99, Math.max(1, Number(event.target.value) || 1)))} /></label>
      <button className={`button-wishlist${isWishlisted ? " is-active" : ""}`} type="button" aria-pressed={isWishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={16} fill={isWishlisted ? "currentColor" : "none"} /> {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}</button>
    </div>
    <div className="product-action-buttons">
      <a className="button-primary" href={enquiryHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Enquire on WhatsApp</a>
      <button className="button-secondary product-email-toggle" type="button" aria-expanded={isEmailFormOpen} aria-controls="product-email-enquiry" onClick={() => setIsEmailFormOpen((open) => !open)}><Mail size={16} /> Email enquiry</button>
    </div>
    {isEmailFormOpen && <div id="product-email-enquiry"><ProductEnquiryForm product={product} productUrl={productUrl} settings={{ brandName: "ART SQUARE", whatsappNumber }} /></div>}
    <p className="product-price-note">{formatPrice(product.price)} · No online payment is taken</p>
  </div>;
}
