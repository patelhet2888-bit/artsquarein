import type { Metadata } from "next";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Site settings · Admin", robots: { index: false, follow: false } };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const [{ data: settings }, { data: assets }] = await Promise.all([
    supabase.from("site_settings").select("id, brand_name, tagline, whatsapp_number, instagram_url, contact_email, announcement_text, hero_headline, hero_subheadline, hero_cta_label, hero_media_id, logo_media_id, updated_at").eq("id", true).maybeSingle(),
    supabase.from("media_assets").select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at").order("created_at", { ascending: false }),
  ]);
  if (!settings) return <section><div className="admin-panel admin-empty">Site settings are unavailable. Refresh the workspace and try again.</div></section>;
  const mediaAssets = (assets ?? []).map((asset) => ({ ...asset, url: supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl }));

  return <section>
    <div className="admin-page-heading"><div><span className="admin-kicker">STOREFRONT CONFIGURATION</span><h1>Site settings</h1><p>Update the business details and homepage content shown across the public storefront.</p></div></div>
    <AdminSettingsForm settings={settings} mediaAssets={mediaAssets} />
  </section>;
}
