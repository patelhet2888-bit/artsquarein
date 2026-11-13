import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Globe2 } from "lucide-react";
import { ProductActions } from "@/components/product-actions";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { formatPrice } from "@/lib/format";
import { getProduct, getProductsByCategory } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return product ? {
    title: product.name,
    description: `${product.description} Ask ART SQUARE about price, availability and shipping by WhatsApp or the product enquiry form.`,
    openGraph: { title: `${product.name} | ART SQUARE`, description: product.description, images: product.images.slice(0, 1).map((image) => ({ url: image.src, alt: image.alt })) },
  } : { title: "Piece not found" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProductsByCategory(product.categoryId)).filter((item) => item.id !== product.id).slice(0, 3);
  const productUrl = new URL(`/product/${product.slug}`, process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsquarein.com").toString();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.productCode,
    description: product.description,
    image: product.images.map(({ src }) => src),
    brand: { "@type": "Brand", name: "ART SQUARE" },
    category: product.category,
    url: productUrl,
  };

  return <main id="main-content" className="product-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="breadcrumb"><Link href="/shop"><ArrowLeft size={14} /> Back to the collection</Link><span>/</span><span>{product.category}</span></div>
    <div className="product-detail">
      <ProductGallery images={product.images} name={product.name} />
      <div className="product-info">
        <span className="eyebrow">{product.category} · {product.productCode}</span>
        <h1>{product.name}</h1>
        <p className="product-description">{product.description}</p>
        <p className="availability"><span className="availability-dot" />{product.availability}</p>
        <div className="detail-specs">
          <div><span>Material</span><strong>{product.material ?? "Please enquire for verified material details"}</strong></div>
          <div><span>Dimensions</span><strong>{product.dimensions ?? "Please enquire for dimensions"}</strong></div>
          <div><span>Customization</span><strong>{product.customization}</strong></div>
          <div><span>Price</span><strong>{formatPrice(product.price)}</strong></div>
        </div>
        <ProductActions product={product} productUrl={productUrl} />
        <p className="shipping-note"><Globe2 size={15} /> Ask us about confirmed availability and shipping to your location.</p>
        <div className="product-promises"><span><Check size={14} /> Handmade in India</span><span><Check size={14} /> Enquiry-based ordering</span></div>
        {product.variants.length > 0 && <div className="product-variants"><span className="eyebrow">Available options</span><ul>{product.variants.map((variant) => <li key={variant}>{variant}</li>)}</ul></div>}
      </div>
    </div>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">In the same collection</span><h2>You may also <em>love.</em></h2></div><Link className="text-action" href="/shop">View all pieces <ArrowUpRight size={15} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
  </main>;
}
