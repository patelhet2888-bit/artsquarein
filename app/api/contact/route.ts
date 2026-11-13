import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ENQUIRY_TYPES,
  serializeEnquiryDetails,
  type EnquiryType,
  type StoredEnquiryDetails,
} from "@/lib/enquiries";

const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const phonePattern = /^\+?[0-9 ()-]{6,32}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaxRequests = 8;
const rateLimit = new Map<string, { count: number; expiresAt: number }>();

function hasSameOrigin(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = request.headers.get("origin");
  const expectedHost = (request.headers.get("x-forwarded-host") ?? request.headers.get("host"))?.split(",")[0].trim();
  if (!origin || !expectedHost) return false;

  try {
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

function isRateLimited(request: Request) {
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (!ip) return false;

  const now = Date.now();
  const current = rateLimit.get(ip);
  if (!current || current.expiresAt <= now) {
    rateLimit.set(ip, { count: 1, expiresAt: now + rateLimitWindowMs });
  } else if (current.count >= rateLimitMaxRequests) {
    return true;
  } else {
    current.count += 1;
  }

  if (rateLimit.size > 2000) {
    for (const [key, value] of rateLimit) {
      if (value.expiresAt <= now) rateLimit.delete(key);
    }
  }
  return false;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return jsonResponse({ error: "This request could not be accepted." }, 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_000) {
    return jsonResponse({ error: "Your enquiry is too large. Shorten your message and try again." }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return jsonResponse({ error: "Enter your enquiry details and try again." }, 400);
    }
    payload = body as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "Enter your enquiry details and try again." }, 400);
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return jsonResponse({ ok: true }, 202);
  }
  if (isRateLimited(request)) {
    return jsonResponse({ error: "Too many enquiries were submitted from this connection. Please try again later." }, 429);
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const country = typeof payload.country === "string" ? payload.country.trim() : "";
  const whatsappNumber = typeof payload.whatsappNumber === "string" ? payload.whatsappNumber.trim() : "";
  const productReference = typeof payload.productReference === "string" ? payload.productReference.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const requestedType = typeof payload.enquiryType === "string" ? payload.enquiryType.trim() : "";
  if (requestedType && !ENQUIRY_TYPES.includes(requestedType as EnquiryType)) {
    return jsonResponse({ error: "Choose a valid enquiry type." }, 400);
  }
  const enquiryType: EnquiryType = ENQUIRY_TYPES.includes(requestedType as EnquiryType)
    ? (requestedType as EnquiryType)
    : productReference
      ? "Product Enquiry"
      : "General Enquiry";
  const subject = typeof payload.subject === "string" ? payload.subject.trim() : `${enquiryType} from ${name}`;

  if (name.length < 1 || name.length > 120) {
    return jsonResponse({ error: "Enter your name using 1 to 120 characters." }, 400);
  }
  if (email.length < 6 || email.length > 254 || !emailPattern.test(email)) {
    return jsonResponse({ error: "Enter a valid email address." }, 400);
  }
  if (country.length < 2 || country.length > 80) {
    return jsonResponse({ error: "Enter your country or region." }, 400);
  }
  if (whatsappNumber && !phonePattern.test(whatsappNumber)) {
    return jsonResponse({ error: "Enter a valid WhatsApp number, including the country code." }, 400);
  }
  if (subject.length < 3 || subject.length > 160) {
    return jsonResponse({ error: "Keep the subject between 3 and 160 characters." }, 400);
  }
  if (productReference.length > 180) {
    return jsonResponse({ error: "Keep the product name or ID under 180 characters." }, 400);
  }
  if (message.length < 3 || message.length > 3000) {
    return jsonResponse({ error: "Your message must be between 3 and 3,000 characters." }, 400);
  }

  if (payload.additionalDetails !== undefined && !Array.isArray(payload.additionalDetails)) {
    return jsonResponse({ error: "Some enquiry details were invalid. Please review and try again." }, 400);
  }
  const rawDetails = Array.isArray(payload.additionalDetails) ? payload.additionalDetails : [];
  if (rawDetails.length > 10 || rawDetails.some((item) => typeof item !== "string" || item.length > 2500)) {
    return jsonResponse({ error: "Some enquiry details were too long. Please shorten them and try again." }, 400);
  }
  const additionalDetails = rawDetails
    .map((item) => (item as string).trim())
    .filter(Boolean);

  const supabase = await createClient();
  let matchedProduct: { id: string; product_code: string; name: string; slug: string; price_inr: number | null } | null = null;

  if (productReference) {
    const lookup = async (column: "id" | "product_code" | "slug" | "name", value: string) => {
      const { data } = await supabase
        .from("products")
        .select("id, product_code, name, slug, price_inr")
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

  const requestOrigin = request.headers.get("origin");
  const productDetails = matchedProduct && requestOrigin
    ? {
        id: matchedProduct.id,
        name: matchedProduct.name,
        productCode: matchedProduct.product_code,
        url: new URL(`/product/${encodeURIComponent(matchedProduct.slug)}`, requestOrigin).toString(),
        price: matchedProduct.price_inr === null
          ? null
          : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(matchedProduct.price_inr)),
      }
    : undefined;

  const storedDetails: StoredEnquiryDetails = {
    version: 1,
    enquiryType,
    subject,
    message,
    additionalDetails,
    emailDeliveryStatus: "Failed",
    emailDeliveryNote: "No email provider is configured, so no notification was sent.",
    product: productDetails,
  };

  const { error } = await supabase.from("enquiries").insert({
    name,
    email,
    country,
    whatsapp_number: whatsappNumber,
    product_id: matchedProduct?.id ?? null,
    product_name_snapshot: matchedProduct?.name ?? productReference,
    product_code_snapshot: matchedProduct?.product_code ?? "",
    message: serializeEnquiryDetails(storedDetails),
    status: "new",
  });

  if (error) {
    return jsonResponse({ error: "We couldn’t save your enquiry just now. Please try again." }, 502);
  }

  return jsonResponse({
    ok: false,
    saved: true,
    emailDeliveryStatus: "Failed",
    error: "Your enquiry was saved, but email notifications are not configured, so the team was not notified. Please contact us on WhatsApp if your request is urgent.",
  }, 503);
}
