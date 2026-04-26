# 🧪 MFD Research Website

Marketing website for **MFD Research LLC** — clinical research consulting focused on site development, regulatory compliance, and trial execution.

- 🚀 **Astro** static site (no React/Vue)
- 🎨 **All styling** in `public/style.css`
- 🧠 **All interactive behavior** in `public/script.js` (deferred)
- 📨 **Contact form** via **Web3Forms** (no backend)
- ♿ **Accessibility-forward** (WCAG 2.1 AA target)

---

## 📚 Docs

- 🏗️ Architecture: `docs/architecture.md`
- 🔄 Handoff notes: `docs/handoff.md`
- ✅ Current tasks: `docs/current_tasks.md`
- 🤖 Agent guidance: `CLAUDE.md` (kept at repo root)

---

## ✨ What’s in this site

- 🌗 **Light/Dark mode**: system preference + manual toggle (persisted)
- 📱 **Responsive layout**: mobile-first, fluid sections
- ♿ **Accessible UX**: skip link, focus management, ARIA where needed, keyboard-friendly components
- ⚡ **Performance-minded**: IntersectionObserver, event delegation, deferred JS, optimized assets
- 📴 **Offline support**: `public/service-worker.js` for caching
- 🖨️ **Print-friendly styles**: clean output for “document-like” pages

---

## 🧰 Tech stack

- **Astro** (static output) — routes in `src/pages/`, sections/components in `src/components/`
- **HTML/CSS/JS** — semantic markup + CSS custom properties + one global JS bundle
- **Node.js** — build + small verification scripts in `scripts/`

---

## ✅ Requirements

- Node.js **16+** (18+ recommended)
- npm (or compatible package manager)

---

## 🏁 Quickstart

Install dependencies:

```bash
npm install
```

Start dev server (port 8080):

```bash
npm run dev
```

Build production output to `dist/`:

```bash
npm run build
```

Preview the production build locally (port 8080):

```bash
npm run preview
```

---

## 🧪 Testing & verification

Run the full verification suite (build + parity + sw-precache + a11y/invariants):

```bash
npm test
```

Run just the accessibility/invariant checks:

```bash
npm run test:a11y
```

What these checks cover:

- ✅ build output exists for `/`, `/privacy-policy/`, `/terms-of-service/`
- ✅ legacy markup parity (ensures dynamic migrations preserve the exact HTML structure and DOM hooks for `public/script.js`)
- ✅ Service Worker precache manifest validation (`verify:sw-precache` ensures offline assets resolve)
- ✅ legal pages inherit the shared font stack + avoid inline layout duplication
- ✅ basic CSS/JS invariants (and guarding against regressions)

---

## 🗂️ Project structure

```text
mfd-research/
  src/
    pages/                 # Routes: home + legal pages
    components/            # Header/Footer + homepage sections
    layouts/               # Shared HTML shell + head injection
    data/                  # Data modules (all repeatable homepage content)
  public/                  # Copied to dist/ root as-is
    style.css              # Global styles + theming tokens
    script.js              # All interactivity (nav, theme, scroll, FAQ, form, etc.)
    service-worker.js      # PWA caching
    assets/                # Images, icons, OG image, etc.
    robots.txt
    sitemap.xml
    site.webmanifest
  scripts/                 # Repo verification + image optimization helpers
  dist/                    # Generated build output (don’t edit by hand)
  package.json
```

---

## 📨 Contact form (Web3Forms)

The contact form posts to **Web3Forms** at `https://api.web3forms.com`.

1) Copy `.env.example` → `.env`
2) Set:

```bash
PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

Notes:

- This is a **public** env var by design (it’s embedded in the built HTML for form submissions). Never include secret values in this file or the README.
- If the key is empty, the test script will warn because submissions will fail.
- **Production environments (like Cloudflare Pages)** must have this variable configured in their deployment settings to work.

### 📊 Contact Submission Tracking (Google Workspace Automation)

While the website remains fully static with no backend database, submissions are tracked using an optional Google Workspace automation.

1. **Submission**: User submits the form; Web3Forms emails the notification to the Google Workspace Gmail inbox.
2. **Filtration**: A Gmail filter (From: `notify@web3forms.com`, Subject: `New Contact Form Submission from MFD Research`) automatically applies the `MFD/Web3Forms-Pending` label.
3. **Processing**: A Google Apps Script runs via a time-driven trigger every 10 minutes. It:
   - Uses `LockService` to prevent overlapping runs.
   - Processes up to 25 pending threads per run.
   - Parses the plain-text email fields (requiring an email plus at least one name field).
   - Prevents duplicate entries using the Gmail Message ID.
4. **Storage**: Valid submissions are appended as a new row to the **"MFD Research Consultation Submissions"** Google Sheet (Tab: `Submissions`).
   - Recorded columns: *Received At, Gmail Message ID, First Name, Last Name, Email, Company, Service, Message, Source URL (optional), Visitor IP (optional), Status (defaults to "New"), Processing Notes (defaults to "Success"), Follow-up Notes, Follow-up Date*.
5. **Categorization**: Processed emails are re-labeled with `MFD/Web3Forms-Processed`. If parsing fails, they are labeled `MFD/Web3Forms-Error`.

*Note: This workflow is purely an external operational automation. It does not affect the static site build, and the `PUBLIC_WEB3FORMS_ACCESS_KEY` is still required for the contact form to function.*

---

## 🎛️ Customization guide

- 🎨 **Theme/colors**: edit CSS custom properties in `public/style.css` (`:root` + `[data-theme="dark"]`)
- 🧩 **Data-driven homepage content**: All homepage grids, timelines, accordions, and repeatable stats are managed via Strongly-Typed data files. Do not edit HTML components to update list content. Edit the following files instead:
  - `src/data/conferences.ts`
  - `src/data/credentials.ts`
  - `src/data/credibility.ts`
  - `src/data/experiences.ts`
  - `src/data/faqs.ts`
  - `src/data/heroStats.ts` (Note: "Industry Experience" is dynamically calculated from `startYear = 2006` during the build)
  - `src/data/services.ts`
  - `src/data/specialties.ts`
- 🧱 **Sections**: edit individual section structures under `src/components/`
- 🧾 **Legal pages**: `src/pages/privacy-policy/index.astro` and `src/pages/terms-of-service/index.astro`
- 🔤 **Fonts**: configured via Google Fonts in `src/layouts/BaseLayout.astro`

---

## 🌍 Deployment

This is a **static site**. The primary deployment target is **Cloudflare Pages**, connected to GitHub.

### Production URLs
- **Primary:** [https://mfdresearch.com](https://mfdresearch.com)
- **Primary (www):** [https://www.mfdresearch.com](https://www.mfdresearch.com)
*(Note: Any `*.workers.dev` URLs are strictly for Cloudflare preview/fallback routing and are not the public production domain).*

### Cloudflare Deployment Setup
- **Repository:** `williamsffc/mfd-research`
- **Production Branch:** `main`
- **Build Command:** `npm run build`
- **Deploy Command:** `npx wrangler deploy --assets=dist --compatibility-date 2026-04-24`
- **Version Command:** `npx wrangler versions upload --assets=dist --compatibility-date 2026-04-24`
- **Environment Variables:** `PUBLIC_WEB3FORMS_ACCESS_KEY` must be set in the Cloudflare dashboard.

### Maintenance & DNS Notes
- **Pre-deploy:** Always run `npm test` locally to ensure parity and accessibility checks pass before pushing to `main`.
- **Security & Caching:** `public/_headers` contains the Cloudflare-specific security (CSP) and cache headers.
- **DNS Records:** Cloudflare manages the DNS for `mfdresearch.com`. **CRITICAL:** Do not delete or modify the Google Workspace email DNS records (MX, SPF, DKIM, DMARC) when adjusting site settings. Web traffic records should remain proxied where appropriate.

---

## 🧭 Browser support

- Chrome / Edge / Firefox / Safari: **last 2 versions**
- Mobile: iOS Safari, Chrome Android

No IE11 (modern JS + CSS custom properties).

---

## 📈 Performance targets

Suggested Lighthouse targets:

- Performance: **90+**
- Accessibility: **100**
- Best Practices: **100**
- SEO: **90+**

---

## 📄 License

Copyright © 2026 MFD Research LLC. All rights reserved.

---

## ✉️ Contact

- Email: `info@mfdresearch.com`
- Website: [mfdresearch.com](https://mfdresearch.com)
