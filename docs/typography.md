# Typography Rules

These rules keep fonts consistent across every page (homepage, Privacy Policy,
Terms of Service, and anything added later). They are enforced by
`npm run verify:typography`, which runs as part of `npm test` and needs no build.

## 1. Three fonts, three jobs

| Token             | Font               | Use it for                                                                 |
|-------------------|--------------------|----------------------------------------------------------------------------|
| `--font-body`     | DM Sans            | Everything by default: paragraphs, labels, links, nav, buttons, form fields, eyebrows |
| `--font-display`  | Space Grotesk      | Headings and titles: page/section titles, card and item titles, FAQ questions, primary form submit |
| `--font-accent`   | Instrument Serif   | Pull quotes only (e.g. the About quote). Italic, sparingly                  |

- Fonts are **self-hosted**. The files live in `public/assets/fonts/` (with their licenses), and they're declared once with `@font-face` at the top of `src/styles/global.css`. Every page loads that stylesheet, so every page gets the same fonts. Nothing is loaded from Google, so visitors' IP addresses aren't shared with Google Fonts (see the Privacy Policy).
- `src/layouts/BaseLayout.astro` preloads DM Sans and Space Grotesk because they're used above the fold.
- The loaded weight range is **300–700** for DM Sans and Space Grotesk. Anything outside that (e.g. `800`) is faked by the browser and looks blurry/inconsistent.
- Instrument Serif ships in italic only, since that's the only way it's used.

## 2. Never write a font name in CSS

Always use the token:

```css
/* ✅ */  font-family: var(--font-display);
/* ❌ */  font-family: 'Space Grotesk', sans-serif;
```

The only place font names appear is the token block at the top of `:root` in
`src/styles/global.css` (and the matching `@font-face` blocks above it). To add or
swap a font:

1. Build the WOFF2 from the upstream TTF:
   `node scripts/build-fonts.mjs <font.ttf> public/assets/fonts/<name>-v1.woff2`,
   and copy the font's `OFL.txt` next to it.
2. Add an `@font-face` block and change the token.
3. If it's used above the fold, update the preload in `BaseLayout.astro`.

The check fails if a token has no `@font-face`, an `@font-face` isn't used by a
token, a file is missing, or anything loads fonts from Google. Files in
`public/assets/` are cached for a year, so a changed font gets a new `-vN` name.

## 3. Sizes come from the scale (px)

The site uses pixel sizes. Pick from this scale — no half-pixels, no `rem`:

```
11  12  13  14  15  16  17  18  20  22  24  26  36
```

- **Body text:** 15–16px. Secondary/meta text: 13–14px. Fine print and eyebrows: 11–12px.
- **Fluid display sizes** (hero and section titles) use `clamp()` or an existing token such as `var(--section-title-size)`. Don't invent a new `clamp()` when a token exists.
- Legal pages follow the same scale (h1 36px, h2 20px, body 16px, meta 14px).

## 4. Weights: 400 / 500 / 600 / 700

- 400 body · 500 nav and soft emphasis · 600 buttons, labels, item titles · 700 headings and eyebrows.
- Nothing else (`650`, `800`, `bold`, `lighter`).

## 5. Eyebrows share one style

Small uppercase labels above a heading or inside a card ("Core Expertise",
"Explore", "Recent & Past Engagements", timeline years, contact labels) all use:

```css
font-size: var(--eyebrow-size);        /* 11px  */
font-weight: var(--eyebrow-weight);    /* 700   */
letter-spacing: var(--eyebrow-tracking); /* 0.12em */
text-transform: uppercase;
```

The one larger variant is the section eyebrow (`.section-label`, 14px / 0.14em)
that sits above each `h2`. Reuse that class rather than styling a new one.

Letter-spacing is always in `em` so it scales with the text (never `2px`).

## 6. Buttons and inputs need an explicit font

Browsers do **not** inherit the page font into `<button>`, `<input>`, `<select>`
or `<textarea>` — they fall back to Arial/system UI. This is how the flipped
service-card description ended up in Arial before these rules existed.

`global.css` now has a global reset (`button, input, select, textarea { font: inherit; }`)
so new controls get the page font automatically. Don't remove it, and don't
introduce controls that bypass `global.css`.

## 7. Typography lives in `global.css`

No `font-*`, `letter-spacing` or `line-height` in `.astro` files — not in
`style=""` attributes and not in `<style>` blocks. One stylesheet, one source
of truth, and the check can see all of it.

## 8. Which class do I use?

| I'm adding…                         | Use                                        |
|-------------------------------------|--------------------------------------------|
| A new homepage section title        | `.section-label` + `.section-title` + `.section-sub` |
| A title inside a card/list item     | `--font-display`, 16–18px, weight 600–700  |
| A small uppercase label             | the eyebrow tokens (§5)                    |
| Body or description text            | inherit `--font-body`, 14–16px, 400        |
| A button                            | `.btn-primary` / `.btn-secondary` (or `font: inherit`) |
| A pull quote                        | `--font-accent`, italic                    |

## Before you open a PR

```bash
npm run verify:typography
```

If it fails, the message names the file, line and rule. Fix the CSS rather than
adding an exception; if a rule genuinely needs to change, change it here and in
`scripts/verify-typography.mjs` in the same PR.
