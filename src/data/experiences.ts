/**
 * Experience Data
 * 
 * To add a new experience item, simply add a new object to the top of the `experiences` array.
 * If the role is current/ongoing, set `endYear: null`.
 */

export type Experience = {
  /** The professional title or role (e.g. "Founder & CEO"). */
  title: string;
  /** The company or organization name. */
  organization: string;
  /** The 4-digit start year of the role. */
  startYear: number;
  /** The 4-digit end year, or null if this is a current, ongoing role. */
  endYear: number | null;
  /** A concise paragraph summarizing the responsibilities and achievements. */
  summary: string;
};

export const experiences: Experience[] = [
  {
    title: "Chief Clinical Officer",
    organization: "Ark Clinical Research",
    startYear: 2025,
    endYear: null,
    summary: "Executive oversight of clinical operations across Ark sites, with focus on patient experience, study execution, enrollment performance, compliance, quality systems, team development, and strategic growth."
  },
  {
    title: "Founder & CEO",
    organization: "MFD Research",
    startYear: 2019,
    endYear: null,
    summary: "Specialized consulting for research site development and strategy, helping partners build, strengthen, and optimize clinical research operations from concept through execution."
  },
  {
    title: "Clinical Operations & Therapeutic Program Leadership",
    organization: "Ark Clinical Research",
    startYear: 2023,
    endYear: 2025,
    summary: "Operational leadership across clinical sites and metabolic/liver disease programs, including recruitment strategy, sponsor/CRO alignment, SOP development, staff mentorship, and scalable research execution."
  },
  {
    title: "Site Operations Leadership",
    organization: "Velocity Clinical Research / Foothill Eye Institute",
    startYear: 2017,
    endYear: 2023,
    summary: "Site-level leadership across high-volume research operations, study execution, regulatory readiness, sponsor relationships, quality processes, staff development, and operational improvement."
  },
  {
    title: "Clinical Research Operations Foundation",
    organization: "Translational Research Group / Encino Research Center / NRI",
    startYear: 2006,
    endYear: 2017,
    summary: "Built the site-level foundation behind MFD Research’s consulting approach through study coordination, patient-facing execution, Phase I-IV trial operations, regulatory documentation, GCP discipline, and multi-therapeutic research delivery."
  }
];
