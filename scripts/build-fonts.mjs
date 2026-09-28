#!/usr/bin/env node
/**
 * Builds the self-hosted web fonts in public/assets/fonts/ from the upstream TTFs.
 *
 *   node scripts/build-fonts.mjs <source.ttf> <public/assets/fonts/name-vN.woff2>
 *
 * Sources: https://github.com/google/fonts (ofl/dmsans/DMSans[opsz,wght].ttf,
 * ofl/spacegrotesk/SpaceGrotesk[wght].ttf, ofl/instrumentserif/InstrumentSerif-Italic.ttf).
 *
 * It repackages the font unchanged (every glyph, feature and variable axis) as WOFF2
 * with Brotli compression, using the null glyf/loca transform that the WOFF2 spec
 * allows and every current browser decodes. No dependencies beyond Node. The fonts
 * are almost entirely Latin already, so subsetting would save little and risks
 * dropping glyphs reached only through ligatures (e.g. "fi").
 *
 * Files in public/assets/ are cached for a year: when a font changes, write it under
 * a new -vN name and update global.css and the preloads in BaseLayout.astro.
 */
import fs from 'node:fs';
import zlib from 'node:zlib';

function readSfnt(buf) {
  const numTables = buf.readUInt16BE(4);
  const tables = new Map();
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    const tag = buf.toString('latin1', o, o + 4);
    const off = buf.readUInt32BE(o + 8);
    const len = buf.readUInt32BE(o + 12);
    tables.set(tag, Buffer.from(buf.subarray(off, off + len)));
  }
  return { flavor: buf.readUInt32BE(0), tables };
}

function base128(n) {
  const bytes = [];
  do { bytes.unshift(n & 0x7f); n >>>= 7; } while (n);
  return Buffer.from(bytes.map((b, i) => (i < bytes.length - 1 ? b | 0x80 : b)));
}

function toWoff2(font) {
  const tags = [...font.tables.keys()].sort();
  const dir = [], data = [];
  for (const tag of tags) {
    const t = font.tables.get(tag);
    const transform = tag === 'glyf' || tag === 'loca' ? 3 : 0; // null transform
    dir.push(Buffer.from([63 | (transform << 6)]), Buffer.from(tag, 'latin1'), base128(t.length));
    data.push(t);
  }
  const directory = Buffer.concat(dir);
  const compressed = zlib.brotliCompressSync(Buffer.concat(data), {
    params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_LGWIN]: 24,
      [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_FONT },
  });
  const sfntSize = 12 + 16 * tags.length + tags.reduce((s, t) => s + ((font.tables.get(t).length + 3) & ~3), 0);
  const header = Buffer.alloc(48);
  const body = 48 + directory.length + compressed.length;
  const total = (body + 3) & ~3;
  header.write('wOF2', 0, 'latin1');
  header.writeUInt32BE(font.flavor, 4);
  header.writeUInt32BE(total, 8);
  header.writeUInt16BE(tags.length, 12);
  header.writeUInt32BE(sfntSize, 16);
  header.writeUInt32BE(compressed.length, 20);
  header.writeUInt16BE(1, 24);
  return Buffer.concat([header, directory, compressed, Buffer.alloc(total - body)]);
}

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('Usage: node scripts/build-fonts.mjs <source.ttf> <output.woff2>');
  process.exit(1);
}
const font = readSfnt(fs.readFileSync(src));
for (const tag of ['DSIG']) font.tables.delete(tag); // signature is invalid once repackaged
const woff2 = toWoff2(font);
fs.writeFileSync(out, woff2);
console.log(`${out}: ${fs.statSync(src).size} -> ${woff2.length} bytes`);
