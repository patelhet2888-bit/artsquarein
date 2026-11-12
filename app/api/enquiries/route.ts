import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phonePattern = /^\+?[0-9 ()-]{6,32}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function hasSameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  const expectedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !expectedHost) return false;

  try {
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "This request could not be accepted." }, { status: 403 });
  }

  let payload: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Enter your enquiry details and try again." }, { status: 400 });
    }
    payload = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Enter your enquiry details and try again." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const country = typeof payload.country === "string" ? payload.country.trim() : "";
  const whatsappNumber = typeof payload.whatsappNumber === "string" ? payload.whatsappNumber.trim() : "";
  const productReference = typeof payload.productReference === "string" ? payload.productReference.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (name.length < 1 || name.length > 120) {
    return NextResponse.json({ error: "Enter your name using 1 to 120 characters." }, { status: 400 });
  }
  if (email.length < 6 || email.length > 254 || !emailPattern.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (country.length < 2 || country.length > 80) {
    return NextResponse.json({ error: "Enter your country or region." }, { status: 400 });
  }
  if (!phonePattern.test(whatsappNumber)) {
    return NextResponse.json({ error: "Enter a WhatsApp number with country code." }, { status: 400 });
  }
  if (productReference.length > 180) {
    return NextResponse.json({ error: "Keep the product name or ID under 180 characters." }, { status: 400 });
  }
  if (message.length < 3 || message.length > 5000) {
    return NextResponse.json({ error: "Your message must be between 3 and 5,000 characters." }, { status: 400 });
  }

  const supabase = await createClient();
  let matchedProduct: { id: string; product_code: string; name: string } | null = null;

  if (productReference) {
    const lookup = async (column: "id" | "product_code" | "slug" | "name", value: string) => {
      const { data } = await supabase
        .from("products")
        .select("id, product_code, name")
        .eq("status", "published")
        .eq(column, value)
        .maybeSingle();
      return data;
    };

    if (uuidPattern.test(productReference)) matchedProduct = await lookup("id", productReference);
    if (!matchedProduct) matchedProduct = await lookup("product_code", productReference.toUpperCase());
    if (!matchedProduct) {
      const slug = productReference.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (slug) matchedProduct = await lookup("slug", slug);
    }
    if (!matchedProduct) matchedProduct = await lookup("name", productReference);
  }

  const { error } = await supabase.from("enquiries").insert({
    name,
    email,
    country,
    whatsapp_number: whatsappNumber,
    product_id: matchedProduct?.id ?? null,
    product_name_snapshot: matchedProduct?.name ?? productReference,
    product_code_snapshot: matchedProduct?.product_code ?? "",
    message,
    status: "new",
  });

  if (error) {
    return NextResponse.json({ error: "We couldn’t save your enquiry just now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
