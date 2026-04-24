# MFD Research Website Architecture

## 1. Project Purpose

The MFD Research website is a founder-led, company-branded consulting website for **MFD Research LLC**.

The website should position MFD Research as a serious clinical research consulting firm while using **Michael Delgado, CCRC** as the credibility engine behind the company.

The site should not feel like Michael's LinkedIn profile copied into a website. LinkedIn should remain Michael-forward. The website should be MFD Research-forward.

## 2. Strategic Brand Direction

### Brand Model

**MFD Research = the consulting firm**  
Clinical research operations consulting for sponsors, CROs, biotech organizations, research sites, and site networks.

**Michael Delgado = founder/principal authority**  
The credibility engine behind the firm, based on 18+ years of clinical research operations leadership.

### Positioning Statement

MFD Research is a specialized clinical research consulting firm helping sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.

### Founder Validation Statement

Founded by Michael Delgado, CCRC, MFD Research brings more than 18 years of hands-on clinical research leadership across site operations, sponsor relationships, regulatory readiness, staff development, and multi-therapeutic trial execution.

### Tone

The website should feel:

- Professional
- Clinical research-focused
- Executive-level
- Trustworthy
- Confidential
- Operationally grounded
- Company-led, not personal-resume-led

Avoid language that feels like generic consulting fluff. The site should communicate practical execution, compliance awareness, and site-level operational credibility.

## 3. Primary Website Goals

The website should accomplish five goals:

1. Clearly explain what MFD Research does.
2. Establish credibility through founder-led experience.
3. Convert visitors into booked consultations or qualified inquiries.
4. Support LinkedIn and conference outreach.
5. Provide a scalable foundation for future service pages, conference pages, and content.

## 4. Recommended Technology Stack

### Frontend Framework

Use **Astro**.

Reasoning:

- Excellent for static and content-forward websites.
- Fast by default.
- Easy to structure into reusable components.
- Supports Markdown/MDX content if needed later.
- Lower complexity than Next.js for this use case.
- Works well with Cloudflare Pages.

## Current Repository Baseline

The project currently exists as a static HTML/CSS/JavaScript website with a lightweight Node-based tooling layer.

### Existing Core Files

```text
index.html
style.css
script.js
assets/
privacy-policy/index.html
terms-of-service/index.html
robots.txt
sitemap.xml
site.webmanifest
service-worker.js
README.md
CLAUDE.md
package.json
package-lock.json
scripts/

### Styling

Preferred options:

1. **Tailwind CSS** for fast, consistent component styling.
2. Or a clean global CSS system if preserving the existing design language.

Recommendation: use Tailwind if rebuilding from scratch. Use organized CSS variables if preserving the current visual identity.

### Hosting

Use **Cloudflare Pages**.

Recommended deployment settings:

```text
Build command: npm run build
Output directory: dist
Framework preset: Astro
```

### DNS

Use **Cloudflare DNS** for:

```text
mfdresearch.com
www.mfdresearch.com
```

The production domain should only be connected after the site is polished and approved.

### Scheduling

Use the existing **Google Booking page** as the primary conversion CTA.

Recommended CTA text:

```text
Schedule a Confidential Consultation
```

Alternative CTA text for event/conference pages:

```text
Schedule a 30-Minute Meeting
```

### Contact Form

The booking link should be the primary conversion path. A contact form may remain secondary.

Possible form options:

- Web3Forms
- Formspree
- Basin
- Cloudflare Workers/Pages Function
- Google Forms, if simplicity matters more than polish

If Web3Forms is used, ensure the access key is not left as a placeholder.

### Analytics

Recommended analytics options:

- Cloudflare Web Analytics
- Plausible
- Fathom
- Google Analytics, only if broader marketing tracking is needed

For this project, start with Cloudflare Web Analytics.

## 5. Development Workflow

The site should be built locally first. Do not expose or attach the production domain until the site is ready.

### Local Development

```bash
npm create astro@latest
npm install
npm run dev
```

### Build Check

Before deployment:

```bash
npm run build
npm run preview
```

### GitHub Workflow

Use GitHub as the source of truth.

Recommended branches:

```text
main        production-ready branch
dev         active development branch
feature/*   isolated work branches if needed
```

For a small project, `main` and `dev` are enough.

## 6. Recommended Project File Structure

```text
mfd-research/
  public/
    assets/
      logos/
      images/
      icons/
      og-image.png
      favicon.svg
      favicon-32x32.png
      favicon-16x16.png
      apple-touch-icon.png
  src/
    components/
      Header.astro
      Hero.astro
      WhoWeHelp.astro
      Services.astro
      WhyMFD.astro
      FounderExpertise.astro
      Conferences.astro
      TherapeuticExpertise.astro
      EngagementProcess.astro
      ContactCTA.astro
      Footer.astro
      SEO.astro
    data/
      services.ts
      audiences.ts
      conferences.ts
      therapeuticAreas.ts
      credentials.ts
      siteConfig.ts
    layouts/
      BaseLayout.astro
    pages/
      index.astro
      ada-2026.astro
      privacy-policy.astro
      terms-of-service.astro
    styles/
      global.css
  architecture.md
  package.json
  astro.config.mjs
  tsconfig.json
  README.md
```

## 7. Homepage Content Architecture

Recommended homepage order:

```text
1. Hero
2. Who We Help
3. What We Do
4. Why MFD Research
5. Founder-Led Expertise
6. Conferences & Industry Engagement
7. Therapeutic Expertise
8. Engagement Process
9. Contact / Schedule Consultation
10. Footer
```

## 8. Section Details

### 8.1 Hero

Purpose: communicate the company's value within five seconds.

Recommended headline:

```text
Clinical Research Operations Built for Execution
```

Recommended subheadline:

```text
MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.
```

Primary CTA:

```text
Schedule a Confidential Consultation
```

Secondary CTA:

```text
View Consulting Services
```

Hero should be company-led, not Michael-led.

### 8.2 Who We Help

Purpose: show target audiences clearly.

Recommended audience cards:

- Pharmaceutical sponsors
- Biotech organizations
- CROs
- Research sites
- Site networks or emerging research programs

Each card should explain the problem MFD Research helps solve for that audience.

### 8.3 What We Do

Purpose: describe consulting services.

Recommended service categories:

1. Research Site Development
2. Clinical Operations Optimization
3. Regulatory & GCP Readiness
4. Quality Management Systems
5. Staff Training & Development
6. Therapeutic Program Support

Avoid overly broad or vague service descriptions. Each service should feel practical and operational.

### 8.4 Why MFD Research

Purpose: explain why the firm is credible and differentiated.

Recommended proof points:

- 18+ years of clinical research operations experience
- Phase I-III trial execution
- Multi-sponsor, multi-therapeutic site leadership
- Site-level operational authority
- Regulatory, quality, and staff training depth
- Confidential consulting model

### 8.5 Founder-Led Expertise

Purpose: introduce Michael as the authority behind the company.

Recommended headline:

```text
Founder-Led Expertise
```

Recommended copy:

```text
MFD Research was founded by Michael Delgado, CCRC, a clinical research operations leader with more than 18 years of experience across site development, regulatory readiness, sponsor partnerships, staff training, and multi-therapeutic trial execution.

Michael's background includes leadership across high-volume research sites, ophthalmology research operations, metabolic and liver disease programs, and multi-specialty clinical trials. His work gives MFD Research a practical, site-level perspective grounded in real execution, not advisory theory.
```

Recommended buttons:

```text
Connect with Michael on LinkedIn
Schedule a Consultation
```

Do not include a full LinkedIn-style resume timeline on the homepage.

### 8.6 Conferences & Industry Engagement

Purpose: replace testimonials with credible industry participation.

This section should highlight recent and upcoming conferences/meetings, including ADA 2026 as an upcoming event.

Recommended headline:

```text
Conferences & Industry Engagement
```

Recommended intro:

```text
MFD Research stays connected to the evolving clinical research landscape through participation in major medical, scientific, and industry meetings.
```

Each conference card should include:

```text
Conference name
Year
Location
Status: Upcoming or Attended
Relevant focus area
Optional URL
```

Important accuracy rule:

Do not imply that MFD Research officially represented every historical conference unless that is accurate.

Safer wording:

```text
Michael Delgado's recent industry participation includes:
```

or:

```text
Recent and upcoming conferences connected to MFD Research's clinical focus areas:
```

ADA 2026 should have a CTA:

```text
Attending ADA 2026? Schedule a time to connect.
```

### 8.7 Therapeutic Expertise

Purpose: show clinical breadth.

Recommended framing:

```text
Therapeutic Areas Supported by MFD Research Experience
```

Suggested categories:

- Ophthalmology
- Metabolic
- Cardiovascular
- Gastrointestinal
- Dermatology
- Vaccine & Immunology
- Pain Management
- Other Indications

### 8.8 Engagement Process

Purpose: explain how a prospect works with MFD Research.

Recommended three-step process:

1. Confidential Discovery Call
2. Operational Assessment & Scope
3. Execution, Advisory, or Remediation Support

### 8.9 Contact / Schedule Consultation

Purpose: convert visitors.

Conversion hierarchy:

1. Google Booking CTA
2. Email link
3. Contact form

Recommended CTA:

```text
Schedule a Confidential Consultation
```

Secondary text:

```text
All inquiries are handled confidentially.
```

## 9. Pages to Build

### Phase 1 Pages

```text
/
/privacy-policy
/terms-of-service
```

### Phase 2 Pages

```text
/ada-2026
/services
/founder
/contact
```

### Future Pages

```text
/services/site-development
/services/clinical-operations
/services/regulatory-gcp-readiness
/services/quality-management-systems
/services/staff-training
/insights
/case-studies
```

## 10. ADA 2026 Landing Page

Create this page after the main homepage is stable.

Path:

```text
/ada-2026
```

Purpose:

Support LinkedIn posts, conference outreach, email signatures, QR codes, and direct meeting scheduling.

Recommended headline:

```text
Meet MFD Research at ADA 2026
```

Recommended copy:

```text
Michael Delgado, CCRC, Founder of MFD Research, will be attending the ADA 2026 Scientific Sessions in New Orleans. Schedule a confidential conversation about clinical research operations, site development, sponsor readiness, or therapeutic program support.
```

Primary CTA:

```text
Schedule a 30-Minute Meeting
```

## 11. Data Files

Use TypeScript data files to keep content manageable.

### `src/data/siteConfig.ts`

```ts
export const siteConfig = {
  name: "MFD Research",
  legalName: "MFD Research LLC",
  domain: "https://mfdresearch.com",
  email: "info@mfdresearch.com",
  linkedinUrl: "https://www.linkedin.com/in/mike-delgado/",
  bookingUrl: "REPLACE_WITH_GOOGLE_BOOKING_URL",
  description:
    "MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations.",
};
```

### `src/data/conferences.ts`

```ts
export const conferences = [
  {
    name: "ADA 2026 Scientific Sessions",
    status: "Upcoming",
    year: "2026",
    location: "New Orleans, LA",
    focus: "Diabetes, obesity, metabolic disease, and clinical research innovation",
    url: "https://corereg.cmrus.com/ada2026",
  },
];
```

### `src/data/services.ts`

```ts
export const services = [
  {
    title: "Research Site Development",
    description:
      "Support for site launch planning, infrastructure readiness, sponsor activation, and first-patient-in preparation.",
  },
  {
    title: "Clinical Operations Optimization",
    description:
      "Workflow design, staff role clarity, trial execution support, and site performance remediation.",
  },
  {
    title: "Regulatory & GCP Readiness",
    description:
      "Inspection readiness, ICH-GCP alignment, documentation workflows, and compliance gap review.",
  },
  {
    title: "Quality Management Systems",
    description:
      "SOP development, CAPA process support, deviation management, and internal audit preparation.",
  },
  {
    title: "Staff Training & Development",
    description:
      "Coordinator training, site team onboarding, protocol-specific workflows, and operational leadership coaching.",
  },
  {
    title: "Therapeutic Program Support",
    description:
      "Multi-specialty trial operations, Phase I-III execution support, and sponsor/CRO communication support.",
  },
];
```

## 12. SEO Requirements

Each page should include:

- Unique title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card metadata
- Robots tag

Recommended homepage title:

```text
MFD Research | Clinical Research Operations Consulting
```

Recommended homepage description:

```text
MFD Research helps sponsors, CROs, biotech organizations, and research sites build, optimize, and strengthen clinical research operations from site development to inspection readiness.
```

## 13. Accessibility Requirements

The site should include:

- Semantic HTML landmarks
- Accessible navigation
- Skip-to-content link
- Proper heading hierarchy
- Descriptive alt text
- Keyboard-accessible menus
- Visible focus states
- Sufficient color contrast
- Accessible form labels
- Reduced-motion consideration for animations

## 14. Performance Requirements

Target:

- Fast static pages
- Minimal JavaScript
- Optimized images
- Lazy-loaded non-critical images
- Proper image dimensions
- Compressed assets
- No unnecessary third-party scripts

Avoid heavy animations or app-like interactivity unless it supports conversion.

## 15. Security and Privacy Requirements

- Do not expose private API keys in frontend code.
- Use environment variables for service keys.
- Use secure external links with `rel="noopener noreferrer"`.
- Use form spam protection.
- Include Privacy Policy and Terms of Service pages.
- Avoid collecting unnecessary personal data.

## 16. Deployment Plan

### Phase 1: Local Build

- Create Astro project.
- Build homepage structure.
- Add core sections.
- Add placeholder Google Booking URL.
- Add placeholder conference data.
- Test locally.

### Phase 2: Content Finalization

- Finalize homepage copy.
- Replace testimonials with conferences.
- Add real conference list.
- Add real Google Booking URL.
- Add Michael LinkedIn URL.
- Confirm email address.
- Confirm logo and image assets.

### Phase 3: GitHub Cleanup

- Commit clean Astro structure.
- Add README.
- Add architecture.md.
- Remove unused old files.
- Confirm `npm run build` works.

### Phase 4: Cloudflare Preview

- Connect GitHub repo to Cloudflare Pages.
- Deploy preview.
- Do not connect production domain yet.
- QA preview URL.

### Phase 5: Production Launch

- Connect `mfdresearch.com`.
- Add `www` redirect.
- Enable Cloudflare Web Analytics.
- Test Google Booking link.
- Test form submission.
- Test LinkedIn preview card.
- Submit sitemap to Google Search Console.

## 17. Launch Checklist

Before launch, confirm:

- [ ] Homepage is company-led, not resume-led.
- [ ] Michael appears as founder/principal authority.
- [ ] Booking CTA works.
- [ ] LinkedIn link works.
- [ ] Email link works.
- [ ] Contact form works or is removed.
- [ ] Testimonials are removed or replaced.
- [ ] Conference section is accurate.
- [ ] ADA 2026 is marked as upcoming.
- [ ] Mobile navigation works.
- [ ] Site is responsive on iPhone and desktop.
- [ ] SEO metadata is complete.
- [ ] Open Graph image displays on LinkedIn.
- [ ] Favicon works.
- [ ] Privacy and Terms pages exist.
- [ ] Cloudflare Web Analytics is enabled.
- [ ] No placeholder links remain.
- [ ] No fake claims or unapproved testimonials remain.

## 18. Content Rules

### Do

- Keep MFD Research as the main brand.
- Use Michael as founder-led credibility.
- Keep the language practical and specific.
- Emphasize execution, compliance, and site operations.
- Use conferences as trust signals.
- Make scheduling the primary action.

### Do Not

- Do not make the website a duplicate of Michael's LinkedIn.
- Do not overuse generic consulting language.
- Do not include fake or unapproved testimonials.
- Do not imply official representation at events unless accurate.
- Do not expose unfinished work on the production domain.
- Do not overbuild dynamic features before the business need exists.

## 19. Future Enhancement Ideas

After launch, consider:

- ADA 2026 campaign page
- Downloadable capability statement PDF
- Service-specific landing pages
- Founder profile page
- Insights/articles section
- Case-study-style outcomes without client names
- Company LinkedIn page
- Email capture
- CRM integration
- Conference QR code landing pages
- Structured data/schema markup

## 20. Final Direction

Build MFD Research as a **modern, founder-led consulting firm website**.

The final product should communicate:

```text
MFD Research is the company.
Michael Delgado is the proof.
Clinical research operations execution is the value.
Confidential consultation is the conversion path.
```
