/**
 * Hero Stats Data
 * 
 * To add a new hero stat to the Core Expertise box, add a new object to the `heroStats` array below.
 */

export type HeroStat = {
  /** The descriptive label (e.g., "Industry Experience"). */
  label: string;
  /** The visible value string (e.g., "20+ Years"). */
  value: string;
  /** The emoji icon string. */
  icon: string;
  /** Optional: The target number for the JS counter animation. */
  dataCount?: string;
  /** Optional: The suffix appended to the counter animation. */
  dataSuffix?: string;
};

const startYear = 2006;
const yearsExperience = new Date().getFullYear() - startYear;

export const heroStats: HeroStat[] = [
  {
    label: 'Industry Experience',
    value: `${yearsExperience}+ Years`,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    dataCount: yearsExperience.toString(),
    dataSuffix: '+ Years'
  },
  {
    label: 'Studies Supported',
    value: '100+',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    dataCount: '100',
    dataSuffix: '+'
  },
  {
    label: 'Sites Activated',
    value: '15+',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    dataCount: '15',
    dataSuffix: '+'
  },
  {
    label: 'Trial Reach',
    value: 'Global',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  }
];
