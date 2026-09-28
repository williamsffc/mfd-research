#!/usr/bin/env node
/**
 * Regenerates the raster brand assets in public/assets/ from their vector sources:
 *
 *   public/assets/favicon.svg     -> favicon-16x16.png, favicon-32x32.png,
 *                                    apple-touch-icon.png, icon-192.png, icon-512.png
 *   public/assets/logo.svg        -> logo.png (600px, used in JSON-LD structured data)
 *   scripts/brand/og-image.svg    -> og-image.png (1200x630 social share image)
 *
 * All sources use outlined text, so rendering needs no fonts.
 * Usage: node scripts/generate-missing-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const favicon = path.join(assetsDir, 'favicon.svg');
const logo = path.join(assetsDir, 'logo.svg');
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
    const name = size <= 32 ? `favicon-${size}x${size}.png` : `icon-${size}.png`;
    await writePng(name, sharp(favicon, { density }).resize(size, size));
  }
  // iOS rounds the corners itself, so the touch icon is a full-bleed square.
  const square = fs.readFileSync(favicon, 'utf8').replace(/rx="14"/, 'rx="0"');
  await writePng('apple-touch-icon.png', sharp(Buffer.from(square), { density }).resize(180, 180));
  await writePng('logo.png', sharp(logo, { density }).resize({ width: 600 }).flatten({ background: '#FFFFFF' }));
  await writePng('og-image.png', sharp(og, { density: 72 }).resize(1200, 630));
  console.log('Generated raster assets under public/assets/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
