import type { Metadata } from "next";
import { AdminProductList, AdminProductsHeading } from "@/components/admin/admin-product-list";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Products · Admin", robots: { index: false, follow: false } };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("id, product_code, name, slug, status, is_featured, price_inr, updated_at, category_id").order("updated_at", { ascending: false }),
    supabase.from("categories").select("id, name"),
  ]);
  const categoryNameById = new Map((categories ?? []).map((category) => [category.id, category.name]));
  const items = (products ?? []).map((product) => ({
    ...product,
    category: categoryNameById.get(product.category_id) ?? "Unassigned",
  }));

  return <section><AdminProductsHeading /><AdminProductList products={items} /></section>;
}
