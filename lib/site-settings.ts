import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  instagramUrl: string;
  contactEmail: string;
  announcementText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaLabel: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  logoImageUrl?: string;
};

export const defaultSiteSettings: SiteSettings = {
  brandName: "ART SQUARE",
  tagline: "Where art meets elegance",
  whatsappNumber: "919054934190",
  instagramUrl: "https://www.instagram.com/art_square_in/",
  contactEmail: "",
  announcementText: "Handcrafted with love · Custom creations available",
  heroHeadline: "Art That Makes Every Space Special.",
  heroSubheadline: "Discover thoughtfully handcrafted creations that bring together Indian artistry, meaningful details and timeless elegance.",
  heroCtaLabel: "Explore Collections",
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("site_settings")
    .select("id, brand_name, tagline, whatsapp_number, instagram_url, contact_email, announcement_text, hero_headline, hero_subheadline, hero_cta_label, hero_media_id, logo_media_id")
    .eq("id", true)
    .maybeSingle();

  if (error || !row) return defaultSiteSettings;

  const mediaIds = [row.hero_media_id, row.logo_media_id].filter((id): id is string => Boolean(id));
  const { data: mediaRows } = mediaIds.length
    ? await supabase.from("media_assets").select("id, storage_path, alt_text").in("id", mediaIds)
    : { data: [] };
  const mediaById = new Map((mediaRows ?? []).map((media) => [media.id, media]));
  const urlById = new Map((mediaRows ?? []).map((media) => [
    media.id,
    supabase.storage.from("art-square-media").getPublicUrl(media.storage_path).data.publicUrl,
  ]));

  return {
    brandName: row.brand_name,
    tagline: row.tagline,
    whatsappNumber: row.whatsapp_number,
    instagramUrl: row.instagram_url,
    contactEmail: row.contact_email ?? "",
    announcementText: row.announcement_text || defaultSiteSettings.announcementText,
    heroHeadline: row.hero_headline,
    heroSubheadline: row.hero_subheadline,
    heroCtaLabel: row.hero_cta_label,
    heroImageUrl: row.hero_media_id ? urlById.get(row.hero_media_id) : undefined,
    heroImageAlt: row.hero_media_id ? mediaById.get(row.hero_media_id)?.alt_text : undefined,
    logoImageUrl: row.logo_media_id ? urlById.get(row.logo_media_id) : undefined,
  };
});
