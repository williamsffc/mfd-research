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

**Conferences** mostly run themselves, by date:

- The large card shows the **next upcoming event** (the nearest `"status": "Upcoming"`
  date). Everything else goes under "Recent & Past Engagements", newest first.
- When an "Upcoming" event's dates have passed, it's shown as "Attended" and moves to
  the list automatically. The site rebuilds every Monday (and on every change), so
  this happens within a week without anyone editing anything.
- If nothing is upcoming, the most recent event takes the card, without a button.

So to announce a new event, add it to `events` with `"status": "Upcoming"`, and add
`"buttonLabel": "Schedule a Meeting"` if you want the booking button (it links to the
booking link, or to `"buttonUrl"` if you set one). Dates are `YYYY-MM-DD`; only the
month is shown. `status` is `"Upcoming"`, `"Attended"` or `"Details Pending"`.
`"featured": true` is only needed to pin a specific upcoming event when several are
coming up.

## The check

`npm run verify:content` validates every file: missing or misspelled fields, empty text,
bad years or dates, unknown icons or statuses, more than one featured conference, and
invalid JSON. It also runs automatically before every build, so a mistake stops the
deploy with a message naming the file and the field instead of breaking the page.

## Editing with Pages CMS (the easy way)

[Pages CMS](https://app.pagescms.org) gives every file above a form: text boxes, date
pickers, dropdowns for icons and statuses, and "Add item" buttons for lists. Nothing to
install; it reads `.pages.yml` in this repository.

1. Go to **app.pagescms.org** and sign in with GitHub. The first time, install the
   Pages CMS GitHub app on the `mfd-research` repository when it asks.
2. Open **mfd-research**, pick a section (e.g. **Conferences**), edit, and **Save**.
3. Saving commits to the branch you're on. The safe habit: switch to a branch first
   (branch menu at the top), save there, then open a pull request on GitHub. Cloudflare
   builds a preview; check it and merge. Saving on `main` publishes directly.

If the content check fails after a save, the Cloudflare build shows which file and field
to fix, and the live site stays as it was.

For developers: when you add a field to a content file, add it to `.pages.yml` too.
Pages CMS only saves fields listed there, and `npm run verify:content` fails if one is
missing.

## Making a change on GitHub directly

1. Open the file under `content/` on GitHub and click the pencil (Edit).
2. Make the change, then **Commit changes → Create a new branch** and open a pull request.
3. Cloudflare builds a preview for the pull request. Check it, then merge.

## Weekly rebuild

`.github/workflows/weekly-rebuild.yml` asks Cloudflare to rebuild the live site every
Monday, so date-based content (conference status, years of experience) stays current.
It needs a one-time setup: a Cloudflare deploy hook for `main`, saved as the
`CLOUDFLARE_DEPLOY_HOOK_URL` repository secret (steps at the top of the file). You can
also run it by hand from GitHub's **Actions** tab.

The legal pages (`src/pages/privacy-policy/`, `src/pages/terms-of-service/`) are
long-form and stay in their page files.
