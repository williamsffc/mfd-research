/**
 * Consulting Services Data
 * 
 * To add a new service, simply add a new object to the `services` array below.
 */

export type Service = {
  /** The title of the consulting service. */
  title: string;
  /** The detailed description shown on the back of the card. */
  description: string;
  /** The raw trusted SVG string for the icon on the front of the card. */
  iconSvg: string;
  /** Accessible label for the service card button. */
  ariaLabel: string;
};

export const services: Service[] = [
  {
    title: 'Site Development & Strategy',
    description: 'We help organizations build research sites from the ground up, from site selection and infrastructure planning to sponsor activation and first patient enrollment.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    ariaLabel: 'Site Development and Strategy'
  },
  {
    title: 'Regulatory Compliance & GCP',
    description: 'Proactive compliance strategies aligned with FDA, ICH-GCP, and sponsor requirements so your site stays inspection-ready at all times.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    ariaLabel: 'Regulatory Compliance and GCP'
  },
  {
    title: 'Quality Management Systems',
    description: 'Design and implementation of robust QMS frameworks, including CAPA processes, deviation management, and internal audit programs.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    ariaLabel: 'Quality Management Systems'
  },
  {
    title: 'Multi-Specialty Trial Management',
    description: 'Operational oversight across multiple therapeutic areas and concurrent trials with proven systems for complex, multi-protocol environments.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    ariaLabel: 'Multi-Specialty Trial Management'
  },
  {
    title: 'Staff Training & Development',
    description: 'Customized training programs for research coordinators, sub-investigators, and site staff covering GCP fundamentals and protocol-specific procedures.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    ariaLabel: 'Staff Training and Development'
  },
  {
    title: 'Operational Assessment & Remediation',
    description: 'Comprehensive site assessments that identify gaps in performance, compliance, and workflow, then turn them into actionable remediation plans.',
    iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    ariaLabel: 'Operational Assessment and Remediation'
  }
];
