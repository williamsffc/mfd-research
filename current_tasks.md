# MFD Research Current Tasks

## Current Phase

Astro migration is in progress on the `astro-migration` branch.

Astro bootstrap is complete, root-served static files have been copied into `public/`, existing static pages have been ported into Astro with near-verbatim page parity, missing referenced favicon/Apple/Open Graph assets have been created, Cloudflare preview is working, Web3Forms submission has been validated locally and on Cloudflare preview, `BaseLayout.astro` has been created, `Header.astro` and `Footer.astro` have been extracted, the former Testimonials section has been replaced with a Conferences & Industry Engagement section, and the hero has been updated to position MFD Research as a company-led clinical research operations consulting firm.

The current goal is to rework the About section so it reinforces the company-led, founder-validated positioning before reducing the resume-style Experience timeline.

## Active Goals

1. Keep `main` as the stable baseline.
2. Use `astro-migration` for all migration work.
3. Preserve current visual design and JavaScript behavior.
4. Preserve root routes, legal pages, SEO files, PWA files, and assets.
5. Deploy to Cloudflare only at meaningful milestones.
6. Validate Conferences & Industry Engagement locally and on Cloudflare preview.
7. Rework homepage content toward company-led and founder-validated positioning.
8. Update the About section to be company-first.
9. Add Google Booking CTA to stronger homepage locations after messaging is stable.
10. Add ADA 2026 landing page after homepage structure/content is stable.
11. Replace Web3Forms later with a Cloudflare-native form architecture.
12. Prepare future Cloudflare Pages/Workers production deployment.

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
Hero positioning updated
About section repositioned
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

### Completed Task 15: Extract Footer.astro

`Footer.astro` has been added as a controlled structural refactor.

Created file:

```text
src/components/Footer.astro
```

Current Footer responsibilities:

```text
Contains the existing footer markup that was previously inline in src/pages/index.astro.
Preserves span#footerYear for public/script.js behavior.
Preserves all classes and structure used by public/style.css.
Preserves LinkedIn social link and attributes.
Preserves Quick Links.
Preserves Contact block.
Preserves Privacy Policy and Terms of Service links.
```

Updated page:

```text
src/pages/index.astro
```

Preserved:

```text
Footer layout
Footer styling selectors
footerYear behavior
Social link behavior
Legal links
Footer copy
public/script.js behavior
public/style.css styling
```

Not changed:

```text
No other sections were extracted.
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

### Completed Task 16: Replace Testimonials with Conferences & Industry Engagement

The previous Testimonials section has been replaced with a Conferences & Industry Engagement section.

Created files:

```text
src/data/conferences.ts
src/components/Conferences.astro
```

Updated files:

```text
src/pages/index.astro
public/style.css
```

Preserved:

```text
Header was not changed.
Footer was not changed.
BaseLayout was not changed.
Web3Forms behavior was not changed.
Other homepage sections were not changed.
Legacy files were not deleted.
```

Conference section behavior:

```text
Conference data is driven from src/data/conferences.ts.
ADA 2026 is rendered as the featured upcoming card.
Only the ADA 2026 card includes the Google Booking CTA.
Google Booking URL: https://calendar.app.google/8fQfrSyLumEMRKHQ9
Incomplete events use honest labels such as Details Pending.
No missing event details were invented.
```

CSS changes:

```text
Small targeted CSS was added to public/style.css.
The new section preserves the dark background visual direction.
The section uses a featured current/upcoming engagement with a compact recent/past engagements list.
```

Build confirmation:

```text
npm run build succeeds
```

### Completed Task 17: Refine Conferences Layout and Navigation

The Conferences & Industry Engagement section was refined after visual review.

Updated behavior:

```text
Section anchor changed to #conferences.
Header nav label changed to Conferences.
Footer quick link changed to Conferences.
Conferences appears before FAQ in the header.
ADA 2026 remains the featured upcoming engagement.
Recent/past engagements render as a compact list/timeline rather than large cards.
The featured card is compact and no longer stretches to match the full recent/past list height.
```

Preserved:

```text
Data-driven conference structure.
featured flag for current/upcoming engagement.
startDate/endDate values for sorting.
Details Pending labels for incomplete events.
Google Booking CTA on ADA card.
Web3Forms behavior.
Header/Footer behavior.
Dark mode readability.
Mobile layout.
```

Build confirmation:

```text
npm run build succeeds
```

### Completed Task 18: Update Hero Positioning and Booking CTA

The hero/top-page copy has been updated to make the site more company-led and consulting-focused.

Updated hero headline:

```text
Clinical Research Operations
Built for Execution
```

Updated hero subheadline:

```text
MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.
```

Updated hero CTA behavior:

```text
Primary CTA changed to Schedule a Confidential Consultation.
Primary CTA links to https://calendar.app.google/8fQfrSyLumEMRKHQ9.
Primary CTA opens in a new tab with rel="noopener noreferrer".
Secondary CTA changed to View Consulting Services.
Secondary CTA links to #services.
```

Preserved:

```text
Hero visual layout.
Hero CSS classes.
Other homepage sections.
Header/Footer behavior.
Web3Forms behavior.
Conferences section.
Legacy files.
```

Build confirmation:

```text
npm run build succeeds
```

## Current Known Inputs

### Google Booking URL

```text
https://calendar.app.google/8fQfrSyLumEMRKHQ9
```

### Conference / Meeting Data

```text
June 4–8, 2026
New Orleans, LA
American Diabetes Association (ADA) 2026 Scientific Sessions
Status: Upcoming
Focus: Diabetes, obesity, metabolic disease, clinical research innovation
Featured: true
CTA: Schedule a Meeting
CTA URL: https://calendar.app.google/8fQfrSyLumEMRKHQ9
```

```text
March 3–4, 2026
Seattle, WA
ENLIGHTEN Investigator Engagement Meeting
Status: Attended
Focus: Investigator engagement, clinical trial collaboration
```

```text
February 25–26, 2026
Dallas/Fort Worth, TX
Dallas/Fort Worth Industry Meeting
Status: Details Pending
Focus: Details pending
```

```text
September 4–5, 2025
Indianapolis, IN
Lilly CoDesign, MASLD/MASH CoLAB
Status: Attended
Focus: MASLD/MASH, metabolic and liver disease research
```

```text
August 12–13, 2025
Indianapolis, IN
Industry Meeting
Status: Details Pending
Focus: Details pending
```

```text
May 8–9, 2025
Indianapolis, IN
Lilly - Sarcopenic Obesity CoDesign
Status: Attended
Focus: Sarcopenic obesity, clinical research collaboration
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

### Task 19: Validate and Commit Hero Positioning Milestone

Run:

```bash
npm run build
npm run preview
```

Open:

```text
http://localhost:8080/
```

Validate:

```text
Hero headline renders cleanly on desktop.
Hero headline wraps cleanly on mobile.
Primary CTA opens Google Booking in a new tab.
Secondary CTA scrolls to #services.
Header still works.
Footer still works.
Conferences section still works.
Contact form still works.
No major console errors.
```

Commit locally:

```bash
git status --short
git diff --stat
git add src/pages/index.astro current_tasks.md
git commit -m "Update hero positioning and booking CTA"
```

Push because this is a meaningful content milestone:

```bash
git push
```

### Task 20: Rework About Section

Next safe content milestone:

```text
Rework the About section to be company-first and founder-validated.
```

Requirements:

```text
Preserve id="about".
Preserve existing layout/grid if possible.
Preserve classes needed for styling and reveal behavior.
Do not change Services, Process, Experience, Specialties, Credentials, Conferences, FAQ, Contact, Header, or Footer.
Do not change Web3Forms behavior.
Do not redesign the full homepage.
Do not delete legacy files.
```

Messaging goals:

```text
Lead with MFD Research as the consulting firm.
Make who the firm helps explicit: sponsors, CROs, biotech organizations, research sites.
Make what the firm supports explicit: clinical operations, site readiness, quality systems, regulatory/GCP readiness, trial delivery.
Use Michael Delgado as founder-led credibility, not as the entire brand.
Keep founder credibility concise.
Avoid generic consulting language.
Avoid turning the section into a resume.
```

Suggested company-first copy:

```text
MFD Research is a specialized clinical research operations consulting firm helping sponsors, CROs, biotech organizations, and research sites strengthen operational execution, site readiness, quality systems, and trial delivery.

Founded by Michael Delgado, CCRC, the firm brings more than 18 years of hands-on clinical research leadership across site operations, sponsor partnerships, regulatory readiness, staff development, and multi-therapeutic trial execution.
```

Validation:

```bash
npm run build
npm run preview
```

Check:

```text
#about still works.
Header About link scrolls correctly.
Scroll reveal still works.
Copy feels company-led and founder-validated.
No unrelated sections changed.
No console errors.
```

## Next Planned Strategic Sequence

Current completed structural/content sequence:

```text
1. BaseLayout.astro complete.
2. Header.astro complete.
3. Footer.astro complete.
4. Testimonials replaced with Conferences & Industry Engagement.
5. Hero positioning updated.
```

Next strategic sequence:

```text
1. Rework About as company-first and founder-validated.
2. Reduce resume-style Experience timeline emphasis.
3. Add Google Booking CTA to another appropriate conversion point.
4. Add ADA 2026 page.
5. Later implement Cloudflare Worker + Turnstile + Resend/Postmark form architecture.
```

## Not Started Yet

```text
Company-first About rewrite
Resume-style timeline reduction
Google Booking CTA integration beyond hero and ADA card
ADA 2026 page
Cloudflare Worker + Turnstile form architecture
Legacy file cleanup after parity
Production domain connection
```

## Blockers / Pending Inputs

Need from project owner:

```text
Final email address
Final decision on whether to keep or remove service worker
Final Open Graph image approval
Future email provider choice for Cloudflare Worker form: Resend or Postmark
Final names/details for currently unspecified meetings
```

## Working Principle

Do parity first, then refactor, then improve.

Do not make large uncontrolled rewrites.

Keep `main` stable.

Use `astro-migration` as the construction branch.

Do not delete legacy files until Astro parity is confirmed.

Do not connect the production domain until the site is approved.

Deploy to Cloudflare only at meaningful milestones.