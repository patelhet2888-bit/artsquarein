"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";
import type { MediaAsset } from "@/lib/media-upload";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

function toSlug(value: string) {
  return value.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminCategoryManager({ categories: initialCategories, mediaAssets }: { categories: CategoryRow[]; mediaAssets: MediaAsset[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCoverId, setNewCoverId] = useState("");
  const [newVisible, setNewVisible] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const mediaById = new Map(mediaAssets.map((asset) => [asset.id, asset]));

  function updateCategory(id: string, patch: Partial<CategoryRow>) {
    setCategories((current) => current.map((category) => category.id === id ? { ...category, ...patch } : category));
  }

  async function saveCategory(category: CategoryRow) {
    setSavingId(category.id);
    setMessage("");
    setSuccess(false);
    const { error } = await createClient().from("categories").update({
      name: category.name.trim(),
      slug: category.slug.trim(),
      description: category.description.trim(),
      cover_media_id: category.cover_media_id,
      sort_order: category.sort_order,
      is_visible: category.is_visible,
    }).eq("id", category.id);
    if (error) setMessage("Could not save this collection. Check that its name and URL slug are unique.");
    else {
      setSuccess(true);
      setMessage(`${category.name} saved.`);
      router.refresh();
    }
    setSavingId("");
  }

  async function deleteCategory(category: CategoryRow) {
    if (!window.confirm(`Delete the “${category.name}” collection? Products assigned to it must be moved first.`)) return;
    setSavingId(category.id);
    setMessage("");
    setSuccess(false);
    const { error } = await createClient().from("categories").delete().eq("id", category.id);
    if (error) setMessage("This collection still has products assigned. Move those products to another collection, or hide this collection instead.");
    else {
      setCategories((current) => current.filter((item) => item.id !== category.id));
      setSuccess(true);
      setMessage(`${category.name} deleted.`);
      router.refresh();
    }
    setSavingId("");
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);
    const { error } = await createClient().from("categories").insert({
      name: newName.trim(),
      slug: newSlug.trim() || toSlug(newName),
      description: newDescription.trim(),
      cover_media_id: newCoverId || null,
      sort_order: categories.length,
      is_visible: newVisible,
    });
    if (error) setMessage("Could not create this collection. Check that its name and URL slug are unique.");
    else {
      setSuccess(true);
      setMessage("Collection created.");
      setNewName("");
      setNewSlug("");
      setNewDescription("");
      setNewCoverId("");
      setNewVisible(false);
      router.refresh();
    }
  }

  return <div className="admin-category-manager">
    <form className="admin-panel admin-create-category" onSubmit={createCategory}>
      <div className="admin-panel-heading"><h2>Add a collection</h2><span className="admin-status">Hidden by default</span></div>
      <div className="admin-panel-body"><div className="admin-form-grid">
        <label className="admin-field"><span>Collection name</span><input required maxLength={100} value={newName} onChange={(event) => { const value = event.target.value; setNewName(value); if (!newSlug) setNewSlug(toSlug(value)); }} /></label>
        <label className="admin-field"><span>URL slug</span><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} value={newSlug} onChange={(event) => setNewSlug(toSlug(event.target.value))} /></label>
        <label className="admin-field admin-field-full"><span>Description</span><textarea rows={3} maxLength={1000} value={newDescription} onChange={(event) => setNewDescription(event.target.value)} /></label>
        <label className="admin-field"><span>Cover image</span><select value={newCoverId} onChange={(event) => setNewCoverId(event.target.value)}><option value="">No cover image</option>{mediaAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select></label>
        <label className="admin-checkbox"><input type="checkbox" checked={newVisible} onChange={(event) => setNewVisible(event.target.checked)} /> Show on storefront</label>
      </div><div className="admin-form-actions"><p className={`admin-form-message${success ? " is-success" : ""}`} role="status">{message}</p><button className="admin-button admin-button-primary" type="submit"><Plus size={14} /> Create collection</button></div></div>
    </form>

    <div className="admin-collection-list">{categories.map((category) => {
      const cover = category.cover_media_id ? mediaById.get(category.cover_media_id) : undefined;
      return <article className="admin-panel admin-collection-card" key={category.id}>
        <div className="admin-collection-cover">{cover ? <Image src={cover.url} alt={cover.alt_text || category.name} fill sizes="100px" /> : <span>No cover</span>}</div>
        <div className="admin-collection-fields">
          <div className="admin-form-grid">
            <label className="admin-field"><span>Name</span><input value={category.name} maxLength={100} onChange={(event) => updateCategory(category.id, { name: event.target.value })} /></label>
            <label className="admin-field"><span>URL slug</span><input value={category.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} onChange={(event) => updateCategory(category.id, { slug: toSlug(event.target.value) })} /></label>
            <label className="admin-field admin-field-full"><span>Description</span><textarea rows={2} maxLength={1000} value={category.description} onChange={(event) => updateCategory(category.id, { description: event.target.value })} /></label>
            <label className="admin-field"><span>Cover image</span><select value={category.cover_media_id ?? ""} onChange={(event) => updateCategory(category.id, { cover_media_id: event.target.value || null })}><option value="">No cover image</option>{mediaAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.file_name}</option>)}</select></label>
            <label className="admin-field"><span>Sort order</span><input type="number" step={1} value={category.sort_order} onChange={(event) => updateCategory(category.id, { sort_order: Number(event.target.value) || 0 })} /></label>
          </div>
          <div className="admin-form-actions"><label className="admin-checkbox"><input type="checkbox" checked={category.is_visible} onChange={(event) => updateCategory(category.id, { is_visible: event.target.checked })} /> Visible on storefront</label><div className="admin-row-actions"><button className="admin-button admin-button-small" type="button" onClick={() => saveCategory(category)} disabled={savingId === category.id}><Save size={13} />{savingId === category.id ? "Saving…" : "Save collection"}</button><button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => deleteCategory(category)} disabled={savingId === category.id}><Trash2 size={12} /> Delete</button></div></div>
        </div>
      </article>;
    })}</div>
  </div>;
}
