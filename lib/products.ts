export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price?: number;
  images: ProductImage[];
  material?: string;
  dimensions?: string;
  variants: string[];
  customization: "Please enquire" | "Available" | "Not available";
  availability: "Enquire for current availability";
  featured: boolean;
};

export type ProductCollection = {
  name: string;
  slug: string;
  description: string;
  image: ProductImage;
};

const photo = (filename: string, alt: string): ProductImage => ({
  src: `/images/products/${filename}.webp`,
  alt,
});

export const categories: ProductCollection[] = [
  {
    name: "Resin & Pooja Thali",
    slug: "resin-pooja-thali",
    description: "Hand-finished ritual trays and floral resin details, photographed as they are.",
    image: photo("pink-pooja-thali-promo", "Pink floral pooja thali with hand-arranged decorative details"),
  },
  {
    name: "Lippan & Mirror Art",
    slug: "lippan-mirror-art",
    description: "Reflective accents and dimensional folk-inspired wall art in a range of colours.",
    image: photo("green-mirror-work-wall-art", "Green mirror-work wall art with raised decorative motifs"),
  },
  {
    name: "Mandala Art",
    slug: "mandala-art",
    description: "Intricate circular patterns and ornamental details for considered spaces.",
    image: photo("white-mandala-mirror", "White round mandala wall accent with a reflective centre"),
  },
  {
    name: "Wall Clocks",
    slug: "wall-clocks",
    description: "Decorative timepieces, from a soft marble-effect face to jewel-toned finishes.",
    image: photo("marble-effect-clock", "Decorative wall clock with a light marble-effect face"),
  },
  {
    name: "Spiritual Wall Décor",
    slug: "spiritual-wall-decor",
    description: "Devotional frames, traditional motifs and meaningful pieces for the home.",
    image: photo("ganesha-mantra-frame", "Framed devotional artwork with a Ganesha motif"),
  },
  {
    name: "Tree of Life",
    slug: "tree-of-life",
    description: "Handmade tree-of-life compositions in dark and emerald palettes.",
    image: photo("black-gold-tree-of-life", "Black and gold tree-of-life artwork"),
  },
  {
    name: "Decorative Trays",
    slug: "decorative-trays",
    description: "Statement platters and keepsake pieces made for gifting and display.",
    image: photo("amber-decorative-tray", "Amber-toned decorative tray with floral detailing"),
  },
  {
    name: "Festive & Custom Gifting",
    slug: "festive-custom-gifting",
    description: "Thoughtful handmade sets for celebrations, keepsakes and custom enquiries.",
    image: photo("miniature-thali-gift-set", "Matching miniature handmade thali gift set"),
  },
];

export const products: Product[] = [
  {
    id: "AS-001",
    name: "Money Tree Art",
    slug: "money-tree-art",
    category: "Tree of Life",
    description: "A dimensional tree-of-life composition photographed in a black-and-gold palette. Ask us about its finish, sizing and made-to-order options.",
    images: [
      photo("black-gold-tree-of-life", "Black and gold tree-of-life artwork with a dimensional branching design"),
    ],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-002",
    name: "Pink Floral Resin Pooja Thali",
    slug: "pink-floral-resin-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "A floral pink pooja thali shown in several arrangements and settings. Each photograph is an original reference from the supplied collection.",
    images: [
      photo("pink-pooja-thali-promo", "Pink floral pooja thali in an editorial product photograph"),
      photo("pink-pooja-thali-closeup", "Close view of a pink floral pooja thali and matching bowls"),
      photo("pink-pooja-thali-garden", "Pink floral pooja thali photographed in a garden setting"),
      photo("pink-pooja-thali-blush", "Blush pink floral pooja thali with decorative accents"),
    ],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-003",
    name: "Burgundy Resin Pooja Thali",
    slug: "burgundy-resin-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "A richly coloured burgundy and red pooja thali, presented in multiple views from the reference photographs.",
    images: [
      photo("burgundy-pooja-thali", "Burgundy floral pooja thali photographed from above"),
      photo("festive-red-pooja-thali", "Red festive pooja thali arranged with decorative details"),
      photo("red-floral-pooja-thali", "Red floral pooja thali with matching ritual accessories"),
    ],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-004",
    name: "Blue Resin Pooja Thali",
    slug: "blue-resin-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "A blue floral pooja thali shown in two complementary product photographs. Please enquire for exact materials and dimensions.",
    images: [
      photo("blue-pooja-thali", "Blue floral pooja thali with coordinated decorative pieces"),
      photo("blue-pooja-thali-detail", "Second view of the blue floral pooja thali"),
    ],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-005",
    name: "Marble-Effect Decorative Clock",
    slug: "marble-effect-decorative-clock",
    category: "Wall Clocks",
    description: "A decorative wall clock with a light marble-effect face and gold-toned visual accents.",
    images: [photo("marble-effect-clock", "Wall clock with a pale marble-effect face and gold-toned hands")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-006",
    name: "Emerald Green Luxury Clock",
    slug: "emerald-green-luxury-clock",
    category: "Wall Clocks",
    description: "A jewel-toned decorative clock with an emerald-green face and an ornate gold-coloured frame.",
    images: [photo("emerald-gold-wall-clock", "Emerald-green decorative clock with an ornate gold-coloured frame")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-007",
    name: "Black and Gold Luxury Clock",
    slug: "black-gold-luxury-clock",
    category: "Wall Clocks",
    description: "A statement black-and-gold clock with a richly detailed decorative face.",
    images: [photo("black-gold-luxury-clock", "Black and gold decorative wall clock with an ornate face")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-008",
    name: "Traditional Lotus Wall Panel",
    slug: "traditional-lotus-wall-panel",
    category: "Spiritual Wall Décor",
    description: "A red multi-panel wall artwork featuring lotus and traditional devotional motifs.",
    images: [photo("lotus-mantra-wall-panel", "Red multi-panel wall art with lotus and devotional motifs")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-009",
    name: "Teal Decorative Clock",
    slug: "teal-decorative-clock",
    category: "Wall Clocks",
    description: "A teal-toned decorative wall clock with an embellished frame. Please enquire for verified dimensions and availability.",
    images: [photo("teal-decorative-clock", "Teal decorative wall clock with an embellished frame")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-010",
    name: "Spiritual Mantra Frame",
    slug: "spiritual-mantra-frame",
    category: "Spiritual Wall Décor",
    description: "A framed devotional artwork photographed with a Ganesha motif and traditional detailing.",
    images: [photo("ganesha-mantra-frame", "Framed devotional artwork with a Ganesha motif and traditional detailing")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-011",
    name: "Peacock and Elephant Art Plates",
    slug: "peacock-elephant-art-plates",
    category: "Spiritual Wall Décor",
    description: "A pair of decorative art plates illustrated with peacock and elephant motifs.",
    images: [photo("peacock-elephant-art-plates", "Pair of decorative plates with peacock and elephant motifs")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-012",
    name: "Floral Resin Pooja Thali",
    slug: "floral-resin-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "An ivory-toned floral pooja thali with a soft, ornamental palette.",
    images: [photo("ivory-floral-pooja-thali", "Ivory floral pooja thali photographed with decorative accents")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-013",
    name: "Decorative Mandala Mirror",
    slug: "decorative-mandala-mirror",
    category: "Mandala Art",
    description: "A round mandala-style wall accent with a central reflective surface and detailed ornamental border.",
    images: [photo("white-mandala-mirror", "Round white mandala wall accent with a reflective centre")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-014",
    name: "Green Mirror-Work Wall Art",
    slug: "green-mirror-work-wall-art",
    category: "Lippan & Mirror Art",
    description: "A green square wall accent with raised mirror-work details and a geometric composition.",
    images: [photo("green-mirror-work-wall-art", "Green square wall art with raised reflective details")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-015",
    name: "Red Mirror-Work Wall Art",
    slug: "red-mirror-work-wall-art",
    category: "Lippan & Mirror Art",
    description: "A red square decorative wall piece with hand-finished mirror-work styling.",
    images: [photo("red-mirror-work-wall-art", "Red square wall accent with geometric mirror-work detailing")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-016",
    name: "Blue Geometric Mirror Art",
    slug: "blue-geometric-mirror-art",
    category: "Lippan & Mirror Art",
    description: "A blue geometric wall accent with bright reflective details and a symmetrical pattern.",
    images: [photo("blue-geometric-mirror-art", "Blue geometric wall art with reflective details")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-017",
    name: "Yellow Mandala Wall Art",
    slug: "yellow-mandala-wall-art",
    category: "Mandala Art",
    description: "A yellow and gold-toned ornamental wall piece with a circular mandala-inspired centre.",
    images: [photo("yellow-mandala-wall-art", "Yellow and gold-toned circular mandala wall art")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-018",
    name: "Evil Eye-Inspired Wall Art",
    slug: "evil-eye-inspired-wall-art",
    category: "Spiritual Wall Décor",
    description: "A blue decorative wall accent with a concentric, eye-inspired motif.",
    images: [photo("blue-eye-inspired-wall-art", "Blue decorative wall accent with a concentric eye-inspired motif")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-019",
    name: "Circular Mandala Wall Art",
    slug: "circular-mandala-wall-art",
    category: "Mandala Art",
    description: "Two circular ornamental wall designs with traditional patterning and layered colour.",
    images: [
      photo("green-teal-circular-mandala", "Green and teal circular mandala wall art"),
      photo("red-green-circular-mandala", "Red and green circular mandala wall art"),
    ],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-020",
    name: "Purple Floral Resin Pooja Thali",
    slug: "purple-floral-resin-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "A purple floral pooja thali with coordinated decorative details.",
    images: [photo("purple-floral-pooja-thali", "Purple floral pooja thali with coordinated decorative details")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-021",
    name: "Amber Decorative Pooja Tray",
    slug: "amber-decorative-pooja-tray",
    category: "Decorative Trays",
    description: "An amber-toned decorative tray photographed with floral and ritual accents.",
    images: [photo("amber-decorative-tray", "Amber-toned decorative tray with floral and ritual accents")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-022",
    name: "Orange and Gold Pooja Thali",
    slug: "orange-gold-pooja-thali",
    category: "Resin & Pooja Thali",
    description: "A vibrant orange and gold-toned thali photographed with a coordinated decorative arrangement.",
    images: [photo("orange-gold-pooja-thali", "Orange and gold-toned pooja thali with decorative accents")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
  {
    id: "AS-023",
    name: "Burgundy Festive Tray Set",
    slug: "burgundy-festive-tray-set",
    category: "Festive & Custom Gifting",
    description: "A coordinated set of burgundy decorative trays, photographed together as a festive gifting idea.",
    images: [photo("burgundy-festive-tray-set", "Coordinated burgundy decorative tray set")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-024",
    name: "Emerald Green Tree of Life Art",
    slug: "emerald-tree-of-life-art",
    category: "Tree of Life",
    description: "A green circular tree-of-life wall accent with a dimensional, branching centre.",
    images: [photo("emerald-tree-of-life-art", "Green circular tree-of-life artwork with a dimensional centre")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: true,
  },
  {
    id: "AS-025",
    name: "Miniature Festive Thali Gift Set",
    slug: "miniature-festive-thali-gift-set",
    category: "Festive & Custom Gifting",
    description: "A set of miniature festive thalis presented together as a handmade gifting collection.",
    images: [photo("miniature-thali-gift-set", "Matching miniature handmade thali gift set")],
    variants: [],
    customization: "Please enquire",
    availability: "Enquire for current availability",
    featured: false,
  },
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

export const getCollection = (slug: string) => categories.find((category) => category.slug === slug);

export const getProductsByCategory = (categoryName: string) =>
  products.filter((product) => product.category === categoryName);

export const formatPrice = (price?: number) =>
  typeof price === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price)
    : "Contact for Price";
