# MFD Research Website Architecture

## Project Overview

MFD Research is a founder-led clinical research consulting firm website. The site should position MFD Research as a credible consulting business while using Michael Delgado’s professional background as the authority behind the firm.

The brand strategy is:

**MFD Research = the consulting firm**  
**Michael Delgado = founder-led credibility engine**

The site should not feel like a duplicate of Michael’s LinkedIn profile. LinkedIn should remain Michael-forward. The website should be company-forward, service-oriented, and conversion-focused.

## Strategic Positioning

### Primary Positioning

MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.

### Founder Validation

MFD Research was founded by Michael Delgado, CCRC, a clinical research operations leader with more than 18 years of experience across site operations, sponsor relationships, regulatory readiness, staff training, and multi-therapeutic trial execution.

Michael should appear on the site as the founder/principal authority behind the business, but the website should remain branded around MFD Research as the company.

## Current Repository Baseline

The site is an **Astro** static build. Shipped CSS, JS, PWA files, and binary assets live under **`public/`** (copied to `dist/` root). Pages and composition live under **`src/`**.

### Core paths

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
src/components/
src/data/
public/style.css
public/script.js
public/service-worker.js
public/assets/
public/robots.txt
public/sitemap.xml
public/site.webmanifest
README.md
CLAUDE.md
package.json
package-lock.json
scripts/
```

Legacy root copies of `index.html`, `style.css`, `script.js`, and duplicate static legal HTML have been removed; **`public/` + `src/`** are the source of truth.

### Existing Tooling

The current `package.json` includes scripts for local development, building, previewing, accessibility testing, and image optimization.

```json
{
  "dev": "node scripts/vite-runner.mjs --port 8080",
  "build": "node scripts/vite-runner.mjs build",
  "build:dev": "node scripts/vite-runner.mjs build",
  "preview": "node scripts/vite-runner.mjs preview",
  "test:a11y": "node scripts/test-a11y.mjs",
  "optimize:images": "node scripts/optimize-images.mjs"
}
```

The current project includes:

- Local development script
- Build script
- Preview script
- Accessibility testing using `axe-core`
- Image optimization script
- Static privacy policy page
- Static terms of service page
- Sitemap
- Robots file
- Web app manifest
- Service worker
- Static assets
- Existing CSS design system

### Repository Hygiene

The repository correctly ignores local environment files and dependencies.

```gitignore
node_modules/
.env
.env.local
.env.*.local
```

The `.env` file and `node_modules/` directory must not be committed.

## Known Current Issues

The current static site references several assets that are not currently present in the repository and should be added or the references should be corrected.

Missing referenced assets:

```text
assets/favicon-32x32.png
assets/favicon-16x16.png
assets/apple-touch-icon.png
assets/og-image.png
```

These are important for browser icons, mobile home screen behavior, PWA metadata, and LinkedIn/Open Graph previews.

The contact form currently uses a placeholder access key:

```html
%VITE_ACCESS_KEY%
```

During Astro migration, form environment handling should be updated so the Web3Forms key is rendered safely at build time using an Astro-compatible environment variable.

Recommended variable:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

The current documentation references Netlify in some places, but the confirmed target hosting platform is Cloudflare Pages.

## Target Technical Architecture

### Framework

The target framework is:

```text
Astro
```

Astro should be used because MFD Research is primarily a content-forward business website, not a heavy web application.

Astro should be configured for static output.

### Hosting

The confirmed hosting target is:

```text
Cloudflare Pages
```

Cloudflare will be used for:

- Static site hosting
- DNS
- Performance
- Security
- Preview deployments
- Future analytics and edge options if needed

### Booking

The primary booking/conversion path will use Google Booking.

Google Booking should be the main CTA destination across the site.

Recommended CTA language:

```text
Schedule a Confidential Consultation
```

Alternative CTA for ADA/conference content:

```text
Schedule a 30-Minute Meeting
```

### Forms

The contact form should remain secondary to the booking CTA.

Preferred conversion hierarchy:

1. Schedule a confidential consultation
2. Email MFD Research
3. Submit contact form

Form behavior should remain stable during migration. Do not change the form provider or field names unless explicitly approved.

## Target Site Structure

The site should be structured as a professional, company-led consulting website.

Recommended homepage order:

```text
1. Hero
2. Who We Help
3. What We Do
4. Why MFD Research
5. Founder-Led Expertise
6. Conferences & Industry Engagement
7. Therapeutic Expertise
8. Engagement Process
9. Contact / Schedule Consultation
10. Footer
```

## Recommended Route Structure

Initial required routes:

```text
/
 /privacy-policy/
 /terms-of-service/
```

Future planned route:

```text
/ada-2026/
```

Possible future routes:

```text
/services/
 /founder/
 /contact/
 /insights/
```

Do not add future routes until the homepage and core migration are stable.

## Required Route Preservation

During migration, these routes must continue to work:

```text
/
 /privacy-policy/
 /terms-of-service/
```

These root-level files must also continue to be served correctly:

```text
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
```

Do not break existing URLs or trailing slash behavior.

## Astro Target Structure

Recommended Astro structure:

```text
src/
  components/
    Header.astro
    Hero.astro
    WhoWeHelp.astro
    Services.astro
    WhyMFD.astro
    FounderExpertise.astro
    Conferences.astro
    TherapeuticExpertise.astro
    EngagementProcess.astro
    ContactCTA.astro
    Footer.astro
  data/
    services.ts
    audiences.ts
    conferences.ts
    therapeuticAreas.ts
  layouts/
    BaseLayout.astro
  pages/
    index.astro
    privacy-policy/
      index.astro
    terms-of-service/
      index.astro
    ada-2026.astro
  styles/
    global.css
public/
  assets/
  robots.txt
  sitemap.xml
  site.webmanifest
  service-worker.js
```

## Migration Principle

The Astro migration should be treated as a controlled migration, not a full rebuild from scratch.

The goal is to preserve working assets, SEO files, legal pages, useful scripts, accessibility behavior, visual style, and routing while reorganizing the website into an Astro component-based architecture.

## Migration Strategy

### Phase 0: Freeze Compatibility Targets

Before modifying the structure, confirm the required URLs and files that must remain stable.

Required routes:

```text
/
 /privacy-policy/
 /terms-of-service/
```

Required root files:

```text
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
```

### Phase 1: Preserve Current Site Baseline

Commit the current architecture documentation before migration begins.

During migration, do not delete the canonical **`public/`** copies of CSS/JS or break Astro routes until parity is verified. Duplicate **root-level** `index.html`, `style.css`, `script.js`, legacy legal HTML, and duplicate `assets/` have been removed after automated parity checks (`npm run verify:parity`).

### Phase 2: Create Astro Structure

Add Astro to the existing repository.

Configure Astro for static output.

Cloudflare Pages build settings should eventually be:

```text
Build command: npm run build
Output directory: dist
```

### Phase 3: Preserve Public Files

Move or copy the following files into Astro’s `public/` directory so they continue to ship at the same root URLs:

```text
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
assets/
```

Any missing referenced assets should be created or references should be corrected.

### Phase 4: Port Visual Design

Preserve the existing visual direction:

- Navy/green clinical-executive palette
- Rounded cards
- Subtle gradients and blobs
- Dark mode support
- Reduced-motion support
- Responsive behavior
- Clear executive consulting tone

The existing `style.css` may be used as the starting point, either by importing it globally or converting it into `src/styles/global.css`.

Do not redesign the entire visual system during the first Astro migration pass.

### Phase 5: Port Pages with Parity First

Create Astro pages for:

```text
src/pages/index.astro
src/pages/privacy-policy/index.astro
src/pages/terms-of-service/index.astro
```

The first Astro version should aim for output and behavior parity before heavy refactoring.

### Phase 6: Reattach JavaScript Behavior

The existing `script.js` may be preserved initially and loaded with `defer`.

Validate:

- Mobile navigation
- Focus handling
- Skip link
- Scroll reveal
- Scrollspy
- Theme toggle
- LocalStorage theme persistence
- Form validation
- Async form submit
- Back-to-top behavior
- Service worker registration
- Reduced-motion behavior

### Phase 7: Replace Testimonials with Conferences

The current testimonial section should be removed or replaced.

New section:

```text
Conferences & Industry Engagement
```

Purpose:

- Show Michael/MFD Research is active in clinical research and therapeutic-area industry conversations.
- Avoid unverified or generic testimonials.
- Support ADA 2026 outreach.
- Reinforce credibility without making the site feel like a resume.

Conference cards should include:

```text
Conference name
Year
Location
Status: Upcoming or Attended
Relevant focus area
Optional URL
```

ADA 2026 should be highlighted as upcoming.

### Phase 8: Refactor into Components

After functional parity is reached, split homepage sections into Astro components.

Recommended components:

```text
Header.astro
Hero.astro
WhoWeHelp.astro
Services.astro
WhyMFD.astro
FounderExpertise.astro
Conferences.astro
TherapeuticExpertise.astro
EngagementProcess.astro
ContactCTA.astro
Footer.astro
```

Move structured content into `src/data/`.

### Phase 9: ADA 2026 Landing Page

After the homepage is stable, create:

```text
/ada-2026/
```

Purpose:

- Dedicated landing page for LinkedIn posts
- Conference outreach
- QR codes
- Email signatures
- Booking CTA

Primary CTA:

```text
Schedule a 30-Minute Meeting
```

### Phase 10: Cloudflare Pages Deployment

Do not connect the production domain until the site is polished and approved.

Deployment sequence:

1. Build and test locally.
2. Push Astro branch to GitHub.
3. Connect repo to Cloudflare Pages.
4. Use Cloudflare preview URL first.
5. Test all routes and CTAs.
6. Connect `mfdresearch.com`.
7. Add `www` redirect.
8. Enable analytics.
9. Test LinkedIn preview card.
10. Submit sitemap to Google Search Console.

## Content Strategy

### Voice

The site should sound:

- Executive
- Clinical
- Precise
- Trustworthy
- Practical
- Confidential
- Service-oriented

Avoid sounding like:

- A freelancer portfolio
- A generic agency website
- A resume copied from LinkedIn
- A hype-heavy startup landing page

### Hero Direction

Recommended hero headline:

```text
Clinical Research Operations Built for Execution
```

Recommended subheadline:

```text
MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.
```

Primary CTA:

```text
Schedule a Confidential Consultation
```

Secondary CTA:

```text
View Consulting Services
```

### Founder Section

Michael should appear in a dedicated founder-led credibility section.

Recommended framing:

```text
Founder-Led Expertise
```

Michael should be described as the founder/principal authority behind the business, not as the entire brand.

The full career timeline should be reduced or removed from the homepage. LinkedIn should carry the detailed career history.

### Conferences Section

The site should include a section for recent and upcoming conferences/meetings.

Recommended section title:

```text
Conferences & Industry Engagement
```

ADA 2026 should be included as upcoming.

A dedicated ADA page may be added after the core site is stable.

### Testimonials

Do not use testimonials unless they are real, approved, and attributable or intentionally anonymized with permission.

Current plan:

```text
Replace testimonials with Conferences & Industry Engagement.
```

## SEO and Metadata Requirements

Preserve:

- Canonical URLs
- Meta descriptions
- Open Graph tags
- Twitter card tags
- Sitemap
- Robots file
- Page titles
- Favicon references
- `og-image.png` or equivalent social preview image

Add or fix:

- Missing favicon PNG files
- Missing Apple touch icon
- Missing Open Graph image

For LinkedIn sharing, the Open Graph image is especially important.

## Security Requirements

The current site uses a Content Security Policy meta tag.

During migration:

- Preserve CSP behavior initially.
- Later consider moving CSP from meta tags to Cloudflare headers.
- Do not weaken security policy without a specific reason.
- Ensure external resources such as Google Fonts, Web3Forms, and booking links are allowed as needed.

## Accessibility Requirements

Preserve or improve:

- Skip link
- Semantic landmarks
- Keyboard navigation
- Focus states
- Button labels
- Form labels and validation
- `aria-expanded` for menus and FAQ items
- Reduced motion support
- Color contrast
- Mobile navigation behavior

Run accessibility checks before launch.

## Performance Requirements

The site should remain:

- Fast
- Static-first
- Low JavaScript
- Mobile-friendly
- SEO-friendly
- Easy to cache

Avoid unnecessary client-side frameworks or heavy dependencies.

## AI Tooling Workflow

The project will be built with assistance from:

```text
Cursor
Claude Code
Codex
ChatGPT
```

ChatGPT is used as the strategic and architectural planning layer.

Cursor/Claude/Codex may be used to implement code changes.

AI coding tools should be instructed to:

- Read `architecture.md` before making changes.
- Preserve existing routes and assets.
- Avoid deleting working files until replacements are verified.
- Make small, reviewable commits.
- Prefer parity first, then refactor.
- Avoid large uncontrolled rewrites.
- Keep changes aligned with the company-led, founder-validated strategy.

## Documentation Files

This repo should maintain three project-control documents:

```text
architecture.md
handoff.md
current_tasks.md
```

### architecture.md

Stable project blueprint.

Update only when major strategy, architecture, framework, hosting, routing, or content-structure decisions change.

### handoff.md

Context transfer file for future ChatGPT sessions, Cursor agents, Claude Code, Codex, or collaborators.

Update whenever a meaningful decision is made or a phase is completed.

### current_tasks.md

Active working queue.

Update frequently during implementation.

Use this for the next immediate tasks, task status, blockers, and Cursor prompts.

## Git Workflow

Recommended workflow:

```text
main = stable baseline
astro-migration = active Astro migration branch
feature branches = optional for focused tasks
```

Recommended initial commit:

```bash
git add architecture.md handoff.md current_tasks.md
git commit -m "Add project planning documents"
git push origin main
```

After documentation is committed:

```bash
git checkout -b astro-migration
```

Do not deploy from an unfinished migration branch to production.

## Definition of Ready for Cloudflare Connection

The site is ready to connect to Cloudflare Pages when:

- `npm run build` succeeds.
- Homepage renders correctly.
- Legal pages render correctly.
- Root SEO/PWA files are served correctly.
- Booking CTA links work.
- Contact form behavior is validated.
- Missing favicon and OG assets are fixed.
- Mobile navigation works.
- Accessibility checks pass.
- LinkedIn preview card has been tested.
- No `.env` or `node_modules` files are committed.
- Content reflects the company-led, founder-validated strategy.

## Definition of Done for Initial Launch

Initial launch is complete when:

- Site is deployed to Cloudflare Pages.
- Custom domain is connected.
- `www` redirect works.
- Google Booking CTA works.
- Contact form works or is intentionally disabled.
- Privacy Policy and Terms of Service pages work.
- Sitemap and robots.txt work.
- Open Graph preview works.
- Site is indexed or ready for indexing.
- Cloudflare analytics or another privacy-conscious analytics tool is enabled.
- ADA 2026 content is either present on the homepage or planned as a follow-up landing page.