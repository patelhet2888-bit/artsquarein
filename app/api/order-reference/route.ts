import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const bucket = "art-square-order-references";
const maxFileSize = 4 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const signedUrlLifetimeSeconds = 60 * 60 * 24 * 7;

function isValidImageSignature(type: string, bytes: Buffer) {
  if (type === "image/jpeg") {
    return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9;
  }

  if (type === "image/png") {
    return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }

  return type === "image/webp"
    && bytes.length >= 12
    && bytes.toString("ascii", 0, 4) === "RIFF"
    && bytes.toString("ascii", 8, 12) === "WEBP";
}

function hasSameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;

  const origin = request.headers.get("origin");
  const expectedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !expectedHost) return true;

  try {
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "This upload request is not allowed." }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxFileSize + 64 * 1024) {
    return NextResponse.json({ error: "Choose an image smaller than 5 MB." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "The upload could not be read. Please try again." }, { status: 400 });
  }

  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) {
    return NextResponse.json({ error: "The upload could not be accepted." }, { status: 400 });
  }

  const file = formData.get("reference");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a reference image to upload." }, { status: 400 });
  }
  if (file.size < 1 || file.size > maxFileSize || !acceptedTypes.has(file.type)) {
    return NextResponse.json({ error: "Use a JPEG, PNG, or WebP image smaller than 5 MB." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!isValidImageSignature(file.type, bytes)) {
    return NextResponse.json({ error: "The file content does not match a supported image format." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Reference uploads are temporarily unavailable. Please contact us on WhatsApp." }, { status: 503 });
  }

  const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const objectPath = `${randomUUID()}.${extension}`;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: "The reference image could not be uploaded. Please try again." }, { status: 502 });
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, signedUrlLifetimeSeconds);

  if (signedUrlError || !data?.signedUrl) {
    await supabase.storage.from(bucket).remove([objectPath]);
    return NextResponse.json({ error: "A secure image link could not be created. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl }, { headers: { "Cache-Control": "no-store" } });
}
