# SlideForge Agent System Guide

This document describes how Lovable should handle slide editing for SlideForge.

**Design Inspiration**: IBM Carbon Design System — clean, accessible, enterprise-grade.

---

## Workflow Overview

### Creating/Editing Slides

Edit slide files directly in the codebase:

**File Location**: `src/slides/demo/Slide{NN}{Name}.tsx`

**For new slides**:
- Create a new file following the naming convention
- Add export to `src/slides/demo/index.ts`
- Update the slides array with component, name, and template type

---

## Slide Structure Guidelines

### Required Imports

```tsx
import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';
// Icons from lucide-react as needed
```

### Component Structure

```tsx
export default function Slide{NN}{Name}() {
  return (
    <MSSlideLayout variant="default|dark">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Content here */}
      </div>
    </MSSlideLayout>
  );
}
```

### MSSlideLayout Variants

- `default` - White background, dark text
- `dark` - Deep navy background, white text
- `title` - For title slides (same as dark)

---

## Design System (Carbon-inspired)

### Color Tokens

Use semantic tokens from `tailwind.config.ts`:

| Token | Usage | Class Example |
|-------|-------|---------------|
| `slide-primary` | Dark backgrounds, primary text | `bg-slide-primary`, `text-slide-primary` |
| `slide-accent` | Highlights, buttons, links | `bg-slide-accent`, `text-slide-accent` |
| `slide-accent-muted` | Light accent backgrounds | `bg-slide-accent-muted` |
| `slide-gray-900` | Primary text (light mode) | `text-slide-gray-900` |
| `slide-gray-600` | Secondary text | `text-slide-gray-600` |
| `slide-gray-400` | Tertiary/muted text | `text-slide-gray-400` |
| `slide-gray-200` | Borders, dividers | `border-slide-gray-200` |
| `slide-gray-100` | Light backgrounds | `bg-slide-gray-100` |

**Legacy tokens** (`ms-navy`, `ms-blue`, etc.) are still available for backwards compatibility.

### Typography Classes

Use these utility classes for consistent typography:

| Class | Description | Usage |
|-------|-------------|-------|
| `.type-display` | 7xl, light, tight tracking | Hero headlines |
| `.type-h1` | 5xl, semibold | Section titles |
| `.type-h2` | 3xl, semibold | Slide titles |
| `.type-h3` | xl, medium | Card titles |
| `.type-body-lg` | lg, light | Subtitles |
| `.type-body` | base, normal | Default text |
| `.type-body-sm` | sm, normal | Supporting text |
| `.type-label` | xs, uppercase, tracking | Metadata, captions |
| `.type-metric` | 4xl, semibold, tabular | Large numbers |
| `.type-mono` | IBM Plex Mono | Code |

**Alternative (inline Tailwind)**:
- **Display**: `text-7xl font-light tracking-tight`
- **H1**: `text-5xl font-semibold tracking-tight`
- **H2**: `text-3xl font-semibold`
- **Body**: `text-base leading-relaxed`
- **Label**: `text-xs font-medium uppercase tracking-widest`

### Spacing (8px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `slide-xs` | 8px | Tight gaps |
| `slide-sm` | 16px | Element spacing |
| `slide-md` | 24px | Section padding |
| `slide-lg` | 32px | Large gaps |
| `slide-xl` | 48px | Section margins |
| `slide-2xl` | 64px | Major spacing |
| `slide-3xl` | 80px | Page margins |

**Standard slide padding**: `px-20 py-16`

### Component Classes

```tsx
// Basic card
<div className="slide-card">...</div>

// Card with shadow
<div className="slide-card-elevated">...</div>

// Card with left accent border
<div className="slide-card-accent">...</div>

// Metric highlight card
<div className="slide-metric-card">...</div>

// Badge
<span className="slide-badge">Label</span>

// Accent divider bar
<div className="slide-divider" />
```

---

## Template Patterns

### Title Slide
- Full-height centered content
- Large title with line break for emphasis
- Accent bar separator (`slide-divider`)
- Key metrics row at bottom

### Three-Up Cards
- Header section with title + subtitle
- 3-column grid (`grid-cols-3 gap-8`)
- Each card: icon, title, description, metrics

### Data Visualization
- Header + subtitle
- Large chart area (use Recharts)
- Side annotations or metrics

### Timeline
- Horizontal timeline with nodes
- Each node: date, title, description
- Connected by lines

### Comparison
- Two columns with headers
- Matching rows for comparison points
- Visual indicators (✓, ✗, arrows)

### Quote
- Large centered quote
- Attribution below
- Optional supporting metrics

---

## Data Patterns

### Static Data Arrays

Define data outside the component:

```tsx
const metrics = [
  { icon: TrendingUp, value: '+18.4%', label: 'YTD Return' },
  { icon: Users, value: '15M+', label: 'Clients' },
];
```

### Icon Usage

```tsx
import { TrendingUp, Shield, Globe } from 'lucide-react';

<Icon className="w-10 h-10 text-slide-accent" strokeWidth={1.5} />
```

---

## Charts (Recharts)

### Basic Setup

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} />
    <Bar dataKey="value" fill="#2196F3" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Color Palette for Charts

- Primary: `#2196F3` (slide-accent)
- Secondary: `#003366` (slide-primary)
- Success: `#27AE60`
- Warning: `#F39C12`
- Error: `#E74C3C`

---

## Quality Checklist

Before marking as complete:

- [ ] Slide uses `MSSlideLayout` wrapper
- [ ] Uses design system color tokens (not hardcoded hex)
- [ ] Proper typography hierarchy (use `.type-*` or equivalent)
- [ ] Adequate padding and spacing (8px grid)
- [ ] Icons have correct sizing (`w-10 h-10` for feature icons)
- [ ] Data is realistic and professional
- [ ] Charts are responsive
- [ ] Dark/light variant works if applicable
- [ ] Export added to index.ts for new slides

---

## Scaling & Transform Considerations

### The Problem
Slides are rendered at a fixed 1920×1080 resolution and scaled using CSS `transform: scale()`. Most content respects this, but certain elements (especially WebGL/Canvas) can break scaling because they use their own rendering context.

### React Three Fiber / WebGL Canvas
When using `@react-three/fiber` Canvas inside slides:

1. **Use fixed pixel dimensions** - Don't use percentage-based sizing
2. **Lock device pixel ratio** - Add `dpr={1}` to prevent DPI-based recalculation
3. **Disable resize observation** - Add `resize={{ scroll: false, offsetSize: true }}`
4. **Use offsetSize** - This tells R3F to use `offsetWidth/Height` instead of `getBoundingClientRect`, which is more stable with CSS transforms

```tsx
<div style={{ width: 800, height: 600 }}>
  <Canvas
    camera={{ position: [0, 0, 6], fov: 45 }}
    gl={{ antialias: true, alpha: true }}
    dpr={1}
    resize={{ scroll: false, offsetSize: true }}
  >
    <Scene />
  </Canvas>
</div>
```

### Other Canvas Elements
For regular HTML `<canvas>` or other rendering contexts:
- Use fixed pixel dimensions in the slide's coordinate space (e.g., 800×600)
- Avoid viewport-relative units (vw, vh, %)
- Don't use ResizeObserver or window resize listeners inside slides
