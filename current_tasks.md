# MFD Research Current Tasks

## Current Phase

Planning is complete. The project is ready to begin the controlled Astro migration.

The current site is still on the static HTML/CSS/JS baseline. The next phase is to create the Astro migration branch and begin a parity-first Astro setup.

## Active Goals

1. Keep `main` as the stable baseline.
2. Create and use an `astro-migration` branch for all migration work.
3. Add Astro without deleting or moving legacy files too early.
4. Preserve current routes, SEO files, legal pages, PWA files, styling, and JavaScript behavior.
5. Build Astro version with parity before redesigning or refactoring.
6. Replace testimonials with Conferences & Industry Engagement after parity.
7. Prepare future Cloudflare Pages deployment.

## Immediate Tasks

### Task 1: Confirm Planning Files Are Committed

Files that should exist in the repo root:

```text
architecture.md
handoff.md
current_tasks.md
```

Check status:

```bash
git status --short
```

If these files are not committed yet, commit them:

```bash
git add architecture.md handoff.md current_tasks.md
git commit -m "Add project planning documents"
git push origin main
```

### Task 2: Create Astro Migration Branch

Create the migration branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b astro-migration
git push -u origin astro-migration
```

Use `astro-migration` for all migration work.

Do not migrate directly on `main`.

### Task 3: Ask Cursor to Start Astro Setup Only

Use this prompt in Cursor:

```text
Based on the approved architecture, handoff, current_tasks, and your migration analysis, begin Step 1 only.

Set up Astro in the existing repository for static output, but do not delete or move the legacy static files yet.

Requirements:
- Preserve the current root files for now.
- Add astro.config.mjs.
- Add the minimum Astro dependencies.
- Configure npm run dev, npm run build, and npm run preview for Astro.
- Create the initial src/pages and public folder structure only if safe.
- Do not refactor homepage content yet.
- Do not remove index.html, style.css, script.js, privacy-policy, terms-of-service, robots.txt, sitemap.xml, site.webmanifest, or service-worker.js.
- Make the smallest safe change possible.
```

### Task 4: Confirm Astro Setup

After Cursor makes changes, run:

```bash
npm install
npm run build
```

Then inspect:

```bash
git status --short
```

Expected new/modified files may include:

```text
astro.config.mjs
package.json
package-lock.json
src/
public/
```

Do not commit until the build succeeds.

### Task 5: Review Cursor Changes Before Commit

Before committing, check what changed:

```bash
git diff --stat
git diff
```

Confirm Cursor did not delete or heavily rewrite:

```text
index.html
style.css
script.js
privacy-policy/index.html
terms-of-service/index.html
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
```

### Task 6: Commit Astro Setup

If the build succeeds and the changes are safe:

```bash
git add .
git commit -m "Set up Astro migration baseline"
```

Push when ready:

```bash
git push
```

## Parity Migration Tasks

These are next, but do not start until the Astro baseline is committed.

### Task 7: Move Root-Served Files Into Astro Public

Move or copy these into `public/` so Astro serves them at the same root URLs:

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

Do not delete legacy root copies until Astro parity is confirmed.

### Task 8: Create Astro Pages With HTML Parity

Create:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

The first Astro pages should preserve:

```text
section IDs
headings
SEO tags
Open Graph tags
Twitter tags
canonical URLs
CSP meta tag
legal page routes
stylesheet behavior
script behavior
```

### Task 9: Validate Existing Behavior

Validate:

```text
Mobile nav
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