/**
 * Cloudflare Worker in front of the static site (dist/), for "Markdown for agents":
 * a request for a page sent with `Accept: text/markdown` gets the page's Markdown copy
 * (dist/<page>/index.md) instead of its HTML. Browsers never ask for Markdown, so they
 * always get HTML. Everything else is served straight from the static assets.
 *
 * It only runs for the page URLs listed under run_worker_first in wrangler.jsonc; all
 * other files (CSS, fonts, images…) skip it.
 */
import headersFile from '../public/_headers';

const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

/** The site-wide headers from public/_headers (the `/*` block): security headers and CSP. */
const SITE_HEADERS = (() => {
  const headers = [];
  let inSiteBlock = false;
  for (const line of headersFile.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      inSiteBlock = line.trim() === '/*';
      continue;
    }
    const colon = line.indexOf(':');
    if (inSiteBlock && colon > 0) headers.push([line.slice(0, colon).trim(), line.slice(colon + 1).trim()]);
  }
  return headers;
})();

/** Quality (q) the Accept header gives a media type; 0 when it isn't listed. */
function quality(accept, type) {
  for (const part of accept.split(',')) {
    const [name, ...params] = part.split(';').map((s) => s.trim().toLowerCase());
    if (name !== type) continue;
    const q = params.find((p) => p.startsWith('q='));
    return q ? Number(q.slice(2)) || 0 : 1;
  }
  return 0;
}

function wantsMarkdown(request) {
  const accept = request.headers.get('Accept') || '';
  const markdown = quality(accept, 'text/markdown');
  return markdown > 0 && markdown >= quality(accept, 'text/html');
}

/** Adds the site-wide headers the response doesn't already have, plus Vary: Accept. */
function withSiteHeaders(response) {
  const out = new Response(response.body, response);
  for (const [name, value] of SITE_HEADERS) if (!out.headers.has(name)) out.headers.set(name, value);
  const vary = out.headers.get('Vary');
  if (!vary || !/\baccept\b/i.test(vary)) out.headers.set('Vary', vary ? `${vary}, Accept` : 'Accept');
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if ((request.method === 'GET' || request.method === 'HEAD') && wantsMarkdown(request)) {
      const page = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
      const markdown = await env.ASSETS.fetch(new URL(`${page}index.md`, url));
      if (markdown.ok) {
        const text = await markdown.text();
        const canonical = new URL(page, 'https://mfdresearch.com').href;
        return withSiteHeaders(
          new Response(request.method === 'HEAD' ? null : text, {
            headers: {
              'Content-Type': 'text/markdown; charset=utf-8',
              'Cache-Control': 'public, max-age=0, must-revalidate',
              'Content-Signal': CONTENT_SIGNAL,
              // Rough token count (about 4 characters per token), as Cloudflare's own feature sends.
              'X-Markdown-Tokens': String(Math.ceil(text.length / 4)),
              Link: `<${canonical}>; rel="canonical"`,
            },
          }),
        );
      }
    }
    return withSiteHeaders(await env.ASSETS.fetch(request));
  },
};
