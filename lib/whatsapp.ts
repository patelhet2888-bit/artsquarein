import type { Product } from "@/lib/products";

export const WHATSAPP_PHONE = "919054934190";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(product: Product, quantity = 1, productUrl?: string) {
  return [
    "Hello ART SQUARE,",
    "",
    "I am interested in:",
    `Product: ${product.name}`,
    `Product ID: ${product.id}`,
    `Quantity: ${quantity}`,
    `Price: ${product.price === undefined ? "Please share the price" : `₹${product.price.toLocaleString("en-IN")}`}`,
    "Please share current availability and delivery details.",
    productUrl ? `Product link: ${productUrl}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
