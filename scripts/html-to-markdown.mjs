/**
 * Converts the built legal pages to Markdown for AI agents (Markdown for agents: the Worker
 * in worker/index.js serves /<page>/index.md to requests sent with `Accept: text/markdown`).
 *
 * Runs after the build (astro.config.mjs) on the page's <article>, whose markup is plain
 * prose: headings, paragraphs, lists, links, bold, line breaks. Buttons and icons are dropped.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGIN = 'https://mfdresearch.com';

/** Pages (dist folders) that get an index.md next to their index.html. */
export const MARKDOWN_PAGES = ['privacy-policy', 'terms-of-service'];

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : +code.slice(1));
    return ENTITIES[code.toLowerCase()] ?? match;
  });

/** Converts simple prose HTML (h1–h4, p, ul/ol/li, a, strong/b, em/i, br, div) to Markdown. */
export function htmlToMarkdown(html) {
  html = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(svg|script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

  let out = '';
  const links = [];
  const lists = [];
  const block = () => { out += '\n\n'; };

  for (const token of html.split(/(<[^>]+>)/)) {
    const tag = token.match(/^<(\/?)([a-z][a-z0-9]*)\b([^>]*)>$/i);
    if (!tag) {
      const text = decode(token).replace(/\s+/g, ' ');
      // Whitespace between blocks and list items is layout, not content.
      if (text.trim() || !/\n[ \t]*(?:[-#*]+ ?|\d+\. )?$/.test(out) && out) out += text;
      continue;
    }
    const [, closing, rawName, attrs] = tag;
    const name = rawName.toLowerCase();
    if (/^h[1-4]$/.test(name)) {
      block();
      if (!closing) out += `${'#'.repeat(+name[1])} `;
    } else if (name === 'p' || name === 'div' || name === 'article') {
      block();
    } else if (name === 'ul' || name === 'ol') {
      if (closing) lists.pop();
      else lists.push({ ordered: name === 'ol', count: 0 });
      block();
    } else if (name === 'li' && !closing) {
      const list = lists.at(-1) ?? { ordered: false, count: 0 };
      list.count++;
      out += `\n${'  '.repeat(Math.max(lists.length - 1, 0))}${list.ordered ? `${list.count}.` : '-'} `;
    } else if (name === 'a') {
      if (closing) {
        const href = links.pop();
        out += href ? `](${href})` : '';
      } else {
        const href = attrs.match(/href="([^"]*)"/)?.[1];
        const absolute = href ? new URL(decode(href), `${ORIGIN}/`).href : null;
        links.push(absolute);
        if (absolute) out += '[';
      }
    } else if (name === 'strong' || name === 'b') {
      out += '**';
    } else if (name === 'em' || name === 'i') {
      out += '*';
    } else if (name === 'br') {
      out += '\n';
    }
  }

  return (
    out
      .split('\n')
      .map((l) => {
        l = l.trimEnd();
        const item = l.match(/^(\s*)(-|\d+\.) +(.*)$/);
        return item ? `${item[1]}${item[2]} ${item[3]}` : l.trimStart();
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}

/** Writes dist/<page>/index.md for each Markdown page, from the <article> of its index.html. */
export async function writeMarkdownPages(distDir) {
  for (const page of MARKDOWN_PAGES) {
    const html = await readFile(join(distDir, page, 'index.html'), 'utf8');
    const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1];
    if (!article) throw new Error(`html-to-markdown: no <article> in ${page}/index.html`);
    await writeFile(join(distDir, page, 'index.md'), htmlToMarkdown(article));
  }
}
