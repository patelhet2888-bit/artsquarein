import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/products";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artsquarein.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ["", "/shop", "/collections", "/about", "/custom-orders", "/contact", "/privacy", "/shipping"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
  const collectionRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${base}/collections/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/product/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
