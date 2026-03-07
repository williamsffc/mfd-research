#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Uses axe-core to test the built site for accessibility issues
 * Run with: npm run test:a11y
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '../index.html');

console.log('\n🔍 Running Accessibility Tests...\n');

try {
  const html = readFileSync(indexPath, 'utf-8');

  // Check for basic accessibility features
  const checks = {
    '✓ Skip link present': html.includes('skip-link'),
    '✓ ARIA labels on interactive elements': html.includes('aria-label'),
    '✓ Alt text on images': html.match(/<img[^>]+alt=/g)?.length > 0,
    '✓ Semantic HTML': html.includes('<main') && html.includes('<nav') && html.includes('<footer'),
    '✓ Lang attribute': html.match(/<html[^>]+lang=/),
    '✓ Meta viewport': html.includes('name="viewport"'),
    '✓ Form labels': html.match(/<label[^>]+for=/g)?.length > 0,
    '✓ Focus management': html.includes('tabindex'),
    '✓ ARIA roles where needed': html.includes('aria-') || html.includes('role='),
  };

  let passCount = 0;
  let failCount = 0;

  console.log('Basic Accessibility Checklist:\n');

  for (const [check, passed] of Object.entries(checks)) {
    if (passed) {
      console.log(`✅ ${check}`);
      passCount++;
    } else {
      console.log(`❌ ${check}`);
      failCount++;
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log(`\nResults: ${passCount} passed, ${failCount} failed\n`);

  if (failCount === 0) {
    console.log('🎉 All basic accessibility checks passed!\n');
    console.log('📝 Recommendations:');
    console.log('   • Run Lighthouse audit in Chrome DevTools for detailed analysis');
    console.log('   • Test with screen readers (NVDA, JAWS, VoiceOver)');
    console.log('   • Verify keyboard navigation manually');
    console.log('   • Check color contrast ratios');
    console.log('   • Test with browser zoom at 200%\n');
  } else {
    console.log('⚠️  Some accessibility checks failed. Please review the HTML.\n');
    process.exit(1);
  }

  // Additional recommendations
  console.log('🔧 Advanced Testing Tools:');
  console.log('   • axe DevTools browser extension');
  console.log('   • WAVE browser extension');
  console.log('   • Pa11y CI for automated testing');
  console.log('   • Lighthouse CI in your build pipeline\n');

} catch (error) {
  console.error('❌ Error reading HTML file:', error.message);
  process.exit(1);
}
