"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/products";

export function ProductCatalog({ initialCategory = "All pieces" }: { initialCategory?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => products.filter((product) => (category === "All pieces" || product.category === category) && `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase())), [category, query]);
  return <section className="catalog-wrap"><div className="catalog-tools"><label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></label><label className="filter-control"><SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Filter products by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All pieces</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label><span className="result-count">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span></div>{visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="eyebrow">A little quiet here</span><h2>No pieces found</h2><p>Try another search or browse all creations.</p><button className="text-action" onClick={() => { setQuery(""); setCategory("All pieces"); }}>Clear filters ↗</button></div>}</section>;
}
