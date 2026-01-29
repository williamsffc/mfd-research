# SlideForge Agent System Guide

This document describes how Lovable should handle slide editing for SlideForge.

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

- `default` - White background, navy text, Morgan Stanley branding
- `dark` - Navy background, white text
- `title` - For title slides (similar to dark)

---

## Design System

### Colors (use these class names)

- `text-ms-navy` - Primary text color (#002B51)
- `text-ms-navy-80` - Secondary text (80% opacity)
- `text-ms-blue` - Accent blue (#0073CF)
- `bg-ms-blue` - Accent backgrounds
- `bg-ms-blue-20` - Light blue backgrounds (20% opacity)
- `border-ms-blue` - Blue borders
- `border-ms-blue-40` - Lighter borders

### Typography

- **Main titles**: `text-3xl font-semibold text-ms-navy`
- **Subtitles**: `text-lg text-ms-navy-80 font-light`
- **Body text**: `text-sm text-ms-navy-80 font-light leading-relaxed`
- **Metrics/values**: `text-2xl font-semibold text-ms-navy`
- **Labels**: `text-xs text-ms-navy-80`

### Spacing

- Slide padding: `px-20 py-16`
- Section gaps: `gap-8` or `gap-12`
- Card padding: `p-6`
- Element margins: `mb-2`, `mb-4`, `mb-6`, `mb-10`

### Card Styling

```tsx
<div className="p-6 bg-ms-blue-20/50 rounded-sm border-t-4 border-ms-blue">
  {/* Card content */}
</div>
```

---

## Template Patterns

### Title Slide
- Full-height centered content
- Large title with line break for emphasis
- Accent bar separator
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

<Icon className="w-10 h-10 text-ms-blue" strokeWidth={1.5} />
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
    <Bar dataKey="value" fill="#0073CF" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Color Palette for Charts

- Primary: `#0073CF` (ms-blue)
- Secondary: `#002B51` (ms-navy)
- Accent 1: `#00A3E0`
- Accent 2: `#6ECEB2`
- Negative: `#E63946`

---

## Quality Checklist

Before marking as complete:

- [ ] Slide uses `MSSlideLayout` wrapper
- [ ] Consistent with MS design system colors
- [ ] Proper typography hierarchy
- [ ] Adequate padding and spacing
- [ ] Icons have correct sizing (`w-10 h-10` for feature icons)
- [ ] Data is realistic and professional
- [ ] Charts are responsive
- [ ] Dark/light variant works if applicable
- [ ] No hardcoded colors outside design system
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
