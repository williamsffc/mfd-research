# MFD Research Website

Professional website for MFD Research LLC, a clinical research consulting firm specializing in site development, regulatory compliance, and clinical trial management.

## Overview

This is a modern, accessible, single-page website built with vanilla HTML, CSS, and JavaScript. Features include:

- **Responsive Design** - Mobile-first approach with fluid layouts
- **Dark Mode** - System preference detection with manual toggle
- **Accessibility** - WCAG 2.1 AA compliant with ARIA labels and keyboard navigation
- **Performance** - Optimized with lazy loading, IntersectionObserver, and event delegation
- **Offline Support** - Service worker for offline functionality and faster loading
- **Print Optimized** - Clean print styles for professional document output

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties for theming, modern layout techniques
- **JavaScript (ES6+)** - Module-based, no frameworks
- **Vite** - Build tool and dev server
- **Netlify** - Hosting and form handling

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/remix-of-lovable-slides.git
cd remix-of-lovable-slides
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:8080`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
remix-of-lovable-slides/
├── index.html              # Main HTML file
├── script.js               # JavaScript functionality
├── style.css               # Styles and theming
├── service-worker.js       # Offline support and caching
├── package.json            # Dependencies and scripts
├── assets/                 # Images and media
│   └── mfd-logo.jpg
├── privacy-policy/         # Privacy policy page
│   └── index.html
├── terms-of-service/       # Terms of service page
│   └── index.html
└── scripts/                # Build scripts
    └── vite-runner.mjs
```

## Features

### Dark Mode
The site automatically detects your system's color scheme preference and applies the appropriate theme. Users can manually toggle between light and dark modes using the theme button in the navigation. The preference is saved to localStorage.

### Accessibility
- Skip-to-content link for keyboard users
- Proper semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- High contrast ratios

### Performance Optimizations
- IntersectionObserver for scroll animations
- Passive event listeners
- Event delegation for click handlers
- Lazy loading images
- Font preloading
- Deferred script loading

### Contact Form
The contact form is powered by Netlify Forms. When deployed to Netlify, form submissions are automatically captured without additional backend code.

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

**Note:** IE11 is not supported due to use of modern JavaScript features and CSS custom properties.

## Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy

The contact form will automatically work with Netlify Forms.

### Other Hosting Providers

You can deploy to any static hosting provider:
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

Build the project with `npm run build` and upload the `dist/` folder.

## Customization

### Colors and Theming
Edit CSS custom properties in `style.css` (lines 10-104):
```css
:root {
  --navy: #1A2744;
  --green: #3A8C5C;
  /* ... more variables */
}
```

### Content
Edit `index.html` to update:
- Company information
- Services and specialties
- Timeline entries
- Contact information

### Fonts
The site uses Google Fonts:
- **Syne** - Headings
- **DM Sans** - Body text
- **DM Serif Display** - Decorative elements

Update font imports in `index.html` (lines 10-14) to change typography.

## Testing

### Accessibility Testing
Run automated accessibility tests:
```bash
npm run test:a11y
```

### Manual Testing Checklist
- [ ] Test all navigation links
- [ ] Verify form submission
- [ ] Test dark mode toggle
- [ ] Check mobile responsiveness
- [ ] Test keyboard navigation
- [ ] Verify print layout
- [ ] Test offline functionality

## Performance

Run Lighthouse audits to check performance, accessibility, best practices, and SEO scores:
```bash
npm run build
npm run preview
# Then run Lighthouse in Chrome DevTools
```

Target scores:
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

## License

Copyright © 2026 MFD Research LLC. All rights reserved.

## Contact

For questions or support regarding this website:
- Email: info@mfdresearch.com
- Website: [mfdresearch.com](https://mfdresearch.com)

## Acknowledgments

Built with modern web standards and best practices for accessibility, performance, and user experience.
