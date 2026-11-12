"use client";

import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import type { Product } from "@/lib/products";

export function ProductEnquiryButton({ product }: { product: Product }) {
  function prepareEnquiry(event: MouseEvent<HTMLAnchorElement>) {
    const productLink = window.location.href;
    const message = [
      `Hello ART SQUARE, I’d love to know more about ${product.name}.`,
      `Product ID: ${product.id}`,
      `Product page: ${productLink}`,
      ...(product.price !== undefined ? [`Price: INR ${product.price.toLocaleString("en-IN")}`] : []),
      "Could you please confirm current availability?",
      "Could you share shipping options for my location?",
    ].join("\n");
    event.currentTarget.href = `https://wa.me/919054934190?text=${encodeURIComponent(message)}`;
  }

  return <a className="button button-dark full-button" href="https://wa.me/919054934190" onClick={prepareEnquiry} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={16} /></a>;
}
