import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { writeMarkdownPages } from './scripts/html-to-markdown.mjs';

// Stamp a per-build cache version into the shipped service worker so each deploy
// invalidates old caches without a manual bump.
const stampServiceWorker = {
  name: 'stamp-service-worker',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const swPath = fileURLToPath(new URL('service-worker.js', dir));
      const source = await readFile(swPath, 'utf8');
      const version = Date.now().toString(36);
      await writeFile(swPath, source.replaceAll('__BUILD_VERSION__', version));
    },
  },
};

// Markdown copies of the legal pages for AI agents (served by worker/index.js).
const markdownPages = {
  name: 'markdown-pages',
  hooks: {
    'astro:build:done': async ({ dir }) => writeMarkdownPages(fileURLToPath(dir)),
  },
};

export default defineConfig({
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [stampServiceWorker, markdownPages],
});
