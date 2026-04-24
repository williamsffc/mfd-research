# MFD Research Current Tasks

## Current Phase

Astro migration and controlled content repositioning are in progress on the `astro-migration` branch.

The site has been migrated from static HTML/CSS/JS into Astro with preserved routes, assets, styling, JavaScript behavior, legal pages, and form behavior. The homepage is now being repositioned from a Michael-forward profile style into a company-led, founder-validated MFD Research consulting site.

## Current Strategic Direction

MFD Research should be positioned as the business brand.

Michael Delgado should function as the founder-led credibility engine, not as the entire brand.

LinkedIn remains Michael-forward.

The website should be company-forward, service-oriented, and conversion-focused.

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
Experience section compressed
Google Booking CTA added
ADA 2026 page added
Final pre-launch QA
```

## Completed Milestones

### Project Planning

Completed:

```text
architecture.md
handoff.md
current_tasks.md
```

Purpose:

```text
architecture.md = stable project blueprint
handoff.md = context transfer file
current_tasks.md = active implementation queue
```

### Git / Branching

Completed:

```text
main = stable baseline
astro-migration = active migration branch
```

### Astro Bootstrap

Completed:

```text
Astro added
astro.config.mjs created
npm run dev/build/preview switched to Astro
npm run build succeeds
```

### Public Asset Preservation

Completed:

```text
robots.txt copied to public/
sitemap.xml copied to public/
site.webmanifest copied to public/
service-worker.js copied to public/
style.css copied to public/
script.js copied to public/
assets/ copied to public/assets/
```

Legacy root files remain in place and have not been deleted.

### Astro Page Parity

Completed:

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

### Missing Asset Fixes

Completed:

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

### Cloudflare Preview

Cloudflare preview is working at:

```text
https://testing.mfd-research.workers.dev/
```

Deployment method currently uses Cloudflare Workers static assets:

```text
npx wrangler deploy --assets=dist --compatibility-date 2026-04-24
```

Do not connect the production domain yet.

### Web3Forms Temporary MVP Setup

Completed:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY added through Astro build-time env handling
CSP updated to allow https://api.web3forms.com
Local form submission validated
Cloudflare preview form submission validated
Test email received successfully
```

Important:

```text
Web3Forms is temporary MVP plumbing.
Do not commit .env.
The long-term preferred architecture is Cloudflare Worker + Turnstile + Resend/Postmark.
```

### Base Astro Structure

Completed:

```text
src/layouts/BaseLayout.astro
src/components/Header.astro
src/components/Footer.astro
```

Preserved:

```text
Header behavior
Mobile navigation
Theme toggle
Scrollspy
Footer year behavior
Legal links
Contact form behavior
CSS classes
JS selectors
```

### Conferences Section

Completed:

```text
src/data/conferences.ts
src/components/Conferences.astro
```

The former Testimonials section has been replaced with:

```text
Conferences & Industry Engagement
```

Current behavior:

```text
Section anchor is #conferences.
Header nav label is Conferences.
Footer quick link label is Conferences.
ADA 2026 is the featured upcoming engagement.
Recent/past engagements render as a compact list.
Google Booking CTA appears on the ADA card.
```

### Hero Positioning

Completed hero headline:

```text
Clinical Research Operations
Built for Execution
```

Completed hero subheadline:

```text
MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.
```

Completed CTA updates:

```text
Primary CTA: Schedule a Confidential Consultation
Primary CTA URL: https://calendar.app.google/8fQfrSyLumEMRKHQ9
Secondary CTA: View Consulting Services
Secondary CTA URL: #services
```

### About Section Repositioning

Completed About section update.

Current About copy direction:

```text
MFD Research is positioned as a specialized clinical research operations consulting firm.
Sponsors, CROs, biotech organizations, and research sites are named explicitly.
Operational execution, site readiness, quality systems, and trial delivery are named explicitly.
Michael Delgado is presented as founder-led credibility, not as the whole brand.
```

Preserved:

```text
id="about"
existing About layout/grid
existing reveal classes
header About anchor behavior
desktop/mobile layout
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

### Task 1: Validate and Commit About Section Milestone

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
About header nav link scrolls to #about.
About section copy renders correctly.
Desktop layout remains clean.
Mobile layout remains clean.
Scroll reveal still works.
Hero still works.
Conferences still work.
Contact form still works.
No major console errors.
```

Commit locally:

```bash
git status --short
git diff --stat
git add src/pages/index.astro current_tasks.md
git commit -m "Rework About section positioning"
```

Push because this is a meaningful content milestone:

```bash
git push
```

### Task 2: Reduce Resume-Style Experience Timeline

Next safe content milestone:

```text
Compress the Experience section so it supports credibility without feeling like a LinkedIn resume timeline.
```

Requirements:

```text
Preserve id="experience".
Preserve timeline behavior if still used.
Preserve classes expected by public/script.js, especially timeline-item behavior.
Keep Michael as founder-led proof, not the site’s main subject.
Reduce excessive resume-style detail.
Keep the section credible, concise, and company-relevant.
Do not change Services, Process, Specialties, Credentials, Conferences, FAQ, Contact, Header, or Footer.
Do not change Web3Forms behavior.
Do not redesign the full homepage.
Do not delete legacy files.
```

Recommended direction:

```text
Reframe Experience as Founder-Led Operating Experience.
Focus on clinical research operations, site leadership, sponsor/CRO collaboration, regulatory readiness, staff development, and therapeutic execution.
Reduce detailed job-history language.
Keep enough proof to validate MFD Research.
```

Validation:

```bash
npm run build
npm run preview
```

Check:

```text
#experience still works.
Header Experience link scrolls correctly.
Timeline/reveal behavior still works.
Copy feels less resume-like.
No unrelated sections changed.
No console errors.
```

## Next Planned Strategic Sequence

Current completed sequence:

```text
1. Astro migration complete.
2. BaseLayout/Header/Footer complete.
3. Conferences section complete.
4. Hero positioning updated.
5. About section repositioned.
```

Next strategic sequence:

```text
1. Reduce resume-style Experience timeline emphasis.
2. Add Google Booking CTA to another appropriate conversion point.
3. Add ADA 2026 page.
4. Later implement Cloudflare Worker + Turnstile + Resend/Postmark form architecture.
5. Clean up legacy root files after final parity confidence.
6. Connect production domain only after final approval.
```

## Not Started Yet

```text
Resume-style Experience timeline reduction
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