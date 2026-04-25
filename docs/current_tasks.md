# MFD Research Current Tasks

## Current Phase

Astro migration and controlled content repositioning are in progress on the `astro-migration` branch.

The site has been migrated from static HTML/CSS/JS into Astro with preserved routes, assets, styling, JavaScript behavior, legal pages, and form behavior. The homepage is being repositioned from a Michael-forward profile style into a company-led, founder-validated MFD Research consulting site. Legacy duplicate root files (`index.html`, `style.css`, `script.js`, duplicate `service-worker.js`, static legal HTML, and duplicate `assets/`) were removed; **`public/`** and **`src/`** are canonical. Run `npm run test` before releases (includes `verify:parity`).

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