# MFD Research Current Tasks

## Current Phase

Astro migration has started.

The project is now on the `astro-migration` branch with an initial Astro bootstrap completed. The current static HTML/CSS/JS site still exists and has not been moved or deleted.

The current goal is to continue a parity-first migration: preserve the existing site behavior, routes, legal pages, SEO files, PWA files, styling, and JavaScript before refactoring or redesigning.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Preserve the existing static site until Astro parity is confirmed.
4. Move root-served static files into Astro `public/` safely.
5. Port existing pages into Astro with output parity.
6. Preserve current visual design and JavaScript behavior.
7. Replace testimonials with Conferences & Industry Engagement after parity.
8. Prepare future Cloudflare Pages deployment.

## Completed

### Completed Task 1: Add Planning Files

The repo should contain:

```text
architecture.md
handoff.md
current_tasks.md
```

These files define project strategy, handoff context, and active implementation tasks.

### Completed Task 2: Create Astro Migration Branch

Migration work should happen on:

```text
astro-migration
```

`main` should remain the stable baseline.

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

### Task 4: Review and Commit Astro Bootstrap

Confirm current branch:

```bash
git branch --show-current
```

Expected:

```text
astro-migration
```

Review changes:

```bash
git status --short
git diff --stat
git diff
```

Confirm build:

```bash
npm run build
```

If the build succeeds and the changes are safe, commit:

```bash
git add astro.config.mjs package.json package-lock.json src public current_tasks.md
git commit -m "Set up Astro migration baseline"
```

Push when ready:

```bash
git push
```

### Task 5: Begin Public File Preservation

After the Astro bootstrap commit is complete, move or copy root-served files into `public/` so Astro can serve them at the same URLs.

Files to preserve through `public/`:

```text
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
assets/
style.css
script.js
```

Target structure:

```text
public/
  assets/
  robots.txt
  sitemap.xml
  site.webmanifest
  service-worker.js
  style.css
  script.js
```

Important: do not delete the legacy root copies until Astro parity is confirmed.

### Task 6: Create Astro Page Parity

Create Astro pages for:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

These should preserve:

```text
/
 /privacy-policy/
 /terms-of-service/
```

The first Astro version should preserve the existing HTML structure, IDs, SEO metadata, Open Graph tags, Twitter tags, canonical URLs, CSP meta tag, stylesheet behavior, and script behavior.

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

These must be added or references must be corrected before launch.

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