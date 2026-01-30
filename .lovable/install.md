# SlideForge Installation Guide

This guide helps you recreate the SlideForge slide viewer from scratch. Copy the files below into a fresh Lovable project.

---

## Quick Start

1. Create a new Lovable project
2. Copy the files listed below
3. Create your own slides in `src/slides/demo/`
4. Update `src/slides/demo/index.ts` with your slides

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Resizable slide navigator
│   │   └── Toolbar.tsx          # Top toolbar with menu
│   └── slides/
│       ├── FloatingMenu.tsx     # Presentation quick actions
│       ├── MSSlideLayout.tsx    # Base slide layout wrapper
│       ├── PresentationMode.tsx # Fullscreen presentation
│       ├── PresenterNotesPanel.tsx # Bottom notes editor
│       ├── PresenterView.tsx    # Dual-window presenter mode
│       ├── SlideCanvas.tsx      # Main slide viewport with zoom
│       ├── SlideOverviewGrid.tsx # Grid view of all slides
│       └── SlideThumbnail.tsx   # Sidebar thumbnail component
├── hooks/
│   ├── usePresenterNotes.ts     # Notes persistence (Supabase)
│   └── usePresenterSync.ts      # BroadcastChannel sync
├── pages/
│   ├── Index.tsx                # Main app page
│   ├── AudienceWindow.tsx       # Presenter view popup
│   └── NotFound.tsx             # 404 page
├── slides/
│   ├── WIPSlide.tsx             # Placeholder for WIP slides
│   └── demo/                    # Your slides go here
│       ├── Slide01Title.tsx
│       ├── Slide02DataViz.tsx
│       └── index.ts             # Export all slides
├── types/
│   └── slide.ts                 # Type definitions
├── index.css                    # Design system + theme
└── App.tsx                      # Router setup
```

---

## Required Files

### 1. Design System

#### `src/index.css`
Contains:
- IBM Plex font imports
- CSS custom properties (color tokens)
- Typography utility classes (`.type-display`, `.type-h1`, etc.)
- Slide component classes (`.slide-card`, `.slide-badge`, etc.)
- Light/dark mode tokens
- Animation keyframes

#### `tailwind.config.ts`
Contains:
- `slide-*` color tokens
- `slide-*` spacing scale (8px grid)
- Font family definitions (IBM Plex Sans/Mono)
- Custom animations

---

### 2. Layout Components

#### `src/components/layout/Sidebar.tsx`
- Resizable slide navigator (drag edge to resize)
- Snap-to-close when dragged below threshold
- Uses `SlideThumbnail` for previews

#### `src/components/layout/Toolbar.tsx`
- Minimal top bar with dropdown menu
- Grid toggle, notes toggle, present, dark mode

---

### 3. Slide Components

#### `src/components/slides/MSSlideLayout.tsx`
Base wrapper for all slides. Provides:
- `default` variant (white bg)
- `dark`/`title` variant (navy bg)
- Logo mark (customizable)
- Bottom accent bar

#### `src/components/slides/SlideCanvas.tsx`
Main slide viewport with:
- Fixed 1920×1080 internal resolution
- CSS transform scaling to fit container
- Zoom controls (50-150%)
- Slide navigation (prev/next)
- `useSlideScale` context for child components

#### `src/components/slides/SlideThumbnail.tsx`
Sidebar thumbnail with:
- 8x scale-down preview
- Active state ring
- Slide number

#### `src/components/slides/SlideOverviewGrid.tsx`
Grid view overlay showing all slides

#### `src/components/slides/PresentationMode.tsx`
Fullscreen presentation:
- Keyboard navigation (←→, Esc)
- Auto-fullscreen on mount
- 16:9 aspect ratio maintained

#### `src/components/slides/PresenterView.tsx`
Dual-window presenter mode:
- Current slide preview
- Next slide preview
- Timer (pause/reset)
- Presenter notes
- Audience window control

#### `src/components/slides/PresenterNotesPanel.tsx`
Bottom panel for editing notes:
- Auto-save with debounce
- Status indicator
- Keyboard shortcuts

#### `src/components/slides/FloatingMenu.tsx`
Quick action menu (bottom-right):
- Present button
- Presenter view button
- Dark mode toggle

---

### 4. Hooks

#### `src/hooks/usePresenterNotes.ts`
Manages notes persistence via Supabase:
- Fetch/create/update/delete notes
- Debounced auto-save
- Save status tracking

**Requires database table** (see Database Setup below)

#### `src/hooks/usePresenterSync.ts`
BroadcastChannel for presenter/audience sync:
- Slide change broadcasts
- Ping/pong connection status
- Window close detection

---

### 5. Pages

#### `src/pages/Index.tsx`
Main app orchestrating:
- Slide state management
- Keyboard shortcuts
- Layout (sidebar, canvas, notes panel)
- Presentation/presenter view modals

#### `src/pages/AudienceWindow.tsx`
Popup window for audience display:
- Synced via BroadcastChannel
- Fullscreen presentation
- No controls (view only)

---

### 6. App Configuration

#### `src/App.tsx`
```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AudienceWindow from "./pages/AudienceWindow";
import NotFound from "./pages/NotFound";

// Routes:
// /          - Main editor
// /audience  - Presenter view popup
```

---

### 7. Slide Index

#### `src/slides/demo/index.ts` (example)
```tsx
import Slide01Title from './Slide01Title';
import Slide02DataViz from './Slide02DataViz';

export const demoSlides = [
  { component: Slide01Title, name: 'Title', template: 'title' },
  { component: Slide02DataViz, name: 'Data Viz', template: 'chart-focus' },
];
```

Update `src/pages/Index.tsx` to import from your slides folder.

---

## Database Setup (Optional)

For presenter notes persistence, create this table:

```sql
CREATE TABLE public.presenter_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (optional, notes are public by default)
ALTER TABLE public.presenter_notes ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for your auth needs)
CREATE POLICY "Allow all" ON public.presenter_notes FOR ALL USING (true);
```

---

## Creating Slides

### Basic Slide Template
```tsx
import React from 'react';
import { MSSlideLayout } from '@/components/slides/MSSlideLayout';

export default function Slide01Title() {
  return (
    <MSSlideLayout variant="dark">
      <div className="flex flex-col items-center justify-center h-full px-20 py-16">
        <h1 className="type-display text-white mb-6">
          Your Title Here
        </h1>
        <div className="slide-divider mb-8" />
        <p className="type-body-lg text-slide-gray-300">
          Your subtitle goes here
        </p>
      </div>
    </MSSlideLayout>
  );
}
```

### Variant Options
- `variant="default"` - White background
- `variant="dark"` or `variant="title"` - Navy background

### Typography Classes
- `.type-display` - 7xl, light, tight tracking
- `.type-h1` - 5xl, semibold
- `.type-h2` - 3xl, semibold
- `.type-h3` - xl, medium
- `.type-body-lg` - lg, light
- `.type-body` - base
- `.type-body-sm` - sm
- `.type-label` - xs, uppercase, tracking
- `.type-metric` - 4xl, semibold, tabular

### Component Classes
- `.slide-card` - Basic card
- `.slide-card-elevated` - Card with shadow
- `.slide-card-accent` - Card with left accent border
- `.slide-metric-card` - Metric highlight card
- `.slide-badge` - Badge/pill
- `.slide-divider` - Accent divider bar

### Color Tokens
- `text-slide-primary` / `bg-slide-primary` - Deep navy
- `text-slide-accent` / `bg-slide-accent` - Bright blue
- `text-slide-gray-{100-900}` - Gray scale

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ←/→ or ↑/↓ | Navigate slides |
| ⇧G | Toggle grid view |
| ⇧N | Toggle notes panel |
| ⇧S | Toggle sidebar |
| ⇧P | Start presentation |
| ⇧V | Start presenter view |
| Esc | Exit presentation |

---

## Dependencies

Key packages (already in Lovable projects):
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching
- `recharts` - Charts
- `lucide-react` - Icons
- `@radix-ui/*` - UI primitives
- `tailwindcss-animate` - Animations

Optional:
- `@react-three/fiber` + `three` - 3D slides
- `@supabase/supabase-js` - Notes persistence

---

## Customization

### Change Branding
1. Edit `MSSlideLayout.tsx` - Update `LogoMark` component
2. Edit `src/index.css` - Modify `--slide-*` CSS variables
3. Edit `tailwind.config.ts` - Update color tokens if needed

### Change Font
1. Update `@import` in `src/index.css`
2. Update `fontFamily` in `tailwind.config.ts`
3. Update `font-family` in `body` styles

---

## Notes

- Slides render at fixed 1920×1080 and scale via CSS transforms
- Use semantic color tokens, not hardcoded hex values
- Follow 8px spacing grid (`slide-xs` through `slide-3xl`)
- WebGL/Canvas components need special handling (see system.md)
