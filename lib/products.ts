export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price?: number;
  images: { src: string; alt: string }[];
  material: string;
  dimensions: string;
  variants: string[];
  customizable: boolean;
  availability: string;
  featured: boolean;
};

export const categories = [
  { name: "Resin Art", slug: "resin-art", image: "/products/resin-pooja-thali.jpeg", alt: "Hand-finished floral resin pooja thali" },
  { name: "Spiritual & Pooja Decor", slug: "spiritual-pooja-decor", image: "/products/resin-thali-detail.jpeg", alt: "Pink resin pooja thali with floral detailing" },
  { name: "Wall Decor", slug: "wall-decor", image: "/products/lotus-wall-panel.jpeg", alt: "Green handcrafted mandala wall panel" },
  { name: "Decorative Clocks", slug: "decorative-clocks", image: "/products/marble-effect-clock.jpeg", alt: "Marble-effect decorative clock" },
  { name: "Traditional Indian Art", slug: "traditional-indian-art", image: "/products/mantra-frame.jpeg", alt: "Traditional framed mantra artwork" },
  { name: "Handmade Gifts", slug: "handmade-gifts", image: "/products/peacock-elephant-art-plates.jpeg", alt: "Hand-painted peacock and elephant art plates" },
  { name: "Customized Creations", slug: "customized-creations", image: "/products/money-tree-art.jpeg", alt: "Handcrafted money tree art" },
];

export const products: Product[] = [
  { id: "AS-001", name: "Money Tree Art", slug: "money-tree-art", category: "Customized Creations", description: "A dimensional tree-of-life composition, crafted by hand to bring a thoughtful, artful focal point to your space.", images: [{ src: "/products/money-tree-art.jpeg", alt: "Money tree artwork with gold-toned accents" }, { src: "/products/money-tree-display.jpeg", alt: "Round money tree artwork displayed on a stand" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: true },
  { id: "AS-002", name: "Resin Pooja Thali", slug: "resin-pooja-thali", category: "Spiritual & Pooja Decor", description: "A floral resin pooja thali with carefully placed decorative details. Each handmade piece has its own character.", images: [{ src: "/products/resin-pooja-thali.jpeg", alt: "Floral pink resin pooja thali in a styled setting" }, { src: "/products/resin-thali-detail.jpeg", alt: "Close detail of floral pink resin pooja thali" }, { src: "/products/crystal-pooja-thali.jpeg", alt: "Blue floral resin pooja thali" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: true },
  { id: "AS-003", name: "Marble-Effect Decorative Clock", slug: "marble-effect-decorative-clock", category: "Decorative Clocks", description: "A sculptural wall clock with a soft marble-effect face and gold-toned detailing.", images: [{ src: "/products/marble-effect-clock.jpeg", alt: "Marble-effect clock with gold-tone hands" }, { src: "/products/luxury-crystal-clock.jpeg", alt: "Textured green decorative clock" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: false, availability: "Enquire for current availability", featured: true },
  { id: "AS-004", name: "Traditional Lotus Wall Panel", slug: "traditional-lotus-wall-panel", category: "Wall Decor", description: "A vivid mandala-inspired wall panel photographed in its garden setting; an expressive accent for a considered interior.", images: [{ src: "/products/lotus-wall-panel.jpeg", alt: "Green mandala wall panel among leafy plants" }, { src: "/products/traditional-wall-art.jpeg", alt: "Red traditional circular wall panel" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: true },
  { id: "AS-005", name: "Decorative Mandala Mirror", slug: "decorative-mandala-mirror", category: "Wall Decor", description: "A round, hand-decorated mandala-style wall piece with a reflective centre and intricate painted detailing.", images: [{ src: "/products/mandala-mirror.jpeg", alt: "Round mandala-style decorative mirror" }, { src: "/products/decorative-wall-art.jpeg", alt: "Decorative circular folk-art wall pieces" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: false },
  { id: "AS-006", name: "Luxury Crystal Clock", slug: "luxury-crystal-clock", category: "Decorative Clocks", description: "A gold-toned decorative wall clock with a richly textured, light-catching frame.", images: [{ src: "/products/luxury-crystal-clock.jpeg", alt: "Green-faced decorative wall clock with gold-tone frame" }, { src: "/products/marble-effect-clock.jpeg", alt: "Marble-effect decorative clock" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: false, availability: "Enquire for current availability", featured: false },
  { id: "AS-007", name: "Spiritual Mantra Frame", slug: "spiritual-mantra-frame", category: "Traditional Indian Art", description: "A framed devotional artwork featuring traditional script and a considered floral border.", images: [{ src: "/products/mantra-frame.jpeg", alt: "Framed devotional mantra artwork with floral borders" }, { src: "/products/decorative-wall-art.jpeg", alt: "Hand-painted traditional art plates" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: false, availability: "Enquire for current availability", featured: false },
  { id: "AS-008", name: "Peacock and Elephant Art Plates", slug: "peacock-elephant-art-plates", category: "Traditional Indian Art", description: "A pair of folk-art plates illustrated with peacock and elephant motifs in a fresh, traditional palette.", images: [{ src: "/products/peacock-elephant-art-plates.jpeg", alt: "Two folk-art plates with peacock and elephant motifs" }, { src: "/products/mandala-mirror.jpeg", alt: "Hand-painted decorative circular artwork" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: false },
  { id: "AS-009", name: "Floral Resin Pooja Thali", slug: "floral-resin-pooja-thali", category: "Spiritual & Pooja Decor", description: "A warm-toned floral resin thali, shown styled for a festive pooja setting.", images: [{ src: "/products/resin-pooja-thali.jpeg", alt: "Floral resin pooja thali styled with diyas" }, { src: "/products/resin-thali-detail.jpeg", alt: "Pink floral resin pooja thali detail" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: false },
  { id: "AS-010", name: "Traditional Decorative Wall Art", slug: "traditional-decorative-wall-art", category: "Wall Decor", description: "A hand-painted statement piece inspired by traditional Indian decorative motifs.", images: [{ src: "/products/traditional-wall-art.jpeg", alt: "Red circular Indian-inspired decorative wall art" }, { src: "/products/lotus-wall-panel.jpeg", alt: "Green mandala wall panel" }], material: "Please enquire for material details", dimensions: "Please enquire for dimensions", variants: [], customizable: true, availability: "Enquire for current availability", featured: false },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
