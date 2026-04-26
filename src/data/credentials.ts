/**
 * Credentials Data
 * 
 * To add a new credential, add an object with a `year` and `description` to the `items` array of the appropriate group.
 * The layout currently uses two columns.
 */

export type Credential = {
  /** The 4-digit year the credential was achieved. */
  year: number;
  /** The name or description of the degree, certification, or training. */
  description: string;
};

export type CredentialGroup = {
  /** Optional title for this group of credentials (e.g., "Education"). */
  title?: string;
  /** The list of credentials within this group. */
  items: Credential[];
};

export const credentials: CredentialGroup[] = [
  {
    title: 'Education',
    items: [
      { year: 2011, description: 'Bachelor of Science in Biology — California State University, Northridge' },
      { year: 2010, description: 'Medical Assistant, CPR & Phlebotomy — Concorde Career College' },
      { year: 2017, description: 'ACRP Certified Clinical Research Coordinator (CCRC)' }
    ]
  },
  {
    items: [
      { year: 2022, description: 'IATA Dangerous Goods Training Certification' },
      { year: 2022, description: 'ACRP Ethics & Human Subject Protection' },
      { year: 2022, description: 'ACRP GCP for the Experienced Clinical Research Professional' },
      { year: 2022, description: 'ACRP Inspection Readiness & Quality Management Systems' },
      { year: 2022, description: 'CAPA Bloodborne Pathogen Certification' },
      { year: 2017, description: 'TransCelerate GCP-ICH Certification' },
      { year: 2008, description: 'NIH Investigator Training — Human Subjects Protection & Clinical Research' }
    ]
  }
];
