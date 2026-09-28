#!/usr/bin/env node
/**
 * Regenerates the raster brand assets in public/assets/ from their vector sources:
 *
 *   public/assets/favicon-v2.svg  -> favicon-16x16-v2.png, favicon-32x32-v2.png,
 *                                    apple-touch-icon-v2.png, icon-192-v2.png, icon-512-v2.png
 *   public/assets/logo-v2.svg     -> logo-v2.png (600px, used in JSON-LD structured data)
 *   scripts/brand/og-image.svg    -> og-image-v2.png (1200x630 social share image)
 *
 * public/assets/* is cached for a year (public/_headers), so every output carries the
 * VERSION suffix below. When the artwork changes, bump VERSION, rerun this script, and
 * update the references (BaseLayout.astro, site.webmanifest, service-worker.js, legal
 * pages, JSON-LD in index.astro), or visitors keep the old files.
 *
 * All sources use outlined text, so rendering needs no fonts.
 * Usage: node scripts/generate-missing-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Bump when any source artwork changes (see header). Applies to every generated file.
const VERSION = 'v2';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const favicon = path.join(assetsDir, `favicon-${VERSION}.svg`);
const logo = path.join(assetsDir, `logo-${VERSION}.svg`);
const og = path.join(root, 'scripts', 'brand', 'og-image.svg');

for (const src of [favicon, logo, og]) {
  if (!fs.existsSync(src)) throw new Error(`Missing source SVG: ${src}`);
}

async function writePng(filename, pipeline) {
  await pipeline.png({ compressionLevel: 9 }).toFile(path.join(assetsDir, filename));
  console.log(`- ${filename}`);
}

async function main() {
  const density = 512;
  for (const size of [16, 32, 192, 512]) {
    const name = size <= 32 ? `favicon-${size}x${size}-${VERSION}.png` : `icon-${size}-${VERSION}.png`;
    await writePng(name, sharp(favicon, { density }).resize(size, size));
  }
  // iOS rounds the corners itself, so the touch icon is a full-bleed square.
  const square = fs.readFileSync(favicon, 'utf8').replace(/rx="14"/, 'rx="0"');
  await writePng(`apple-touch-icon-${VERSION}.png`, sharp(Buffer.from(square), { density }).resize(180, 180));
  await writePng(`logo-${VERSION}.png`, sharp(logo, { density }).resize({ width: 600 }).flatten({ background: '#FFFFFF' }));
  await writePng(`og-image-${VERSION}.png`, sharp(og, { density: 72 }).resize(1200, 630));
  console.log('Generated raster assets under public/assets/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
