import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type ProductImage = {
  id: string;
  src: string;
  alt: string;
  isPrimary: boolean;
};

export type Product = {
  id: string;
  productCode: string;
  name: string;
  slug: string;
  category: string;
  categoryId: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  price?: number;
  images: ProductImage[];
  material?: string;
  dimensions?: string;
  variants: string[];
  customization: "Please enquire" | "Available" | "Not available";
  availability: string;
  availabilityStatus: string;
  featured: boolean;
  sortOrder: number;
};

export type ProductCollection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: ProductImage;
  sortOrder: number;
};

const availabilityLabels: Record<string, string> = {
  unknown: "Enquire for current availability",
  in_stock: "In stock",
  out_of_stock: "Currently unavailable",
  made_to_order: "Made to order",
};

const customizationLabels: Record<string, Product["customization"]> = {
  by_request: "Please enquire",
  available: "Available",
  not_available: "Not available",
};

export const getCatalog = cache(async () => {
  const supabase = await createClient();
  const [categoryResult, productResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description, cover_media_id, sort_order")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("products")
      .select("id, product_code, slug, name, category_id, short_description, description, price_inr, material, dimensions, variants, customization, availability, is_featured, sort_order")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  if (categoryResult.error) throw new Error("The ART SQUARE collections could not be loaded.");
  if (productResult.error) throw new Error("The ART SQUARE catalog could not be loaded.");

  const categories = categoryResult.data ?? [];
  const rows = productResult.data ?? [];
  const productIds = rows.map((product) => product.id);
  const mediaIds = [
    ...categories.flatMap((category) => category.cover_media_id ? [category.cover_media_id] : []),
  ];

  const imageResult = productIds.length
    ? await supabase
        .from("product_images")
        .select("id, product_id, media_asset_id, alt_text, sort_order, is_primary")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true })
    : { data: [], error: null };

  if (imageResult.error) throw new Error("The ART SQUARE product images could not be loaded.");

  const imageRows = imageResult.data ?? [];
  const assetIds = [...new Set([
    ...mediaIds,
    ...imageRows.map((image) => image.media_asset_id),
  ])];
  const { data: assetRows, error: assetError } = assetIds.length
    ? await supabase.from("media_assets").select("id, storage_path, alt_text").in("id", assetIds)
    : { data: [], error: null };
  if (assetError) throw new Error("The ART SQUARE media library could not be loaded.");

  const mediaById = new Map((assetRows ?? []).map((asset) => [asset.id, asset]));
  const publicUrlById = new Map((assetRows ?? []).map((asset) => [
    asset.id,
    supabase.storage.from("art-square-media").getPublicUrl(asset.storage_path).data.publicUrl,
  ]));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const imagesByProduct = new Map<string, ProductImage[]>();

  for (const image of imageRows) {
    const src = publicUrlById.get(image.media_asset_id);
    if (!src) continue;
    const productImages = imagesByProduct.get(image.product_id) ?? [];
    productImages.push({
      id: image.id,
      src,
      alt: image.alt_text,
      isPrimary: image.is_primary,
    });
    imagesByProduct.set(image.product_id, productImages);
  }

  for (const images of imagesByProduct.values()) {
    images.sort((first, second) => Number(second.isPrimary) - Number(first.isPrimary));
  }

  const products: Product[] = rows.flatMap((row) => {
    const category = categoryById.get(row.category_id);
    const images = imagesByProduct.get(row.id) ?? [];
    if (!category || images.length === 0) return [];

    return [{
      id: row.id,
      productCode: row.product_code,
      name: row.name,
      slug: row.slug,
      category: category.name,
      categoryId: category.id,
      categorySlug: category.slug,
      description: row.description,
      shortDescription: row.short_description,
      price: row.price_inr === null ? undefined : Number(row.price_inr),
      images,
      material: row.material || undefined,
      dimensions: row.dimensions || undefined,
      variants: row.variants,
      customization: customizationLabels[row.customization] ?? "Please enquire",
      availability: availabilityLabels[row.availability] ?? availabilityLabels.unknown,
      availabilityStatus: row.availability,
      featured: row.is_featured,
      sortOrder: row.sort_order,
    }];
  });

  const collections: ProductCollection[] = categories.map((category) => {
    const coverUrl = category.cover_media_id ? publicUrlById.get(category.cover_media_id) : undefined;
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sort_order,
      image: coverUrl ? {
        id: category.cover_media_id!,
        src: coverUrl,
        alt: mediaById.get(category.cover_media_id!)?.alt_text || category.name,
        isPrimary: true,
      } : products.find((product) => product.categoryId === category.id)?.images[0],
    };
  });

  return { categories: collections, products };
});

export const getProducts = cache(async () => (await getCatalog()).products);
export const getCategories = cache(async () => (await getCatalog()).categories);

export const getProduct = cache(async (slug: string) =>
  (await getProducts()).find((product) => product.slug === slug),
);

export const getCollection = cache(async (slug: string) =>
  (await getCategories()).find((category) => category.slug === slug),
);

export const getProductsByCategory = cache(async (categoryId: string) =>
  (await getProducts()).filter((product) => product.categoryId === categoryId),
);
