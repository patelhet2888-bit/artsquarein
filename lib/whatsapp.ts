import type { Product } from "@/lib/products";

export const WHATSAPP_PHONE = "919998032506";

export function whatsappLink(message: string, phone = WHATSAPP_PHONE) {
  const digits = phone.replace(/[^0-9]/g, "") || WHATSAPP_PHONE;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productEnquiryMessage(product: Product, quantity = 1, productUrl?: string) {
  return [
    "Hello ART SQUARE,",
    "",
    "I am interested in:",
    `Product: ${product.name}`,
    `Product ID: ${product.productCode}`,
    `Quantity: ${quantity}`,
    `Price: ${product.price === undefined ? "Please share the price" : `₹${product.price.toLocaleString("en-IN")}`}`,
    "Please share current availability and delivery details.",
    productUrl ? `Product link: ${productUrl}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}
