const VERIFIED_PRODUCTION_HOST = "art-square-website-development.vercel.app";

export function getSiteOrigin() {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (!productionHost) return `https://${VERIFIED_PRODUCTION_HOST}`;

  try {
    const url = new URL(productionHost.startsWith("http") ? productionHost : `https://${productionHost}`);
    return url.origin;
  } catch {
    return `https://${VERIFIED_PRODUCTION_HOST}`;
  }
}

export function getProductUrl(slug: string) {
  return new URL(`/product/${encodeURIComponent(slug)}`, getSiteOrigin()).toString();
}
