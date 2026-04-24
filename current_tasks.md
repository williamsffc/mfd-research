# MFD Research Current Tasks

## Current Phase

Astro migration is in progress on the `astro-migration` branch.

The initial Astro bootstrap is complete, and root-served static files have been copied into `public/` for Astro parity. The legacy static site still exists and has not been moved or deleted.

The current goal is to port the existing pages into Astro with output parity before refactoring or redesigning.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Preserve the existing static site until Astro parity is confirmed.
4. Port existing pages into Astro with output parity.
5. Preserve current visual design and JavaScript behavior.
6. Preserve root routes, legal pages, SEO files, PWA files, and assets.
7. Replace testimonials with Conferences & Industry Engagement after parity.
8. Prepare future Cloudflare Pages deployment.

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

Preserved legacy files include:

```text
index.html
style.css
script.js
privacy-policy/
terms-of-service/
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
assets/
```

## Immediate Tasks

### Task 5: Review and Commit Static Preservation

Review changes:

```bash
git status --short
git diff --stat
```

Confirm build:

```bash
npm run build
```

Confirm public files:

```bash
find public -maxdepth 3 -type f | sort
```

If the build succeeds and the changes are safe, commit:

```bash
git add public current_tasks.md
git commit -m "Preserve static assets for Astro"
git push
```

### Task 6: Create Astro Page Parity

Create Astro pages for:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

These should preserve the existing routes:

```text
/
 /privacy-policy/
 /terms-of-service/
```

The first Astro pages should preserve the existing HTML structure, IDs, SEO metadata, Open Graph tags, Twitter tags, canonical URLs, CSP meta tag, stylesheet behavior, and script behavior.

Do not refactor sections yet.

Do not replace testimonials yet.

Do not redesign.

Do not delete legacy root files yet.

### Task 7: Validate Existing Behavior

Validate:

```text
Mobile navigation
Scroll reveal
Scrollspy
Theme toggle
LocalStorage theme persistence
Back-to-top button
FAQ accordion
Service card keyboard behavior
Form validation
Web3Forms async submit
Service worker registration
Reduced-motion behavior
Skip link
Focus states
Legal page routes
Root SEO/PWA files
```

## Missing Assets Inventory

The current site references these files, but they are missing:

```text
assets/favicon-32x32.png
assets/favicon-16x16.png
assets/apple-touch-icon.png
assets/og-image.png
```

These must be added to both `assets/` and `public/assets/`, or references must be corrected before launch.

Do not launch until these are resolved.

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
Astro homepage parity
Astro legal page parity
Astro component creation
Cloudflare Pages connection
ADA 2026 page
Google Booking CTA integration
Form environment variable migration
SEO/Open Graph image finalization
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
Final Open Graph image design
```

## Working Principle

Do parity first, then refactor, then improve.

Do not make large uncontrolled rewrites.

Keep `main` stable.

Use `astro-migration` as the construction branch.

Do not delete legacy files until Astro parity is confirmed.