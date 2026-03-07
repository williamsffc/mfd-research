

## Dark/Light Mode — Implementation Plan

### Approach
Copy `index.html` → `home.html`, then implement dark mode in `home.html` only. The original `index.html` stays untouched as a safe fallback.

### Steps

**1. Create `home.html` as a copy of `index.html`**

**2. Add dark theme CSS variables**
Add a `[data-theme="dark"]` block overriding `:root` tokens:

| Variable | Light (current) | Dark |
|---|---|---|
| `--bg` | `#F5F6FA` | `#0F1520` |
| `--bg-white` | `#FFFFFF` | `#1A2235` |
| `--bg-soft` | `#EEF0F7` | `#1E2840` |
| `--text-primary` | `#0F1B35` | `#E8ECF2` |
| `--text-secondary` | `#4A5568` | `#A0AEC0` |
| `--text-muted` | `#8896AB` | `#6B7A90` |
| `--border` | `#E2E8F0` | `#2A3650` |
| `--green-pale` | `#E8F5EE` | `#1A3A2A` |
| `--navy` | `#1A2744` | `#C8D6E8` |
| `--navy-light` | `#243560` | `#3A5080` |

Shadows and gradients adjusted for dark surfaces.

**3. Introduce new semantic variables for ~140 hardcoded `rgba()` values**
New tokens like `--nav-bg`, `--nav-bg-scrolled`, `--card-bg`, `--overlay-white`, `--divider-light`, `--footer-text`, etc. Each hardcoded `rgba()` replaced with the appropriate variable, with dark overrides.

**4. Handle "already dark" sections**
- **About** (`#about`), **Services**, **Credentials**, **Footer** — these already use dark navy backgrounds with light text. They'll keep their dark styling in both modes, with minor tweaks (e.g., slightly different background shade in dark mode to maintain contrast).

**5. Add toggle button in nav**
- Sun/moon SVG icon button, placed after the nav links (before the CTA on desktop, in the mobile menu on small screens).
- Toggles `data-theme="dark"` on `<html>`.

**6. JavaScript logic (~20 lines)**
- Check `localStorage` for saved preference, fall back to `prefers-color-scheme`.
- On toggle: flip attribute, save to `localStorage`, swap icon.

**7. Smooth transition**
- `transition: background 0.3s, color 0.3s` on `body` and key containers.

**8. Update Vite config / entry point**
- Point the dev server to serve `home.html` (or just navigate to `/home.html` manually).

### Estimated scope
- 1 new file (`home.html`) — full copy + modifications
- ~70 lines new CSS (dark tokens + semantic variables)
- ~100 CSS lines modified (rgba → variables)
- ~15 lines HTML (toggle button)
- ~20 lines JS (toggle logic)

