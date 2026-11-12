import type { Metadata } from "next";
import { AdminCategoryManager } from "@/components/admin/admin-category-manager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Collections · Admin", robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: assets }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, description, cover_media_id, sort_order, is_visible, created_at, updated_at").order("sort_order", { ascending: true }),
    supabase.from("media_assets").select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at").order("created_at", { ascending: false }),
  ]);
  const mediaAssets = (assets ?? []).map((asset) => ({ ...asset, url: supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl }));

  return <section>
    <div className="admin-page-heading"><div><span className="admin-kicker">CATALOGUE ORGANIZATION</span><h1>Collections</h1><p>Create and arrange the categories customers use to explore the catalog. Hidden collections stay out of the storefront.</p></div></div>
    <AdminCategoryManager categories={categories ?? []} mediaAssets={mediaAssets} />
  </section>;
}
