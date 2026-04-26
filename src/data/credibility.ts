/**
 * Credibility Data
 * 
 * To add a new credibility item, simply add a new object to the `credibility` array below.
 */

export type CredibilityItem = {
  /** The top value or metric shown (e.g., "18+", "Phase I–III"). */
  value: string;
  /** The descriptive text below the value. */
  text: string;
  /** The raw SVG string for the icon. */
  iconSvg: string;
  /** Optional: The target number for the JS counter animation. */
  dataCount?: string;
  /** Optional: The suffix appended to the counter animation (e.g., "+"). */
  dataSuffix?: string;
};

const startYear = 2006;
const yearsExperience = new Date().getFullYear() - startYear;

export const credibility: CredibilityItem[] = [
  {
    value: `${yearsExperience}+`,
    text: 'Years of Experience',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    dataCount: yearsExperience.toString(),
    dataSuffix: '+'
  },
  {
    value: 'Phase I–III',
    text: 'Clinical Trials',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
  },
  {
    value: 'GCP Certified',
    text: 'ICH Guidelines',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>'
  },
  {
    value: 'Multi-Sponsor',
    text: 'Portfolio Expertise',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  },
  {
    value: '10+ Areas',
    text: 'Therapeutic Specialties',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    dataCount: '10',
    dataSuffix: '+ Areas'
  }
];
