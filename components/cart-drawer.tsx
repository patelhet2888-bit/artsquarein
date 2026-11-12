"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useShop } from "@/components/shop-provider";
import { formatPrice, products } from "@/lib/products";
import { whatsappLink } from "@/lib/whatsapp";

export function CartDrawer() {
  const { cart, cartOpen, closeCart, setQuantity, removeFromCart } = useShop();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lines = cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const estimatedTotal = lines.reduce((total, line) => total + (line.product.price ?? 0) * line.quantity, 0);
  const message = [
    "Hello ART SQUARE,",
    "I would like to enquire about these pieces:",
    ...lines.map(({ product, quantity }) => `Product: ${product.name} (${product.id}) — quantity ${quantity}; ${formatPrice(product.price)}`),
    `Estimated total for priced items: ${estimatedTotal ? formatPrice(estimatedTotal) : "Please share prices"}`,
    "Please share availability and delivery details.",
  ].join("\n");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (cartOpen && !dialog.open) dialog.showModal();
    if (!cartOpen && dialog.open) dialog.close();
  }, [cartOpen]);

  return <dialog ref={dialogRef} className="cart-drawer-dialog" aria-labelledby="cart-title" onCancel={(event) => { event.preventDefault(); closeCart(); }} onClose={() => { if (cartOpen) closeCart(); }} onClick={(event) => { if (event.target === event.currentTarget) closeCart(); }}>
    <div className="cart-drawer">
      <div className="cart-drawer-header"><div><span className="eyebrow">Your selection</span><h2 id="cart-title">Enquiry bag <span>({cart.reduce((sum, line) => sum + line.quantity, 0)})</span></h2></div><button className="icon-button" type="button" aria-label="Close enquiry bag" onClick={closeCart}><X size={19} /></button></div>
      {lines.length ? <>
        <div className="cart-lines">{lines.map(({ product, quantity }) => <article className="cart-line" key={product.id}>
          <Link className="cart-line-image" href={`/product/${product.slug}`} onClick={closeCart}><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="96px" /></Link>
          <div className="cart-line-copy"><Link href={`/product/${product.slug}`} onClick={closeCart}><strong>{product.name}</strong></Link><small>{product.id} · {formatPrice(product.price)}</small><div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button type="button" aria-label={`Remove one ${product.name}`} onClick={() => quantity === 1 ? removeFromCart(product.id) : setQuantity(product.id, quantity - 1)}><Minus size={13} /></button><span aria-live="polite">{quantity}</span><button type="button" aria-label={`Add one ${product.name}`} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={13} /></button></div></div>
          <button className="cart-remove" type="button" aria-label={`Remove ${product.name} from enquiry bag`} onClick={() => removeFromCart(product.id)}><Trash2 size={15} /></button>
        </article>)}</div>
        <div className="cart-summary"><div><span>Price</span><strong>Confirmed by enquiry</strong></div><p>Prices and availability are confirmed by ART SQUARE before an order is placed.</p><a className="button-primary cart-checkout" href={whatsappLink(message)} target="_blank" rel="noreferrer" onClick={closeCart}>Enquire on WhatsApp <span aria-hidden="true">↗</span></a><button type="button" className="text-action cart-continue" onClick={closeCart}>Continue browsing</button></div>
      </> : <div className="cart-empty"><ShoppingBag size={26} strokeWidth={1.3} /><h3>Your bag is ready for a piece of art.</h3><p>Add a creation to collect your questions in one WhatsApp enquiry.</p><Link href="/shop" className="button-primary" onClick={closeCart}>Explore the collection <span aria-hidden="true">↗</span></Link></div>}
    </div>
  </dialog>;
}
