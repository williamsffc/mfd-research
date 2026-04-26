#!/usr/bin/env node
/**
 * After `npm run build`, verifies:
 * - dist/index.html exposes DOM hooks required by the shipped client script.
 * - built output includes bundled CSS/JS (Astro/Vite fingerprinted assets).
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function fail(msg) {
  console.error(`PARITY FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

if (existsSync(join(root, 'public', 'style.css'))) fail('public/style.css should not exist (now bundled from src/styles/global.css)');
if (existsSync(join(root, 'public', 'script.js'))) fail('public/script.js should not exist (now bundled from src/scripts/main.js)');
ok('CSS/JS are bundled from src/ (no public/ copies)');

const distIndex = join(root, 'dist', 'index.html');
if (!existsSync(distIndex)) fail('missing dist/index.html — run npm run build first');

const built = readFileSync(distIndex, 'utf8');

const requiredIds = [
  'id="main-content"',
  'id="navbar"',
  'id="navLinks"',
  'id="hamburger"',
  'id="themeToggle"',
  'id="contact-form"',
  'id="contact-status"',
  'id="footerYear"',
  'id="backToTop"',
  'id="loader-overlay"',
  'id="hero"',
  'id="about"',
  'id="services"',
  'id="process"',
  'id="experience"',
  'id="specialties"',
  'id="credentials"',
  'id="conferences"',
  'id="trust"',
  'id="faq"',
  'id="contact"',
];

for (const needle of requiredIds) {
  if (!built.includes(needle)) fail(`dist/index.html missing ${needle}`);
}
ok('dist/index.html contains section/nav/form IDs required by script');

const requiredStrings = [
  '/_astro/',
  'class="contact-form"',
  'name="access_key"',
];
for (const needle of requiredStrings) {
  if (!built.includes(needle)) fail(`dist/index.html missing ${JSON.stringify(needle)}`);
}
if (!/href="\/_astro\/[^"]+\.css"/.test(built)) fail('dist/index.html missing bundled CSS href under /_astro/');
if (!/src="\/_astro\/[^"]+\.js"/.test(built)) fail('dist/index.html missing bundled JS src under /_astro/');
ok('dist/index.html loads bundled CSS/JS and includes Web3Forms access_key');

const legacyIndex = join(root, 'index.html');
if (existsSync(legacyIndex)) {
  const legacy = readFileSync(legacyIndex, 'utf8');
  for (const needle of requiredIds) {
    if (!legacy.includes(needle)) fail(`legacy index.html missing ${needle}`);
  }
  ok('legacy root index.html present and exposes same ID hooks as dist');
} else {
  ok('legacy root index.html absent (post-cleanup)');
}

console.log('\nShipped-app parity checks passed.\n');
