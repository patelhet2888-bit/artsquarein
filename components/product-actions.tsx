"use client";

import { useState } from "react";
import { Copy, Heart, Mail, MessageCircle, Share2 } from "lucide-react";
import { ProductEnquiryForm } from "@/components/product-enquiry-form";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useShop } from "@/components/shop-provider";
import { productEnquiryMessage, WHATSAPP_PHONE, whatsappLink } from "@/lib/whatsapp";

export function ProductActions({ product, productUrl }: { product: Product; productUrl: string }) {
  const [quantity, setQuantity] = useState(1);
  const [isEmailFormOpen, setIsEmailFormOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState("");
  const { toggleWishlist, wishlist, whatsappNumber } = useShop();
  const isWishlisted = wishlist.includes(product.id);
  const enquiryHref = whatsappLink(productEnquiryMessage(product, quantity, productUrl), WHATSAPP_PHONE);

  async function copyProductLink(fallbackMessage = "Product link copied.") {
    try {
      await navigator.clipboard.writeText(productUrl);
      setActionNotice(fallbackMessage);
    } catch {
      setActionNotice("Copy is unavailable in this browser. You can copy the product address from the browser bar.");
    }
  }

  async function shareProduct() {
    setActionNotice("");
    if (!navigator.share) {
      await copyProductLink("Native sharing is unavailable; the product link was copied.");
      return;
    }

    try {
      await navigator.share({ title: product.name, text: `${product.name} by ART SQUARE`, url: productUrl });
      setActionNotice("Product shared.");
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setActionNotice("Sharing could not be opened. Use Copy product link instead.");
    }
  }

  return <div className="product-actions">
    <div className="product-action-row">
      <label className="quantity-field" htmlFor={`quantity-${product.id}`}><span>Enquiry quantity</span><input id={`quantity-${product.id}`} type="number" min={1} max={99} step={1} value={quantity} onChange={(event) => setQuantity(Math.min(99, Math.max(1, Math.trunc(Number(event.target.value) || 1))))} /></label>
      <button className={`button-wishlist${isWishlisted ? " is-active" : ""}`} type="button" aria-pressed={isWishlisted} onClick={() => toggleWishlist(product.id)}><Heart size={16} fill={isWishlisted ? "currentColor" : "none"} /> {isWishlisted ? "Saved to wishlist" : "Save to wishlist"}</button>
    </div>
    <div className="product-action-buttons">
      <a className="button-primary" href={enquiryHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} /> Enquire on WhatsApp</a>
      <button className="button-secondary product-email-toggle" type="button" aria-expanded={isEmailFormOpen} aria-controls="product-email-enquiry" onClick={() => setIsEmailFormOpen((open) => !open)}><Mail size={16} /> Email enquiry</button>
    </div>
    <div className="product-share-actions">
      <button className="button-secondary" type="button" onClick={() => void copyProductLink()}><Copy size={15} /> Copy product link</button>
      <button className="button-secondary" type="button" onClick={() => void shareProduct()}><Share2 size={15} /> Share product</button>
    </div>
    <p className="product-action-message" role="status" aria-live="polite">{actionNotice}</p>
    {isEmailFormOpen && <div id="product-email-enquiry"><ProductEnquiryForm product={product} productUrl={productUrl} settings={{ brandName: "ART SQUARE", whatsappNumber }} /></div>}
    <p className="product-price-note">{formatPrice(product.price)} · No online payment is taken</p>
  </div>;
}
