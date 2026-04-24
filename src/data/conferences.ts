export type ConferenceStatus = 'Upcoming' | 'Attended' | 'Details Pending';

export type Conference = {
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  location: string;
  status: ConferenceStatus;
  focus: string;
  featured?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
};

export const conferences: Conference[] = [
  {
    name: 'American Diabetes Association (ADA) 2026 Scientific Sessions',
    date: 'June 4–8, 2026',
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
    date: 'March 3–4, 2026',
    startDate: '2026-03-03',
    endDate: '2026-03-04',
    location: 'Seattle, WA',
    status: 'Attended',
    focus: 'Investigator engagement and clinical trial collaboration',
  },
  {
    name: 'Dallas/Fort Worth Industry Meeting',
    date: 'February 25–26, 2026',
    startDate: '2026-02-25',
    endDate: '2026-02-26',
    location: 'Dallas/Fort Worth, TX',
    status: 'Details Pending',
    focus: 'Details pending',
  },
  {
    name: 'Lilly CoDesign, MASLD/MASH CoLAB',
    date: 'September 4–5, 2025',
    startDate: '2025-09-04',
    endDate: '2025-09-05',
    location: 'Indianapolis, IN',
    status: 'Attended',
    focus: 'MASLD/MASH, metabolic and liver disease research',
  },
  {
    name: 'Industry Meeting',
    date: 'August 12–13, 2025',
    startDate: '2025-08-12',
    endDate: '2025-08-13',
    location: 'Indianapolis, IN',
    status: 'Details Pending',
    focus: 'Details pending',
  },
  {
    name: 'Lilly - Sarcopenic Obesity CoDesign',
    date: 'May 8–9, 2025',
    startDate: '2025-05-08',
    endDate: '2025-05-09',
    location: 'Indianapolis, IN',
    status: 'Attended',
    focus: 'Sarcopenic obesity and clinical research collaboration',
  },
];

