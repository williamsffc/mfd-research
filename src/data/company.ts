/**
 * Company Facts
 *
 * Single source of truth for figures repeated across the site (hero, credibility bar,
 * About copy, meta description, JSON-LD). Computed at build time.
 */

/** Year the founder began working in clinical research. */
export const careerStartYear = 2006;

/** Whole years of experience, recalculated on every build. */
export const yearsExperience = new Date().getFullYear() - careerStartYear;

export const siteDescription = `MFD Research delivers ${yearsExperience}+ years of clinical research expertise, helping pharmaceutical organizations build world-class research sites from concept to completion.`;
