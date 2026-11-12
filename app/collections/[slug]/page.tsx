import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { categories, getCollection, getProductsByCategory } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
    openGraph: { title: `${collection.name} | ART SQUARE`, description: collection.description, images: [{ url: collection.image.src, alt: collection.image.alt }] },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const collectionProducts = getProductsByCategory(collection.name);

  return <main id="main-content" className="page-main collection-detail-page">
    <div className="breadcrumb"><Link href="/collections"><ArrowLeft size={14} /> All collections</Link><span>/</span><span>{collection.name}</span></div>
    <header className="collection-detail-hero">
      <div className="collection-detail-copy"><span className="eyebrow">ART SQUARE collection</span><h1>{collection.name}</h1><p>{collection.description}</p><span className="collection-piece-count">{collectionProducts.length} {collectionProducts.length === 1 ? "piece" : "pieces"} to explore</span></div>
      <div className="collection-detail-image"><Image src={collection.image.src} alt={collection.image.alt} fill priority sizes="(max-width: 760px) 100vw, 45vw" /></div>
    </header>
    <section className="collection-products"><div className="section-heading"><div><span className="eyebrow">Made by hand</span><h2>Find your <em>favourite.</em></h2></div><Link className="text-action" href="/shop">Shop all creations <ArrowUpRight size={15} /></Link></div>
      {collectionProducts.length ? <div className="product-grid">{collectionProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h2>New pieces are on their way.</h2><p>Ask us about this collection or explore all available creations.</p><Link className="button-primary" href="/contact">Enquire with ART SQUARE <ArrowUpRight size={15} /></Link></div>}
    </section>
  </main>;
}
