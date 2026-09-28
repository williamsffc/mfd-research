# Editing Site Content

All homepage text lives in `content/`, one file per section. Change the text there;
the page layout and design pick it up automatically. You never need to touch the
components in `src/components/` to change wording.

| File | What it holds |
|---|---|
| `site.json` | Email, booking link, LinkedIn link, the year your career started, the search-engine description |
| `hero.json` | Headline (three parts), intro paragraph, the two button labels, the "Core Expertise" stats |
| `credibility.json` | The figures in the bar under the hero |
| `about.json` | "Who We Are": title, paragraphs, quote, tags |
| `services.json` | Consulting services (title, description on the back of the card, icon) |
| `process.json` | The engagement steps |
| `experience.json` | The experience timeline (`endYear: null` means "Present") |
| `specialties.json` | Therapeutic areas, their emoji and tags |
| `credentials.json` | Certifications, in columns (a column's `title` can be `""`) |
| `conferences.json` | Events. The `featured` one gets the large card; newest-first for the rest |
| `why.json` | "What Sets Us Apart" cards |
| `faq.json` | Questions and answers (also sent to Google as FAQ data) |
| `contact.json` | Contact section text and the "Area of Interest" options |
| `footer.json` | Footer tagline, booking button label, notes |

Every section file that has a heading uses `label` (the small green line above the
title), `title` and `intro`.

## Rules of the format

The files are JSON. Four things to keep in mind:

- Text goes in double quotes: `"title": "Consulting Services"`. To use a double quote
  inside text, write `\"`. Curly quotes (“ ” ’) need no escaping.
- Numbers and years have **no** quotes: `"startYear": 2019`. So do `true`, `false`, `null`.
- Items in a list are separated by commas, with **no** comma after the last one.
- Keep field names exactly as they are. The check below flags a misspelled one.

**`{years}`** in any text is replaced by the current years of experience (from
`careerStartYear` in `site.json`), so "{years}+ Years" stays correct every year.

**Stats** that start with a number ("100+", "{years}+ Years") count up when scrolled
into view. Text like "Global" just appears.

**Icons** are picked by name: award, folder, map-pin, globe, clock, activity,
shield-check, layers, layout, file-text, settings, users, bar-chart, message, home,
lock. New icons are added in `src/data/icons.ts`.

**Conferences:** dates are `YYYY-MM-DD` (only the month is shown). `status` is one of
`"Upcoming"`, `"Attended"`, `"Details Pending"`. To add a button to the featured card,
set `"buttonLabel"`; it links to the booking link unless you also set `"buttonUrl"`.

## The check

`npm run verify:content` validates every file: missing or misspelled fields, empty text,
bad years or dates, unknown icons or statuses, more than one featured conference, and
invalid JSON. It also runs automatically before every build, so a mistake stops the
deploy with a message naming the file and the field instead of breaking the page.

## Making a change on GitHub

1. Open the file under `content/` on GitHub and click the pencil (Edit).
2. Make the change, then **Commit changes → Create a new branch** and open a pull request.
3. Cloudflare builds a preview for the pull request. Check it, then merge.

The legal pages (`src/pages/privacy-policy/`, `src/pages/terms-of-service/`) are
long-form and stay in their page files.
