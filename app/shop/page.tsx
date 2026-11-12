import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";

export const metadata: Metadata = { title: "Shop Handmade Art & Home Décor", description: "Explore handcrafted resin art, spiritual décor, wall art, clocks and more. Every piece is available by WhatsApp enquiry." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return <main id="main-content" className="page-main"><header className="page-hero"><span className="eyebrow">The ART SQUARE collection</span><h1>Made by hand.<br /><em>Found by you.</em></h1><p>Explore our collection of handmade art and décor. Each piece has its own story; ask us for details, availability and shipping options.</p></header><ProductCatalog initialCategory={category ?? "All pieces"} /></main>;
}
