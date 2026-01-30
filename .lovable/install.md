# SlideForge Complete Installation Guide

Copy all files below into a fresh Lovable project to recreate SlideForge.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Configuration Files](#configuration-files)
3. [Design System](#design-system)
4. [Layout Components](#layout-components)
5. [Slide Components](#slide-components)
6. [Hooks](#hooks)
7. [Pages](#pages)
8. [Types](#types)
9. [Utility Files](#utility-files)
10. [Agent System Files](#agent-system-files)
11. [Database Setup](#database-setup)
12. [Creating Your Slides](#creating-your-slides)

---

## Project Structure

```
.lovable/
├── system.md                    # Agent instructions
├── plan.md                      # Project overview
└── install.md                   # This file

src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Toolbar.tsx
│   └── slides/
│       ├── FloatingMenu.tsx
│       ├── MSSlideLayout.tsx
│       ├── PresentationMode.tsx
│       ├── PresenterNotesPanel.tsx
│       ├── PresenterView.tsx
│       ├── SlideCanvas.tsx
│       ├── SlideOverviewGrid.tsx
│       └── SlideThumbnail.tsx
├── hooks/
│   ├── usePresenterNotes.ts
│   └── usePresenterSync.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   ├── AudienceWindow.tsx
│   └── NotFound.tsx
├── slides/
│   ├── WIPSlide.tsx
│   └── demo/                    # Your slides here
│       └── index.ts
├── types/
│   └── slide.ts
├── App.tsx
├── main.tsx
└── index.css

tailwind.config.ts
```

---

## Configuration Files

### `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        // IBM Plex - Clean enterprise typography (Carbon Design System)
        sans: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
        // Legacy alias
        ms: ['"IBM Plex Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // Slide Design System - Clean, accessible tokens
        slide: {
          primary: 'hsl(var(--slide-primary))',
          'primary-light': 'hsl(var(--slide-primary-light))',
          accent: 'hsl(var(--slide-accent))',
          'accent-light': 'hsl(var(--slide-accent-light))',
          'accent-muted': 'hsl(var(--slide-accent-muted))',
          success: 'hsl(var(--slide-success))',
          warning: 'hsl(var(--slide-warning))',
          error: 'hsl(var(--slide-error))',
          // Gray scale
          'gray-100': 'hsl(var(--slide-gray-100))',
          'gray-200': 'hsl(var(--slide-gray-200))',
          'gray-300': 'hsl(var(--slide-gray-300))',
          'gray-400': 'hsl(var(--slide-gray-400))',
          'gray-500': 'hsl(var(--slide-gray-500))',
          'gray-600': 'hsl(var(--slide-gray-600))',
          'gray-700': 'hsl(var(--slide-gray-700))',
          'gray-800': 'hsl(var(--slide-gray-800))',
          'gray-900': 'hsl(var(--slide-gray-900))',
          bg: "hsl(var(--slide-bg))",
        },
        // Legacy MS tokens (backwards compatibility)
        ms: {
          blue: 'hsl(var(--ms-blue))',
          navy: 'hsl(var(--ms-navy))',
          'navy-80': 'hsl(var(--ms-navy-80))',
          'blue-80': 'hsl(var(--ms-blue-80))',
          'blue-40': 'hsl(var(--ms-blue-40))',
          'blue-20': 'hsl(var(--ms-blue-20))',
          jade: 'hsl(var(--ms-jade))',
          ocean: 'hsl(var(--ms-ocean))',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        canvas: {
          bg: "hsl(var(--canvas-bg))",
        },
        comment: {
          pin: "hsl(var(--comment-pin))",
          "pin-resolved": "hsl(var(--comment-pin-resolved))",
        },
      },
      // Spacing scale for slides (based on 8px grid)
      spacing: {
        'slide-xs': '0.5rem',   // 8px
        'slide-sm': '1rem',     // 16px
        'slide-md': '1.5rem',   // 24px
        'slide-lg': '2rem',     // 32px
        'slide-xl': '3rem',     // 48px
        'slide-2xl': '4rem',    // 64px
        'slide-3xl': '5rem',    // 80px
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

## Design System

### `src/index.css`

```css
/* IBM Plex for clean enterprise typography - inspired by Carbon Design System */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* 
     * Design System: Inspired by IBM Carbon
     * Clean, accessible, enterprise-grade tokens
     */
    
    /* === Brand Colors (Slide Deck) === */
    /* Primary - Deep blue for authority and trust */
    --slide-primary: 215 100% 20%;      /* #003366 - Deep Navy */
    --slide-primary-light: 215 85% 35%; /* #1a5490 */
    
    /* Accent - Vibrant blue for highlights */
    --slide-accent: 207 90% 54%;        /* #2196F3 - Bright Blue */
    --slide-accent-light: 207 90% 70%;  /* Lighter accent */
    --slide-accent-muted: 207 40% 90%;  /* Very light accent bg */
    
    /* Semantic */
    --slide-success: 145 63% 42%;       /* #27AE60 - Green */
    --slide-warning: 36 100% 50%;       /* #F39C12 - Amber */
    --slide-error: 4 90% 58%;           /* #E74C3C - Red */
    
    /* Neutrals - Gray scale for text and backgrounds */
    --slide-gray-100: 220 14% 96%;      /* #F4F5F7 */
    --slide-gray-200: 220 13% 91%;      /* #E5E7EB */
    --slide-gray-300: 216 12% 84%;      /* #D1D5DB */
    --slide-gray-400: 218 11% 65%;      /* #9CA3AF */
    --slide-gray-500: 220 9% 46%;       /* #6B7280 */
    --slide-gray-600: 215 14% 34%;      /* #4B5563 */
    --slide-gray-700: 217 19% 27%;      /* #374151 */
    --slide-gray-800: 215 28% 17%;      /* #1F2937 */
    --slide-gray-900: 221 39% 11%;      /* #111827 */
    
    /* === Legacy MS Tokens (for backwards compatibility) === */
    --ms-blue: 207 90% 54%;
    --ms-navy: 215 100% 20%;
    --ms-navy-80: 215 40% 40%;
    --ms-blue-80: 207 70% 60%;
    --ms-blue-40: 207 60% 80%;
    --ms-blue-20: 207 50% 92%;
    --ms-jade: 145 63% 42%;
    --ms-ocean: 185 85% 26%;
    
    /* === App UI Tokens === */
    --background: 0 0% 100%;
    --foreground: 221 39% 11%;
    --card: 0 0% 100%;
    --card-foreground: 221 39% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 221 39% 11%;
    --primary: 207 90% 54%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 14% 96%;
    --secondary-foreground: 221 39% 11%;
    --muted: 220 14% 96%;
    --muted-foreground: 220 9% 46%;
    --accent: 207 50% 92%;
    --accent-foreground: 215 100% 20%;
    --destructive: 4 90% 58%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 207 90% 54%;
    --radius: 0.375rem;
    
    /* Sidebar */
    --sidebar-background: 215 100% 20%;
    --sidebar-foreground: 0 0% 100%;
    --sidebar-primary: 207 90% 54%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 215 60% 30%;
    --sidebar-accent-foreground: 0 0% 100%;
    --sidebar-border: 215 50% 25%;
    --sidebar-ring: 207 90% 54%;
    
    /* Canvas */
    --canvas-bg: 220 14% 96%;
    --slide-bg: 0 0% 100%;
    --grid-line: 220 13% 91%;
    --comment-pin: 36 100% 50%;
    --comment-pin-resolved: 145 63% 42%;
  }

  .dark {
    --background: 221 39% 11%;
    --foreground: 220 14% 96%;
    --card: 215 28% 17%;
    --card-foreground: 220 14% 96%;
    --popover: 215 28% 17%;
    --popover-foreground: 220 14% 96%;
    --primary: 207 90% 60%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 19% 27%;
    --secondary-foreground: 220 14% 96%;
    --muted: 217 19% 27%;
    --muted-foreground: 218 11% 65%;
    --accent: 215 60% 30%;
    --accent-foreground: 220 14% 96%;
    --destructive: 4 70% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 217 19% 27%;
    --input: 217 19% 27%;
    --ring: 207 90% 60%;
    
    --sidebar-background: 221 39% 8%;
    --sidebar-foreground: 220 14% 96%;
    --sidebar-primary: 207 90% 60%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 217 19% 22%;
    --sidebar-accent-foreground: 220 14% 96%;
    --sidebar-border: 217 19% 18%;
    --sidebar-ring: 207 90% 60%;
    
    --canvas-bg: 221 39% 8%;
    --slide-bg: 215 28% 17%;
    --grid-line: 217 19% 27%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

/* === Typography Scale (Carbon-inspired) === */
@layer components {
  /* Display - For hero slides */
  .type-display {
    @apply text-7xl font-light tracking-tight leading-none;
  }
  
  /* Heading 1 - Section titles */
  .type-h1 {
    @apply text-5xl font-semibold tracking-tight leading-tight;
  }
  
  /* Heading 2 - Slide titles */
  .type-h2 {
    @apply text-3xl font-semibold leading-snug;
  }
  
  /* Heading 3 - Card titles */
  .type-h3 {
    @apply text-xl font-medium leading-snug;
  }
  
  /* Body Large - Subtitles */
  .type-body-lg {
    @apply text-lg font-light leading-relaxed;
  }
  
  /* Body - Default text */
  .type-body {
    @apply text-base font-normal leading-relaxed;
  }
  
  /* Body Small - Supporting text */
  .type-body-sm {
    @apply text-sm font-normal leading-relaxed;
  }
  
  /* Label - Metadata, captions */
  .type-label {
    @apply text-xs font-medium uppercase tracking-widest;
  }
  
  /* Metric - Large numbers */
  .type-metric {
    @apply text-4xl font-semibold tabular-nums;
  }
  
  /* Code */
  .type-mono {
    font-family: 'IBM Plex Mono', 'JetBrains Mono', monospace;
  }
}

/* === Slide-specific utilities === */
@layer components {
  /* Card styles */
  .slide-card {
    @apply p-6 rounded-lg bg-white border border-slide-gray-200;
  }
  
  .slide-card-elevated {
    @apply slide-card shadow-sm;
  }
  
  .slide-card-accent {
    @apply slide-card border-l-4 border-l-slide-accent;
  }
  
  /* Metric card */
  .slide-metric-card {
    @apply p-6 rounded-lg;
    background: hsl(var(--slide-accent-muted));
  }
  
  /* Badge */
  .slide-badge {
    @apply inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium;
    background: hsl(var(--slide-accent-muted));
    color: hsl(var(--slide-primary));
  }
  
  /* Divider */
  .slide-divider {
    @apply w-16 h-1 rounded-full;
    background: hsl(var(--slide-accent));
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/20 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/40;
}

/* Slide canvas styles */
.slide-canvas {
  aspect-ratio: 16 / 9;
  background: hsl(var(--slide-bg));
}

/* Grid overlay */
.grid-overlay {
  background-image: 
    linear-gradient(to right, hsl(var(--grid-line)) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--grid-line)) 1px, transparent 1px);
  background-size: calc(100% / 6) calc(100% / 6);
}

/* Slide thumbnail hover effect */
.slide-thumbnail {
  @apply transition-all duration-200;
}

.slide-thumbnail:hover {
  @apply ring-2 ring-primary/50;
}

.slide-thumbnail.active {
  @apply ring-2 ring-primary;
}

/* Comment pin styles */
.comment-pin {
  @apply w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-transform;
  background: hsl(var(--comment-pin));
  color: white;
}

.comment-pin:hover {
  @apply scale-110;
}

.comment-pin.resolved {
  background: hsl(var(--comment-pin-resolved));
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes collapseIn {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

.animate-collapse {
  animation: collapseIn 0.2s ease-out forwards;
}
```

---

## Layout Components

### `src/components/layout/Sidebar.tsx`

```tsx
import React, { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlideThumbnail } from '@/components/slides/SlideThumbnail';

interface SlideItem {
  id: string;
  content: React.ReactNode;
}

interface SidebarProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  width: number;
  onWidthChange: (width: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  onSnapClose?: () => void;
  className?: string;
}

export function Sidebar({
  slides,
  activeSlideIndex,
  onSlideClick,
  width,
  onWidthChange,
  onResizeStart,
  onResizeEnd,
  onSnapClose,
  className,
}: SidebarProps) {
  const [isResizing, setIsResizing] = useState(false);

  const SNAP_CLOSE_THRESHOLD = 150;
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 400;

  // Handle resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    onResizeStart?.();
    
    const startX = e.clientX;
    const startWidth = width;
    let shouldSnapClose = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const rawWidth = startWidth + delta;
      
      // If dragged below threshold, mark for snap close
      if (rawWidth < SNAP_CLOSE_THRESHOLD) {
        shouldSnapClose = true;
        onWidthChange(MIN_WIDTH); // Keep at min visually
      } else {
        shouldSnapClose = false;
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, rawWidth));
        onWidthChange(newWidth);
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      onResizeEnd?.();
      
      // Snap close if below threshold on release
      if (shouldSnapClose) {
        onSnapClose?.();
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [width, onWidthChange, onResizeStart, onResizeEnd, onSnapClose]);

  return (
    <div
      className={cn(
        'h-full bg-background border-r flex flex-col outline-none relative',
        className
      )}
      style={{ width }}
    >
      {/* Resize handle */}
      <div
        className={cn(
          'absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-primary/50 transition-colors z-30',
          isResizing && 'bg-primary'
        )}
        onMouseDown={handleResizeStart}
      />

      {/* Slide list */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {slides.map((slide, index) => (
            <SlideThumbnail
              key={slide.id}
              slideNumber={index + 1}
              isActive={index === activeSlideIndex}
              onClick={() => onSlideClick(index)}
            >
              {slide.content}
            </SlideThumbnail>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
```

### `src/components/layout/Toolbar.tsx`

```tsx
import { cn } from '@/lib/utils';
import { Grid3X3, FileText, MoreVertical, Play, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ToolbarProps {
  showGrid: boolean;
  onToggleGrid: () => void;
  showNotes?: boolean;
  onToggleNotes?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onStartPresentation?: () => void;
  onStartPresenterView?: () => void;
  className?: string;
}

export function Toolbar({
  showGrid,
  onToggleGrid,
  showNotes,
  onToggleNotes,
  isDarkMode,
  onToggleDarkMode,
  onStartPresentation,
  onStartPresenterView,
  className
}: ToolbarProps) {
  return (
    <div className={cn('h-12 border-b bg-background flex items-center', className)}>
      {/* Left section - Logo */}
      <div className="flex items-center px-4">
        <span className="text-sm font-medium tracking-tight text-foreground">Lovable Slides</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section - All options in menu */}
      <div className="flex items-center justify-end flex-shrink-0 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onToggleGrid}>
              <Grid3X3 className="h-4 w-4 mr-2" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
              <span className="ml-auto text-xs text-muted-foreground">⇧G</span>
            </DropdownMenuItem>
            {onToggleNotes && (
              <DropdownMenuItem onClick={onToggleNotes}>
                <FileText className="h-4 w-4 mr-2" />
                {showNotes ? 'Hide Notes' : 'Show Notes'}
                <span className="ml-auto text-xs text-muted-foreground">⇧N</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onStartPresentation && (
              <DropdownMenuItem onClick={onStartPresentation}>
                <Play className="h-4 w-4 mr-2" />
                Present
                <span className="ml-auto text-xs text-muted-foreground">⇧P</span>
              </DropdownMenuItem>
            )}
            {onStartPresenterView && (
              <DropdownMenuItem onClick={onStartPresenterView}>
                <Monitor className="h-4 w-4 mr-2" />
                Presenter View
                <span className="ml-auto text-xs text-muted-foreground">⇧V</span>
              </DropdownMenuItem>
            )}
            {onToggleDarkMode && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onToggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
```

---

## Slide Components

### `src/components/slides/MSSlideLayout.tsx`

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MSSlideLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'title' | 'dark';
  className?: string;
}

/**
 * Slide Layout Component
 * Inspired by IBM Carbon Design System
 * 
 * Variants:
 * - default: White background, dark text
 * - dark/title: Deep navy background, white text
 */
export function MSSlideLayout({ children, variant = 'default', className }: MSSlideLayoutProps) {
  const isDark = variant === 'dark' || variant === 'title';
  
  return (
    <div 
      className={cn(
        'w-full h-full relative font-sans',
        isDark 
          ? 'bg-slide-primary text-white' 
          : 'bg-white text-slide-gray-900',
        className
      )}
    >
      {/* Logo mark - Top Right */}
      <div className="absolute top-8 right-10 z-10">
        <LogoMark variant={isDark ? 'light' : 'dark'} />
      </div>
      
      {/* Content */}
      <div className="w-full h-full">
        {children}
      </div>
      
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slide-accent" />
    </div>
  );
}

interface LogoMarkProps {
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Minimal logo mark - can be customized per brand
 */
export function LogoMark({ variant = 'dark', className }: LogoMarkProps) {
  const color = variant === 'light' ? 'hsl(var(--slide-gray-100))' : 'hsl(var(--slide-primary))';
  
  return (
    <svg
      viewBox="0 0 120 24"
      className={cn('h-5 w-auto', className)}
      fill={color}
    >
      {/* Clean wordmark placeholder */}
      <text
        x="0"
        y="17"
        fontFamily="IBM Plex Sans, sans-serif"
        fontSize="14"
        fontWeight="600"
        letterSpacing="0.05em"
      >
        SLIDEFORGE
      </text>
    </svg>
  );
}

// Re-export with legacy name for backwards compatibility
export const MSLogo = LogoMark;
```

### `src/components/slides/SlideCanvas.tsx`

```tsx
import React, { useRef, useEffect, useState, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingMenu } from './FloatingMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// Context to share scale with child components
const SlideScaleContext = createContext<number>(1);

export function useSlideScale() {
  return useContext(SlideScaleContext);
}

interface SlideCanvasProps {
  children: React.ReactNode;
  showGrid?: boolean;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  currentSlide?: number;
  totalSlides?: number;
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  onStartPresentation?: () => void;
  onStartPresenterView?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const ZOOM_LEVELS = [50, 75, 100, 125, 150];
const HIDE_DELAY = 500; // 0.5 seconds

export function SlideCanvas({
  children,
  showGrid = false,
  zoom = 100,
  onZoomChange,
  className,
  onClick,
  currentSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  onStartPresentation,
  onStartPresenterView,
  isDarkMode = false,
  onToggleDarkMode,
}: SlideCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerScale, setContainerScale] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [isHoveringZoomPill, setIsHoveringZoomPill] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringZoomPillRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isHoveringZoomPillRef.current = isHoveringZoomPill;
  }, [isHoveringZoomPill]);

  // Fixed internal resolution
  const SLIDE_WIDTH = 1920;
  const SLIDE_HEIGHT = 1080;

  // Clear any existing timeout
  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Start the hide timeout
  const startHideTimeout = useCallback(() => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      // Use ref to get current value, not stale closure
      if (!isHoveringZoomPillRef.current) {
        setShowZoomControls(false);
      }
    }, HIDE_DELAY);
  }, [clearHideTimeout]);

  // Handle mouse movement in canvas
  const handleMouseMove = useCallback(() => {
    setShowZoomControls(true);
    startHideTimeout();
  }, [startHideTimeout]);

  // Handle mouse leave from canvas
  const handleMouseLeave = useCallback(() => {
    if (!isHoveringZoomPillRef.current) {
      clearHideTimeout();
      setShowZoomControls(false);
    }
  }, [clearHideTimeout]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => clearHideTimeout();
  }, [clearHideTimeout]);

  // Keep visible while hovering zoom pill, restart timeout when leaving
  useEffect(() => {
    if (isHoveringZoomPill) {
      clearHideTimeout();
      setShowZoomControls(true);
    } else if (showZoomControls) {
      // Only start timeout if controls are visible
      startHideTimeout();
    }
  }, [isHoveringZoomPill, clearHideTimeout, startHideTimeout, showZoomControls]);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      setContainerSize({ width: containerWidth, height: containerHeight });
      
      // Calculate scale to fit the slide in the container
      const scaleX = containerWidth / SLIDE_WIDTH;
      const scaleY = containerHeight / SLIDE_HEIGHT;
      const fitScale = Math.min(scaleX, scaleY);
      
      setContainerScale(fitScale);
    };

    updateScale();
    
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Apply zoom on top of fit scale
  const zoomMultiplier = zoom / 100;
  const finalScale = containerScale * zoomMultiplier;
  
  // Calculate if slide overflows container (needs scrolling)
  const scaledWidth = SLIDE_WIDTH * finalScale;
  const scaledHeight = SLIDE_HEIGHT * finalScale;
  const needsScroll = scaledWidth > containerSize.width || scaledHeight > containerSize.height;

  const showNavigation = currentSlide !== undefined && totalSlides !== undefined;

  return (
    <SlideScaleContext.Provider value={finalScale}>
      <div 
        className="relative flex flex-col h-full w-full bg-[hsl(var(--canvas-bg))]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Zoom controls - fixed position top right */}
        {onZoomChange && (
          <TooltipProvider>
            <div 
              className={cn(
                "absolute top-3 right-3 flex items-center gap-0.5 px-1.5 py-0.5 bg-card/90 backdrop-blur-sm border border-border rounded-full shadow-md z-20 transition-opacity duration-300 ease-in-out",
                showZoomControls ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onMouseEnter={() => setIsHoveringZoomPill(true)}
              onMouseLeave={() => setIsHoveringZoomPill(false)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = ZOOM_LEVELS.indexOf(zoom);
                      if (currentIndex > 0) {
                        onZoomChange(ZOOM_LEVELS[currentIndex - 1]);
                      }
                    }}
                    disabled={zoom === ZOOM_LEVELS[0]}
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>

              <span className="text-[10px] font-mono min-w-[28px] text-center text-muted-foreground">
                {zoom}%
              </span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = ZOOM_LEVELS.indexOf(zoom);
                      if (currentIndex < ZOOM_LEVELS.length - 1) {
                        onZoomChange(ZOOM_LEVELS[currentIndex + 1]);
                      }
                    }}
                    disabled={zoom === ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onZoomChange(100);
                    }}
                  >
                    <Maximize className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Zoom</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )}

        {/* Scrollable slide area */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-8 overflow-hidden"
        >
          {/* Slide */}
          <div
            className={cn(
              'slide-canvas relative shadow-2xl rounded-lg overflow-hidden flex-shrink-0 isolate',
              showGrid && 'grid-overlay',
              className
            )}
            style={{
              width: SLIDE_WIDTH,
              height: SLIDE_HEIGHT,
              transform: `scale(${finalScale})`,
              transformOrigin: 'center center',
            }}
            onClick={onClick}
          >
            {/* Fixed 1920x1080 slide content - fully opaque background to prevent bleed-through */}
            <div className="absolute inset-0 bg-white dark:bg-slate-900">
              {children}
            </div>
          </div>
        </div>

        {/* Bottom navigation controls */}
        {showNavigation && (
          <>
            {/* Center - Navigation pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-card border border-border rounded-full shadow-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={onPrevSlide}
                disabled={currentSlide <= 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              
              <span className="text-xs font-medium text-muted-foreground min-w-[50px] text-center">
                {currentSlide} / {totalSlides}
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={onNextSlide}
                disabled={currentSlide >= totalSlides}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Right - Floating menu (absolute right) */}
            {onStartPresentation && onToggleDarkMode && (
              <div className="absolute bottom-3 right-3">
                <FloatingMenu
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={onToggleDarkMode}
                  onStartPresentation={onStartPresentation}
                  onStartPresenterView={onStartPresenterView}
                />
              </div>
            )}
          </>
        )}
      </div>
    </SlideScaleContext.Provider>
  );
}
```

### `src/components/slides/SlideThumbnail.tsx`

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface SlideThumbnailProps {
  slideNumber: number;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function SlideThumbnail({
  slideNumber,
  isActive = false,
  onClick,
  children,
}: SlideThumbnailProps) {
  return (
    <div className="group relative">
      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center gap-1 pt-2">
          <span className="text-xs text-muted-foreground font-mono">
            {slideNumber}
          </span>
        </div>
        
        <div
          className={cn(
            'slide-thumbnail relative flex-1 aspect-video bg-[hsl(var(--slide-bg))] rounded-md overflow-hidden border cursor-pointer',
            isActive ? 'active ring-2 ring-primary' : 'border-border hover:border-primary/50'
          )}
          onClick={onClick}
        >
          {/* Solid background to prevent bleed-through */}
          <div className="absolute inset-0 bg-white dark:bg-slate-900" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none isolate">
            <div 
              className="origin-top-left"
              style={{ 
                transform: 'scale(0.125)', 
                width: '800%', 
                height: '800%' 
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/slides/SlideOverviewGrid.tsx`

```tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SlideItem {
  id: string;
  component: React.ComponentType;
  name: string;
  isWIP: boolean;
  pendingAgentAction?: boolean;
}

interface SlideOverviewGridProps {
  slides: SlideItem[];
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
  onClose: () => void;
}

export function SlideOverviewGrid({
  slides,
  activeSlideIndex,
  onSlideClick,
  onClose,
}: SlideOverviewGridProps) {
  const handleSlideClick = (index: number) => {
    onSlideClick(index);
    onClose();
  };

  return (
    <div className="fixed inset-0 top-12 bg-background z-[60] overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Slides</h2>
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Press Grid or click a slide to close
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                'relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors',
                index === activeSlideIndex
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              )}
              onClick={() => handleSlideClick(index)}
            >
              {/* Slide number badge */}
              <div className="absolute top-2 left-2 z-10 bg-background/90 px-2 py-0.5 rounded text-xs font-mono">
                {index + 1}
              </div>
              
              {/* Pending agent action indicator */}
              {slide.pendingAgentAction && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-2 left-2 z-10">
                        <div className="flex items-center justify-center h-5 w-5 rounded bg-primary/90 text-primary-foreground">
                          <Bot className="h-3 w-3" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">Awaiting Lovable update</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Slide preview */}
              <div className="aspect-video bg-[hsl(var(--slide-bg))] overflow-hidden">
                <div 
                  className="origin-top-left pointer-events-none"
                  style={{ 
                    transform: 'scale(0.15)', 
                    width: '666.67%', 
                    height: '666.67%' 
                  }}
                >
                  <slide.component />
                </div>
              </div>
              
              {/* Slide name */}
              <div className="p-2 bg-card border-t">
                <p className="text-xs truncate text-muted-foreground">
                  {slide.name}
                </p>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### `src/components/slides/PresentationMode.tsx`

```tsx
import React, { useEffect, useCallback } from 'react';

interface PresentationModeProps {
  slides: Array<{
    id: string;
    component: React.ComponentType<any>;
    isWIP?: boolean;
    description?: string;
  }>;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onExit: () => void;
}

export function PresentationMode({
  slides,
  activeIndex,
  onIndexChange,
  onExit,
}: PresentationModeProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (activeIndex < slides.length - 1) {
            onIndexChange(activeIndex + 1);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (activeIndex > 0) {
            onIndexChange(activeIndex - 1);
          }
          break;
        case 'Escape':
        case 'p':
        case 'P':
          e.preventDefault();
          onExit();
          break;
        case 'Home':
          e.preventDefault();
          onIndexChange(0);
          break;
        case 'End':
          e.preventDefault();
          onIndexChange(slides.length - 1);
          break;
      }
    },
    [activeIndex, slides.length, onIndexChange, onExit]
  );

  // Request fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen not available:', err);
      }
    };
    enterFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Handle fullscreen exit via browser controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        onExit();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  // Keyboard controls
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentSlide = slides[activeIndex];
  const SlideComponent = currentSlide?.component;

  if (!SlideComponent) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Slide container - 16:9 aspect ratio */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative bg-white overflow-hidden"
          style={{
            width: 'min(100vw, 177.78vh)', // 16:9 width constraint
            height: 'min(100vh, 56.25vw)', // 16:9 height constraint
            aspectRatio: '16 / 9',
          }}
        >
          <SlideComponent />
        </div>
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 right-4 text-white/60 text-sm font-medium">
        {activeIndex + 1} / {slides.length}
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-4 left-4 text-white/40 text-xs">
        ← → to navigate • Esc or P to exit
      </div>
    </div>
  );
}
```

### `src/components/slides/PresenterView.tsx`

```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Monitor, 
  MonitorOff,
  Play,
  Pause,
  RotateCcw,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresenterSync } from '@/hooks/usePresenterSync';
import { usePresenterNotes } from '@/hooks/usePresenterNotes';

interface SlideInfo {
  id: string;
  component: React.ComponentType<any>;
  isWIP?: boolean;
  description?: string;
}

interface PresenterViewProps {
  slides: SlideInfo[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onExit: () => void;
}

const SLIDE_WIDTH = 1920;
const SLIDE_HEIGHT = 1080;

/**
 * Scaled slide preview component - handles the transform scaling properly
 */
function ScaledSlide({ 
  SlideComponent, 
  fillContainer = false,
}: { 
  SlideComponent: React.ComponentType<any> | undefined;
  fillContainer?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth > 0) {
        setScale(containerWidth / SLIDE_WIDTH);
      }
    };

    // Use RAF to ensure layout is complete
    requestAnimationFrame(updateScale);

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!SlideComponent) return null;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-white rounded-lg shadow-xl overflow-hidden",
        fillContainer ? "w-full" : ""
      )}
      style={{ aspectRatio: '16/9' }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <SlideComponent />
      </div>
    </div>
  );
}

export function PresenterView({
  slides,
  activeIndex,
  onIndexChange,
  onExit,
}: PresenterViewProps) {
  const [audienceConnected, setAudienceConnected] = useState(false);
  const [audienceWindow, setAudienceWindow] = useState<Window | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  const currentSlideId = slides[activeIndex]?.id ?? null;
  const { note } = usePresenterNotes(currentSlideId);

  const { broadcastSlideChange } = usePresenterSync(
    undefined,
    () => setAudienceConnected(true),
    () => setAudienceConnected(false)
  );

  // Timer
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Open audience window
  const openAudienceWindow = useCallback(() => {
    const width = 1280;
    const height = 720;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    const popup = window.open(
      '/audience',
      'SlideForge Audience',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
    
    if (popup) {
      setAudienceWindow(popup);
      const checkInterval = setInterval(() => {
        if (popup.closed) {
          setAudienceWindow(null);
          setAudienceConnected(false);
          clearInterval(checkInterval);
        }
      }, 1000);
    }
  }, []);

  // Close audience window
  const closeAudienceWindow = useCallback(() => {
    if (audienceWindow && !audienceWindow.closed) {
      audienceWindow.close();
    }
    setAudienceWindow(null);
    setAudienceConnected(false);
  }, [audienceWindow]);

  // Broadcast slide changes
  useEffect(() => {
    broadcastSlideChange(activeIndex);
  }, [activeIndex, broadcastSlideChange]);

  // Cleanup on exit
  useEffect(() => {
    return () => {
      if (audienceWindow && !audienceWindow.closed) {
        audienceWindow.close();
      }
    };
  }, [audienceWindow]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        onIndexChange(Math.min(slides.length - 1, activeIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onIndexChange(Math.max(0, activeIndex - 1));
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slides.length, onIndexChange, onExit]);

  const CurrentSlide = slides[activeIndex]?.component;
  const NextSlide = slides[activeIndex + 1]?.component;

  return (
    <div className="fixed inset-0 z-50 bg-slide-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-black border-b border-slide-gray-800 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">Presenter View</h1>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            audienceConnected 
              ? "bg-slide-gray-700 text-white" 
              : "bg-slide-gray-800 text-slide-gray-500"
          )}>
            {audienceConnected ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                Connected
              </>
            ) : (
              <>
                <MonitorOff className="w-3.5 h-3.5" />
                No Audience
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Timer */}
          <div className="flex items-center gap-1.5 bg-slide-gray-800 rounded-lg px-3 py-1.5 border border-slide-gray-700">
            <span className="text-white font-mono text-sm tabular-nums">{formatTime(elapsedTime)}</span>
            <div className="w-px h-4 bg-slide-gray-600 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slide-gray-400 hover:text-white hover:bg-slide-gray-700"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slide-gray-400 hover:text-white hover:bg-slide-gray-700"
              onClick={() => setElapsedTime(0)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
          
          {/* Audience window control */}
          {!audienceWindow || audienceWindow.closed ? (
            <Button
              size="sm"
              onClick={openAudienceWindow}
              className="gap-2 bg-white hover:bg-slide-gray-100 text-black h-8 text-xs"
            >
              <Monitor className="w-3.5 h-3.5" />
              Open Audience
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={closeAudienceWindow}
              className="gap-2 bg-slide-gray-800 border-slide-gray-600 text-white hover:bg-slide-gray-700 h-8 text-xs"
            >
              <MonitorOff className="w-3.5 h-3.5" />
              Close
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onExit}
            className="text-slide-gray-400 hover:text-white hover:bg-slide-gray-700 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0 p-4 gap-4">
        {/* Left: Current slide + controls */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Current slide */}
          <div className="flex-1 bg-slide-gray-800 rounded-xl relative flex items-center justify-center p-6 min-h-0 border border-slide-gray-700">
            {/* Slide badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="bg-white text-black text-xs font-medium px-2.5 py-1 rounded-full">
                {activeIndex + 1} / {slides.length}
              </span>
            </div>
            
            {/* Slide container */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <ScaledSlide 
                  SlideComponent={CurrentSlide} 
                  fillContainer
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="bg-slide-gray-800 border-slide-gray-700 text-white hover:bg-slide-gray-700 disabled:opacity-40 h-9 px-4 gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={() => onIndexChange(Math.min(slides.length - 1, activeIndex + 1))}
              disabled={activeIndex === slides.length - 1}
              className="bg-white hover:bg-slide-gray-100 text-black disabled:opacity-40 h-9 px-4 gap-1.5"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right: Notes + Next slide */}
        <div className="w-72 flex flex-col gap-3 shrink-0">
          {/* Notes */}
          <div className="flex-1 bg-slide-gray-800 rounded-xl p-4 flex flex-col min-h-0 border border-slide-gray-700">
            <div className="flex items-center gap-2 mb-3 shrink-0">
              <div className="w-6 h-6 rounded-md bg-slide-gray-700 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-medium text-white">Notes</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {note?.content ? (
                <p className="text-slide-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              ) : (
                <p className="text-slide-gray-500 text-sm italic">
                  No notes for this slide
                </p>
              )}
            </div>
          </div>

          {/* Next slide preview */}
          <div className="bg-slide-gray-800 rounded-xl p-4 shrink-0 border border-slide-gray-700">
            <p className="text-xs font-medium text-slide-gray-400 mb-3">Up Next</p>
            {NextSlide ? (
              <ScaledSlide SlideComponent={NextSlide} />
            ) : (
              <div 
                className="bg-slide-gray-700 rounded-lg flex items-center justify-center text-slide-gray-500 text-xs border border-slide-gray-600"
                style={{ aspectRatio: '16/9' }}
              >
                End of presentation
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/slides/PresenterNotesPanel.tsx`

```tsx
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { FileText, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePresenterNotes } from '@/hooks/usePresenterNotes';

interface PresenterNotesPanelProps {
  slideId: string | null;
  slideIndex: number;
  onClose: () => void;
  className?: string;
}

export function PresenterNotesPanel({
  slideId,
  slideIndex,
  onClose,
  className,
}: PresenterNotesPanelProps) {
  const { content, loading, saveStatus, updateContent } = usePresenterNotes(slideId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        'h-52 bg-gradient-to-b from-background to-muted/30 border-t border-border/50 flex flex-col w-full backdrop-blur-sm',
        'animate-in slide-in-from-bottom-4 duration-300 ease-out',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Presenter Notes</span>
            <span className="text-xs text-muted-foreground">Slide {slideIndex + 1}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div className={cn(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300',
            saveStatus === 'saved' && 'bg-green-500/10 text-green-600 dark:text-green-400',
            saveStatus === 'saving' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
            saveStatus === 'error' && 'bg-red-500/10 text-red-600 dark:text-red-400',
            saveStatus === 'idle' && 'bg-muted text-muted-foreground'
          )}>
            {saveStatus === 'saved' ? (
              <>
                <Check className="h-3 w-3" />
                Saved
              </>
            ) : saveStatus === 'saving' ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertCircle className="h-3 w-3" />
                Error saving
              </>
            ) : (
              'Auto-save enabled'
            )}
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-4 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              Loading notes...
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            placeholder="Add notes for this slide... (auto-saves as you type)"
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-full resize-none text-sm leading-relaxed",
              "bg-background/50 rounded-xl border border-border/50 p-4",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
              "transition-all duration-200"
            )}
          />
        )}
      </div>
    </div>
  );
}
```

### `src/components/slides/FloatingMenu.tsx`

```tsx
import { useState } from 'react';
import { Play, Moon, Sun, MoreHorizontal, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface FloatingMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onStartPresentation: () => void;
  onStartPresenterView?: () => void;
}

export function FloatingMenu({
  isDarkMode,
  onToggleDarkMode,
  onStartPresentation,
  onStartPresenterView,
}: FloatingMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <div
        className={cn(
          "flex flex-col items-center gap-1 px-2 py-1 bg-card border border-border rounded-full shadow-md transition-all duration-200",
          isExpanded ? "opacity-100" : "opacity-80 hover:opacity-100"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Expanded state - show options above the trigger */}
        {isExpanded && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={onStartPresentation}
                >
                  <Play className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Present (⇧P)</TooltipContent>
            </Tooltip>

            {onStartPresenterView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={onStartPresenterView}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Presenter View (⇧V)</TooltipContent>
              </Tooltip>
            )}

            <div className="w-6 h-px bg-border" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full"
                  onClick={onToggleDarkMode}
                >
                  {isDarkMode ? (
                    <Sun className="h-3.5 w-3.5" />
                  ) : (
                    <Moon className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
            </Tooltip>

            <div className="w-6 h-px bg-border" />
          </>
        )}

        {/* Trigger icon - always visible at bottom */}
        <div className="h-6 w-6 flex items-center justify-center">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </TooltipProvider>
  );
}
```

---

## Hooks

### `src/hooks/usePresenterNotes.ts`

```tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PresenterNote {
  id: string;
  slideId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const DEBOUNCE_MS = 500;

export function usePresenterNotes(slideId: string | null) {
  const [note, setNote] = useState<PresenterNote | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pendingContentRef = useRef<string | null>(null);
  const noteIdRef = useRef<string | null>(null);

  const fetchNote = useCallback(async () => {
    if (!slideId) {
      setNote(null);
      setContent('');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('presenter_notes')
        .select('*')
        .eq('slide_id', slideId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const fetchedNote = {
          id: data.id,
          slideId: data.slide_id,
          content: data.content,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setNote(fetchedNote);
        setContent(data.content);
        noteIdRef.current = data.id;
      } else {
        setNote(null);
        setContent('');
        noteIdRef.current = null;
      }
    } catch (err) {
      console.error('Failed to fetch presenter note:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchNote();
    // Clear debounce on slide change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [fetchNote]);

  const persistNote = useCallback(async (contentToSave: string) => {
    if (!slideId) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      if (noteIdRef.current) {
        // Update existing note
        const { error } = await supabase
          .from('presenter_notes')
          .update({ content: contentToSave })
          .eq('id', noteIdRef.current);

        if (error) throw error;
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('presenter_notes')
          .insert({
            slide_id: slideId,
            content: contentToSave,
          })
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          noteIdRef.current = data.id;
          setNote({
            id: data.id,
            slideId: data.slide_id,
            content: data.content,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save presenter note:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  }, [slideId]);

  const updateContent = useCallback((newContent: string) => {
    // Optimistic update
    setContent(newContent);
    pendingContentRef.current = newContent;

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the save
    debounceRef.current = setTimeout(() => {
      if (pendingContentRef.current !== null) {
        persistNote(pendingContentRef.current);
        pendingContentRef.current = null;
      }
    }, DEBOUNCE_MS);
  }, [persistNote]);

  const deleteNote = async (): Promise<boolean> => {
    if (!noteIdRef.current) return false;

    try {
      const { error } = await supabase
        .from('presenter_notes')
        .delete()
        .eq('id', noteIdRef.current);

      if (error) throw error;

      setNote(null);
      setContent('');
      noteIdRef.current = null;
      return true;
    } catch (err) {
      console.error('Failed to delete presenter note:', err);
      return false;
    }
  };

  return {
    note,
    content,
    loading,
    saving,
    saveStatus,
    updateContent,
    deleteNote,
    refetch: fetchNote,
  };
}
```

### `src/hooks/usePresenterSync.ts`

```tsx
import { useEffect, useCallback, useRef } from 'react';

export interface PresenterSyncMessage {
  type: 'slide_change' | 'ping' | 'pong' | 'close';
  slideIndex?: number;
  timestamp?: number;
}

const CHANNEL_NAME = 'slideforge-presenter-sync';

export function usePresenterSync(
  onSlideChange?: (index: number) => void,
  onAudienceConnected?: () => void,
  onAudienceDisconnected?: () => void
) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isConnectedRef = useRef(false);
  
  // Store callbacks in refs to avoid recreating the channel on callback changes
  const onSlideChangeRef = useRef(onSlideChange);
  const onAudienceConnectedRef = useRef(onAudienceConnected);
  const onAudienceDisconnectedRef = useRef(onAudienceDisconnected);
  
  // Keep refs updated
  useEffect(() => {
    onSlideChangeRef.current = onSlideChange;
    onAudienceConnectedRef.current = onAudienceConnected;
    onAudienceDisconnectedRef.current = onAudienceDisconnected;
  });

  useEffect(() => {
    channelRef.current = new BroadcastChannel(CHANNEL_NAME);

    const handleMessage = (event: MessageEvent<PresenterSyncMessage>) => {
      const { type, slideIndex } = event.data;

      switch (type) {
        case 'slide_change':
          if (slideIndex !== undefined && onSlideChangeRef.current) {
            onSlideChangeRef.current(slideIndex);
          }
          break;
        case 'ping':
          // Audience window is checking if presenter is alive
          channelRef.current?.postMessage({ type: 'pong' });
          break;
        case 'pong':
          // Presenter received response from audience
          if (!isConnectedRef.current) {
            isConnectedRef.current = true;
            onAudienceConnectedRef.current?.();
          }
          break;
        case 'close':
          isConnectedRef.current = false;
          onAudienceDisconnectedRef.current?.();
          break;
      }
    };

    channelRef.current.addEventListener('message', handleMessage);

    return () => {
      channelRef.current?.removeEventListener('message', handleMessage);
      channelRef.current?.close();
    };
  }, []); // Empty deps - channel created once

  const broadcastSlideChange = useCallback((index: number) => {
    channelRef.current?.postMessage({
      type: 'slide_change',
      slideIndex: index,
      timestamp: Date.now(),
    } as PresenterSyncMessage);
  }, []);

  const sendPing = useCallback(() => {
    channelRef.current?.postMessage({ type: 'ping' } as PresenterSyncMessage);
  }, []);

  const sendClose = useCallback(() => {
    channelRef.current?.postMessage({ type: 'close' } as PresenterSyncMessage);
  }, []);

  return {
    broadcastSlideChange,
    sendPing,
    sendClose,
  };
}
```

---

## Pages

### `src/pages/Index.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Toolbar } from '@/components/layout/Toolbar';
import { SlideCanvas } from '@/components/slides/SlideCanvas';
import { SlideOverviewGrid } from '@/components/slides/SlideOverviewGrid';
import { PresentationMode } from '@/components/slides/PresentationMode';
import { PresenterView } from '@/components/slides/PresenterView';
import { PresenterNotesPanel } from '@/components/slides/PresenterNotesPanel';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { demoSlides } from '@/slides/demo'; // Update this import for your slides

interface SlideData {
  id: string;
  component: React.ComponentType<any>;
  name: string;
  isWIP: boolean;
  description?: string;
}

export default function Index() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [isPresenterView, setIsPresenterView] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  
  // Derive slides from demoSlides with deterministic IDs
  const slides = React.useMemo<SlideData[]>(() => 
    demoSlides.map((s) => ({
      id: `slide-${s.name.toLowerCase().replace(/\s+/g, '-')}`,
      component: s.component,
      name: s.name,
      isWIP: false,
      description: undefined,
    })),
    [demoSlides]
  );

  // Get current slide ID for presenter notes
  const currentSlideId = slides[activeSlideIndex]?.id ?? null;

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isPresentationMode || isPresenterView) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'G' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowGrid(prev => !prev);
      } else if (e.key === 'N' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowNotes(prev => !prev);
      } else if (e.key === 'S' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowSidebar(prev => !prev);
      } else if (e.key === 'P' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresentationMode(true);
      } else if (e.key === 'V' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsPresenterView(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, isPresentationMode, isPresenterView]);


  const ActiveSlideComponent = slides[activeSlideIndex]?.component || demoSlides[0].component;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar
        showGrid={showGrid}
        onToggleGrid={() => {
          const newShowGrid = !showGrid;
          setShowGrid(newShowGrid);
          if (newShowGrid) setShowSidebar(false);
        }}
        showNotes={showNotes}
        onToggleNotes={() => setShowNotes(!showNotes)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onStartPresentation={() => setIsPresentationMode(true)}
        onStartPresenterView={() => setIsPresenterView(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - always rendered, clipped when hidden */}
        <div 
          className="flex-shrink-0 overflow-hidden z-50 h-full"
          style={{ 
            width: showSidebar ? sidebarWidth : 0,
            transition: isResizing ? 'none' : 'width 200ms ease-out',
          }}
        >
          <div className="h-full" style={{ width: sidebarWidth }}>
            <Sidebar
              slides={slides.map((slide) => ({
                id: slide.id,
                content: <slide.component />,
              }))}
              activeSlideIndex={activeSlideIndex}
              onSlideClick={setActiveSlideIndex}
              width={sidebarWidth}
              onWidthChange={setSidebarWidth}
              onResizeStart={() => setIsResizing(true)}
              onResizeEnd={() => setIsResizing(false)}
              onSnapClose={() => setShowSidebar(false)}
            />
          </div>
        </div>

        {/* Sidebar Toggle - morphed tab shape at sidebar edge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute top-1.5 z-40 h-8 w-6 flex items-center justify-center bg-background border border-l-0 rounded-r-full shadow-sm hover:bg-muted"
                style={{ 
                  left: showSidebar ? sidebarWidth - 5 : -4,
                  transition: isResizing ? 'none' : 'left 200ms ease-out, background-color 150ms'
                }}
              >
                {showSidebar ? (
                  <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronsRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'} (⇧S)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 relative overflow-hidden">
            <SlideCanvas
              showGrid={false}
              zoom={zoom}
              onZoomChange={setZoom}
              currentSlide={activeSlideIndex + 1}
              totalSlides={slides.length}
              onPrevSlide={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              onNextSlide={() => setActiveSlideIndex(Math.min(slides.length - 1, activeSlideIndex + 1))}
            >
              <ActiveSlideComponent />
            </SlideCanvas>

            {/* Grid View Overlay */}
            {showGrid && (
              <SlideOverviewGrid
                slides={slides}
                activeSlideIndex={activeSlideIndex}
                onSlideClick={setActiveSlideIndex}
                onClose={() => setShowGrid(false)}
              />
            )}
          </div>

          {/* Presenter Notes Panel - Bottom */}
          {showNotes && (
            <PresenterNotesPanel
              slideId={currentSlideId}
              slideIndex={activeSlideIndex}
              onClose={() => setShowNotes(false)}
            />
          )}
        </div>
      </div>

      {/* Presentation Mode */}
      {isPresentationMode && (
        <PresentationMode
          slides={slides.map(slide => ({
            id: slide.id,
            component: slide.component,
            isWIP: slide.isWIP,
            description: slide.description,
          }))}
          activeIndex={activeSlideIndex}
          onIndexChange={setActiveSlideIndex}
          onExit={() => setIsPresentationMode(false)}
        />
      )}

      {/* Presenter View (dual-window mode) */}
      {isPresenterView && (
        <PresenterView
          slides={slides.map(slide => ({
            id: slide.id,
            component: slide.component,
            isWIP: slide.isWIP,
            description: slide.description,
          }))}
          activeIndex={activeSlideIndex}
          onIndexChange={setActiveSlideIndex}
          onExit={() => setIsPresenterView(false)}
        />
      )}
    </div>
  );
}
```

### `src/pages/AudienceWindow.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { usePresenterSync } from '@/hooks/usePresenterSync';
import { demoSlides } from '@/slides/demo'; // Update this import for your slides
import { WIPSlide } from '@/slides/WIPSlide';

interface SlideInfo {
  id: string;
  component: React.ComponentType<any>;
  isWIP?: boolean;
  description?: string;
}

// This component is rendered in the popup window for the audience
export default function AudienceWindow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides] = useState<SlideInfo[]>(() =>
    demoSlides.map((s, i) => ({
      id: `slide-${i}`,
      component: s.component,
      isWIP: false,
    }))
  );

  const { sendPing, sendClose } = usePresenterSync(
    (index) => setCurrentIndex(index),
    undefined,
    undefined
  );

  // Ping presenter on mount to establish connection
  useEffect(() => {
    sendPing();
    
    // Send close message when window closes
    const handleBeforeUnload = () => {
      sendClose();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      sendClose();
    };
  }, [sendPing, sendClose]);

  // Enter fullscreen on mount
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log('Fullscreen not available:', err);
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(enterFullscreen, 100);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation (for audience window too)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentSlide = slides[currentIndex];
  const SlideComponent = currentSlide?.component;

  if (!SlideComponent) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <p className="text-white text-2xl">No slides available</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        className="relative bg-white"
        style={{
          width: '100vw',
          height: '56.25vw', // 16:9 aspect ratio
          maxHeight: '100vh',
          maxWidth: '177.78vh', // 16:9 aspect ratio
        }}
      >
        <div 
          className="absolute inset-0 origin-top-left"
          style={{
            width: '1920px',
            height: '1080px',
            transform: `scale(${Math.min(
              (typeof window !== 'undefined' ? window.innerWidth : 1920) / 1920,
              (typeof window !== 'undefined' ? window.innerHeight : 1080) / 1080
            )})`,
          }}
        >
          {currentSlide.isWIP ? (
            <WIPSlide description={currentSlide.description || ''} onDescriptionChange={() => {}} />
          ) : (
            <SlideComponent />
          )}
        </div>
      </div>
    </div>
  );
}
```

### `src/pages/NotFound.tsx`

```tsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
```

---

## Types

### `src/types/slide.ts`

```tsx
export interface SlideComponent {
  id: string;
  render: () => React.ReactNode;
}

export interface SlideMetadata {
  id: string;
  filePath: string;
  position: number;
  description?: string;
  templateType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CMSString {
  id: string;
  key: string;
  value: string;
  category?: string;
}

export type TemplateType = 
  | 'title'
  | 'section-header'
  | 'two-column'
  | 'three-up'
  | 'chart-focus'
  | 'data-story'
  | 'comparison'
  | 'timeline'
  | 'quote'
  | 'blank';

export interface GridPosition {
  col: number; // 1-6
  row: number; // 1-6
  colSpan?: number;
  rowSpan?: number;
}
```

---

## Utility Files

### `src/lib/utils.ts`

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/App.tsx`

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AudienceWindow from "./pages/AudienceWindow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/audience" element={<AudienceWindow />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

### `src/main.tsx`

```tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
```

### `src/slides/WIPSlide.tsx`

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface WIPSlideProps {
  description?: string;
  onDescriptionChange?: (description: string) => void;
  autoFocus?: boolean;
}

// Calculate optimal font size based on text length and container
function calculateFontSize(text: string, containerWidth: number): number {
  const len = text.length;
  
  // Dynamic sizing thresholds
  if (len === 0) return 72; // Huge placeholder
  if (len <= 10) return 64;
  if (len <= 20) return 56;
  if (len <= 35) return 48;
  if (len <= 50) return 40;
  if (len <= 80) return 32;
  if (len <= 120) return 28;
  if (len <= 180) return 24;
  if (len <= 280) return 20;
  return 18; // Minimum for very long text
}

const DEBOUNCE_DELAY = 500; // Save after 500ms of no typing

export function WIPSlide({ 
  description = '', 
  onDescriptionChange,
  autoFocus = false 
}: WIPSlideProps) {
  const [text, setText] = useState(description);
  const [fontSize, setFontSize] = useState(72);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef(description);

  // Update font size when text changes
  const updateFontSize = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 800;
    const newSize = calculateFontSize(text, containerWidth);
    setFontSize(newSize);
  }, [text]);

  useEffect(() => {
    updateFontSize();
  }, [updateFontSize]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => updateFontSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateFontSize]);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Sync external description changes (only if different from what we last saved)
  useEffect(() => {
    if (description !== lastSavedRef.current && description !== text) {
      setText(description);
      lastSavedRef.current = description;
    }
  }, [description]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    
    // Update local state immediately (optimistic)
    setText(newText);
    
    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the save to database
    debounceRef.current = setTimeout(() => {
      if (newText !== lastSavedRef.current) {
        lastSavedRef.current = newText;
        onDescriptionChange?.(newText);
      }
    }, DEBOUNCE_DELAY);
  };

  // Calculate line height based on font size
  const lineHeight = fontSize < 32 ? 1.6 : fontSize < 48 ? 1.4 : 1.2;

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-[hsl(var(--slide-bg))] p-12 md:p-16"
    >
      <div className="relative w-full max-w-4xl flex items-center justify-center">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          placeholder="Describe your slide..."
          className="w-full min-h-[200px] text-center bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 text-foreground focus:ring-0 transition-all duration-200 ease-out"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontSize >= 40 ? 600 : fontSize >= 28 ? 500 : 400,
            lineHeight,
            fontFamily: 'inherit',
            letterSpacing: fontSize >= 48 ? '-0.02em' : '0',
          }}
          rows={Math.max(3, Math.ceil(text.length / (fontSize > 40 ? 20 : fontSize > 28 ? 35 : 50)))}
        />
      </div>
    </div>
  );
}

export default WIPSlide;
```

### `src/slides/demo/index.ts` (Starter Template)

```tsx
// Create your slides in this folder and export them here
// Example:
// import Slide01Title from './Slide01Title';
// import Slide02Content from './Slide02Content';

export const demoSlides = [
  // { component: Slide01Title, name: 'Title', template: 'title' },
  // { component: Slide02Content, name: 'Content', template: 'default' },
];
```

---

## Agent System Files

### `.lovable/system.md`

Copy the full contents from the existing `.lovable/system.md` file - it contains:
- Slide creation workflow
- Design system documentation
- Typography and color token references
- Chart setup guidelines
- WebGL/Canvas scaling instructions

### `.lovable/plan.md`

Copy the full contents from the existing `.lovable/plan.md` file - it contains:
- Architecture overview
- Layout template descriptions
- UI layout specifications
- State management approach

---

## Database Setup

For presenter notes persistence, run this migration:

```sql
CREATE TABLE public.presenter_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.presenter_notes ENABLE ROW LEVEL SECURITY;

-- Allow all operations (adjust for your auth needs)
CREATE POLICY "Allow all" ON public.presenter_notes FOR ALL USING (true);
```

---

## Creating Your Slides

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

### Add to Index

```tsx
// src/slides/demo/index.ts
import Slide01Title from './Slide01Title';

export const demoSlides = [
  { component: Slide01Title, name: 'Title', template: 'title' },
];
```

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

## Notes

- All slides render at fixed 1920×1080 and scale via CSS transforms
- Use semantic color tokens, not hardcoded hex values
- Follow 8px spacing grid (`slide-xs` through `slide-3xl`)
- WebGL/Canvas components need special handling (see system.md)
- The UI components in `src/components/ui/` are from shadcn/ui
