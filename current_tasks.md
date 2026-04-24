# MFD Research Current Tasks

## Current Phase

Planning and controlled Astro migration preparation.

The project is still on the current static HTML/CSS/JS baseline. Astro migration has not started yet.

Cursor has reviewed the current repo and confirmed the safe migration approach:

- Preserve the current static site until Astro parity is proven.
- Create the Astro structure without deleting working files.
- Move route-safe static files into `public/`.
- Keep `style.css` and `script.js` as-is during the first parity pass.
- Preserve routes, legal pages, SEO files, PWA files, accessibility behavior, visual direction, and form behavior.
- Componentize only after parity.

## Active Goals

1. Commit project planning documentation.
2. Create an Astro migration branch.
3. Preserve current static site while preparing migration.
4. Build Astro version with parity before redesigning or refactoring.
5. Replace testimonials with Conferences & Industry Engagement after parity.
6. Prepare future Cloudflare Pages deployment.

## Immediate Tasks

### Task 1: Confirm Planning Files Are Committed

Confirm these files exist in the repo root:

```text
architecture.md
handoff.md
current_tasks.md
```

Check status:

```bash
git status --short
```

If the files are not committed yet, commit them:

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

Optional but recommended when ready to back up the branch:

```bash
git push -u origin astro-migration
```

Pushing immediately is not required, but it is useful once the branch has meaningful work.

### Task 3: Ask Cursor to Create Astro Structure Without Deleting Static Site

Use this prompt in Cursor:

```text
Create the initial Astro migration structure while preserving the existing static site.

Requirements:
- Do not delete index.html, style.css, script.js, privacy-policy/index.html, terms-of-service/index.html, robots.txt, sitemap.xml, site.webmanifest, service-worker.js, or assets yet.
- Add Astro configured for static output.
- Configure build output to dist.
- Create astro.config.mjs.
- Create src/pages/index.astro.
- Create src/pages/privacy-policy/index.astro.
- Create src/pages/terms-of-service/index.astro.
- Create src/layouts/BaseLayout.astro.
- Create public/ and copy route-safe static files into it:
  - robots.txt
  - sitemap.xml
  - site.webmanifest
  - service-worker.js
  - assets/
  - style.css
  - script.js
- Preserve current URLs and route behavior.
- Keep the first Astro pass focused on parity, not redesign.
- Update package.json scripts so npm run dev, npm run build, and npm run preview use Astro.
- Do not remove scripts/vite-runner.mjs yet.
- Do not modify visual design or content strategy yet.
- After changes, summarize exactly what was created, moved, copied, and changed.
```

### Task 4: Run Local Build and Dev Check

After Cursor creates the initial Astro structure, run:

```bash
npm install
npm run dev
```

Then test locally:

```text
/
 /privacy-policy/
 /terms-of-service/
 /robots.txt
 /sitemap.xml
 /site.webmanifest
 /service-worker.js
```

Then run:

```bash
npm run build
npm run preview
```

### Task 5: Commit Initial Astro Setup

If the dev server and build work:

```bash
git status --short
git add .
git commit -m "Set up Astro migration structure"
```

Push only when ready:

```bash
git push -u origin astro-migration
```

### Task 6: Missing Assets Inventory

Confirm and fix or replace references for:

```text
assets/favicon-32x32.png
assets/favicon-16x16.png
assets/apple-touch-icon.png
assets/og-image.png
```

These should eventually exist at:

```text
public/assets/favicon-32x32.png
public/assets/favicon-16x16.png
public/assets/apple-touch-icon.png
public/assets/og-image.png
```

Do not launch until these are resolved.

### Task 7: Conference Data Collection

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

These will become the `Conferences & Industry Engagement` section after Astro parity is complete.

## Target Astro Folder Structure

The intended structure after the first safe Astro migration pass is:

```text
mfd-research/
  public/
    assets/
      favicon.svg
      mfd-logo.jpg
      favicon-16x16.png
      favicon-32x32.png
      apple-touch-icon.png
      og-image.png
    robots.txt
    sitemap.xml
    site.webmanifest
    service-worker.js
    style.css
    script.js

  src/
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      privacy-policy/
        index.astro
      terms-of-service/
        index.astro

  scripts/
    test-a11y.mjs
    optimize-images.mjs
    vite-runner.mjs

  astro.config.mjs
  package.json
  package-lock.json
  tsconfig.json
  README.md
  CLAUDE.md
  architecture.md
  handoff.md
  current_tasks.md
  .gitignore
  .env.example
```

## Files That Should Move or Be Copied Into public/

These files must continue to be served at root URLs:

```text
robots.txt -> public/robots.txt
sitemap.xml -> public/sitemap.xml
site.webmanifest -> public/site.webmanifest
service-worker.js -> public/service-worker.js
assets/ -> public/assets/
style.css -> public/style.css
script.js -> public/script.js
```

During the first pass, copying is safer than moving because the legacy static site should remain intact until Astro parity is confirmed.

## Files That Should Become Astro Source

```text
index.html -> src/pages/index.astro
privacy-policy/index.html -> src/pages/privacy-policy/index.astro
terms-of-service/index.html -> src/pages/terms-of-service/index.astro
```

Create:

```text
src/layouts/BaseLayout.astro
```

Do not componentize heavily until parity is proven.

## Files to Remove Only After Astro Parity Is Confirmed

Do not remove these yet:

```text
index.html
privacy-policy/index.html
terms-of-service/index.html
scripts/vite-runner.mjs
```

They can be removed only after:

- Astro routes are working.
- Astro build succeeds.
- Cloudflare preview works.
- Legal pages work.
- SEO/PWA files work.
- Styling and JavaScript behavior are preserved.

## Not Started Yet

```text
Astro installation
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