import type { MetadataRoute } from "next";

import { getSiteOrigin } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteOrigin();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/wishlist", "/api/"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
