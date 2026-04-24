#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const distRoot = join(repoRoot, 'dist');

const pagePaths = [
  'index.html',
  join('privacy-policy', 'index.html'),
  join('terms-of-service', 'index.html'),
];

const sourceFiles = {
  style: join(repoRoot, 'public', 'style.css'),
  script: join(repoRoot, 'public', 'script.js'),
  homeSource: join(repoRoot, 'src', 'pages', 'index.astro'),
  privacySource: join(repoRoot, 'src', 'pages', 'privacy-policy', 'index.astro'),
  termsSource: join(repoRoot, 'src', 'pages', 'terms-of-service', 'index.astro'),
};

const failures = [];
const warnings = [];
let passCount = 0;

function record(result, message) {
  if (result) {
    console.log(`✅ ${message}`);
    passCount++;
    return;
  }

  failures.push(message);
  console.log(`❌ ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.log(`⚠️  ${message}`);
}

function readFile(path) {
  return readFileSync(path, 'utf-8');
}

console.log('\n🔍 Running frontend verification...\n');

record(existsSync(distRoot), 'Built output directory exists');

const builtPages = new Map();
for (const relativePath of pagePaths) {
  const absolutePath = join(distRoot, relativePath);
  const exists = existsSync(absolutePath);
  record(exists, `Built page exists: ${relativePath}`);
  if (exists) {
    builtPages.set(relativePath, readFile(absolutePath));
  }
}

const styleSource = readFile(sourceFiles.style);
const scriptSource = readFile(sourceFiles.script);
const homeSource = readFile(sourceFiles.homeSource);
const privacySource = readFile(sourceFiles.privacySource);
const termsSource = readFile(sourceFiles.termsSource);
const homeHtml = builtPages.get('index.html') ?? '';
const privacyHtml = builtPages.get(join('privacy-policy', 'index.html')) ?? '';
const termsHtml = builtPages.get(join('terms-of-service', 'index.html')) ?? '';

console.log('\nHomepage checks:\n');
record(/<html[^>]+lang=/.test(homeHtml), 'Home page includes a lang attribute');
record(homeHtml.includes('name="viewport"'), 'Home page includes viewport metadata');
record(homeHtml.includes('class="skip-link"'), 'Home page includes a skip link');
record(homeHtml.includes('<nav'), 'Home page renders navigation');
record(homeHtml.includes('<main id="main-content"'), 'Home page renders a main landmark');
record(homeHtml.includes('<footer>'), 'Home page renders a footer landmark');
record(homeHtml.includes('id="contact-status"') && homeHtml.includes('aria-live="polite"'), 'Home page includes a live region for form status');
record(!homeHtml.includes('role="tooltip"'), 'Home page no longer ships decorative tooltip roles');
record(!/service-card[^"]*tabindex/.test(homeHtml), 'Service cards are no longer keyboard-trap divs');

console.log('\nLegal page checks:\n');
record(privacyHtml.includes('class="legal-page wrap"'), 'Privacy page uses shared legal layout classes');
record(termsHtml.includes('class="legal-page wrap"'), 'Terms page uses shared legal layout classes');
record(!privacySource.includes('<style>'), 'Privacy page no longer duplicates inline layout styles');
record(!termsSource.includes('<style>'), 'Terms page no longer duplicates inline layout styles');
record(privacyHtml.includes('fonts.googleapis.com') && termsHtml.includes('fonts.googleapis.com'), 'Legal pages inherit the shared font stack');

console.log('\nSource checks:\n');
record(!styleSource.includes('transition: all'), 'Shipped stylesheet avoids transition: all');
record(styleSource.includes('.service-card.flipped'), 'Shipped stylesheet includes the service-card flip state');
record(!styleSource.includes('.tag-tooltip'), 'Shipped stylesheet no longer contains tooltip-only chip styling');
record(!scriptSource.includes('setupServiceCardKeyboard'), 'Shipped script no longer contains faux button keyboard handlers for service cards');
record(scriptSource.includes('setupServiceCardFlip'), 'Shipped script includes managed service-card flip behavior');
record(scriptSource.includes("aria-invalid") && scriptSource.includes('contact-status'), 'Form script manages accessible error and status states');
record(homeSource.includes('Select a service…'), 'Form placeholder copy uses a typographic ellipsis');

if (homeHtml.includes('name="access_key" value=""')) {
  warn('Web3Forms access key is empty in the current build; submissions will fail until PUBLIC_WEB3FORMS_ACCESS_KEY is set.');
}

console.log('\n' + '─'.repeat(50));
console.log(`\nResults: ${passCount} passed, ${failures.length} failed, ${warnings.length} warning(s)\n`);

if (failures.length > 0) {
  console.log('Failed checks:');
  for (const failure of failures) {
    console.log(` - ${failure}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('Warnings:');
  for (const warning of warnings) {
    console.log(` - ${warning}`);
  }
  console.log('');
}

console.log('Frontend verification passed.\n');
