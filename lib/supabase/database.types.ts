export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDefinition<
  Row extends Record<string, unknown>,
  Insert extends Record<string, unknown>,
  Update extends Record<string, unknown> = Partial<Insert>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" };
  public: {
    Tables: {
      admin_users: TableDefinition<
        { user_id: string; created_at: string },
        { user_id: string; created_at?: string },
        { user_id?: string; created_at?: string }
      >;
      media_assets: TableDefinition<
        { id: string; storage_path: string; file_name: string; mime_type: string; size_bytes: number; alt_text: string; uploaded_by: string | null; created_at: string },
        { id?: string; storage_path: string; file_name: string; mime_type: string; size_bytes: number; alt_text?: string; uploaded_by?: string | null; created_at?: string },
        { id?: string; storage_path?: string; file_name?: string; mime_type?: string; size_bytes?: number; alt_text?: string; uploaded_by?: string | null; created_at?: string }
      >;
      categories: TableDefinition<
        { id: string; name: string; slug: string; description: string; cover_media_id: string | null; sort_order: number; is_visible: boolean; created_at: string; updated_at: string },
        { id?: string; name: string; slug: string; description?: string; cover_media_id?: string | null; sort_order?: number; is_visible?: boolean; created_at?: string; updated_at?: string },
        { id?: string; name?: string; slug?: string; description?: string; cover_media_id?: string | null; sort_order?: number; is_visible?: boolean; created_at?: string; updated_at?: string }
      >;
      enquiries: TableDefinition<
        { id: string; name: string; email: string; country: string; whatsapp_number: string; product_id: string | null; product_name_snapshot: string; product_code_snapshot: string; message: string; status: string; created_at: string; updated_at: string },
        { id?: string; name: string; email: string; country: string; whatsapp_number: string; product_id?: string | null; product_name_snapshot?: string; product_code_snapshot?: string; message: string; status?: string; created_at?: string; updated_at?: string },
        { id?: string; name?: string; email?: string; country?: string; whatsapp_number?: string; product_id?: string | null; product_name_snapshot?: string; product_code_snapshot?: string; message?: string; status?: string; created_at?: string; updated_at?: string }
      >;
      newsletter_subscribers: TableDefinition<
        { id: string; email: string; created_at: string },
        { id?: string; email: string; created_at?: string },
        { id?: string; email?: string; created_at?: string }
      >;
      product_images: TableDefinition<
        { id: string; product_id: string; media_asset_id: string; alt_text: string; sort_order: number; is_primary: boolean; created_at: string },
        { id?: string; product_id: string; media_asset_id: string; alt_text?: string; sort_order?: number; is_primary?: boolean; created_at?: string },
        { id?: string; product_id?: string; media_asset_id?: string; alt_text?: string; sort_order?: number; is_primary?: boolean; created_at?: string }
      >;
      products: TableDefinition<
        { id: string; product_code: string; slug: string; name: string; category_id: string; short_description: string; description: string; price_inr: number | null; material: string; dimensions: string; variants: string[]; search_tags: string[]; customization: string; availability: string; stock_quantity: number | null; is_featured: boolean; status: string; sort_order: number; published_at: string | null; created_at: string; updated_at: string },
        { id?: string; product_code: string; slug: string; name: string; category_id: string; short_description?: string; description?: string; price_inr?: number | null; material?: string; dimensions?: string; variants?: string[]; search_tags?: string[]; customization?: string; availability?: string; stock_quantity?: number | null; is_featured?: boolean; status?: string; sort_order?: number; published_at?: string | null; created_at?: string; updated_at?: string },
        { id?: string; product_code?: string; slug?: string; name?: string; category_id?: string; short_description?: string; description?: string; price_inr?: number | null; material?: string; dimensions?: string; variants?: string[]; search_tags?: string[]; customization?: string; availability?: string; stock_quantity?: number | null; is_featured?: boolean; status?: string; sort_order?: number; published_at?: string | null; created_at?: string; updated_at?: string }
      >;
      site_settings: TableDefinition<
        { id: boolean; brand_name: string; tagline: string; whatsapp_number: string; instagram_url: string; contact_email: string | null; announcement_text: string; hero_headline: string; hero_subheadline: string; hero_cta_label: string; hero_media_id: string | null; logo_media_id: string | null; updated_at: string },
        { id?: boolean; brand_name?: string; tagline?: string; whatsapp_number?: string; instagram_url?: string; contact_email?: string | null; announcement_text?: string; hero_headline?: string; hero_subheadline?: string; hero_cta_label?: string; hero_media_id?: string | null; logo_media_id?: string | null; updated_at?: string },
        { id?: boolean; brand_name?: string; tagline?: string; whatsapp_number?: string; instagram_url?: string; contact_email?: string | null; announcement_text?: string; hero_headline?: string; hero_subheadline?: string; hero_cta_label?: string; hero_media_id?: string | null; logo_media_id?: string | null; updated_at?: string }
      >;
    };
    Views: Record<string, never>;
    Functions: { is_admin: { Args: Record<PropertyKey, never>; Returns: boolean } };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
