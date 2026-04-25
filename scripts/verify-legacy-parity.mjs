#!/usr/bin/env node
/**
 * After `npm run build`, verifies:
 * - public/style.css and public/script.js match repo root copies when those exist (pre-removal drift check).
 * - dist/index.html exposes DOM hooks required by public/script.js.
 * - When root index.html exists, it matches dist on the same hook set (optional pre-cleanup check).
 */
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function sha256(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

function fail(msg) {
  console.error(`PARITY FAIL: ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`OK: ${msg}`);
}

function assertFilePairMatchesRootOrAbsent(name) {
  const a = join(root, name);
  const b = join(root, 'public', name);
  if (!existsSync(b)) fail(`missing ${join('public', name)}`);
  if (existsSync(a)) {
    if (sha256(a) !== sha256(b)) fail(`${name}: root and public/ differ — sync public/ from root or resolve before removing root copy`);
    ok(`${name}: root === public`);
  } else {
    ok(`${name}: no root copy (using public/ only)`);
  }
}

assertFilePairMatchesRootOrAbsent('style.css');
assertFilePairMatchesRootOrAbsent('script.js');

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
ok('dist/index.html contains section/nav/form IDs required by script.js');

const requiredStrings = [
  'href="style.css"',
  'src="script.js"',
  'class="contact-form"',
  'name="access_key"',
];
for (const needle of requiredStrings) {
  if (!built.includes(needle)) fail(`dist/index.html missing ${JSON.stringify(needle)}`);
}
ok('dist/index.html loads style.css + script.js and includes Web3Forms access_key');

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
