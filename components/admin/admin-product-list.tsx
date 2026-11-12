"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { formatPrice } from "@/lib/format";

type ProductListItem = {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  status: string;
  is_featured: boolean;
  price_inr: number | null;
  updated_at: string;
  category: string;
};

export function AdminProductList({ products }: { products: ProductListItem[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const visible = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.product_code} ${product.name} ${product.category}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    return matchesQuery && (status === "all" || product.status === status);
  }), [products, query, status]);

  return <>
    <div className="admin-toolbar">
      <label className="admin-search-wrap"><Search size={15} aria-hidden="true" /><span className="sr-only">Search products</span><input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or product code" /></label>
      <label className="admin-filter"><span className="sr-only">Filter products by status</span><select className="admin-search" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></label>
      <span className="admin-result-count">{visible.length} {visible.length === 1 ? "product" : "products"}</span>
    </div>
    <div className="admin-panel admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Collection</th><th>Price</th><th>Status</th><th>Updated</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
      {visible.map((product) => <tr key={product.id}>
        <td><strong>{product.name}</strong><small>{product.product_code}{product.is_featured ? " · Featured" : ""}</small></td>
        <td>{product.category}</td>
        <td>{formatPrice(product.price_inr ?? undefined)}</td>
        <td><span className={`admin-status is-${product.status}`}>{product.status}</span></td>
        <td>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(product.updated_at))}</td>
        <td><Link className="admin-row-link" href={`/admin/products/${product.id}`} aria-label={`Edit ${product.name}`}>Edit <ArrowUpRight size={13} /></Link></td>
      </tr>)}
    </tbody></table>{!visible.length && <p className="admin-empty">No products match these filters.</p>}</div>
  </>;
}

export function AdminProductsHeading() {
  return <div className="admin-page-heading"><div><span className="admin-kicker">CATALOGUE</span><h1>Products</h1><p>Manage published pieces, drafts, pricing, photography and product details.</p></div><Link className="admin-button admin-button-primary" href="/admin/products/new"><Plus size={15} /> New product</Link></div>;
}
