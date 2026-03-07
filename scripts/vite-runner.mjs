import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

const VITE_VERSION = '5.4.11';
const runtimeDir = path.resolve('.vite-runtime');
const viteRoot = path.join(runtimeDir, 'node_modules', 'vite');
const viteBin = path.join(viteRoot, 'bin', 'vite.js');
const viteCli = path.join(viteRoot, 'dist', 'node', 'cli.js');

const viteArgs = process.argv.slice(2);

if (viteArgs.length === 0) {
  console.error('Usage: node scripts/vite-runner.mjs <vite-args...>');
  process.exit(1);
}

function exitIfFailed(result) {
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function hasHealthyViteInstall() {
  if (!existsSync(viteBin) || !existsSync(viteCli)) return false;

  try {
    const cliSource = readFileSync(viteCli, 'utf8');
    const chunkMatch = cliSource.match(/['"]\.\/chunks\/(dep-[^'"]+\.js)['"]/);
    if (!chunkMatch) return false;

    const requiredChunk = path.join(viteRoot, 'dist', 'node', 'chunks', chunkMatch[1]);
    return existsSync(requiredChunk);
  } catch {
    return false;
  }
}

function installFreshVite() {
  const install = spawnSync(
    'npm',
    ['install', '--no-save', '--prefix', runtimeDir, `vite@${VITE_VERSION}`],
    { stdio: 'inherit' }
  );
  exitIfFailed(install);
}

if (!hasHealthyViteInstall()) {
  rmSync(path.join(runtimeDir, 'node_modules'), { recursive: true, force: true });
  installFreshVite();

  if (!hasHealthyViteInstall()) {
    console.error('Vite runtime is still corrupted after reinstall.');
    process.exit(1);
  }
}

const runVite = spawnSync(process.execPath, [viteBin, ...viteArgs], { stdio: 'inherit' });

if (runVite.error) {
  console.error(runVite.error.message);
  process.exit(1);
}

process.exit(runVite.status ?? 1);
