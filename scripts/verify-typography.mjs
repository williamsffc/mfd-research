#!/usr/bin/env node
/**
 * Typography rules check — enforces docs/typography.md.
 *
 * Runs on source (no build needed):
 * - src/styles/global.css: font-family must use the --font-* tokens; font-size
 *   must be a px value from the scale (or clamp()/var()); font-weight must be
 *   400/500/600/700; letter-spacing must be em-based; no rem/half-pixel sizes.
 * - src/**\/*.astro: no font-* declarations in inline `style=""` or `<style>`
 *   blocks — typography lives in global.css only.
 * - src/layouts/BaseLayout.astro: the single Google Fonts loader must list
 *   exactly the families defined by the --font-* tokens.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const cssPath = join(repoRoot, 'src', 'styles', 'global.css');
const layoutPath = join(repoRoot, 'src', 'layouts', 'BaseLayout.astro');

/** Allowed px font sizes. Display sizes use clamp() instead. */
const FONT_SIZE_SCALE = new Set([11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 36]);
/** Loaded weight range is 300–700; anything else is synthesized by the browser. */
const FONT_WEIGHTS = new Set(['400', '500', '600', '700']);

const failures = [];
let checks = 0;

function fail(file, line, message) {
  failures.push(`${relative(repoRoot, file)}:${line}  ${message}`);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.astro')) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------- global.css
const css = readFileSync(cssPath, 'utf8');
const cssLines = css.split('\n');

const tokenFamilies = new Map(); // token name -> primary family
for (const [i, line] of cssLines.entries()) {
  const lineNo = i + 1;
  const trimmed = line.trim();

  const token = trimmed.match(/^(--font-[a-z-]+):\s*'([^']+)'/);
  if (token) tokenFamilies.set(token[1], token[2]);

  const family = trimmed.match(/^font-family:\s*([^;]+);/);
  if (family) {
    checks++;
    const value = family[1].trim();
    if (!/^var\(--font-[a-z-]+\)$/.test(value) && value !== 'inherit') {
      fail(cssPath, lineNo, `font-family must use a --font-* token, got "${value}"`);
    }
  }

  const shorthand = trimmed.match(/^font:\s*([^;]+);/);
  if (shorthand && shorthand[1].trim() !== 'inherit') {
    fail(cssPath, lineNo, `font shorthand is only allowed as "font: inherit", got "${shorthand[1].trim()}"`);
  }

  const size = trimmed.match(/^font-size:\s*([^;]+);/);
  if (size) {
    checks++;
    const value = size[1].trim();
    const px = value.match(/^(\d+(?:\.\d+)?)px$/);
    if (px) {
      if (!FONT_SIZE_SCALE.has(Number(px[1]))) {
        fail(cssPath, lineNo, `font-size ${value} is off the scale (${[...FONT_SIZE_SCALE].join(', ')} px)`);
      }
    } else if (!/^(clamp\(|var\(--)/.test(value) && value !== '0' && value !== 'inherit') {
      fail(cssPath, lineNo, `font-size must be px from the scale, clamp() or var(), got "${value}"`);
    }
  }

  const weight = trimmed.match(/^font-weight:\s*([^;]+);/);
  if (weight) {
    checks++;
    const value = weight[1].trim();
    if (!FONT_WEIGHTS.has(value) && !/^var\(--/.test(value) && value !== 'inherit') {
      fail(cssPath, lineNo, `font-weight ${value} is not one of ${[...FONT_WEIGHTS].join('/')}`);
    }
  }

  const tracking = trimmed.match(/^letter-spacing:\s*([^;]+);/);
  if (tracking) {
    checks++;
    const value = tracking[1].trim();
    if (!/^-?\d*\.?\d+em$/.test(value) && !/^var\(--/.test(value) && value !== 'normal' && value !== '0') {
      fail(cssPath, lineNo, `letter-spacing must be em-based (or var()), got "${value}"`);
    }
  }
}

if (tokenFamilies.size === 0) fail(cssPath, 1, 'no --font-* tokens found in :root');

// ------------------------------------------------------------- .astro files
for (const file of walk(join(repoRoot, 'src'))) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  let inStyle = false;
  for (const [i, line] of lines.entries()) {
    const lineNo = i + 1;
    if (/<style[\s>]/.test(line)) inStyle = true;
    if (inStyle && /\bfont(-family|-size|-weight|-style)?\s*:/.test(line)) {
      fail(file, lineNo, 'font declaration in a <style> block — move it to src/styles/global.css');
    }
    if (/<\/style>/.test(line)) inStyle = false;

    for (const attr of line.matchAll(/style="([^"]*)"/g)) {
      if (/\bfont|letter-spacing|line-height/.test(attr[1])) {
        fail(file, lineNo, `typography in an inline style attribute: "${attr[1]}"`);
      }
    }

    if (/fonts\.googleapis\.com\/css/.test(line) && file !== layoutPath) {
      fail(file, lineNo, 'fonts must be loaded once, from src/layouts/BaseLayout.astro');
    }
  }
  checks++;
}

// ----------------------------------------------------------- font loader
const layout = readFileSync(layoutPath, 'utf8');
const loaders = [...layout.matchAll(/fonts\.googleapis\.com\/css2\?([^"]+)"/g)];
if (loaders.length !== 1) {
  fail(layoutPath, 1, `expected exactly one Google Fonts loader, found ${loaders.length}`);
} else {
  const loadedFamilies = new Set(
    [...loaders[0][1].matchAll(/family=([^:&]+)/g)].map((m) => decodeURIComponent(m[1]).replace(/\+/g, ' ')),
  );
  for (const [token, family] of tokenFamilies) {
    checks++;
    if (!loadedFamilies.has(family)) fail(layoutPath, 1, `${token} uses "${family}" but the font loader does not load it`);
  }
  for (const family of loadedFamilies) {
    checks++;
    if (![...tokenFamilies.values()].includes(family)) {
      fail(layoutPath, 1, `font loader loads "${family}" but no --font-* token uses it — remove it or add a token`);
    }
  }
}

// ------------------------------------------------------------------ report
console.log(`\n🔤 Typography rules: ${checks} checks, ${failures.length} problem(s)\n`);
if (failures.length) {
  for (const f of failures) console.log(`❌ ${f}`);
  console.log('\nSee docs/typography.md for the rules.\n');
  process.exit(1);
}
console.log('OK: typography follows docs/typography.md\n');
