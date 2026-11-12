import type { Metadata } from "next";
import { AdminMediaManager } from "@/components/admin/admin-media-manager";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Media library · Admin", robots: { index: false, follow: false } };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data: assets } = await supabase.from("media_assets").select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at").order("created_at", { ascending: false });
  const mediaAssets = (assets ?? []).map((asset) => ({ ...asset, url: supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl }));

  return <section>
    <div className="admin-page-heading"><div><span className="admin-kicker">ASSET LIBRARY</span><h1>Media</h1><p>Original ART SQUARE photographs are stored in Supabase Storage and reused across products, collections and homepage settings.</p></div></div>
    <AdminMediaManager initialAssets={mediaAssets} />
  </section>;
}
