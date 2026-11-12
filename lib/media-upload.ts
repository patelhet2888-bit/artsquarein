import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"] & { url: string };

const maxImageBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFileName(fileName: string) {
  const sanitized = fileName.trim().replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return sanitized || "art-square-image";
}

async function hasSupportedSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  return file.type === "image/webp"
    && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
    && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

export async function uploadMediaFile(file: File, altText: string): Promise<MediaAsset> {
  if (file.size < 1 || file.size > maxImageBytes || !allowedTypes.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image smaller than 5 MB.");
  }
  if (!(await hasSupportedSignature(file))) {
    throw new Error("The file content does not match a supported image format.");
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in again before uploading media.");

  const storagePath = `library/${crypto.randomUUID()}/${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage.from("art-square-media").upload(storagePath, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error("The image could not be uploaded. Please try again.");

  const { data, error: insertError } = await supabase
    .from("media_assets")
    .insert({
      storage_path: storagePath,
      file_name: safeFileName(file.name),
      mime_type: file.type,
      size_bytes: file.size,
      alt_text: altText.trim().slice(0, 500),
      uploaded_by: user.id,
    })
    .select("id, storage_path, file_name, mime_type, size_bytes, alt_text, uploaded_by, created_at")
    .single();

  if (insertError || !data) {
    await supabase.storage.from("art-square-media").remove([storagePath]);
    throw new Error("The image was uploaded but could not be added to the media library.");
  }

  return {
    ...data,
    url: supabase.storage.from("art-square-media").getPublicUrl(storagePath).data.publicUrl,
  };
}
