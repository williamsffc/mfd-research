

## SlideForge - Powerful Slide Making App

### Overview
A feature-rich, personal slide-making tool with PDF-style fixed aspect ratio slides, flexible grid-based positioning, and full creative freedom. Built with a Supabase backend for persistence, CMS, and AI-powered slide generation via Lovable.

---

### Core Architecture

**1. Fixed Aspect Ratio Canvas (16:9)**
- All slides render at fixed 1920x1080 internal resolution
- Zoom controls scale the viewport without changing layout
- PDF-style viewing - what you see is what you export

**2. 6-Column Grid System**
- Each slide has a 6-column × 6-row invisible grid
- Components snap to grid cells for easy alignment
- Full absolute positioning available for custom layouts
- Grid lines toggle for editing assistance

**3. Slide Data Model (File-Based)**
- Each slide is a `.tsx` file in `src/slides/{presentation-id}/`
- Supabase stores only: file reference, position, description (for AI context)
- Full React power: hooks, animations, edge function calls, anything possible
- Lovable can directly read/edit any slide file
- Reordering handled via Supabase position field

---

### Layout Templates (Pre-built)

1. **Title Slide** - Centered title + subtitle
2. **Section Header** - Bold header + optional description  
3. **Two-Column** - Header + left/right content areas
4. **Three-Up Cards** - Header + 3 equal content boxes
5. **Chart Focus** - Large chart area (4 cols) + side annotations
6. **Data Story** - Big number/metric + supporting content below
7. **Comparison** - Side-by-side with comparison headers
8. **Timeline** - Horizontal timeline with milestone content
9. **Quote/Highlight** - Large centered quote with attribution
10. **Blank Canvas** - Empty grid for fully custom layouts

---

### UI Layout

**Left Sidebar - Slide Navigator**
- Thumbnail previews of all slides (scaled-down iframes)
- Drag-and-drop reordering
- "Add Slide" button with template picker
- Option to add description-only placeholder (for AI generation)
- Delete/duplicate slide actions

**Main Canvas Area**
- Currently selected slide at editable zoom level
- Grid overlay toggle
- Component selection and editing
- Zoom controls (50%, 75%, 100%, 150%)

**Right Sidebar - Properties Panel**
- Selected component properties
- Grid position controls
- Custom CSS/styling options
- Animation settings

**Commenting Overlay**
- Click anywhere to add a comment pin
- Comment threads with replies
- Name entry for each comment (no auth)
- Resolve/unresolve threads
- Show/hide comments toggle

---

### Component System

**Built-in Components:**
- Text blocks (headings, paragraphs, lists)
- Images and videos
- Charts (bar, line, pie, etc. via Recharts)
- Code blocks with syntax highlighting
- Tables
- Shapes and dividers
- Metric/KPI cards
- Icons (via Lucide)

**Custom Component Freedom:**
- "Custom HTML" component type
- Full access to CSS animations
- Embedded iframes for external content
- Edge function integration for dynamic data
- Any React component possible within slides

---

### Supabase Backend

**Tables:**
- `presentations` - deck metadata (id, title, description, created_at)
- `slides` - individual slides with these key fields:
  - `id` (UUID) - unique identifier, always use this for referencing slides
  - `presentation_id` - which deck this belongs to
  - `file_path` - source React component path (copied slides share same path as original)
  - `position` - display order (0-indexed, can change with reordering)
  - `description` - AI edit instructions or slide description
  - `pending_agent_action` - boolean flag for edit queue
  - `template_type` - layout template identifier
  - `deleted_at` - soft delete timestamp (null = active)
- `slide_changes` - edit requests linked by slide_id (not position!)
  - `id`, `slide_id`, `content`, `resolved`, `created_at`
- `comments` - comment threads (slide_id, x_position, y_position, author_name, content, resolved, parent_id)
- `cms_strings` - all UI text/labels for easy editing

**Edit Tracking:**
- Copied slides get their own unique UUID but share `file_path` with source
- All edits reference slides by `id` (UUID), never by position
- `pending_agent_action=true` indicates slide needs AI attention
- `slide_changes` table holds individual edit requests per slide

**Edge Functions:**
- Dynamic data fetching for charts
- Any custom integrations you want to add

---

### Example Slides (Shipped with App)

A showcase deck demonstrating:
1. Title slide with animations
2. Data visualization (multiple chart types)
3. Custom animations (CSS keyframes)
4. Timeline layout
5. Comparison layout
6. Interactive elements
7. Code showcase
8. Metric/KPI dashboard slide
9. Quote/testimonial slide
10. Custom HTML/creative slide

---

### Documentation

**setup.md will include:**
- Project architecture overview
- Database schema and relationships
- Component system explanation
- How to add new templates
- How to add new components
- CMS string management
- Theming and customization
- Deployment guide
- Template extraction instructions

---

### Design & Style

- **Minimal & Clean** aesthetic (Notion/Linear inspired)
- Monospace accents for technical feel
- Generous whitespace
- Subtle shadows and borders
- Dark mode support
- Smooth transitions and micro-interactions

