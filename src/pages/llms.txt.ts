/**
 * /llms.txt: a plain-text (Markdown) summary of the site for AI assistants and answer
 * engines (ChatGPT, Claude, Perplexity, Gemini…), following https://llmstxt.org.
 *
 * Built from the same content/*.json files as the homepage, so it updates with every
 * content change and every weekly rebuild. Nothing here is edited by hand.
 */
import type { APIRoute } from 'astro';
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
} from '../data/content';

const ORIGIN = 'https://mfdresearch.com';

/** One line per list item; collapses stray whitespace from multi-line content. */
const line = (text: string) => text.replace(/\s+/g, ' ').trim();

function build(): string {
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

  push(`## ${services.title}`, '');
  for (const item of services.items) push(`- **${line(item.title)}**: ${line(item.description)}`);
  push('');

  push(`## ${engagementProcess.title}`, '');
  engagementProcess.steps.forEach((step, i) => push(`${i + 1}. **${line(step.title)}**: ${line(step.description)}`));
  push('');

  push(`## ${why.title}`, '');
  for (const card of why.cards) push(`- **${line(card.title)}**: ${line(card.description)}`);
  push('');

  push(`## ${specialties.title}`, '');
  for (const group of specialties.groups) push(`- **${line(group.name)}**: ${group.tags.map(line).join(', ')}`);
  push('');

  push(`## ${experience.title}`, '');
  for (const role of experience.roles) {
    const years = `${role.startYear}–${role.endYear ?? 'present'}`;
    push(`- **${line(role.title)}**, ${line(role.organization)} (${years}): ${line(role.summary)}`);
  }
  push('');

  push(`## ${credentials.title}`, '');
  for (const column of credentials.columns) {
    for (const item of column.items) push(`- ${line(item.description)} (${item.year})`);
  }
  push('');

  push(`## ${conferences.title}`, '');
  const events = [conferences.featured, ...conferences.past].filter(Boolean);
  for (const event of events) {
    push(`- ${line(event.name)}: ${formatConferenceDate(event)}, ${line(event.location)} (${event.status})`);
  }
  push('');

  push(`## ${faq.title}`, '');
  for (const item of faq.questions) push(`### ${line(item.question)}`, '', line(item.answer), '');

  push(`## Pages`, '');
  push(
    `- [Home](${ORIGIN}/): services, experience, credentials, conferences, FAQ and contact`,
    `- [Privacy Policy](${ORIGIN}/privacy-policy/)`,
    `- [Terms of Service](${ORIGIN}/terms-of-service/)`,
    '',
  );

  return out.join('\n');
}

export const GET: APIRoute = () =>
  new Response(build(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
