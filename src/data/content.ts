/**
 * Site content, read from the JSON files in content/ (see docs/content.md).
 *
 * Editors change the JSON; this module only adds what's computed at build time:
 * - "{years}" anywhere in the text becomes the years of experience (from site.careerStartYear);
 * - numeric stats ("100+", "{years}+ Years") get the count-up animation attributes;
 * - icon names become inline SVG.
 * scripts/verify-content.mjs checks the JSON before every build.
 */
import siteRaw from '../../content/site.json';
import heroRaw from '../../content/hero.json';
import credibilityRaw from '../../content/credibility.json';
import aboutRaw from '../../content/about.json';
import servicesRaw from '../../content/services.json';
import processRaw from '../../content/process.json';
import experienceRaw from '../../content/experience.json';
import specialtiesRaw from '../../content/specialties.json';
import credentialsRaw from '../../content/credentials.json';
import conferencesRaw from '../../content/conferences.json';
import whyRaw from '../../content/why.json';
import faqRaw from '../../content/faq.json';
import contactRaw from '../../content/contact.json';
import footerRaw from '../../content/footer.json';
import { iconSvg } from './icons';

/** Whole years of experience, recalculated on every build. */
export const yearsExperience = new Date().getFullYear() - siteRaw.careerStartYear;

/** Replaces "{years}" with the current years of experience. */
export const fill = (text: string): string => text.replaceAll('{years}', String(yearsExperience));

/** Applies fill() to every text value in a content file, however deeply nested. */
function fillAll<T>(value: T): T {
  if (typeof value === 'string') return fill(value) as T;
  if (Array.isArray(value)) return value.map(fillAll) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillAll(item)])) as T;
  }
  return value;
}

const siteJson = fillAll(siteRaw);
const heroJson = fillAll(heroRaw);
const credibilityJson = fillAll(credibilityRaw);
const aboutJson = fillAll(aboutRaw);
const servicesJson = fillAll(servicesRaw);
const processJson = fillAll(processRaw);
const experienceJson = fillAll(experienceRaw);
const specialtiesJson = fillAll(specialtiesRaw);
const credentialsJson = fillAll(credentialsRaw);
const conferencesJson = fillAll(conferencesRaw);
const whyJson = fillAll(whyRaw);
const faqJson = fillAll(faqRaw);
const contactJson = fillAll(contactRaw);
const footerJson = fillAll(footerRaw);

/** "100+" counts up to 100 and keeps "+"; values without a leading number don't animate. */
function counter(value: string): { dataCount?: string; dataSuffix?: string } {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { dataCount: match[1], dataSuffix: match[2] } : {};
}

export const site = siteJson;

export const hero = {
  ...heroJson,
  stats: heroJson.stats.map((stat) => {
    return { label: stat.label, value: stat.value, ...counter(stat.value), iconSvg: iconSvg(stat.icon, 20) };
  }),
};

export const credibility = credibilityJson.items.map((item) => {
  return { value: item.value, text: item.text, ...counter(item.value), iconSvg: iconSvg(item.icon, 22, 'currentColor') };
});

export const about = aboutJson;

export const services = {
  ...servicesJson,
  items: servicesJson.items.map((item) => ({
    ...item,
    ariaLabel: item.title.replaceAll('&', 'and'),
    iconSvg: iconSvg(item.icon, 28, 'var(--green)', 1.75),
  })),
};

export const engagementProcess = {
  ...processJson,
  steps: processJson.steps.map((step) => ({ ...step, iconSvg: iconSvg(step.icon, 28, 'var(--green)', 1.75) })),
};

export type Role = { title: string; organization: string; startYear: number; endYear: number | null; summary: string };
// An empty end year means a current role. (Pages CMS removes empty fields when saving,
// so a missing endYear is the same as null.)
export const experience = {
  ...experienceJson,
  roles: (experienceJson.roles as Array<Omit<Role, 'endYear'> & { endYear?: number | null }>).map((role) => ({
    ...role,
    endYear: role.endYear ?? null,
  })) as Role[],
};

export const specialties = specialtiesJson;

export const credentials = credentialsJson;

export type ConferenceStatus = 'Upcoming' | 'Attended' | 'Details Pending';
export type Conference = {
  name: string;
  /** ISO date (YYYY-MM-DD); sorts the list and gives the month shown. */
  startDate: string;
  /** Only changes the label when the event spans two months. */
  endDate?: string;
  location: string;
  status: ConferenceStatus;
  focus: string;
  /** Pins this event to the large card (ignored once it's over). Optional: without it, the next upcoming event is featured. */
  featured?: boolean;
  /** Button on the featured card while the event is ahead; links to buttonUrl, or the booking link. */
  buttonLabel?: string;
  buttonUrl?: string;
};
/** Build date (YYYY-MM-DD, UTC). Dates are compared as text, which is safe for ISO dates. */
const today = new Date().toISOString().slice(0, 10);
const isOver = (event: Conference) => (event.endDate || event.startDate) < today;

// An "Upcoming" event whose dates have passed is shown as "Attended", so the list stays
// right without editing statuses by hand. (It updates on the next build/deploy.)
const events = (conferencesJson.events as Conference[]).map((event) =>
  event.status === 'Upcoming' && isOver(event) ? { ...event, status: 'Attended' as const } : event,
);
const upcoming = events
  .filter((event) => event.status === 'Upcoming')
  .sort((a, b) => a.startDate.localeCompare(b.startDate));
const newestFirst = [...events].sort((a, b) => b.startDate.localeCompare(a.startDate));

/**
 * The large card: the event marked "featured" (while it hasn't passed), otherwise the
 * next upcoming event, otherwise the most recent one. Everything else is listed under
 * "Recent & Past Engagements", newest first.
 */
const featured =
  events.find((event) => event.featured && !isOver(event)) ?? upcoming[0] ?? newestFirst[0];

export const conferences = {
  ...conferencesJson,
  featured,
  /** The booking button only shows while the featured event is still ahead. */
  featuredButton: featured && featured.buttonLabel && !isOver(featured)
    ? { label: featured.buttonLabel, url: featured.buttonUrl || siteJson.bookingUrl }
    : null,
  past: newestFirst.filter((event) => event !== featured),
};

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

export const why = {
  ...whyJson,
  cards: whyJson.cards.map((card) => ({ ...card, iconSvg: iconSvg(card.icon, 26, 'var(--green)', 1.75) })),
};

export const faq = faqJson;

export const contact = contactJson;

export const footer = footerJson;
