import type { Metadata } from "next";
import { ProductCatalog } from "@/components/product-catalog";
import { getCatalog } from "@/lib/products";

export const metadata: Metadata = { title: "Shop Handmade Art & Home Décor", description: "Explore handmade ART SQUARE products across resin pooja thalis, mirror and mandala art, clocks, spiritual décor, tree of life pieces and handmade gifts." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category, q }, catalog] = await Promise.all([searchParams, getCatalog()]);
  return <main id="main-content" className="page-main"><header className="page-hero"><span className="eyebrow">The ART SQUARE collection</span><h1>Made by hand.<br /><em>Found by you.</em></h1><p>Browse {catalog.products.length} original product listings. Price, materials and availability are confirmed by enquiry.</p></header><ProductCatalog key={`${category ?? "all"}:${q ?? ""}`} products={catalog.products} categories={catalog.categories} initialCategory={category ?? "All pieces"} initialQuery={q ?? ""} /></main>;
}
