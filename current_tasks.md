# MFD Research Current Tasks

## Current Phase

Astro migration is in progress on the `astro-migration` branch.

Astro bootstrap is complete, root-served static files have been copied into `public/`, existing static pages have been ported into Astro with near-verbatim page parity, and missing referenced favicon/Apple/Open Graph assets have been created.

The current goal is to validate Astro parity locally, then validate the same build through a Cloudflare Pages preview before refactoring or redesigning.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Validate Astro output parity for homepage and legal pages.
4. Validate production-like behavior through Cloudflare Pages preview.
5. Preserve current visual design and JavaScript behavior.
6. Preserve root routes, legal pages, SEO files, PWA files, and assets.
7. Fix Web3Forms environment variable handling after Cloudflare preview is working.
8. Replace testimonials with Conferences & Industry Engagement after parity and form behavior are stable.
9. Prepare future Cloudflare Pages production deployment.

## Completed

### Completed Task 1: Add Planning Files

The repo contains:

```text
architecture.md
handoff.md
current_tasks.md
```

These files define project strategy, handoff context, and active implementation tasks.

### Completed Task 2: Create Astro Migration Branch

Migration work is happening on:

```text
astro-migration
```

`main` remains the stable baseline.

### Completed Task 3: Initial Astro Bootstrap

Astro has been added in the smallest safe way.

Completed setup includes:

```text
astro.config.mjs
src/pages/index.astro
public/.gitkeep
```

`package.json` has been updated so:

```text
npm run dev
npm run build
npm run preview
```

use Astro equivalents.

Astro is configured for static output and directory-style builds.

`npm install` succeeded.

`npm run build` succeeded and produced output in:

```text
dist/
```

No legacy files were moved or deleted during the bootstrap.

### Completed Task 4: Preserve Root-Served Static Files

Root-served static files have been copied into `public/` for Astro parity.

Copied files:

```text
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
style.css
script.js
assets/
```

Target files now include:

```text
public/robots.txt
public/sitemap.xml
public/site.webmanifest
public/service-worker.js
public/style.css
public/script.js
public/assets/
```

Legacy root files remain in place and have not been deleted.

### Completed Task 5: Create Astro Page Parity

Existing static pages have been ported into Astro with near-verbatim parity.

Created or updated Astro pages:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

Preserved routes:

```text
/
 /privacy-policy/
 /terms-of-service/
```

Preserved page behavior and markup:

```text
section IDs
anchor links
CSS classes
existing page structure
title tags
meta descriptions
canonical tags
robots meta tag
Open Graph tags
Twitter tags
CSP meta tag
stylesheet references
script references
Web3Forms placeholder and behavior
```

No redesign, componentization, testimonial replacement, or Web3Forms changes were made during this step.

Legacy files remain in place and have not been deleted.

`npm run build` succeeds and generates:

```text
dist/index.html
dist/privacy-policy/index.html
dist/terms-of-service/index.html
```

### Completed Task 6: Generate Repo-Specific QA Checklist

A repo-specific Astro parity QA checklist has been generated.

It covers:

```text
Build output
Routes
SEO tags
Canonical URLs
Open Graph tags
Twitter tags
CSP meta tag
CSS loading
JS loading
Asset loading
Mobile navigation
Dark mode persistence
Scroll reveal
Scrollspy
FAQ accordion
Back-to-top button
Service worker registration
Contact form validation
Web3Forms behavior
Legal page styling
Root file content parity
```

### Completed Task 7: Fix Missing Referenced Assets

The previously missing referenced assets have been created in both legacy and Astro public asset locations.

Created files:

```text
assets/favicon-16x16.png
assets/favicon-32x32.png
assets/apple-touch-icon.png
assets/og-image.png
public/assets/favicon-16x16.png
public/assets/favicon-32x32.png
public/assets/apple-touch-icon.png
public/assets/og-image.png
```

Source assets used:

```text
assets/favicon.svg
assets/mfd-logo.jpg
```

Build confirmation:

```text
npm run build succeeds
```

Visual notes:

```text
OG image is a simple brand-safe composition with the logo centered on a neutral background.
Apple touch icon is centered with padding on the same background color.
```

### Completed Task 8: Review Recommended Next Order

The recommended next implementation order is:

```text
1. Run full local QA pass.
2. Connect Cloudflare Pages preview.
3. Fix Web3Forms environment variable handling.
4. Create BaseLayout.astro.
5. Extract Header/Footer.
```

Rationale:

```text
Local QA proves Astro parity before structural changes.
Cloudflare preview validates HTTPS, path resolution, and service worker behavior.
Web3Forms env handling should be fixed before refactoring.
BaseLayout should come before Header/Footer extraction.
Header/Footer extraction should happen only after parity and form behavior are stable.
```

## Immediate Tasks

### Task 9: Run Local Astro Parity QA

Run local dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:8080/
http://localhost:8080/privacy-policy/
http://localhost:8080/terms-of-service/
```

Validate:

```text
Homepage renders correctly
Legal pages render correctly
CSS loads
Logo loads
Navigation works
Anchor links work
Mobile nav works
Dark mode toggle works
Theme persists in localStorage
FAQ expands/collapses
Service card keyboard behavior works
Scroll reveal works
Scrollspy works
Back-to-top button works
Contact form displays correctly
Contact form validation works
Reduced-motion behavior is preserved
Skip link works
Focus states are visible
No major console errors appear
```

### Task 10: Validate Build Preview

Run:

```bash
npm run build
npm run preview
```

Confirm these routes work:

```text
/
 /privacy-policy/
 /terms-of-service/
```

Confirm these root files load:

```text
/robots.txt
/sitemap.xml
/site.webmanifest
/service-worker.js
/style.css
/script.js
/assets/mfd-logo.jpg
/assets/favicon.svg
/assets/favicon-32x32.png
/assets/favicon-16x16.png
/assets/apple-touch-icon.png
/assets/og-image.png
```

### Task 11: Connect Cloudflare Pages Preview

After local QA passes, connect the `astro-migration` branch to Cloudflare Pages as a preview deployment.

Cloudflare Pages settings:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Production branch: main
Preview branch: astro-migration
```

Do not connect the production domain yet.

Do not deploy unfinished work to `mfdresearch.com`.

Use the Cloudflare preview URL only.

### Task 12: Validate Cloudflare Preview

On the Cloudflare preview URL, validate:

```text
Homepage route works
Privacy Policy route works
Terms of Service route works
Root files load
CSS loads
JS loads
Logo and icons load
Open Graph image loads
Mobile nav works
Dark mode works
FAQ works
Back-to-top works
Service worker registers under HTTPS
No major console errors appear
```

### Task 13: Fix Web3Forms Environment Variable Handling

After Cloudflare preview works, replace the current placeholder:

```text
%VITE_ACCESS_KEY%
```

with Astro-compatible environment variable handling.

Recommended variable:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

Do not change form field names or the Web3Forms endpoint unless explicitly approved.

### Task 14: Begin Post-Parity Refactor Planning

After local QA, Cloudflare preview, and Web3Forms env handling are stable, begin controlled refactor planning.

Recommended refactor order:

```text
1. Create BaseLayout.astro
2. Extract Header.astro
3. Extract Footer.astro
4. Preserve existing visual output
5. Preserve existing script behavior
6. Do not redesign yet
7. Do not replace testimonials yet
```

## Conference Data Collection

Collect the last six conferences/meetings, including ADA 2026.

For each conference, capture:

```text
Conference name:
Year:
Location:
Attended or upcoming:
Relevant focus area:
URL:
Notes:
```

These will become the `Conferences & Industry Engagement` section.

## Not Started Yet

```text
Cloudflare Pages preview connection
Web3Forms environment variable migration
Astro component creation
BaseLayout extraction
Header/Footer extraction
ADA 2026 page
Google Booking CTA integration
Conference section implementation
Legacy file cleanup after parity
```

## Blockers / Pending Inputs

Need from project owner:

```text
Google Booking URL
Final list of six conferences/meetings
Confirmation of contact form provider
Final email address
Final decision on whether to keep or remove service worker
Final Open Graph image approval
```

## Working Principle

Do parity first, then refactor, then improve.

Do not make large uncontrolled rewrites.

Keep `main` stable.

Use `astro-migration` as the construction branch.

Do not delete legacy files until Astro parity is confirmed.

Do not connect the production domain until the site is approved.