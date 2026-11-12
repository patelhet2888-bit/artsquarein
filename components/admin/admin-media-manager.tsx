"use client";

import Image from "next/image";
import { useMemo, useState, type ChangeEvent } from "react";
import { ImagePlus, Save, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMediaFile, type MediaAsset } from "@/lib/media-upload";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminMediaManager({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const visibleAssets = useMemo(() => assets.filter((asset) => `${asset.file_name} ${asset.alt_text}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [assets, query]);

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setMessage("");
    setSuccess(false);
    try {
      const uploaded: MediaAsset[] = [];
      for (const file of files) {
        uploaded.push(await uploadMediaFile(file, file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")));
      }
      setAssets((current) => [...uploaded, ...current]);
      setSuccess(true);
      setMessage(`${uploaded.length} ${uploaded.length === 1 ? "image" : "images"} added to the library.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The images could not be uploaded.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function saveAltText(asset: MediaAsset) {
    setBusyId(asset.id);
    setMessage("");
    setSuccess(false);
    const { error } = await createClient().from("media_assets").update({ alt_text: asset.alt_text.trim().slice(0, 500) }).eq("id", asset.id);
    if (error) setMessage("Could not save this image description.");
    else {
      setSuccess(true);
      setMessage("Image description saved.");
    }
    setBusyId("");
  }

  return <>
    <section className="admin-panel admin-media-upload"><div className="admin-panel-heading"><h2>Upload original images</h2><span className="admin-status">Public storefront media</span></div><div className="admin-panel-body">
      <div className="admin-upload-drop"><ImagePlus size={22} aria-hidden="true" /><strong>Choose product, collection or homepage images</strong><span>JPEG, PNG or WebP · maximum 5 MB per image</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple aria-label="Upload images to media library" disabled={uploading} onChange={uploadFiles} /></div>
      <p className={`admin-form-message${success ? " is-success" : ""}`} role="status">{uploading ? "Uploading and registering images…" : message}</p>
    </div></section>
    <div className="admin-media-toolbar"><label className="admin-search-wrap"><Search size={15} aria-hidden="true" /><span className="sr-only">Search media</span><input className="admin-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file names or descriptions" /></label><span className="admin-result-count">{visibleAssets.length} images</span></div>
    <div className="admin-media-grid">{visibleAssets.map((asset) => <article className="admin-media-card" key={asset.id}>
      <div className="admin-media-preview"><Image src={asset.url} alt={asset.alt_text || asset.file_name} fill sizes="(max-width: 760px) 45vw, 22vw" /></div>
      <div className="admin-media-copy"><strong title={asset.file_name}>{asset.file_name}</strong><small>{formatBytes(asset.size_bytes)} · {asset.mime_type.replace("image/", "").toUpperCase()}</small><label className="admin-field"><span>Alt text</span><input maxLength={500} value={asset.alt_text} onChange={(event) => setAssets((current) => current.map((item) => item.id === asset.id ? { ...item, alt_text: event.target.value } : item))} /></label><button className="admin-button admin-button-small" type="button" disabled={busyId === asset.id} onClick={() => saveAltText(asset)}><Save size={12} />{busyId === asset.id ? "Saving…" : "Save description"}</button></div>
    </article>)}</div>
    {!visibleAssets.length && <div className="admin-panel admin-empty">No images match your search.</div>}
  </>;
}
