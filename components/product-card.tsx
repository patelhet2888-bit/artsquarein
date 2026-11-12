import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return <article className="product-card"><Link href={`/product/${product.slug}`} className="product-card-image"><Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 25vw" priority={priority} /><span className="product-card-arrow" aria-hidden="true">↗</span></Link><div className="product-card-copy"><span className="eyebrow">{product.category}</span><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3><p>Price on enquiry <span aria-hidden="true">·</span> Handmade</p></div></article>;
}
