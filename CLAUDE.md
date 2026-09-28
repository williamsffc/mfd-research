# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev           # Astro dev server on port 8080
npm run build         # Static production build (output: dist/)
npm run preview       # Preview production build locally
npm run verify:parity # After build: checks public CSS/JS vs root (if present) + dist HTML hooks
npm run test:a11y     # Build output + accessibility / invariant checks
npm run verify:sw-precache # After build: checks service-worker precache URLs exist in dist/
npm run verify:typography  # No build needed: enforces docs/typography.md (font tokens, size scale, weights)
npm run verify:colors      # No build needed: enforces docs/colors.md (palette-only colors, AA contrast in both themes)
npm run test          # verify:typography + verify:colors + build + verify:parity + verify:sw-precache + test:a11y
```

## Typography rules (enforced)

Full rules: `docs/typography.md`. The short version:

- **Never write a font name in CSS.** Use `var(--font-body)` (DM Sans, default), `var(--font-display)` (Space Grotesk, headings/titles) or `var(--font-accent)` (Instrument Serif, pull quotes only). Tokens live at the top of `:root` in `src/styles/global.css`; fonts load once in `src/layouts/BaseLayout.astro`.
- **Sizes** are px from the scale `11 12 13 14 15 16 17 18 20 22 24 26 36`, or `clamp()`/an existing token for fluid display text. No `rem`, no half-pixels.
- **Weights** are `400 / 500 / 600 / 700` only (loaded range is 300–700).
- **Eyebrow labels** (small uppercase) use `--eyebrow-size/--eyebrow-weight/--eyebrow-tracking`; `letter-spacing` is always `em`.
- **Buttons/inputs** don't inherit fonts — set `font: inherit` or a token on the control.
- **No typography in `.astro` files** (`style=""` or `<style>`); it all lives in `global.css`.
- Run `npm run verify:typography` before opening a PR.

## Color rules (enforced)

Full rules: `docs/colors.md`. The short version:

- **Raw colors live only in the palette block** at the top of `:root` in `src/styles/global.css` (`--c-name: R G B;`). Everywhere else use a semantic token (`var(--green)`, `var(--text-muted)`) or a palette color with alpha (`rgb(var(--c-white) / 0.08)`). No hex/`rgba(255,…)`/`white` elsewhere.
- **No colors in `.astro` files** — icons use `stroke="var(--green)"` or `currentColor`. Only exception: `<meta name="theme-color">`.
- **Text must pass WCAG AA (4.5:1) in light and dark mode**; the check resolves key token pairs and fails below 4.5:1. Fading text with `opacity` counts — measure it.
- **Primary buttons use `--action-bg/--action-text/--action-hover-*`**, not `--navy` (dark mode turns them green).
- **Greens are one family matched to the logo** (`#5ABC69` bars); don't add new shades.
- **Logo:** use `<Logo />` (`src/components/Logo.astro`), never an `<img>` of a raster logo. Standalone files: `public/assets/logo.svg`, `logo-reversed.svg`.
- Changing palettes = editing the palette block; Option B is recorded in `docs/colors.md`.
- Run `npm run verify:colors` before opening a PR.

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

**Theming:** Raw colors live in the palette block at the top of `:root` in `src/styles/global.css`; semantic tokens below it (and in `[data-theme="dark"]`) map them to roles. See `docs/colors.md`.

**Accessibility target:** WCAG 2.1 AA. Lighthouse targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+.

**Browser support:** Last 2 versions of Chrome, Edge, Firefox, Safari. No IE11.
