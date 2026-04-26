#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const distRoot = join(repoRoot, 'dist');
const serviceWorkerPath = join(repoRoot, 'public', 'service-worker.js');

function fail(message) {
  console.error(`PRECACHE FAIL: ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`OK: ${message}`);
}

if (!existsSync(distRoot)) fail('missing dist/ output; run npm run build first');
if (!existsSync(serviceWorkerPath)) fail('missing public/service-worker.js');

const source = readFileSync(serviceWorkerPath, 'utf8');
const match = source.match(/const\s+PRECACHE_URLS\s*=\s*\[([\s\S]*?)\];/);
if (!match) fail('could not locate PRECACHE_URLS array in public/service-worker.js');

const entries = [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]);
if (entries.length === 0) fail('PRECACHE_URLS is empty');

const missing = [];

for (const entry of entries) {
  const distPath =
    entry === '/'
      ? join(distRoot, 'index.html')
      : join(distRoot, entry.replace(/^\//, ''));

  if (!existsSync(distPath)) {
    missing.push(`${entry} -> ${distPath}`);
  }
}

if (missing.length > 0) {
  fail(`missing built precache asset(s): ${missing.join(', ')}`);
}

ok(`PRECACHE_URLS entries resolve in dist/: ${entries.join(', ')}`);
