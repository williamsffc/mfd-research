# MFD Research Current Tasks

## Current Phase

Astro migration is in progress on the `astro-migration` branch.

Astro bootstrap is complete, root-served static files have been copied into `public/`, existing static pages have been ported into Astro with near-verbatim page parity, missing referenced favicon/Apple/Open Graph assets have been created, Cloudflare preview is working, Web3Forms submission has been validated locally and on Cloudflare preview, `BaseLayout.astro` has been created, and `Header.astro` has been extracted as a controlled structural refactor.

The current goal is to complete basic structural component extraction while preserving visual output, routes, SEO metadata, CSS, JavaScript behavior, and form behavior.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Preserve current visual design and JavaScript behavior.
4. Preserve root routes, legal pages, SEO files, PWA files, and assets.
5. Deploy to Cloudflare only at meaningful milestones.
6. Continue controlled Astro structure refactor.
7. Replace testimonials with Conferences & Industry Engagement after structure is stable.
8. Add Google Booking CTA after structure is stable.
9. Add ADA 2026 landing page after homepage structure/content is stable.
10. Replace Web3Forms later with a Cloudflare-native form architecture.
11. Prepare future Cloudflare Pages/Workers production deployment.

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
Web3Forms CSP submission fixed
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
```

No redesign, componentization, testimonial replacement, or form behavior redesign was made during this step.

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

### Completed Task 9: Add Astro Environment Variable Handling for Web3Forms

The Web3Forms access key is now read at build time from:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

Current implementation:

```astro
---
const web3formsAccessKey = import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';
---
```

The hidden input now uses:

```astro
<input type="hidden" name="access_key" value={web3formsAccessKey} />
```

The following were not changed:

```text
Web3Forms endpoint
form field names
contact form layout
public/script.js behavior
component structure
visual design
legacy files
```

Fallback behavior:

```text
If PUBLIC_WEB3FORMS_ACCESS_KEY is missing, the input value is empty.
The page still builds and loads.
Submission should fail gracefully using existing error handling.
```

### Completed Task 10: Update CSP for Web3Forms Submission

The Content Security Policy in `src/pages/index.astro` has been updated to allow Web3Forms submission.

Previous CSP issue:

```text
connect-src was only 'self', which blocked fetch requests to https://api.web3forms.com/submit.
form-action was not present, which could block native form POST submission.
```

Updated CSP now includes:

```text
connect-src 'self' https://api.web3forms.com;
form-action 'self' https://api.web3forms.com;
```

The following were not changed:

```text
Web3Forms endpoint
form field names
contact form layout
public/script.js behavior
component structure
visual design
legacy files
```

Build confirmation:

```text
npm run build succeeds
```

### Completed Task 11: Validate Local Web3Forms Submission

Local Web3Forms form submission has been validated successfully.

Validated conditions:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY was set in local .env.
Astro injected the key into dist/index.html.
%VITE_ACCESS_KEY% no longer appears in dist/index.html.
PUBLIC_WEB3FORMS_ACCESS_KEY variable name does not appear in dist/index.html.
CSP no longer blocks submission.
Test form submission succeeded.
Test email was received.
```

Important:

```text
.env must not be committed.
The Web3Forms access key is temporary MVP plumbing and should later be replaced by Cloudflare Worker + Turnstile + Resend/Postmark.
```

### Completed Task 12: Validate Cloudflare Preview Web3Forms Submission

Cloudflare preview form submission has been validated successfully.

Validated conditions:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY was configured in Cloudflare.
The deployed HTML contains a populated Web3Forms access_key value.
%VITE_ACCESS_KEY% no longer appears in deployed HTML.
PUBLIC_WEB3FORMS_ACCESS_KEY variable name does not appear in deployed HTML.
CSP no longer blocks submission.
A realistic form submission succeeded.
Test email was received.
```

Notes:

```text
An earlier submission using obvious spam values such as test@test.com and repeated "test" fields was rejected by Web3Forms spam filtering.
A realistic test submission worked successfully.
```

### Completed Task 13: Create BaseLayout.astro

`BaseLayout.astro` has been added as the first controlled structural refactor.

Created file:

```text
src/layouts/BaseLayout.astro
```

Current BaseLayout responsibilities:

```text
Centralizes <!DOCTYPE html>, <html lang>, <head>, and <body>.
Includes shared charset and viewport meta tags.
Provides a named head slot for page-specific head content.
Preserves page-specific title, description, canonical, Open Graph, Twitter, CSP, CSS, and script behavior through page-level slots and markup.
```

Updated pages:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

Preserved:

```text
Routes
Page-specific head tags
CSP behavior
Stylesheet references
Script references
Markup
IDs
CSS classes
Web3Forms behavior
Legal page styling
```

Not changed:

```text
Header/Footer were not extracted.
No redesign was performed.
No copy/content strategy changes were made.
Testimonials were not replaced.
Web3Forms behavior was not changed.
Legacy files were not deleted.
```

Build confirmation:

```text
npm run build succeeds
```

### Completed Task 14: Extract Header.astro

`Header.astro` has been added as a controlled structural refactor.

Created file:

```text
src/components/Header.astro
```

Current Header responsibilities:

```text
Contains the existing navigation/header markup that was previously inline in src/pages/index.astro.
Preserves nav#navbar.
Preserves #navLinks.
Preserves #themeToggle.
Preserves #hamburger.
Preserves all existing classes, aria attributes, logo path, anchor links, theme toggle markup, and hamburger markup.
```

Updated page:

```text
src/pages/index.astro
```

Preserved:

```text
Desktop navigation
Mobile navigation selectors
Theme toggle selectors
Hamburger selectors
Scrollspy expectations
Anchor links
Logo path
CSS classes
ARIA attributes
public/script.js behavior
public/style.css styling
```

Not changed:

```text
Footer was not extracted.
No redesign was performed.
No copy/content strategy changes were made.
Testimonials were not replaced.
Web3Forms behavior was not changed.
Legacy files were not deleted.
```

Build confirmation:

```text
npm run build succeeds
```

## Form Architecture Decision

Web3Forms is acceptable as temporary MVP plumbing.

Long-term preferred architecture:

```text
Cloudflare Worker + Turnstile + Resend/Postmark
```

Recommended future architecture:

```text
Astro contact form
  ↓
Cloudflare Worker endpoint
  ↓
Cloudflare Turnstile verification
  ↓
Server-side validation
  ↓
Email provider such as Resend or Postmark
  ↓
MFD Research inbox
```

Do not implement this yet.

Implement after the site structure, messaging, booking CTA, and conference section are stable.

## Immediate Tasks

### Task 15: Validate and Commit Header Refactor

Run:

```bash
npm run build
npm run preview
```

Check route:

```text
/
```

Validate:

```text
Desktop nav renders correctly.
Logo renders correctly.
Anchor links work.
Mobile hamburger appears at mobile widths.
Mobile menu opens and closes.
Escape closes mobile menu.
Clicking a nav link closes mobile menu.
Theme toggle works.
Theme persists after reload.
Scrollspy still works.
No major console errors.
```

Commit locally:

```bash
git status --short
git diff --stat
git add src/components/Header.astro src/pages/index.astro current_tasks.md
git commit -m "Extract Header component"
```

Push only if ready to deploy this milestone:

```bash
git push
```

### Task 16: Extract Footer.astro

After Header is committed and local QA passes, extract the footer only.

Expected file:

```text
src/components/Footer.astro
```

Requirements:

```text
Preserve existing footer markup.
Preserve footer-copy and footerYear behavior expected by public/script.js.
Preserve footer social link.
Preserve Quick Links.
Preserve Contact block.
Preserve Privacy Policy and Terms of Service links.
Preserve classes used by public/style.css.
Do not change copy.
Do not redesign.
Do not extract other sections yet.
Do not replace testimonials yet.
Do not delete legacy files.
```

Validation after Footer extraction:

```bash
npm run build
npm run preview
```

Check:

```text
Footer renders correctly.
Footer year updates.
Footer links work.
Footer social link works.
Privacy Policy and Terms of Service links work.
No console errors.
```

## Next Planned Refactor Sequence

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

Current status:

```text
BaseLayout.astro complete.
Header.astro complete.
Footer.astro next.
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
Footer extraction
ADA 2026 page
Google Booking CTA integration
Conference section implementation
Cloudflare Worker + Turnstile form architecture
Legacy file cleanup after parity
Production domain connection
```

## Blockers / Pending Inputs

Need from project owner:

```text
Google Booking URL
Final list of six conferences/meetings
Final email address
Final decision on whether to keep or remove service worker
Final Open Graph image approval
Future email provider choice for Cloudflare Worker form: Resend or Postmark
```

## Working Principle

Do parity first, then refactor, then improve.

Do not make large uncontrolled rewrites.

Keep `main` stable.

Use `astro-migration` as the construction branch.

Do not delete legacy files until Astro parity is confirmed.

Do not connect the production domain until the site is approved.

Deploy to Cloudflare only at meaningful milestones.