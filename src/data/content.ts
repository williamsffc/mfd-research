/**
 * Site content, read from the JSON files in content/ (see docs/content.md).
 *
 * Editors change the JSON; this module only adds what's computed at build time:
 * - "{years}" in any text becomes the years of experience (from site.careerStartYear);
 * - numeric stats ("100+", "{years}+ Years") get the count-up animation attributes;
 * - icon names become inline SVG.
 * scripts/verify-content.mjs checks the JSON before every build.
 */
import siteJson from '../../content/site.json';
import heroJson from '../../content/hero.json';
import credibilityJson from '../../content/credibility.json';
import aboutJson from '../../content/about.json';
import servicesJson from '../../content/services.json';
import processJson from '../../content/process.json';
import experienceJson from '../../content/experience.json';
import specialtiesJson from '../../content/specialties.json';
import credentialsJson from '../../content/credentials.json';
import conferencesJson from '../../content/conferences.json';
import whyJson from '../../content/why.json';
import faqJson from '../../content/faq.json';
import contactJson from '../../content/contact.json';
import footerJson from '../../content/footer.json';
import { iconSvg } from './icons';

/** Whole years of experience, recalculated on every build. */
export const yearsExperience = new Date().getFullYear() - siteJson.careerStartYear;

/** Replaces "{years}" with the current years of experience. */
export const fill = (text: string): string => text.replaceAll('{years}', String(yearsExperience));

/** "100+" counts up to 100 and keeps "+"; values without a leading number don't animate. */
function counter(value: string): { dataCount?: string; dataSuffix?: string } {
  const match = value.match(/^(\d+)(.*)$/);
  return match ? { dataCount: match[1], dataSuffix: match[2] } : {};
}

export const site = { ...siteJson, description: fill(siteJson.description) };

export const hero = {
  ...heroJson,
  stats: heroJson.stats.map((stat) => {
    const value = fill(stat.value);
    return { label: stat.label, value, ...counter(value), iconSvg: iconSvg(stat.icon, 20) };
  }),
};

export const credibility = credibilityJson.items.map((item) => {
  const value = fill(item.value);
  return { value, text: item.text, ...counter(value), iconSvg: iconSvg(item.icon, 22, 'currentColor') };
});

export const about = { ...aboutJson, paragraphs: aboutJson.paragraphs.map(fill) };

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
export const experience = { ...experienceJson, roles: experienceJson.roles as Role[] };

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
  /** Shown as the large card; if none is featured, the first upcoming event is. */
  featured?: boolean;
  /** Button on the featured card; links to buttonUrl, or the booking link. */
  buttonLabel?: string;
  buttonUrl?: string;
};
export const conferences = { ...conferencesJson, events: conferencesJson.events as Conference[] };

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
