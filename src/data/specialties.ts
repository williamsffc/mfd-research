/**
 * Specialties Data
 * 
 * To add a new therapeutic specialty, simply add a new object to the `specialties` array.
 */

export type Specialty = {
  /** The therapeutic category name (e.g., "Ophthalmology"). */
  name: string;
  /** The emoji icon used for the category. */
  icon: string;
  /** A list of specific indications within this category. */
  tags: string[];
};

export const specialties: Specialty[] = [
  {
    name: 'Ophthalmology',
    icon: '👁️',
    tags: [
      'Glaucoma',
      'Dry Eye Disease',
      'AMD',
      'Retinopathy',
      'Ocular Inflammation',
      'Thyroid Eye Disease',
      'Presbyopia',
      'Post-Cataract Pain'
    ]
  },
  {
    name: 'Metabolic',
    icon: '⚖️',
    tags: [
      'Diabetes T1 & T2',
      'Obesity / Weight Loss',
      'NAFLD / NASH',
      'Hypercholesterolemia',
      'Obesity with CVD'
    ]
  },
  {
    name: 'Cardiovascular',
    icon: '🫀',
    tags: [
      'Hypertension',
      'Resistant Hypertension',
      'Hypotension'
    ]
  },
  {
    name: 'Gastrointestinal',
    icon: '🦠',
    tags: [
      'IBS-C / IBS-D',
      'GERD',
      'Chronic Constipation',
      'Opioid-Induced Constipation'
    ]
  },
  {
    name: 'Dermatology',
    icon: '🧫',
    tags: [
      'Psoriasis',
      'Acne',
      'Rosacea',
      'Atopic Dermatitis'
    ]
  },
  {
    name: 'Vaccine & Immunology',
    icon: '💉',
    tags: [
      'COVID-19',
      'Flu Vaccines',
      'RSV',
      'Healthy Volunteers'
    ]
  },
  {
    name: 'Pain Management',
    icon: '🩹',
    tags: [
      'Chronic Pain',
      'Low Back Pain',
      'Osteoarthritis',
      'Knee Pain'
    ]
  },
  {
    name: 'Other Indications',
    icon: '🔭',
    tags: [
      'Chronic Kidney Disease',
      'Hot Flashes',
      'Bio Bank Studies',
      'PK/PD Trials'
    ]
  }
];
