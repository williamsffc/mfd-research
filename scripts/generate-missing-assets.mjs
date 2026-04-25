#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const assetsDir = path.join(root, 'public', 'assets');
const srcSvg = path.join(assetsDir, 'favicon.svg');
const srcLogo = path.join(assetsDir, 'mfd-logo.jpg');

function ensureDirs() {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function writePng(filename, pipeline) {
  const out = path.join(assetsDir, filename);
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(out);
}

async function main() {
  ensureDirs();

  if (!fs.existsSync(srcSvg)) {
    throw new Error(`Missing source SVG: ${srcSvg}`);
  }
  if (!fs.existsSync(srcLogo)) {
    throw new Error(`Missing source logo JPG: ${srcLogo}`);
  }

  const density = 512;
  await writePng('favicon-16x16.png', sharp(srcSvg, { density }).resize(16, 16, { fit: 'cover' }));
  await writePng('favicon-32x32.png', sharp(srcSvg, { density }).resize(32, 32, { fit: 'cover' }));

  const bg = '#F5F6FA';
  const appleMark = await sharp(srcSvg, { density })
    .resize(140, 140, { fit: 'contain' })
    .png()
    .toBuffer();
  const apple = sharp({
    create: { width: 180, height: 180, channels: 4, background: bg },
  }).composite([{ input: appleMark, gravity: 'center' }]);
  await writePng('apple-touch-icon.png', apple);

  const logoBuf = await sharp(srcLogo)
    .resize({ width: 720, height: 360, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();
  const og = sharp({
    create: { width: 1200, height: 630, channels: 4, background: bg },
  }).composite([{ input: logoBuf, gravity: 'center' }]);
  await writePng('og-image.png', og);

  console.log('Generated raster assets under public/assets/:');
  console.log('- favicon-16x16.png');
  console.log('- favicon-32x32.png');
  console.log('- apple-touch-icon.png');
  console.log('- og-image.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
