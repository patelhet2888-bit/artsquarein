import type { Metadata } from "next";
import { WishlistPage } from "@/components/wishlist-page";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

export default async function WishlistRoute() {
  const products = await getProducts();
  return <WishlistPage products={products} />;
}
