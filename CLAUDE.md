# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build locally
npm run test:a11y    # Run axe-core accessibility audit
```

Deployment: Netlify with build command `npm run build`, publish directory `dist/`.

## Architecture

This is a **vanilla HTML/CSS/JS static website** for MFD Research LLC (clinical research consulting). No frontend framework — just HTML5, CSS custom properties, and ES6 modules. Vite is the build tool.

**Key files:**
- `index.html` — Single-page entry point; all sections live here (Hero, About, Services, Experience, Specialties, Credentials, Contact, Footer)
- `style.css` — All styles; uses CSS custom properties for theming. Light theme on `:root`, dark theme on `[data-theme="dark"]`
- `script.js` — All JS; ~11 `setup*()` functions called on `DOMContentLoaded` (scroll handlers, mobile nav, form validation, theme toggle, service worker registration, etc.)
- `service-worker.js` — PWA caching: cache-first for static assets/images, network-first for pages
- `scripts/vite-runner.mjs` — Custom Vite wrapper (manages `.vite-runtime/` directory); called by `npm run dev` and `npm run build` instead of Vite directly

**Subpages:** `privacy-policy/index.html` and `terms-of-service/index.html` (standalone HTML files, not generated).

**Forms:** Contact form uses Netlify Forms (the `netlify` attribute on `<form>`). No backend.

**Theming:** CSS variables define colors, shadows, spacing, and border radii. To change colors, update the custom properties in `:root` and `[data-theme="dark"]` blocks in `style.css`.

**Accessibility target:** WCAG 2.1 AA. Lighthouse targets: Performance 90+, Accessibility 100, Best Practices 100, SEO 90+.

**Browser support:** Last 2 versions of Chrome, Edge, Firefox, Safari. No IE11.
