import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Our Story", description: "Meet ART SQUARE: a celebration of thoughtful craftsmanship, Indian artistry and handmade pieces for everyday life." };

export default async function AboutPage() {
  const [products, settings] = await Promise.all([getProducts(), getSiteSettings()]);
  const storyImage = products[0]?.images[0];

  return <main id="main-content" className="page-main">
    <header className="page-hero"><span className="eyebrow">A note from {settings.brandName}</span><h1>Beauty, made<br /><em>by hand.</em></h1><p>Where art meets elegance — and the everyday becomes a little more meaningful.</p></header>
    <section className="about-feature"><div className="about-image">{storyImage && <Image src={storyImage.src} alt={storyImage.alt} fill sizes="(max-width: 750px) 100vw, 50vw" priority />}</div><div className="about-copy"><span className="eyebrow">Every creation tells a story</span><h2>Craftsmanship.<br />Creativity.<br /><em>A little wonder.</em></h2><p>{settings.brandName} celebrates the beauty of things made slowly and with intention. We bring together Indian artistic traditions, expressive colour and thoughtful detail in handmade pieces for the home and for life’s meaningful moments.</p><p>From devotional décor to statement wall art, every creation is an invitation to surround yourself with things that feel personal. The small variations in handmade work aren’t imperfections; they are part of the story.</p><Link className="text-action" href="/shop">Discover the collection <ArrowRight size={16} /></Link></div></section>
    <section className="about-values"><span className="eyebrow">A few things we believe</span><div className="values-grid"><article><span>01 / Craft</span><h3>Care lives in the details.</h3><p>From the first idea to the finishing touch, the making matters.</p></article><article><span>02 / Culture</span><h3>Rooted, never static.</h3><p>Traditional Indian art can feel at home in spaces of every kind.</p></article><article><span>03 / Connection</span><h3>Made personal.</h3><p>Your thoughtful questions and custom ideas are always welcome.</p></article></div></section>
    <section className="about-cta"><span className="eyebrow">We’d love to hear what you’re imagining</span><h2>Let’s find a piece<br />that feels like <em>you.</em></h2><Link href="/contact" className="button button-dark">Start a conversation <ArrowUpRight size={16} /></Link></section>
  </main>;
}
