# MFD Research Current Tasks

## Current Phase

Astro migration is in progress on the `astro-migration` branch.

Astro bootstrap is complete, root-served static files have been copied into `public/`, existing static pages have been ported into Astro with near-verbatim page parity, missing referenced favicon/Apple/Open Graph assets have been created, and Cloudflare preview is working at:

```text
https://testing.mfd-research.workers.dev/
```

The current goal is to fix Web3Forms environment variable handling locally before doing more structural refactoring.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Validate Astro output parity for homepage and legal pages.
4. Preserve current visual design and JavaScript behavior.
5. Preserve root routes, legal pages, SEO files, PWA files, and assets.
6. Fix Web3Forms environment variable handling.
7. Deploy to Cloudflare only at meaningful milestones.
8. Replace testimonials with Conferences & Industry Engagement after parity and form behavior are stable.
9. Prepare future Cloudflare Pages/Workers production deployment.

## Deployment Discipline

Do not push/deploy every small change.

Use local testing for frequent iteration:

```bash
npm run dev
npm run build
npm run preview
```

Commit logical local checkpoints.

Push/deploy to Cloudflare only at meaningful milestones, such as:

```text
Astro parity complete
Missing assets fixed
Web3Forms env handling fixed
BaseLayout/Header/Footer extraction complete
Testimonials replaced with Conferences section
Google Booking CTA added
ADA 2026 page added
Final pre-launch QA
```

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

### Completed Task 8: Connect Cloudflare Preview

Cloudflare preview is working at:

```text
https://testing.mfd-research.workers.dev/
```

The preview is currently deployed through Cloudflare Workers static assets using:

```text
npx wrangler deploy --assets=dist --compatibility-date 2026-04-24
```

The current deployment should be treated as preview/testing only.

Do not connect the production domain yet.

## Immediate Tasks

### Task 9: Fix Web3Forms Environment Variable Handling

Replace the current placeholder:

```text
%VITE_ACCESS_KEY%
```

with Astro-compatible build-time environment handling.

Recommended variable:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

Expected implementation in `src/pages/index.astro`:

```astro
---
const web3formsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? "%VITE_ACCESS_KEY%";
---
```

Expected hidden input:

```astro
<input type="hidden" name="access_key" value={web3formsAccessKey} />
```

Do not change:

```text
Web3Forms endpoint
form field names
form layout
form validation behavior
script.js behavior
```

### Task 10: Configure Local Environment

Create or update local `.env`:

```env
PUBLIC_WEB3FORMS_ACCESS_KEY=your_real_web3forms_key_here
```

Do not commit `.env`.

### Task 11: Validate Form Build Output Locally

Run:

```bash
npm run build
npm run preview
```

Check built HTML:

```bash
grep -R "VITE_ACCESS_KEY\|PUBLIC_WEB3FORMS_ACCESS_KEY\|access_key" dist/index.html
```

Expected:

```text
No %VITE_ACCESS_KEY% placeholder
No PUBLIC_WEB3FORMS_ACCESS_KEY text
access_key input exists
```

### Task 12: Configure Cloudflare Environment Variable

In Cloudflare, add:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

under:

```text
Settings > Variables and secrets
```

Use the correct Web3Forms key.

### Task 13: Deploy Form Handling Milestone

After local validation succeeds:

```bash
git status --short
git add .
git commit -m "Use Astro env variable for Web3Forms key"
git push
```

This is a meaningful milestone, so Cloudflare preview deployment is acceptable.

### Task 14: Validate Cloudflare Preview Form Behavior

On:

```text
https://testing.mfd-research.workers.dev/
```

Validate:

```text
Contact form renders
Required field validation works
Invalid email validation works
Submit button enters Sending state
Submission succeeds with real key or fails gracefully if service-side configuration blocks it
No placeholder key appears in page source
No major console errors
```

## Next Planned Refactor Sequence

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
Web3Forms environment variable migration
Astro component creation
BaseLayout extraction
Header/Footer extraction
ADA 2026 page
Google Booking CTA integration
Conference section implementation
Legacy file cleanup after parity
Production domain connection
```

## Blockers / Pending Inputs

Need from project owner:

```text
Web3Forms access key
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

Deploy to Cloudflare only at meaningful milestones.