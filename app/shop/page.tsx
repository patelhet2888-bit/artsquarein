import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";

export const metadata: Metadata = { title: "Shop Handmade Art & Home Décor", description: "Explore all 25 ART SQUARE products across resin pooja thalis, mirror and mandala art, clocks, spiritual décor, tree of life pieces and handmade gifts." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category, q } = await searchParams;
  return <main id="main-content" className="page-main"><header className="page-hero"><span className="eyebrow">The ART SQUARE collection</span><h1>Made by hand.<br /><em>Found by you.</em></h1><p>Browse 25 original product listings and all 32 supplied photographs. Price, materials and availability are confirmed by enquiry.</p></header><ProductCatalog key={`${category ?? "all"}:${q ?? ""}`} initialCategory={category ?? "All pieces"} initialQuery={q ?? ""} /></main>;
}
