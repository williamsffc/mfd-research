/**
 * FAQ Data
 * 
 * To add a new Frequently Asked Question, simply add a new object to the `faqs` array below.
 */

export type FAQ = {
  /** The question text as it appears in the accordion header. */
  question: string;
  /** The text content of the answer. */
  answer: string;
};

export const faqs: FAQ[] = [
  {
    question: "What types of organizations do you work with?",
    answer: "We work with pharmaceutical sponsors, biotech firms, CROs, and research sites of all sizes — from emerging Phase I sites to established multi-specialty networks. If you're building, optimizing, or remediating clinical research operations, we can help."
  },
  {
    question: "Do you work on a project or retainer basis?",
    answer: "Both. Short-term project engagements are available for defined deliverables such as SOP development, site assessments, or staff training programs. Ongoing advisory retainers are also available for organizations that need continuous operational support."
  },
  {
    question: "Are engagements confidential?",
    answer: "Yes — all client relationships are handled with complete professional discretion. We routinely sign mutual NDAs at the start of any engagement, and client details are never shared or referenced publicly."
  },
  {
    question: "Do you work with sites outside of California?",
    answer: "Yes. While our founder is based in California, we support clients across the United States and can work remotely or on-site depending on the engagement type and client preference."
  },
  {
    question: "How quickly can an engagement begin?",
    answer: "Typically within 1–2 weeks of a signed agreement, depending on the scope of work. We understand that clinical research timelines are rarely forgiving, and we prioritize rapid mobilization for urgent site needs."
  }
];
