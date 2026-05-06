# MFD Research Website Handoff

## Project Summary

MFD Research is a clinical research consulting firm founded by Michael Delgado, CCRC.

The website strategy is company-led and founder-validated:

- MFD Research is the business brand.
- Michael Delgado is the founder and credibility engine.
- LinkedIn remains Michael-forward.
- The website should be service-oriented, business-focused, and conversion-focused.

## Current Direction

The website should not be a duplicate of Michael’s LinkedIn profile.

The website should position MFD Research as a specialized consulting firm helping sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations.

Michael should appear in a founder-led credibility section, but the company should remain the main brand.

## Confirmed Technical Direction

Framework:

```text
Astro
```

Hosting:

```text
Cloudflare Pages
```

Booking CTA:

```text
Google Booking page
```

Primary CTA:

```text
Schedule a Confidential Consultation
```

Source control:

```text
GitHub repo: https://github.com/williamsffc/mfd-research
```

## Current Repo Baseline

The repo is an **Astro** static site: **`src/`** for pages/components plus bundled global CSS/JS (`src/styles/global.css`, `src/scripts/main.js`), and **`public/`** for PWA files and assets (mirrored to `dist/`).

Important paths:

```text
src/pages/
src/components/
src/styles/global.css
src/scripts/main.js
public/service-worker.js
public/assets/
public/robots.txt
public/sitemap.xml
public/site.webmanifest
package.json
scripts/
```

The current package scripts include:

```text
npm run dev
npm run build
npm run preview
npm run test:a11y
npm run optimize:images
```

## Important Existing Behavior to Preserve

Preserve:

- Home route `/`
- Privacy Policy route `/privacy-policy/`
- Terms of Service route `/terms-of-service/`
- robots.txt
- sitemap.xml
- site.webmanifest
- service-worker.js
- Existing visual direction
- Dark mode support
- Mobile navigation
- Accessibility behavior
- Form validation behavior
- SEO metadata
- Open Graph/Twitter metadata

## Known Issues

Referenced but missing assets:

```text
assets/favicon-32x32.png
assets/favicon-16x16.png
assets/apple-touch-icon.png
assets/og-image.png
```

Current form key placeholder:

The contact form uses this build-time public env var:

```text
PUBLIC_WEB3FORMS_ACCESS_KEY
```

## Content Decisions

Homepage should include:

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

Testimonials should be removed or avoided unless real, approved, and attributable.

Replace testimonials with:

```text
Conferences & Industry Engagement
```

ADA 2026 should be included as an upcoming conference and may later have its own landing page:

```text
/ada-2026/
```

## Current Preferred Workflow

1. Update and commit planning documents.
2. Create `astro-migration` branch.
3. Add Astro carefully.
4. Preserve current site until Astro parity is reached.
5. Move public assets and root files safely.
6. Port pages with parity first.
7. Refactor into components after parity.
8. Add new company-led content structure.
9. Replace testimonials with conferences.
10. Deploy to Cloudflare preview.
11. Connect domain only when polished.

## Warnings for Future AI Agents

Do not:

- Remove or drift `src/styles/global.css`, `src/scripts/main.js`, or `src/` routes without running `npm run test` (includes parity + invariant checks).
- Break existing URLs.
- Commit `.env`.
- Commit `node_modules`.
- Replace the visual design system too early.
- Turn the site into a heavy app.
- Make the website overly Michael-centered.
- Use fake testimonials.
- Deploy unfinished work to production.

Always:

- Read `architecture.md` first.
- Check `current_tasks.md`.
- Make small, reviewable changes.
- Preserve SEO/legal/PWA files.
- Keep MFD Research as the primary brand.