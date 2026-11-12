import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Edit product · Admin", robots: { index: false, follow: false } };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: categories }, { data: imageRows }, { data: mediaRows }] = await Promise.all([
    supabase.from("products").select("id, product_code, slug, name, category_id, short_description, description, price_inr, material, dimensions, variants, search_tags, customization, availability, stock_quantity, is_featured, status, sort_order, published_at, created_at, updated_at").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("product_images").select("id, product_id, media_asset_id, alt_text, sort_order, is_primary, created_at").eq("product_id", id).order("sort_order", { ascending: true }),
    supabase.from("media_assets").select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at").order("created_at", { ascending: false }),
  ]);
  if (!product) notFound();

  const mediaAssets = (mediaRows ?? []).map((asset) => ({
    ...asset,
    url: supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl,
  }));
  const mediaById = new Map(mediaAssets.map((asset) => [asset.id, asset]));
  const images = (imageRows ?? []).flatMap((image) => {
    const asset = mediaById.get(image.media_asset_id);
    return asset ? [{ asset, altText: image.alt_text, isPrimary: image.is_primary }] : [];
  });

  return <section>
    <div className="admin-page-heading"><div><Link className="admin-back-link" href="/admin/products"><ArrowLeft size={14} /> Products</Link><span className="admin-kicker">{product.product_code}</span><h1>Edit product</h1><p>Update details, imagery and storefront visibility.</p></div><Link className="admin-button" href={`/product/${product.slug}`} target="_blank" rel="noreferrer">Preview product</Link></div>
    <AdminProductForm categories={categories ?? []} mediaAssets={mediaAssets} product={{ ...product, images }} />
  </section>;
}
