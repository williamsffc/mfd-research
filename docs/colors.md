# Color Rules

Colors on every page (homepage, Privacy Policy, Terms of Service, and anything added
later) come from one palette. The rules are enforced by `npm run verify:colors`, which
runs as part of `npm test` and needs no build.

## 1. Two layers: palette and semantic tokens

All colors live at the top of `:root` in `src/styles/global.css`.

**Palette** (`--c-*`): the raw colors, stored as `R G B` channels.

```css
--c-green-600: 43 122 58; /* #2B7A3A */
```

This is the **only** place a raw color value may appear.

**Semantic tokens** (`--navy`, `--green`, `--text-muted`, `--action-bg`, …): what the
rest of the stylesheet uses. They point at the palette, and `[data-theme="dark"]`
redefines them for dark mode.

```css
--green: rgb(var(--c-green-600));
```

Components use semantic tokens. When a rule needs a tint that has no semantic token,
it may reference the palette directly with an alpha:

```css
/* ✅ */ color: var(--text-muted);
/* ✅ */ border-color: rgb(var(--c-white) / 0.08);
/* ❌ */ color: #5E6B80;
/* ❌ */ border-color: rgba(255, 255, 255, 0.08);
```

## 2. The rules

1. **No raw colors outside the palette block.** No hex, no `rgb(255, …)`, no `white`/`black`
   anywhere else in `global.css`.
2. **No colors in `.astro` files.** Icons use `stroke="var(--green)"` or `currentColor`,
   never a hex value. (Exception: `<meta name="theme-color">` in `BaseLayout.astro`, which
   can't read CSS variables.)
3. **Text must pass WCAG AA (4.5:1)** in light and dark mode. The check resolves the key
   pairs (body, secondary and muted text, green labels, primary buttons, text on the dark
   sections, footer) from the tokens and fails the build if any drops below 4.5:1.
4. **Primary buttons use the action tokens:** `--action-bg`, `--action-text`,
   `--action-hover-bg`, `--action-hover-text`. Don't style a new call-to-action with
   `--navy` directly; dark mode needs it to become green.
5. **Watch opacity on text.** `opacity` and `rgb(… / alpha)` both fade text toward its
   background. The check covers the token pairs, but not every rule that lowers opacity.
   If you fade text, measure the result.

## 3. What each color is for

| Token | Light | Dark | Use |
|---|---|---|---|
| `--navy` | `#1A2744` | `#D6E3F7` | Headings, strong text |
| `--green` | `#2B7A3A` | `#5ABC69` | Eyebrow labels, links, highlights |
| `--green-accent` | `#8FD69A` | `#8FD69A` | Green text on the dark (navy) sections |
| `--text-primary` | `#0F1B35` | `#EAF0FA` | Body text |
| `--text-secondary` | `#445268` | `#B2C0D6` | Supporting text |
| `--text-muted` | `#5E6B80` | `#8FA1BE` | Small labels, dates, captions |
| `--action-bg` | navy | green | Primary buttons |
| `--section-accent-bg` | `#1A2744` | `#162035` | Credibility bar, Credentials, Conferences |

The greens are one family matched to the logo bars (`#5ABC69`, `#87CB90`, `#B1DCB1`).
Keep new greens on that scale rather than adding a new shade.

## 4. Changing the palette later

Because every color flows from the palette block, a new color scheme is a change to
that block (and, if roles move, a few semantic tokens), nothing else.

1. Edit the `--c-*` values in `src/styles/global.css`.
2. Run `npm run verify:colors`. Fix any contrast failures it reports.
3. Update `<meta name="theme-color">` in `src/layouts/BaseLayout.astro` and
   `theme_color` / `background_color` in `public/site.webmanifest`.
4. If the logo colors change, edit `--c-logo-bar-*` and regenerate the brand files
   (section 5).

**Option B ("Evergreen")** from the September 2026 color review is the recorded
alternative: deep evergreen instead of navy, warm ivory backgrounds, logo green as the
accent. Starting values, all contrast-checked in the review:

| Role | Option A (current) | Option B |
|---|---|---|
| Lead color (`--c-navy-700`) | `#1A2744` | `#0F3B2C` |
| Lead, lighter (`--c-navy-500`) | `#243560` | `#1B5140` |
| Dark sections (`--section-accent-bg`) | `#1A2744` | `#0C3325` |
| Page (`--c-slate-25`) | `#F7F8FB` | `#FAF8F3` |
| Soft sections (`--c-slate-50`) | `#EEF2F8` | `#F2EEE4` |
| Borders (`--c-slate-150`) | `#DDE5F0` | `#E4DED0` |
| Body text (`--c-navy-925`) | `#0F1B35` | `#16211D` |
| Secondary text (`--c-slate-600`) | `#445268` | `#4A5550` |
| Muted text (`--c-slate-500`) | `#5E6B80` | `#5F6A64` |
| Footer (`--footer-bg`) | `#0F1B35` | `#0B2A20` |

Dark mode for Option B needs its own navy scale (`--c-navy-9xx` → greens). Treat these
as a starting point and let `npm run verify:colors` confirm contrast.

## 5. The logo

The logo was redrawn as a vector (September 2026) from the original JPG. Its text is
converted to shapes, so it renders identically everywhere with no font installed.

| File | Use |
|---|---|
| `src/components/Logo.astro` | On the site (nav and footer). Inline SVG that follows the theme: ink uses `currentColor`, bars use `--logo-bar-1..3`. `<Logo tagline />` adds the tagline for large sizes. |
| `public/assets/logo.svg` | The full framed logo for light backgrounds (print, documents, partners). |
| `public/assets/logo-reversed.svg` | The same, with white ink, for dark backgrounds. |
| `public/assets/logo.png` | 600px raster for structured data (Google). |
| `public/assets/favicon.svg` | Browser tab icon: the three bars on navy. |
| `scripts/brand/og-image.svg` | Source of the social share image. |

On the site the square frame is omitted (a horizontal lockup), and the tagline is left
out below about 60px tall because it becomes unreadable.

To regenerate the PNGs (favicons, touch icon, PWA icons, `logo.png`, `og-image.png`)
after editing an SVG source:

```bash
node scripts/generate-missing-assets.mjs
```

## Before you open a PR

```bash
npm run verify:colors
```

If it fails, the message names the file, line and rule. Fix the CSS rather than adding
an exception. If a rule genuinely needs to change, change it here and in
`scripts/verify-colors.mjs` in the same PR.
