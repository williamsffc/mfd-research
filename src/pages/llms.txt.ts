/**
 * /llms.txt: a Markdown summary of the site for AI assistants and answer engines
 * (ChatGPT, Claude, Perplexity, Gemini…), following https://llmstxt.org. Built from
 * content/*.json by src/data/markdown.ts; nothing here is edited by hand.
 */
import type { APIRoute } from 'astro';
import { homeMarkdown } from '../data/markdown';

export const GET: APIRoute = () =>
  new Response(homeMarkdown(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
