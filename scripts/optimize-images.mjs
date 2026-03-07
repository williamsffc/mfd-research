#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format for better performance
 * Usage: node scripts/optimize-images.mjs
 */

import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '../assets');

console.log('\n🖼️  Image Optimization Guide\n');

console.log('To optimize images for this project, you can use one of these methods:\n');

console.log('1️⃣  Online Tools (Easiest):');
console.log('   • https://squoosh.app (by Google)');
console.log('   • https://tinypng.com');
console.log('   • https://cloudconvert.com/jpg-to-webp\n');

console.log('2️⃣  CLI Tools (Recommended):');
console.log('   Install Sharp (Node.js image processor):');
console.log('   $ npm install sharp --save-dev\n');
console.log('   Then convert images:');
console.log('   $ npx sharp -i assets/mfd-logo.jpg -o assets/mfd-logo.webp\n');

console.log('3️⃣  Using ImageMagick:');
console.log('   Install: brew install imagemagick (macOS)');
console.log('   Convert: magick convert assets/mfd-logo.jpg assets/mfd-logo.webp\n');

console.log('4️⃣  Bulk Optimization:');
console.log('   Install: npm install @squoosh/cli --save-dev');
console.log('   Run: npx @squoosh/cli --webp auto assets/*.jpg\n');

console.log('📋 Current Images in /assets:\n');

try {
  const files = await readdir(assetsDir);
  const imageFiles = files.filter(file => {
    const ext = extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext);
  });

  for (const file of imageFiles) {
    const filePath = join(assetsDir, file);
    const stats = await stat(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    const ext = extname(file).toLowerCase();

    let recommendation = '';
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      recommendation = ' → Consider converting to WebP';
    } else if (ext === '.webp') {
      recommendation = ' ✓ Already optimized';
    } else if (ext === '.svg') {
      recommendation = ' ✓ Vector format (already optimal)';
    }

    console.log(`   ${file} (${sizeKB} KB)${recommendation}`);
  }

  console.log('\n💡 After Optimization:');
  console.log('   Update HTML to use <picture> elements with WebP fallback:');
  console.log(`
   <picture>
     <source srcset="assets/image.webp" type="image/webp">
     <img src="assets/image.jpg" alt="Description" loading="lazy">
   </picture>
  `);

} catch (error) {
  console.error('Error reading assets directory:', error.message);
}

console.log('✨ Pro Tips:');
console.log('   • Aim for <100KB per image');
console.log('   • Use WebP for photos (70-90% smaller than JPEG)');
console.log('   • Use SVG for logos and icons');
console.log('   • Enable lazy loading with loading="lazy"');
console.log('   • Use responsive images with srcset\n');
