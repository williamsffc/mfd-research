#!/usr/bin/env node
/**
 * Typography rules check — enforces docs/typography.md.
 *
 * Runs on source (no build needed):
 * - src/styles/global.css: font-family must use a defined --font-* token; font-size
 *   must be a px value from the scale (or clamp()/var()); font-weight must be
 *   400/500/600/700; letter-spacing must be em-based; every var(--x) used in a
 *   typography declaration must be a custom property defined in the file.
 * - src/**\/*.astro: no font-*, letter-spacing or line-height declarations in
 *   inline `style=""` or `<style>` blocks — typography lives in global.css only.
 * - Fonts are self-hosted: each --font-* family has an @font-face at the top of
 *   global.css whose file exists in public/, every @font-face family is used by a
 *   token, font preloads in BaseLayout.astro point at declared files, and nothing
 *   loads fonts from Google.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
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
/** Properties that must only ever be declared in global.css. */
const TYPOGRAPHY_PROP = /\b(font(-[a-z]+)*|letter-spacing|line-height)\s*:/;

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

// Pass 1: collect every custom property defined anywhere in the file, and the
// primary family name of each --font-* token.
const definedProps = new Set();
const tokenFamilies = new Map(); // token name -> primary family
for (const line of cssLines) {
  const def = line.trim().match(/^(--[a-z0-9-]+):\s*([^;]+);/);
  if (!def) continue;
  definedProps.add(def[1]);
  const family = def[1].startsWith('--font-') && def[2].match(/^'([^']+)'/);
  if (family) tokenFamilies.set(def[1], family[1]);
}
if (tokenFamilies.size === 0) fail(cssPath, 1, 'no --font-* tokens found in :root');

/**
 * Every `var(--x)` inside a value — bare or nested in clamp() — must point at a
 * property defined in this file (catches typos). This validates references only;
 * whether the value's overall form is allowed is decided separately per property.
 */
function checkVarRefs(value, lineNo, prop) {
  for (const [, ref] of value.matchAll(/var\((--[a-z0-9-]+)/g)) {
    if (!definedProps.has(ref)) {
      fail(cssPath, lineNo, `${prop} references ${ref}, which is not defined anywhere in global.css`);
    }
  }
}

/** The value is exactly one custom-property reference, e.g. `var(--eyebrow-size)`. */
const isBareVar = (value) => /^var\(--[a-z0-9-]+\)$/.test(value);
/** The value is exactly one clamp() expression (fluid display sizes). */
const isClamp = (value) => /^clamp\(.*\)$/.test(value);

// Pass 2: validate each typography declaration. @font-face blocks are checked
// separately: they declare the self-hosted files, so they name the family and
// carry a weight range.
const fontFaces = []; // { family, src, lineNo }
let fontFace = null;
for (const [i, line] of cssLines.entries()) {
  const lineNo = i + 1;
  const trimmed = line.trim();

  if (/^@font-face\s*\{/.test(trimmed)) {
    fontFace = { family: null, src: null, display: null, lineNo };
    continue;
  }
  if (fontFace) {
    const fam = trimmed.match(/^font-family:\s*'([^']+)';/);
    if (fam) fontFace.family = fam[1];
    const src = trimmed.match(/^src:\s*url\('([^']+)'\)/);
    if (src) fontFace.src = src[1];
    const display = trimmed.match(/^font-display:\s*([a-z]+);/);
    if (display) fontFace.display = display[1];
    if (trimmed.startsWith('}')) {
      checks++;
      const where = fontFace.lineNo;
      if (!fontFace.family) fail(cssPath, where, "@font-face needs font-family: '<Name>';");
      if (!fontFace.src || !fontFace.src.startsWith('/assets/fonts/')) {
        fail(cssPath, where, "@font-face src must be url('/assets/fonts/<file>.woff2') (self-hosted)");
      } else if (!existsSync(join(repoRoot, 'public', fontFace.src))) {
        fail(cssPath, where, `@font-face src ${fontFace.src} does not exist in public/`);
      }
      if (fontFace.display !== 'swap') fail(cssPath, where, '@font-face needs font-display: swap;');
      fontFaces.push(fontFace);
      fontFace = null;
    }
    continue;
  }

  const family = trimmed.match(/^font-family:\s*([^;]+);/);
  if (family) {
    checks++;
    const value = family[1].trim();
    if (value !== 'inherit') {
      if (!/^var\(--font-[a-z-]+\)$/.test(value)) {
        fail(cssPath, lineNo, `font-family must use a --font-* token, got "${value}"`);
      } else if (!tokenFamilies.has(value.slice(4, -1))) {
        fail(cssPath, lineNo, `font-family references ${value.slice(4, -1)}, which is not a defined --font-* token`);
      }
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
    } else if (isClamp(value) || isBareVar(value)) {
      checkVarRefs(value, lineNo, 'font-size');
    } else if (value !== '0' && value !== 'inherit') {
      fail(cssPath, lineNo, `font-size must be px from the scale, clamp() or var(), got "${value}"`);
    }
  }

  const weight = trimmed.match(/^font-weight:\s*([^;]+);/);
  if (weight) {
    checks++;
    const value = weight[1].trim();
    if (isBareVar(value)) {
      checkVarRefs(value, lineNo, 'font-weight');
    } else if (!FONT_WEIGHTS.has(value) && value !== 'inherit') {
      fail(cssPath, lineNo, `font-weight ${value} is not one of ${[...FONT_WEIGHTS].join('/')}`);
    }
  }

  const tracking = trimmed.match(/^letter-spacing:\s*([^;]+);/);
  if (tracking) {
    checks++;
    const value = tracking[1].trim();
    if (isBareVar(value)) {
      checkVarRefs(value, lineNo, 'letter-spacing');
    } else if (!/^-?\d*\.?\d+em$/.test(value) && value !== 'normal' && value !== '0') {
      fail(cssPath, lineNo, `letter-spacing must be em-based (or var()), got "${value}"`);
    }
  }
}

// ------------------------------------------------------------- .astro files
for (const file of walk(join(repoRoot, 'src'))) {
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');
  let inStyle = false;
  for (const [i, line] of lines.entries()) {
    const lineNo = i + 1;
    if (/<style[\s>]/.test(line)) inStyle = true;
    if (inStyle && TYPOGRAPHY_PROP.test(line)) {
      fail(file, lineNo, 'typography declaration in a <style> block — move it to src/styles/global.css');
    }
    if (/<\/style>/.test(line)) inStyle = false;

    for (const attr of line.matchAll(/style="([^"]*)"/g)) {
      if (TYPOGRAPHY_PROP.test(attr[1])) {
        fail(file, lineNo, `typography in an inline style attribute: "${attr[1]}"`);
      }
    }

    if (/fonts\.(googleapis|gstatic)\.com/.test(line)) {
      fail(file, lineNo, 'fonts are self-hosted — declare them with @font-face in global.css, not from Google');
    }
  }
  checks++;
}

// -------------------------------------------------------- self-hosted fonts
if (/fonts\.(googleapis|gstatic)\.com/.test(css)) {
  fail(cssPath, 1, 'fonts are self-hosted — no fonts.googleapis.com / fonts.gstatic.com');
}
const declaredFamilies = new Set(fontFaces.map((f) => f.family));
for (const [token, family] of tokenFamilies) {
  checks++;
  if (!declaredFamilies.has(family)) fail(cssPath, 1, `${token} uses "${family}" but no @font-face declares it`);
}
for (const face of fontFaces) {
  checks++;
  if (![...tokenFamilies.values()].includes(face.family)) {
    fail(cssPath, face.lineNo, `@font-face declares "${face.family}" but no --font-* token uses it — remove it or add a token`);
  }
}
const layout = readFileSync(layoutPath, 'utf8');
const declaredSrcs = new Set(fontFaces.map((f) => f.src));
for (const [, href] of layout.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)) {
  checks++;
  if (!declaredSrcs.has(href)) fail(layoutPath, 1, `font preload ${href} does not match any @font-face src in global.css`);
}

// ------------------------------------------------------------------ report
console.log(`\n🔤 Typography rules: ${checks} checks, ${failures.length} problem(s)\n`);
if (failures.length) {
  for (const f of failures) console.log(`❌ ${f}`);
  console.log('\nSee docs/typography.md for the rules.\n');
  process.exit(1);
}
console.log('OK: typography follows docs/typography.md\n');
