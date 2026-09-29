/**
 * The site as Markdown for AI assistants and agents, built from the same content/*.json
 * files as the homepage, so it updates with every content change and weekly rebuild.
 *
 * Used by /llms.txt (https://llmstxt.org) and /index.md, which the Worker in worker/index.js
 * serves for requests to / that ask for `Accept: text/markdown`.
 */
import {
  about,
  conferences,
  credentials,
  engagementProcess,
  experience,
  faq,
  formatConferenceDate,
  services,
  site,
  specialties,
  why,
  yearsExperience,
} from './content';

const ORIGIN = 'https://mfdresearch.com';

/** One line per list item; collapses stray whitespace from multi-line content. */
const line = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * The llms.txt format reads every `##` section as a list of links, and allows no headings
 * in the summary before the first one. So content sections are bold-labelled paragraphs,
 * and the only `##` section is the page list at the end.
 */
const label = (title: string) => `**${line(title)}**`;

/** The homepage as Markdown: served as /llms.txt and as /index.md (Markdown for agents). */
export function homeMarkdown(): string {
  const out: string[] = [];
  const push = (...lines: string[]) => out.push(...lines);

  push(`# MFD Research`, '');
  push(`> ${line(site.description)}`, '');
  push(
    ...about.paragraphs.map(line).flatMap((p) => [p, '']),
    `- Legal name: MFD Research Group LLC`,
    `- Founder & Principal: Michael Delgado, CCRC (${yearsExperience}+ years in clinical research)`,
    `- Based in California; serves sponsors, CROs, biotech organizations and research sites across the United States, remotely or on-site`,
    `- Email: ${site.email}`,
    `- Book a confidential consultation: ${site.bookingUrl}`,
    `- LinkedIn: ${site.linkedinUrl}`,
    `- Website: ${ORIGIN}/`,
    '',
  );

  push(label(services.title), '');
  for (const item of services.items) push(`- **${line(item.title)}**: ${line(item.description)}`);
  push('');

  push(label(engagementProcess.title), '');
  engagementProcess.steps.forEach((step, i) => push(`${i + 1}. **${line(step.title)}**: ${line(step.description)}`));
  push('');

  push(label(why.title), '');
  for (const card of why.cards) push(`- **${line(card.title)}**: ${line(card.description)}`);
  push('');

  push(label(specialties.title), '');
  for (const group of specialties.groups) push(`- **${line(group.name)}**: ${group.tags.map(line).join(', ')}`);
  push('');

  push(label(experience.title), '');
  for (const role of experience.roles) {
    const years = `${role.startYear}–${role.endYear ?? 'present'}`;
    push(`- **${line(role.title)}**, ${line(role.organization)} (${years}): ${line(role.summary)}`);
  }
  push('');

  push(label(credentials.title), '');
  for (const column of credentials.columns) {
    for (const item of column.items) push(`- ${line(item.description)} (${item.year})`);
  }
  push('');

  push(label(conferences.title), '');
  const events = [conferences.featured, ...conferences.past].filter(Boolean);
  for (const event of events) {
    push(`- ${line(event.name)}: ${formatConferenceDate(event)}, ${line(event.location)} (${event.status})`);
  }
  push('');

  push(label(faq.title), '');
  for (const item of faq.questions) push(`- **${line(item.question)}** ${line(item.answer)}`);
  push('');

  push(`## Pages`, '');
  push(
    `- [Home](${ORIGIN}/): services, experience, credentials, conferences, FAQ and contact`,
    `- [Privacy Policy](${ORIGIN}/privacy-policy/index.md): how website inquiries are handled (Markdown; web page at ${ORIGIN}/privacy-policy/)`,
    `- [Terms of Service](${ORIGIN}/terms-of-service/index.md): terms for using the website (Markdown; web page at ${ORIGIN}/terms-of-service/)`,
    '',
  );

  return out.join('\n');
}
