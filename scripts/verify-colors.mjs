#!/usr/bin/env node
/**
 * Color rules check — enforces docs/colors.md. No build needed.
 *
 * 1. Raw color values (hex, rgb()/rgba() with numbers, named colors) may appear in
 *    src/styles/global.css ONLY in the palette block (`--c-*: R G B;` lines). Everything
 *    else must use a token: var(--semantic) or rgb(var(--c-name) / alpha).
 * 2. Every var(--c-*) reference must name a palette color that exists.
 * 3. .astro files may not hard-code colors (hex/rgb) in markup or <style> blocks.
 * 4. Key text/background pairs are resolved from the tokens in light AND dark mode and
 *    must meet WCAG 2.1 AA (4.5:1 normal text). So a future palette swap is contrast-checked.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const cssPath = join(repoRoot, 'src', 'styles', 'global.css');
const css = readFileSync(cssPath, 'utf8');
const lines = css.split('\n');

const failures = [];
let checks = 0;
const fail = (file, line, msg) => failures.push(`${relative(repoRoot, file)}:${line}  ${msg}`);

const PALETTE_LINE = /^\s*--c-([a-z0-9-]+):\s*(\d{1,3}) (\d{1,3}) (\d{1,3});/;
const RAW_HEX = /#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3,4})\b/;
const RAW_RGB = /\b(?:rgba?|hsla?)\(\s*\d/;
const NAMED = /:\s*[^;]*\b(white|black|red|green|blue|gray|grey|navy|silver)\b\s*[;,)]/;

// ---------------------------------------------------------------- 1 + 2
const palette = new Map();
for (const line of lines) {
  const m = line.match(PALETTE_LINE);
  if (m) palette.set(m[1], [Number(m[2]), Number(m[3]), Number(m[4])]);
}
if (palette.size === 0) fail(cssPath, 1, 'no palette block (--c-name: R G B;) found');

for (const [i, line] of lines.entries()) {
  const lineNo = i + 1;
  if (PALETTE_LINE.test(line)) continue;
  const code = line.replace(/\/\*.*?\*\//g, '');
  // selectors can legitimately contain "#id" — only inspect declaration values
  const isDecl = code.includes(':') && !code.trimEnd().endsWith('{');
  const value = isDecl ? code.slice(code.indexOf(':') + 1) : code.trimEnd().endsWith('{') ? '' : code;
  checks++;
  const bare = value.replace(/var\([^)]*\)/g, ''); // token names like --bg-white aren't named colors
  if (RAW_HEX.test(bare) || RAW_RGB.test(bare) || (isDecl && NAMED.test(':' + bare) && !/white-space/.test(code))) {
    fail(cssPath, lineNo, `raw color outside the palette block: "${line.trim()}" — use a token (see docs/colors.md)`);
  }
  for (const [, name] of code.matchAll(/var\(--c-([a-z0-9-]+)\)/g)) {
    if (!palette.has(name)) fail(cssPath, lineNo, `--c-${name} is not defined in the palette block`);
  }
}

// ---------------------------------------------------------------- 3
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.astro')) out.push(full);
  }
  return out;
}
for (const file of walk(join(repoRoot, 'src'))) {
  for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
    // the one allowed literal: <meta name="theme-color"> cannot read CSS variables
    if (/name="theme-color"/.test(line)) continue;
    const stripped = line.replace(/href="[^"]*"|src="[^"]*"|id="[^"]*"|\bd="[^"]*"/g, '');
    if (RAW_HEX.test(stripped) || RAW_RGB.test(stripped)) {
      fail(file, i + 1, 'hard-coded color in a component — use var(--token) (e.g. stroke="var(--green)")');
    }
  }
  checks++;
}

// ---------------------------------------------------------------- 4
function block(startPattern) {
  const start = lines.findIndex((l) => startPattern.test(l));
  if (start < 0) return new Map();
  const decls = new Map();
  for (let i = start + 1; i < lines.length && !/^\s{4}\}\s*$/.test(lines[i]); i++) {
    const m = lines[i].match(/^\s*(--[a-z0-9-]+):\s*(.+?);/);
    if (m) decls.set(m[1], m[2].trim());
  }
  return decls;
}
const lightDecls = block(/^\s{4}:root \{\s*$/);
const darkDecls = new Map([...lightDecls, ...block(/^\s{4}\[data-theme="dark"\] \{\s*$/)]);

/** Resolve a CSS color expression to [r,g,b,a] using the token maps. */
function resolve(expr, decls, depth = 0) {
  if (depth > 20) throw new Error(`token cycle at ${expr}`);
  expr = expr.trim();
  let m = expr.match(/^var\((--[a-z0-9-]+)\)$/);
  if (m) {
    if (!decls.has(m[1])) throw new Error(`undefined token ${m[1]}`);
    return resolve(decls.get(m[1]), decls, depth + 1);
  }
  m = expr.match(/^rgb\(var\(--c-([a-z0-9-]+)\)(?:\s*\/\s*([0-9.]+))?\)$/);
  if (m) {
    if (!palette.has(m[1])) throw new Error(`undefined palette color --c-${m[1]}`);
    return [...palette.get(m[1]), m[2] === undefined ? 1 : Number(m[2])];
  }
  throw new Error(`cannot resolve "${expr}" to a solid color`);
}
const over = (fg, bg) => fg.slice(0, 3).map((v, i) => v * fg[3] + bg[i] * (1 - fg[3]));
const lum = (c) => {
  const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [label, text, background, minimum]; each checked in light and dark.
const PAIRS = [
  ['Body text on page', 'var(--text-primary)', 'var(--bg)', 4.5],
  ['Secondary text on cards', 'var(--text-secondary)', 'var(--bg-white)', 4.5],
  ['Muted text on cards', 'var(--text-muted)', 'var(--bg-white)', 4.5],
  ['Muted text on page', 'var(--text-muted)', 'var(--bg)', 4.5],
  ['Muted text on soft sections', 'var(--text-muted)', 'var(--bg-soft)', 4.5],
  ['Green labels on cards', 'var(--green)', 'var(--bg-white)', 4.5],
  ['Green labels on page', 'var(--green)', 'var(--bg)', 4.5],
  ['Green labels on soft sections', 'var(--green)', 'var(--bg-soft)', 4.5],
  ['Primary button text', 'var(--action-text)', 'var(--action-bg)', 4.5],
  ['Primary button text (hover)', 'var(--action-hover-text)', 'var(--action-hover-bg)', 4.5],
  ['Accent labels on dark sections', 'var(--green-accent)', 'var(--section-accent-bg)', 4.5],
  ['Credential text on dark sections', 'var(--cred-entry-text)', 'var(--section-accent-bg)', 4.5],
  ['Footer links', 'var(--footer-text-50)', 'var(--footer-bg)', 4.5],
  ['Footer headings', 'var(--footer-text-70)', 'var(--footer-bg)', 4.5],
  ['Footer booking button', 'var(--footer-cta-text)', 'var(--footer-cta-bg)', 4.5],
  ['Footer booking button (hover)', 'var(--footer-cta-text)', 'var(--footer-cta-hover-bg)', 4.5],
  ['Specialty tag text', 'rgb(var(--c-green-800))', 'var(--green-pale)', 4.5, 'light'],
];
for (const [label, fgExpr, bgExpr, min, only] of PAIRS) {
  for (const [theme, decls] of [['light', lightDecls], ['dark', darkDecls]]) {
    if (only && only !== theme) continue;
    checks++;
    try {
      const bg = resolve(bgExpr, decls);
      const fg = resolve(fgExpr, decls);
      const r = ratio(over(fg, bg), bg.slice(0, 3));
      if (r < min) fail(cssPath, 1, `[${theme}] ${label}: contrast ${r.toFixed(2)}:1 is below ${min}:1 (${fgExpr} on ${bgExpr})`);
    } catch (err) {
      fail(cssPath, 1, `[${theme}] ${label}: ${err.message}`);
    }
  }
}

// ------------------------------------------------------------------ report
console.log(`\n🎨 Color rules: ${checks} checks, ${palette.size} palette colors, ${failures.length} problem(s)\n`);
if (failures.length) {
  for (const f of failures) console.log(`❌ ${f}`);
  console.log('\nSee docs/colors.md for the rules.\n');
  process.exit(1);
}
console.log('OK: colors follow docs/colors.md\n');
