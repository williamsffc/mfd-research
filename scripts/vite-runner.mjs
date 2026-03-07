import { spawnSync } from 'node:child_process';

const viteArgs = process.argv.slice(2);

if (viteArgs.length === 0) {
  console.error('Usage: node scripts/vite-runner.mjs <vite-args...>');
  process.exit(1);
}

const result = spawnSync(
  'npm',
  ['exec', '--yes', '--package=vite@5.4.11', '--', 'vite', ...viteArgs],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
