import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, products } from "@/lib/products";

export const metadata: Metadata = { title: "Collections", description: "Browse ART SQUARE’s eight handmade collections: resin pooja thalis, mirror and mandala art, clocks, spiritual décor, tree of life pieces and gifting." };

export default function CollectionsPage() {
  return <main id="main-content" className="page-main"><header className="page-hero"><span className="eyebrow">Eight ways to find your piece</span><h1>Made to find<br /><em>its place.</em></h1><p>Browse handmade creations by colour, craft and occasion. Product details and availability are shared by enquiry.</p></header><div className="collection-list">{categories.map((item, index) => {
    const productCount = products.filter((product) => product.category === item.name).length;
    return <Link key={item.slug} className="collection-list-item" href={`/collections/${item.slug}`}><div className="collection-list-image"><Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 700px) 40vw, 28vw" /></div><span className="collection-index">{String(index + 1).padStart(2, "0")}</span><span className="collection-list-name"><small>{productCount} {productCount === 1 ? "piece" : "pieces"}</small><strong>{item.name}</strong><span>{item.description}</span></span><ArrowUpRight className="collection-list-arrow" size={19} /></Link>;
  })}</div></main>;
}
