import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceFiles = [
  ["WhatsApp Image 2026-11-12 at 8.52.23 PM.jpeg", "pink-pooja-thali-promo"],
  ["WhatsApp Image 2026-11-12 at 8.52.37 PM.jpeg", "pink-pooja-thali-closeup"],
  ["WhatsApp Image 2026-11-12 at 8.52.38 PM (1).jpeg", "burgundy-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.52.38 PM.jpeg", "blue-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (1).jpeg", "green-mirror-work-wall-art"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (10).jpeg", "blue-pooja-thali-detail"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (11).jpeg", "ganesha-mantra-frame"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (12).jpeg", "white-mandala-mirror"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (13).jpeg", "emerald-gold-wall-clock"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (14).jpeg", "black-gold-luxury-clock"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (15).jpeg", "lotus-mantra-wall-panel"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (16).jpeg", "black-gold-tree-of-life"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (17).jpeg", "pink-pooja-thali-garden"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (18).jpeg", "marble-effect-clock"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (19).jpeg", "ivory-floral-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (2).jpeg", "red-mirror-work-wall-art"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (20).jpeg", "festive-red-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (3).jpeg", "blue-geometric-mirror-art"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (4).jpeg", "yellow-mandala-wall-art"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (5).jpeg", "blue-eye-inspired-wall-art"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (6).jpeg", "green-teal-circular-mandala"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (7).jpeg", "red-green-circular-mandala"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (8).jpeg", "purple-floral-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM (9).jpeg", "peacock-elephant-art-plates"],
  ["WhatsApp Image 2026-11-12 at 8.53.01 PM.jpeg", "pink-pooja-thali-blush"],
  ["WhatsApp Image 2026-11-12 at 8.55.53 PM.jpeg", "amber-decorative-tray"],
  ["WhatsApp Image 2026-11-12 at 8.55.56 PM.jpeg", "orange-gold-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 8.55.57 PM.jpeg", "red-floral-pooja-thali"],
  ["WhatsApp Image 2026-11-12 at 9.01.22 PM (1).jpeg", "burgundy-festive-tray-set"],
  ["WhatsApp Image 2026-11-12 at 9.01.22 PM.jpeg", "teal-decorative-clock"],
  ["WhatsApp Image 2026-11-12 at 9.01.23 PM (1).jpeg", "emerald-tree-of-life-art"],
  ["WhatsApp Image 2026-11-12 at 9.01.23 PM.jpeg", "miniature-thali-gift-set"],
];

const projectRoot = process.cwd();
const outputDirectory = path.join(projectRoot, "public", "images", "products");
await mkdir(outputDirectory, { recursive: true });

for (const [sourceName, outputName] of sourceFiles) {
  const sourcePath = path.join(projectRoot, sourceName);
  const outputPath = path.join(outputDirectory, `${outputName}.webp`);
  await sharp(sourcePath)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(outputPath);
}

console.log(`Optimized ${sourceFiles.length} source photographs into ${outputDirectory}. Original JPEGs were left untouched.`);
