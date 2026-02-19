import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const walk = (dir, files = []) => {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git') continue;
    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      walk(full, files);
      continue;
    }

    if (full.endsWith('.js') && full !== 'scripts/validate-js.js') {
      files.push(full);
    }
  }

  return files;
};

let hasErrors = false;
for (const file of walk('.')) {
  const result = spawnSync('node', ['--check', file], { stdio: 'pipe', encoding: 'utf8' });

  if (result.status === 0) {
    console.log(`✅ ${file}`);
    continue;
  }

  hasErrors = true;
  console.error(`❌ ${file}`);
  if (result.stderr) {
    console.error(result.stderr.trim());
  }
}

if (hasErrors) process.exit(1);
