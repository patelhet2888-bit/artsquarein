import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/products";

export const metadata: Metadata = { title: "Collections", description: "Browse ART SQUARE’s handmade collections: resin art, spiritual décor, wall art, clocks and thoughtful gifts." };
export default function CollectionsPage() { return <main id="main-content" className="page-main"><header className="page-hero"><span className="eyebrow">A collection for every corner</span><h1>Made to find<br /><em>its place.</em></h1><p>Explore handmade pieces by mood, moment and material. Looking for something specific? We’re happy to help.</p></header><div className="collection-list">{categories.map((item, index) => <Link key={item.slug} className="collection-list-item" href={`/shop?category=${encodeURIComponent(item.name)}`}><div className="collection-list-image"><Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 40vw, 28vw" /></div><span className="collection-index">0{index + 1}</span><span className="collection-list-name"><small>{item.slug.replaceAll("-", " ")}</small><strong>{item.name}</strong></span><ArrowUpRight className="collection-list-arrow" size={19} /></Link>)}</div></main>; }
