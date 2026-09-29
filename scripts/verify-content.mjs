#!/usr/bin/env node
/**
 * Content check: validates the editable site text in content/*.json (docs/content.md).
 *
 * Runs on source (no build needed) and before every build, so a typo in a content file
 * stops the deploy with a clear message instead of breaking or blanking a section:
 * - each file has exactly the fields listed below (a misspelled field name is caught);
 * - text is non-empty, lists have at least one entry, years and dates are valid;
 * - icon names exist in src/data/icons.ts, conference statuses are known, at most one
 *   conference is featured, and "{years}" is the only placeholder.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(repoRoot, 'content');
const iconsSource = readFileSync(join(repoRoot, 'src', 'data', 'icons.ts'), 'utf8');
const ICON_NAMES = new Set(
  [...iconsSource.slice(iconsSource.indexOf('export const ICONS'), iconsSource.indexOf('} as const')).matchAll(/^\s+'?([a-z-]+)'?:/gm)].map((m) => m[1]),
);
const STATUSES = ['Upcoming', 'Attended', 'Details Pending'];

// ------------------------------------------------------------------- field types
const text = { type: 'text' };
const optionalText = { type: 'text', optional: true };
const icon = { type: 'icon' };
const year = { type: 'year' };
const url = { type: 'url' };
const list = (item) => ({ type: 'list', item });
const obj = (fields) => ({ type: 'object', fields });
const section = (fields) => obj({ label: text, title: text, intro: text, ...fields });

const SCHEMA = {
  'site.json': obj({ careerStartYear: year, email: { type: 'email' }, bookingUrl: url, linkedinUrl: url, description: text }),
  'hero.json': obj({
    titleLine1: text, titleLine2: text, titleHighlight: text, intro: text,
    primaryButton: text, secondaryButton: text, cardTitle: text,
    stats: list(obj({ label: text, value: text, icon })),
  }),
  'credibility.json': obj({ items: list(obj({ value: text, text, icon })) }),
  'about.json': obj({
    label: text, title: text, paragraphs: list(text), quote: text, quoteAuthor: text, tags: list(text),
  }),
  'services.json': section({ items: list(obj({ title: text, description: text, icon })) }),
  'process.json': section({ steps: list(obj({ title: text, description: text, icon })) }),
  'experience.json': section({
    roles: list(obj({ title: text, organization: text, startYear: year, endYear: { type: 'year', optional: true, nullable: true }, summary: text })),
  }),
  'specialties.json': section({ groups: list(obj({ name: text, emoji: text, tags: list(text) })) }),
  'credentials.json': section({
    columns: list(obj({ title: { type: 'text', optional: true }, items: list(obj({ year, description: text })) })),
  }),
  'conferences.json': section({
    pastTitle: text,
    events: list(obj({
      name: text, startDate: { type: 'date' }, endDate: { type: 'date', optional: true }, location: text,
      status: { type: 'enum', values: STATUSES }, focus: text,
      featured: { type: 'boolean', optional: true }, buttonLabel: optionalText, buttonUrl: { type: 'url', optional: true },
    })),
  }),
  'why.json': section({ cards: list(obj({ title: text, description: text, icon })) }),
  'faq.json': section({ questions: list(obj({ question: text, answer: text })) }),
  'contact.json': section({
    confidentiality: text, responseTime: text, scheduleLink: text, linkedinLink: text, interestOptions: list(text),
  }),
  'footer.json': obj({ tagline: text, bookingButton: text, notes: list(text) }),
};

// ------------------------------------------------------------------- validation
const failures = [];
let checks = 0;
const thisYear = new Date().getFullYear();

function check(value, spec, path, file) {
  checks++;
  const fail = (msg) => failures.push(`${file} → ${path}: ${msg}`);
  if (value === undefined || value === null) {
    if (spec.optional || (value === null && spec.nullable)) return;
    return fail(value === null ? 'must not be null' : 'is missing');
  }
  switch (spec.type) {
    case 'text':
      if (typeof value !== 'string') return fail('must be text (in quotes)');
      if (!spec.allowEmpty && !spec.optional && !value.trim()) return fail('is empty');
      for (const [, name] of value.matchAll(/\{([^}]*)\}/g)) {
        if (name !== 'years') fail(`unknown placeholder "{${name}}" (only {years} is supported)`);
      }
      return;
    case 'icon':
      if (!ICON_NAMES.has(value)) fail(`unknown icon "${value}"; use one of: ${[...ICON_NAMES].join(', ')}`);
      return;
    case 'year':
      if (!Number.isInteger(value) || value < 1950 || value > thisYear + 1) fail(`must be a 4-digit year (no quotes), got ${JSON.stringify(value)}`);
      return;
    case 'date': {
      // Date.parse rolls impossible dates over (2026-02-30 → March 2), so compare the parts.
      const parts = typeof value === 'string' && value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      const d = parts && new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3]));
      if (!d || d.getUTCFullYear() !== +parts[1] || d.getUTCMonth() !== +parts[2] - 1 || d.getUTCDate() !== +parts[3]) {
        fail(`must be a real date written YYYY-MM-DD, got ${JSON.stringify(value)}`);
      }
      return;
    }
    case 'url':
      if (typeof value !== 'string' || !/^https:\/\/\S+$/.test(value)) {
        if (!(spec.optional && value === '')) fail(`must be a full https:// link, got ${JSON.stringify(value)}`);
      }
      return;
    case 'email':
      if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) fail(`must be an email address, got ${JSON.stringify(value)}`);
      return;
    case 'boolean':
      if (typeof value !== 'boolean') fail('must be true or false (no quotes)');
      return;
    case 'enum':
      if (!spec.values.includes(value)) fail(`must be one of ${spec.values.map((v) => `"${v}"`).join(', ')}, got ${JSON.stringify(value)}`);
      return;
    case 'list':
      if (!Array.isArray(value)) return fail('must be a list [ … ]');
      if (value.length === 0) return fail('needs at least one entry');
      value.forEach((item, i) => check(item, spec.item, `${path}[${i + 1}]`, file));
      return;
    case 'object': {
      if (typeof value !== 'object' || Array.isArray(value)) return fail('must be a group { … }');
      for (const key of Object.keys(value)) {
        if (!(key in spec.fields)) fail(`unexpected field "${key}" (misspelled?). Allowed: ${Object.keys(spec.fields).join(', ')}`);
      }
      for (const [key, fieldSpec] of Object.entries(spec.fields)) check(value[key], fieldSpec, path ? `${path}.${key}` : key, file);
    }
  }
}

const files = readdirSync(contentDir).filter((f) => f.endsWith('.json'));
for (const f of files) if (!SCHEMA[f]) failures.push(`${f}: not a known content file (known: ${Object.keys(SCHEMA).join(', ')})`);

const data = {};
for (const [file, spec] of Object.entries(SCHEMA)) {
  const path = join(contentDir, file);
  let json;
  try {
    json = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    failures.push(`${relative(repoRoot, path)}: ${err.code === 'ENOENT' ? 'missing' : `is not valid JSON (${err.message})`}`);
    continue;
  }
  data[file] = json;
  check(json, spec, '', file);
}

// Pages CMS (.pages.yml) saves only the fields its config lists, so a field missing
// there would be silently deleted the first time someone edits that file in the CMS.
const pagesConfigPath = join(repoRoot, '.pages.yml');
let pagesConfig = '';
try {
  pagesConfig = readFileSync(pagesConfigPath, 'utf8');
} catch {
  failures.push('.pages.yml is missing (the Pages CMS editor config)');
}
if (pagesConfig) {
  const lines = pagesConfig.split('\n');
  const indentOf = (line) => line.length - line.trimStart().length;
  const nameOf = (line) => line.match(/name:\s*([A-Za-z0-9_-]+)/)?.[1];

  // Reads a `fields:` list written one field per `- name: x` / `- { name: x, ... }`
  // line (the style .pages.yml uses) into { fieldName: childFields | null }.
  function parseFieldList(start, indent) {
    const fields = {};
    let current = null;
    for (let i = start; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const ind = indentOf(line);
      if (ind < indent) break;
      if (ind === indent && line.trimStart().startsWith('- ')) {
        current = nameOf(line);
        if (current) fields[current] = null;
      } else if (current && ind === indent + 2 && /^fields:\s*$/.test(line.trim())) {
        fields[current] = parseFieldList(i + 1, indent + 4);
      }
    }
    return fields;
  }

  // Each content file's own entry must list its fields, at the right nesting level.
  const compare = (spec, parsed, path, file) => {
    if (spec.type === 'list') return compare(spec.item, parsed, path, file);
    if (spec.type !== 'object') return;
    for (const [key, child] of Object.entries(spec.fields)) {
      checks++;
      const where = `${file} → ${path ? `${path}.` : ''}${key}`;
      if (!parsed || !(key in parsed)) {
        failures.push(`.pages.yml: the ${file} entry doesn't list "${key}" (${where}); Pages CMS would drop it on save`);
        continue;
      }
      const needsChildren = (child.type === 'object') || (child.type === 'list' && child.item.type === 'object');
      if (needsChildren) compare(child, parsed[key], path ? `${path}.${key}` : key, file);
    }
  };

  for (const [file, spec] of Object.entries(SCHEMA)) {
    checks++;
    const pathLine = lines.findIndex((line) => line.trim() === `path: content/${file}`);
    if (pathLine === -1) {
      failures.push(`.pages.yml: no entry for content/${file}`);
      continue;
    }
    // The entry runs from its "- name:" line to the next entry at the same level.
    let entryStart = pathLine;
    while (entryStart > 0 && !/^ {2}- name:/.test(lines[entryStart])) entryStart--;
    let fieldsLine = -1;
    for (let i = entryStart + 1; i < lines.length && !/^ {2}- name:/.test(lines[i]); i++) {
      if (indentOf(lines[i]) === 4 && /^fields:\s*$/.test(lines[i].trim())) { fieldsLine = i; break; }
    }
    if (fieldsLine === -1) {
      failures.push(`.pages.yml: the content/${file} entry has no fields`);
      continue;
    }
    compare(spec, parseFieldList(fieldsLine + 1, 6), '', file);
  }
}

// Cross-field rules
for (const [i, role] of (data['experience.json']?.roles ?? []).entries()) {
  if (Number.isInteger(role.endYear) && role.endYear < role.startYear) failures.push(`experience.json → roles[${i + 1}]: endYear is before startYear`);
}
const events = data['conferences.json']?.events ?? [];
for (const [i, e] of events.entries()) {
  const isDate = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
  if (isDate(e.startDate) && isDate(e.endDate) && e.endDate < e.startDate) failures.push(`conferences.json → events[${i + 1}]: endDate is before startDate`);
  if (e.buttonUrl && !e.buttonLabel) failures.push(`conferences.json → events[${i + 1}]: buttonUrl needs a buttonLabel`);
}
if (events.filter((e) => e.featured).length > 1) failures.push('conferences.json: only one event can be "featured": true');

// ------------------------------------------------------------------- report
console.log(`\n📝 Content: ${files.length} files, ${checks} checks, ${failures.length} problem(s)\n`);
if (failures.length) {
  for (const f of failures) console.log(`❌ ${f}`);
  console.log('\nSee docs/content.md for what each file holds.\n');
  process.exit(1);
}
console.log('OK: content files are valid\n');
