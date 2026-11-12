"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product, ProductCollection } from "@/lib/products";

type SortOption = "curated" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

export function ProductCatalog({
  products,
  categories,
  initialCategory = "All pieces",
  initialQuery = "",
}: {
  products: Product[];
  categories: ProductCollection[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const resolvedInitialCategory = categories.find((category) =>
    category.id === initialCategory || category.slug === initialCategory || category.name === initialCategory,
  )?.id ?? "all";
  const [categoryId, setCategoryId] = useState(resolvedInitialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>("curated");
  const hasPrices = products.some((product) => typeof product.price === "number");

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    const filtered = products.filter((product) => {
      const matchesCategory = categoryId === "all" || product.categoryId === categoryId;
      const searchable = `${product.name} ${product.productCode} ${product.category} ${product.description}`.toLocaleLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });

    return filtered.sort((first, second) => {
      if (sort === "name-asc") return first.name.localeCompare(second.name);
      if (sort === "name-desc") return second.name.localeCompare(first.name);
      if (sort === "price-asc") return (first.price ?? Number.POSITIVE_INFINITY) - (second.price ?? Number.POSITIVE_INFINITY);
      if (sort === "price-desc") return (second.price ?? Number.NEGATIVE_INFINITY) - (first.price ?? Number.NEGATIVE_INFINITY);
      return Number(second.featured) - Number(first.featured) || first.sortOrder - second.sortOrder;
    });
  }, [categoryId, products, query, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategoryId("all");
    setSort("curated");
  };

  return <section className="catalog-wrap">
    <div className="catalog-tools">
      <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Search products</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the collection" /></label>
      <label className="filter-control"><SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Filter products by category</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="all">All pieces</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label className="filter-control"><span className="sr-only">Sort products</span><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="curated">Curated order</option><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="price-asc" disabled={!hasPrices}>Price: low to high{!hasPrices ? " (add prices in Admin)" : ""}</option><option value="price-desc" disabled={!hasPrices}>Price: high to low{!hasPrices ? " (add prices in Admin)" : ""}</option></select></label>
      <span className="result-count" aria-live="polite">{visibleProducts.length} {visibleProducts.length === 1 ? "piece" : "pieces"}</span>
    </div>
    {!hasPrices && <p className="catalog-price-note">Prices and current availability are shared by enquiry.</p>}
    {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="eyebrow">A little quiet here</span><h2>No pieces found</h2><p>Try another search or browse all creations.</p><button className="text-action" type="button" onClick={clearFilters}>Clear filters <span aria-hidden="true">↗</span></button></div>}
  </section>;
}
