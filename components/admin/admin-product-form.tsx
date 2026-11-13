"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMediaFile, type MediaAsset } from "@/lib/media-upload";
import type { Database } from "@/lib/supabase/database.types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type CategoryOption = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name">;
type ProductImageSelection = { asset: MediaAsset; altText: string; isPrimary: boolean };
type InitialProduct = ProductRow & { images: ProductImageSelection[] };

function toSlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ProductAdminClient = ReturnType<typeof createClient>;

async function isProductSlugTaken(supabase: ProductAdminClient, slug: string, excludeProductId?: string) {
  let query = supabase.from("products").select("id").eq("slug", slug);
  if (excludeProductId) query = query.neq("id", excludeProductId);
  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function generateUniqueProductSlug(supabase: ProductAdminClient, baseSlug: string) {
  for (let suffix = 1; suffix <= 100; suffix += 1) {
    const candidate = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;
    if (!(await isProductSlugTaken(supabase, candidate))) return candidate;
  }
  throw new Error("A unique product URL could not be generated.");
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export function AdminProductForm({
  categories,
  mediaAssets: initialMediaAssets,
  product,
}: {
  categories: CategoryOption[];
  mediaAssets: MediaAsset[];
  product?: InitialProduct;
}) {
  const router = useRouter();
  const [mediaAssets, setMediaAssets] = useState(initialMediaAssets);
  const [images, setImages] = useState<ProductImageSelection[]>(product?.images ?? []);
  const [productCode, setProductCode] = useState(product?.product_code ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price_inr === null || product?.price_inr === undefined ? "" : String(product.price_inr));
  const [material, setMaterial] = useState(product?.material ?? "");
  const [dimensions, setDimensions] = useState(product?.dimensions ?? "");
  const [variants, setVariants] = useState(product?.variants.join("\n") ?? "");
  const [customization, setCustomization] = useState(product?.customization ?? "by_request");
  const [availability, setAvailability] = useState(product?.availability ?? "unknown");
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [sortOrder, setSortOrder] = useState(String(product?.sort_order ?? 0));
  const [featured, setFeatured] = useState(product?.is_featured ?? false);
  const [librarySelection, setLibrarySelection] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function addMedia(asset: MediaAsset) {
    setImages((current) => current.some((image) => image.asset.id === asset.id)
      ? current
      : [...current, { asset, altText: asset.alt_text, isPrimary: current.length === 0 }]);
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setMessage("");
    try {
      for (const file of files) {
        const asset = await uploadMediaFile(file, file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
        setMediaAssets((current) => [asset, ...current]);
        addMedia(asset);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function deleteProduct() {
    if (!product || !window.confirm(`Permanently delete ${product.name}? Existing enquiry records will be preserved without a product link.`)) return;
    setSaving(true);
    setMessage("");
    const { error } = await createClient().from("products").delete().eq("id", product.id);
    if (error) {
      setMessage("Could not delete this product. Please try again.");
      setSaving(false);
      return;
    }
    router.replace("/admin/products");
    router.refresh();
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    if (status === "published" && images.length === 0) {
      setMessage("Add at least one image before publishing a product.");
      return;
    }
    if (!categoryId) {
      setMessage("Create a category before saving a product.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const normalizedVariants = [...new Set(variants.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean))];
    const generatedTags = [...new Set(`${name} ${categories.find((category) => category.id === categoryId)?.name ?? ""}`
      .toLocaleLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((tag) => tag.length > 1))];
    const productValues = {
      product_code: productCode.trim(),
      slug: slug.trim() || toSlug(name),
      name: name.trim(),
      category_id: categoryId,
      short_description: (shortDescription.trim() || description.trim()).slice(0, 220),
      description: description.trim(),
      price_inr: price.trim() ? Number(price) : null,
      material: material.trim(),
      dimensions: dimensions.trim(),
      variants: normalizedVariants,
      search_tags: generatedTags,
      customization,
      availability,
      is_featured: featured,
      sort_order: Number(sortOrder) || 0,
    };

    try {
      const baseSlug = toSlug(!product && !slugEdited ? name : productValues.slug);
      if (!baseSlug) {
        setMessage("Enter a product name to generate a URL slug.");
        return;
      }

      const productSlug = !product && !slugEdited
        ? await generateUniqueProductSlug(supabase, baseSlug)
        : baseSlug;
      if ((product || slugEdited) && await isProductSlugTaken(supabase, productSlug, product?.id)) {
        setMessage("That URL slug is already in use. Choose a unique slug before saving.");
        return;
      }
      productValues.slug = productSlug;
      setSlug(productSlug);

      let productId = product?.id;
      if (productId) {
        const { error } = await supabase.from("products").update({ ...productValues, status: "draft" }).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert({ ...productValues, status: "draft" })
          .select("id")
          .single();
        if (error || !data) throw error ?? new Error("Product was not created.");
        productId = data.id;
      }

      if (product) {
        const { error } = await supabase.from("product_images").delete().eq("product_id", productId);
        if (error) throw error;
      }

      if (images.length) {
        const primaryIndex = Math.max(0, images.findIndex((image) => image.isPrimary));
        const { error } = await supabase.from("product_images").insert(images.map((image, index) => ({
          product_id: productId!,
          media_asset_id: image.asset.id,
          alt_text: image.altText.trim().slice(0, 500),
          sort_order: index,
          is_primary: index === primaryIndex,
        })));
        if (error) throw error;
      }

      const publishedAt = status === "published"
        ? product?.published_at ?? new Date().toISOString()
        : product?.published_at ?? null;
      const { error: publishError } = await supabase
        .from("products")
        .update({ status, published_at: publishedAt })
        .eq("id", productId);
      if (publishError) throw publishError;

      setSuccess(true);
      setMessage(status === "published" ? "Product saved and published to the storefront." : "Product saved.");
      router.refresh();
      if (!product) router.replace("/admin/products");
    } catch (error) {
      setMessage(isUniqueViolation(error)
        ? "Another product already uses this product code or URL slug. Choose a unique value and try again."
        : "We couldn’t save this product. Check that its product code and URL slug are unique, then try again.");
    } finally {
      setSaving(false);
    }
  }

  return <form className="admin-panel" onSubmit={saveProduct}>
    <div className="admin-panel-heading"><h2>{product ? "Product details" : "New product"}</h2><span className={`admin-status is-${status}`}>{status}</span></div>
    <div className="admin-panel-body">
      <div className="admin-form-grid">
        <label className="admin-field"><span>Product name</span><input required maxLength={180} value={name} onChange={(event) => { const value = event.target.value; setName(value); if (!slugEdited) setSlug(toSlug(value)); }} /></label>
        <label className="admin-field"><span>Product code</span><input required minLength={2} maxLength={50} value={productCode} onChange={(event) => setProductCode(event.target.value.toUpperCase())} placeholder="AS-026" /></label>
        <label className="admin-field"><span>URL slug</span><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={180} value={slug} onChange={(event) => { setSlug(toSlug(event.target.value)); setSlugEdited(true); }} /><small>Generated from the product name. You can edit it; slugs must be unique.</small></label>
        <label className="admin-field"><span>Collection</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="admin-field admin-field-full"><span>Short description</span><input maxLength={220} value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} placeholder="A concise line for product cards" /></label>
        <label className="admin-field admin-field-full"><span>Product description</span><textarea required minLength={3} maxLength={5000} rows={5} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label className="admin-field"><span>Price in INR (optional)</span><input type="number" min={0} step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Ask us for current pricing" /></label>
        <label className="admin-field"><span>Material</span><input maxLength={180} value={material} onChange={(event) => setMaterial(event.target.value)} /></label>
        <label className="admin-field"><span>Dimensions</span><input maxLength={120} value={dimensions} onChange={(event) => setDimensions(event.target.value)} /></label>
        <label className="admin-field"><span>Customization</span><select value={customization} onChange={(event) => setCustomization(event.target.value)}><option value="by_request">By request</option><option value="available">Available</option><option value="not_available">Not available</option></select></label>
        <label className="admin-field"><span>Availability</span><select value={availability} onChange={(event) => setAvailability(event.target.value)}><option value="unknown">Enquire for current availability</option><option value="in_stock">In stock</option><option value="out_of_stock">Out of stock</option><option value="made_to_order">Made to order</option></select></label>
        <label className="admin-field"><span>Variants (one per line)</span><textarea rows={3} value={variants} onChange={(event) => setVariants(event.target.value)} /></label>
        <label className="admin-field"><span>Visibility</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        <label className="admin-field"><span>Sort order</span><input type="number" step={1} value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /></label>
        <label className="admin-checkbox admin-field-full"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Feature this piece on the homepage</label>
      </div>

      <section className="admin-media-section" aria-labelledby="product-images-heading">
        <div className="admin-subheading"><div><span className="admin-kicker">PRODUCT PHOTOGRAPHY</span><h3 id="product-images-heading">Images</h3></div><span className="admin-muted">Published pieces need at least one image.</span></div>
        <div className="admin-upload-drop"><ImagePlus size={20} aria-hidden="true" /><strong>Upload original photographs</strong><span>JPEG, PNG or WebP · up to 5 MB each</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Upload product photographs" disabled={uploading} onChange={uploadFiles} /></div>
        {mediaAssets.length > 0 && <div className="admin-add-media"><label className="admin-field"><span>Add an existing image from the library</span><select value={librarySelection} onChange={(event) => setLibrarySelection(event.target.value)}><option value="">Choose an image…</option>{mediaAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select></label><button className="admin-button admin-button-small" type="button" disabled={!librarySelection} onClick={() => { const asset = mediaAssets.find((item) => item.id === librarySelection); if (asset) addMedia(asset); setLibrarySelection(""); }}>Add image</button></div>}
        {images.length > 0 ? <div className="admin-product-images">{images.map((image, index) => <article key={image.asset.id} className="admin-product-image">
          <Image src={image.asset.url} alt={image.altText || image.asset.file_name} width={480} height={320} sizes="(max-width: 760px) 90vw, 25vw" />
          <div className="admin-image-controls"><label><input type="radio" name="primary-image" checked={image.isPrimary} onChange={() => setImages((current) => current.map((item, itemIndex) => ({ ...item, isPrimary: itemIndex === index })))} /> Primary</label><button type="button" aria-label={`Move ${image.asset.file_name} up`} disabled={index === 0} onClick={() => moveImage(index, -1)}><ArrowUp size={13} /></button><button type="button" aria-label={`Move ${image.asset.file_name} down`} disabled={index === images.length - 1} onClick={() => moveImage(index, 1)}><ArrowDown size={13} /></button><button type="button" aria-label={`Remove ${image.asset.file_name}`} onClick={() => setImages((current) => { const remaining = current.filter((item) => item.asset.id !== image.asset.id); if (remaining.length && !remaining.some((item) => item.isPrimary)) remaining[0].isPrimary = true; return [...remaining]; })}><Trash2 size={13} /></button></div>
          <label className="admin-field admin-image-alt"><span>Alt text</span><input maxLength={500} value={image.altText} onChange={(event) => setImages((current) => current.map((item) => item.asset.id === image.asset.id ? { ...item, altText: event.target.value } : item))} /></label>
        </article>)}</div> : <p className="admin-empty">No images selected yet.</p>}
      </section>

      <div className="admin-form-actions"><p className={`admin-form-message${success ? " is-success" : ""}`} role="status">{uploading ? "Uploading images…" : message}</p><div className="admin-form-action-buttons">{product && <button className="admin-button admin-button-danger" type="button" disabled={saving || uploading} onClick={deleteProduct}><Trash2 size={14} /> Delete product</button>}<button className="admin-button admin-button-primary" type="submit" disabled={saving || uploading}><Save size={15} />{saving ? "Saving…" : "Save product"}</button></div></div>
    </div>
  </form>;
}
