import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "New product · Admin", robots: { index: false, follow: false } };

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: mediaRows }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("media_assets").select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at").order("created_at", { ascending: false }),
  ]);
  const mediaAssets = (mediaRows ?? []).map((asset) => ({
    ...asset,
    url: supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl,
  }));

  return <section>
    <div className="admin-page-heading"><div><Link className="admin-back-link" href="/admin/products"><ArrowLeft size={14} /> Products</Link><span className="admin-kicker">CATALOGUE</span><h1>Add a product</h1><p>New products start as drafts. Add at least one original photograph before publishing.</p></div></div>
    {!categories?.length ? <div className="admin-panel admin-empty">Create a collection before adding a product. <Link href="/admin/categories">Manage collections</Link></div> : <AdminProductForm categories={categories} mediaAssets={mediaAssets} />}
  </section>;
}
