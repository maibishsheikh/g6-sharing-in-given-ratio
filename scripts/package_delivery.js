// scripts/package_delivery.js
// Creates the downloadable clean delivery zip archive excluding node_modules, dist, and zip files.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetZip = 'ratio-sharing-main.zip';
const stagingDir = 'ratio-sharing-main';

console.log('📦 Preparing clean delivery package...');

if (fs.existsSync(stagingDir)) {
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
if (fs.existsSync(targetZip)) {
  fs.rmSync(targetZip, { force: true });
}

fs.mkdirSync(stagingDir, { recursive: true });

const copyItems = [
  'public',
  'scripts',
  'src',
  'index.html',
  'package.json',
  'package-lock.json',
  'postcss.config.js',
  'tailwind.config.js',
  'vercel.json',
  'vite.config.js',
  '.oxlintrc.json',
  '.gitignore',
  '.env.local.example',
  'README.md',
];

for (const item of copyItems) {
  const srcPath = path.join(process.cwd(), item);
  const destPath = path.join(stagingDir, item);
  if (fs.existsSync(srcPath)) {
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
    console.log(`  + Added: ${item}`);
  }
}

// Create zip using PowerShell Compress-Archive
console.log(`\nCompressing ${stagingDir} into ${targetZip}...`);
execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${stagingDir}' -DestinationPath '${targetZip}' -Force"`);

// Clean staging dir
fs.rmSync(stagingDir, { recursive: true, force: true });

const zipStats = fs.statSync(targetZip);
console.log(`\n🎉 Created ${targetZip} (${(zipStats.size / 1024 / 1024).toFixed(2)} MB) successfully!`);

