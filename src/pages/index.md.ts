/**
 * /index.md: the homepage as Markdown. The Worker (worker/index.js) serves it for requests
 * to / sent with `Accept: text/markdown`; same text as /llms.txt (src/data/markdown.ts).
 */
import type { APIRoute } from 'astro';
import { homeMarkdown } from '../data/markdown';

export const GET: APIRoute = () =>
  new Response(homeMarkdown(), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
