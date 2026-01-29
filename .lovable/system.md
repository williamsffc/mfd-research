# SlideForge Agent System Guide

This document describes how Lovable should handle user edit requests for SlideForge.

---

## Workflow Overview

### 1. Read Comments

Check for comments on slides that need attention:

```sql
SELECT c.*, s.file_path, s.position
FROM comments c
JOIN slides s ON c.slide_id = s.id
WHERE c.resolved = false
ORDER BY c.created_at ASC;
```

Comments contain:

- `x_position`, `y_position` - where on the slide (0-100%)
- `content` - the user's feedback/request
- `author_name` - who wrote it
- `parent_id` - for threaded replies

### 2. Check Pending Agent Actions

Find slides flagged for AI editing:

```sql
SELECT id, file_path, position, description, template_type
FROM slides
WHERE pending_agent_action = true
ORDER BY position ASC;
```

The `description` field contains the user's edit instructions. For bulk edits, it will say something like:
`"Joint edit for slides 3-5. Comment: Make all charts use the same blue color scheme"`

### 3. Create/Edit Slides

After understanding the request, edit the appropriate slide files:

**File Location**: `src/slides/demo/Slide{NN}{Name}.tsx`

**For new slides**:

- Create a new file following the naming convention
- Add export to `src/slides/demo/index.ts`
- Update the slides array with component, name, and template type
- Call proper edge functions to make sure slide is inserted in the cloud

**For WIP slides** (user-created placeholders):

- Read the description from the database
- Create a proper slide component based on their description
- Update the `file_path` in the database to point to the new file

### 4. Mark as Resolved

After completing edits:

```sql
-- Mark comments as resolved
UPDATE comments SET resolved = true WHERE id = '{comment_id}';

-- Clear pending agent action
UPDATE slides SET pending_agent_action = false WHERE id = '{slide_id}';
```

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
- Footer with date/department

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

### Metric Display

```tsx
<div className="flex items-center justify-between">
  <span className="text-xs text-ms-navy-80">{label}</span>
  <div className="flex items-center gap-1">
    <span className="text-sm font-semibold text-ms-navy">{value}</span>
    {positive && <ArrowUpRight className="w-3 h-3 text-green-600" />}
  </div>
</div>
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

## Bulk Edit Handling

When multiple slides are selected for editing:

1. Parse the joint description to understand the scope
2. Apply consistent changes across all selected slides
3. Maintain visual consistency (colors, fonts, spacing)
4. Clear `pending_agent_action` for ALL affected slides

Example description:
`"Joint edit for slides 2-4. Comment: Update all headers to use the same format"`

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
