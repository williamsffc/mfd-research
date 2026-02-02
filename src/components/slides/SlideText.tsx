import React from 'react';
import { cn } from '@/lib/utils';

/**
 * SlideText - Bulletproof typography component for slides
 * 
 * ENFORCES the approved type scale. No raw Tailwind font sizes allowed.
 * Minimum size is 20px (caption) - anything smaller is unreadable when projected.
 * 
 * Usage:
 *   <SlideText variant="h1">Section Title</SlideText>
 *   <SlideText variant="body">Standard content</SlideText>
 *   <SlideText variant="caption">Supporting text (minimum size)</SlideText>
 */

export type SlideTextVariant = 
  | 'display'   // 96px - Hero headlines only
  | 'h1'        // 60px - Section titles
  | 'h2'        // 36px - Slide titles
  | 'h3'        // 32px - Card titles
  | 'body-lg'   // 28px - Subtitles, callouts
  | 'body'      // 24px - Default content (USE THIS)
  | 'caption'   // 20px - Supporting text (MINIMUM!)
  | 'metric'    // 48px - Large numbers
  | 'label';    // 18px - Metadata/labels only

interface SlideTextProps {
  variant?: SlideTextVariant;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<SlideTextVariant, string> = {
  display: 'type-display',
  h1: 'type-h1',
  h2: 'type-h2',
  h3: 'type-h3',
  'body-lg': 'type-body-lg',
  body: 'type-body',
  caption: 'type-caption',
  metric: 'type-metric',
  label: 'type-label',
};

const defaultElements: Record<SlideTextVariant, keyof JSX.IntrinsicElements> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  'body-lg': 'p',
  body: 'p',
  caption: 'span',
  metric: 'span',
  label: 'span',
};

export function SlideText({ 
  variant = 'body', 
  as,
  className, 
  children 
}: SlideTextProps) {
  const Component = as || defaultElements[variant];
  
  return (
    <Component className={cn(variantStyles[variant], className)}>
      {children}
    </Component>
  );
}

/**
 * Typography Scale Reference:
 * 
 * | Variant   | Size | When to Use                          |
 * |-----------|------|--------------------------------------|
 * | display   | 96px | Hero slides, opening statements      |
 * | h1        | 60px | Section dividers, major transitions  |
 * | h2        | 36px | Slide titles (most slides)           |
 * | h3        | 32px | Card headers, subsections            |
 * | body-lg   | 28px | Subtitles, key callouts              |
 * | body      | 24px | DEFAULT - all standard content       |
 * | caption   | 20px | MINIMUM - footnotes, metadata        |
 * | metric    | 48px | KPIs, statistics, large numbers      |
 * | label     | 18px | Category labels, tags                |
 * 
 * ⚠️  NEVER use text smaller than caption (20px)!
 * ⚠️  Avoid raw Tailwind classes like text-sm, text-xs
 */
