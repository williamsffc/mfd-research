# MFD Research Current Tasks

## Current Phase

Planning and controlled migration preparation.

The project is still on the current static HTML/CSS/JS baseline. Astro migration has not started yet.

## Active Goals

1. Commit project planning documentation.
2. Create an Astro migration branch.
3. Preserve current static site while preparing migration.
4. Build Astro version with parity before redesigning or refactoring.
5. Replace testimonials with Conferences & Industry Engagement.
6. Prepare future Cloudflare Pages deployment.

## Immediate Tasks

### Task 1: Add Planning Files

Create or update:

```text
architecture.md
handoff.md
current_tasks.md
```

Then commit:

```bash
git add architecture.md handoff.md current_tasks.md
git commit -m "Add project planning documents"
git push origin main
```

### Task 2: Create Astro Migration Branch

After planning docs are committed:

```bash
git checkout -b astro-migration
```

### Task 3: Ask Cursor for Analysis Only

Use this prompt in Cursor:

```text
Read architecture.md, handoff.md, current_tasks.md, CLAUDE.md, README.md, package.json, index.html, style.css, script.js, sitemap.xml, robots.txt, site.webmanifest, and service-worker.js.

Do not modify files yet.

Summarize the current project structure, current tooling, existing behavior, and a safe step-by-step migration plan to Astro static output for Cloudflare Pages. Preserve routes, SEO files, PWA files, legal pages, visual design, accessibility behavior, and form behavior.
```

### Task 4: Missing Assets Inventory

Confirm and fix or replace references for:

```text
assets/favicon-32x32.png
assets/favicon-16x16.png
assets/apple-touch-icon.png
assets/og-image.png
```

Do not launch until these are resolved.

### Task 5: Conference Data Collection

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
Astro installation
Astro component creation
Cloudflare Pages connection
ADA 2026 page
Google Booking CTA integration
Form environment variable migration
SEO/Open Graph image finalization
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