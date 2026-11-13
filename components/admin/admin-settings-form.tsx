"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { WHATSAPP_PHONE } from "@/lib/whatsapp";
import type { Database } from "@/lib/supabase/database.types";
import type { MediaAsset } from "@/lib/media-upload";

type SettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
type EditableSettings = Pick<SettingsRow, "brand_name" | "tagline" | "whatsapp_number" | "instagram_url" | "contact_email" | "announcement_text" | "hero_headline" | "hero_subheadline" | "hero_cta_label" | "hero_media_id" | "logo_media_id">;

export function AdminSettingsForm({ settings, mediaAssets, officialContactEmail }: { settings: SettingsRow; mediaAssets: MediaAsset[]; officialContactEmail?: string }) {
  const router = useRouter();
  const [values, setValues] = useState<EditableSettings>({
    brand_name: settings.brand_name,
    tagline: settings.tagline,
    whatsapp_number: WHATSAPP_PHONE,
    instagram_url: settings.instagram_url,
    contact_email: officialContactEmail ?? settings.contact_email,
    announcement_text: settings.announcement_text,
    hero_headline: settings.hero_headline,
    hero_subheadline: settings.hero_subheadline,
    hero_cta_label: settings.hero_cta_label,
    hero_media_id: settings.hero_media_id,
    logo_media_id: settings.logo_media_id,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const assetById = new Map(mediaAssets.map((asset) => [asset.id, asset]));

  function update<K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setSuccess(false);
    let instagramUrl: URL;
    try {
      instagramUrl = new URL(values.instagram_url.trim());
    } catch {
      setMessage("Enter a valid Instagram URL.");
      setSaving(false);
      return;
    }
    if (instagramUrl.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(instagramUrl.hostname)) {
      setMessage("Use a secure https://www.instagram.com/ URL.");
      setSaving(false);
      return;
    }
    const { error } = await createClient().from("site_settings").update({
      ...values,
      brand_name: values.brand_name.trim(),
      tagline: values.tagline.trim(),
      whatsapp_number: WHATSAPP_PHONE,
      instagram_url: values.instagram_url.trim(),
      contact_email: values.contact_email?.trim() || null,
      announcement_text: values.announcement_text.trim(),
      hero_headline: values.hero_headline.trim(),
      hero_subheadline: values.hero_subheadline.trim(),
      hero_cta_label: values.hero_cta_label.trim(),
    }).eq("id", true);
    if (error) setMessage("Could not save site settings. Check the WhatsApp number and public URLs.");
    else {
      setSuccess(true);
      setMessage("Site settings saved.");
      router.refresh();
    }
    setSaving(false);
  }

  const imageSelect = (label: string, field: "hero_media_id" | "logo_media_id") => {
    const selected = values[field] ? assetById.get(values[field]!) : undefined;
    return <div className="admin-settings-image">
      <label className="admin-field"><span>{label}</span><select value={values[field] ?? ""} onChange={(event) => update(field, event.target.value || null)}><option value="">Use the default image</option>{mediaAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select></label>
      {selected && <div className="admin-settings-preview"><Image src={selected.url} alt={selected.alt_text || selected.file_name} fill sizes="160px" /></div>}
    </div>;
  };

  return <form className="admin-panel" onSubmit={saveSettings}>
    <div className="admin-panel-heading"><h2>Storefront content</h2><span className="admin-status is-published">Live settings</span></div>
    <div className="admin-panel-body">
      <div className="admin-form-grid">
        <label className="admin-field"><span>Brand name</span><input required maxLength={100} value={values.brand_name} onChange={(event) => update("brand_name", event.target.value)} /></label>
        <label className="admin-field"><span>Tagline</span><input maxLength={180} value={values.tagline} onChange={(event) => update("tagline", event.target.value)} /></label>
        <label className="admin-field"><span>Official WhatsApp number</span><input inputMode="numeric" value={WHATSAPP_PHONE} readOnly aria-describedby="official-whatsapp-note" /><small id="official-whatsapp-note">Used consistently across the storefront and enquiry links.</small></label>
        <label className="admin-field"><span>Instagram URL</span><input type="url" required maxLength={300} value={values.instagram_url} onChange={(event) => update("instagram_url", event.target.value)} /></label>
        <label className="admin-field"><span>Public contact email</span><input type="email" maxLength={254} value={values.contact_email ?? ""} readOnly={Boolean(officialContactEmail)} onChange={(event) => update("contact_email", event.target.value)} />{officialContactEmail && <small>Managed by the project&apos;s existing contact setting.</small>}</label>
        <label className="admin-field"><span>Announcement bar</span><input maxLength={180} value={values.announcement_text} onChange={(event) => update("announcement_text", event.target.value)} /></label>
        <label className="admin-field admin-field-full"><span>Homepage headline</span><input required maxLength={200} value={values.hero_headline} onChange={(event) => update("hero_headline", event.target.value)} /></label>
        <label className="admin-field admin-field-full"><span>Homepage subheadline</span><textarea required rows={4} maxLength={600} value={values.hero_subheadline} onChange={(event) => update("hero_subheadline", event.target.value)} /></label>
        <label className="admin-field"><span>Homepage button label</span><input required maxLength={60} value={values.hero_cta_label} onChange={(event) => update("hero_cta_label", event.target.value)} /></label>
        {imageSelect("Homepage hero image", "hero_media_id")}
        {imageSelect("Brand logo", "logo_media_id")}
      </div>
      <div className="admin-form-actions"><p className={`admin-form-message${success ? " is-success" : ""}`} role="status">{message}</p><button className="admin-button admin-button-primary" type="submit" disabled={saving}><Save size={14} />{saving ? "Saving…" : "Save settings"}</button></div>
    </div>
  </form>;
}
