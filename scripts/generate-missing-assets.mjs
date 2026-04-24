#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const srcSvg = path.join(root, 'assets', 'favicon.svg');
const srcLogo = path.join(root, 'assets', 'mfd-logo.jpg');

const outLegacyDir = path.join(root, 'assets');
const outPublicDir = path.join(root, 'public', 'assets');

function ensureDirs() {
  fs.mkdirSync(outLegacyDir, { recursive: true });
  fs.mkdirSync(outPublicDir, { recursive: true });
}

async function writeBoth(filename, pipeline) {
  const out1 = path.join(outLegacyDir, filename);
  const out2 = path.join(outPublicDir, filename);
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(out1);
  await pipeline.clone().png({ compressionLevel: 9 }).toFile(out2);
}

async function main() {
  ensureDirs();

  if (!fs.existsSync(srcSvg)) {
    throw new Error(`Missing source SVG: ${srcSvg}`);
  }
  if (!fs.existsSync(srcLogo)) {
    throw new Error(`Missing source logo JPG: ${srcLogo}`);
  }

  // Favicons from SVG for crisp rasterization.
  const density = 512;
  await writeBoth(
    'favicon-16x16.png',
    sharp(srcSvg, { density }).resize(16, 16, { fit: 'cover' })
  );
  await writeBoth(
    'favicon-32x32.png',
    sharp(srcSvg, { density }).resize(32, 32, { fit: 'cover' })
  );

  // Apple touch icon: background matches current theme background.
  const bg = '#F5F6FA';
  const appleMark = await sharp(srcSvg, { density })
    .resize(140, 140, { fit: 'contain' })
    .png()
    .toBuffer();
  const apple = sharp({
    create: { width: 180, height: 180, channels: 4, background: bg },
  }).composite([{ input: appleMark, gravity: 'center' }]);
  await writeBoth('apple-touch-icon.png', apple);

  // OG image: simple brand-safe logo on background (no redesign).
  const logoBuf = await sharp(srcLogo)
    .resize({ width: 720, height: 360, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();
  const og = sharp({
    create: { width: 1200, height: 630, channels: 4, background: bg },
  }).composite([{ input: logoBuf, gravity: 'center' }]);
  await writeBoth('og-image.png', og);

  console.log('Generated missing referenced assets:');
  console.log('- assets/favicon-16x16.png + public/assets/favicon-16x16.png');
  console.log('- assets/favicon-32x32.png + public/assets/favicon-32x32.png');
  console.log('- assets/apple-touch-icon.png + public/assets/apple-touch-icon.png');
  console.log('- assets/og-image.png + public/assets/og-image.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

