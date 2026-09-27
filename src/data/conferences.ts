/**
 * Conference Data
 * 
 * To add a new conference item, simply add a new object to the top of the `conferences` array.
 */

/** Lifecycle state of a conference appearance. */
export type ConferenceStatus = 'Upcoming' | 'Attended' | 'Details Pending';

export type Conference = {
  /** Full official name of the conference or event. */
  name: string;
  /** ISO 8601 start date, used for sorting and the displayed month (e.g. "2026-06-04"). */
  startDate: string;
  /** ISO 8601 end date; only affects the label when the event spans two months (e.g. "2026-06-08"). */
  endDate?: string;
  /** City and state/country (e.g. "New Orleans, LA"). */
  location: string;
  /** Current lifecycle state of the appearance. */
  status: ConferenceStatus;
  /** Short description of the conference focus or topic area. */
  focus: string;
  /** When true, this entry is displayed as the hero featured card. */
  featured?: boolean;
  /** Label for the call-to-action button (only shown when featured). */
  ctaLabel?: string;
  /** URL for the call-to-action button (only shown when featured). */
  ctaUrl?: string;
};

export const conferences: Conference[] = [
  {
    name: 'American Diabetes Association (ADA) 2026 Scientific Sessions',
    startDate: '2026-06-04',
    endDate: '2026-06-08',
    location: 'New Orleans, LA',
    status: 'Upcoming',
    focus: 'Diabetes, obesity, metabolic disease, and clinical research innovation',
    featured: true,
    ctaLabel: 'Schedule a Meeting',
    ctaUrl: 'https://calendar.app.google/8fQfrSyLumEMRKHQ9',
  },
  {
    name: 'ENLIGHTEN Investigator Engagement Meeting',
    startDate: '2026-03-03',
    endDate: '2026-03-04',
    location: 'Seattle, WA',
    status: 'Attended',
    focus: 'Investigator engagement and clinical trial collaboration',
  },
  {
    name: 'Dallas/Fort Worth Industry Meeting',
    startDate: '2026-02-25',
    endDate: '2026-02-26',
    location: 'Dallas/Fort Worth, TX',
    status: 'Details Pending',
    focus: 'Details pending',
  },
  {
    name: 'Lilly CoDesign, MASLD/MASH CoLAB',
    startDate: '2025-09-04',
    endDate: '2025-09-05',
    location: 'Indianapolis, IN',
    status: 'Attended',
    focus: 'MASLD/MASH, metabolic and liver disease research',
  },
  {
    name: 'Industry Meeting',
    startDate: '2025-08-12',
    endDate: '2025-08-13',
    location: 'Indianapolis, IN',
    status: 'Details Pending',
    focus: 'Details pending',
  },
  {
    name: 'Lilly - Sarcopenic Obesity CoDesign',
    startDate: '2025-05-08',
    endDate: '2025-05-09',
    location: 'Indianapolis, IN',
    status: 'Attended',
    focus: 'Sarcopenic obesity and clinical research collaboration',
  },
];


const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthOnly = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });

/**
 * Month-level label shown in the UI: "March 2026", or "January–February 2026" /
 * "December 2025–January 2026" when the event spans months. Specific days are
 * intentionally not shown.
 */
export function formatConferenceDate({ startDate, endDate }: Pick<Conference, 'startDate' | 'endDate'>): string {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 'Details Pending';

  const end = endDate ? new Date(endDate) : start;
  if (Number.isNaN(end.getTime())) return monthYear.format(start);

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  if (sameYear && start.getUTCMonth() === end.getUTCMonth()) return monthYear.format(start);
  if (sameYear) return `${monthOnly.format(start)}–${monthYear.format(end)}`;
  return `${monthYear.format(start)}–${monthYear.format(end)}`;
}
