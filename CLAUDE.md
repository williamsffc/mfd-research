# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Astro dev server on port 8080
npm run build         # Static production build (output: dist/)
npm run preview       # Preview production build locally
npm run verify:parity # After build: checks public CSS/JS vs root (if present) + dist HTML hooks
npm run test:a11y     # Build output + accessibility / invariant checks
npm run test          # build + verify:parity + test:a11y
```

Deployment: configure the host (e.g. Cloudflare Pages or Netlify) with build command `npm run build` and publish directory `dist/`.

## Architecture

**Astro** static site (`output: 'static'`, `build.format: 'directory'`). No React/Vue — pages are `.astro` components; global styling and behavior are bundled from `src/` (see `src/styles/global.css` and `src/scripts/main.js`).

**Key locations:**

- `src/pages/index.astro` — Homepage composition (imports section components).
- `src/pages/privacy-policy/index.astro`, `src/pages/terms-of-service/index.astro` — Legal routes.
- `src/components/` — Header, Footer, homepage sections, Conferences, etc.
- `src/data/conferences.ts` — Conference list for the homepage section.
- `src/styles/global.css` — Global styles + theming tokens (CSS custom properties; light `:root`, dark `[data-theme="dark"]`).
- `src/scripts/main.js` — Mobile nav, theme toggle, scroll/reveal, scrollspy, FAQ, service-card flip, form + Web3Forms fetch, service worker registration, etc.
- `public/service-worker.js` — PWA caching.
- `public/assets/`, `public/robots.txt`, `public/sitemap.xml`, `public/site.webmanifest` — Shipped as-is at site root.

**Forms:** Contact form posts to Web3Forms; set `PUBLIC_WEB3FORMS_ACCESS_KEY` (see `.env.example`). No backend.

**Theming:** Edit custom properties in `src/styles/global.css` (`:root` and `[data-theme="dark"]`).

**Accessibility target:** WCAG 2.1 AA. Lighthouse targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+.

**Browser support:** Last 2 versions of Chrome, Edge, Firefox, Safari. No IE11.
