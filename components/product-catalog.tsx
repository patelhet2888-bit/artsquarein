"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/products";

type SortOption = "curated" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

export function ProductCatalog({ initialCategory = "All pieces", initialQuery = "" }: { initialCategory?: string; initialQuery?: string }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("curated");
  const hasPrices = products.some((product) => typeof product.price === "number");

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = category === "All pieces" || product.category === category;
      const matchesQuery = !search || `${product.name} ${product.id} ${product.category} ${product.description}`.toLocaleLowerCase().includes(search);
      return matchesCategory && matchesQuery;
    });

    return filtered.sort((first, second) => {
      if (sort === "name-asc") return first.name.localeCompare(second.name);
      if (sort === "name-desc") return second.name.localeCompare(first.name);
      if (sort === "price-asc") return (first.price ?? Number.POSITIVE_INFINITY) - (second.price ?? Number.POSITIVE_INFINITY);
      if (sort === "price-desc") return (second.price ?? Number.NEGATIVE_INFINITY) - (first.price ?? Number.NEGATIVE_INFINITY);
      return Number(second.featured) - Number(first.featured);
    });
  }, [category, query, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All pieces");
    setSort("curated");
  };

  return <section className="catalog-wrap">
    <div className="catalog-tools">
      <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></label>
      <label className="filter-control"><SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Filter products by category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All pieces</option>{categories.map((item) => <option key={item.slug}>{item.name}</option>)}</select></label>
      <label className="filter-control"><span className="sr-only">Sort products</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="curated">Curated order</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option>{hasPrices && <><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></>}</select></label>
      <span className="result-count" aria-live="polite">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
    </div>
    {!hasPrices && <p className="catalog-price-note">Prices and current availability are shared by enquiry.</p>}
    {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="eyebrow">A little quiet here</span><h2>No pieces found</h2><p>Try another search or browse all creations.</p><button className="text-action" type="button" onClick={clearFilters}>Clear filters <span aria-hidden="true">↗</span></button></div>}
  </section>;
}
