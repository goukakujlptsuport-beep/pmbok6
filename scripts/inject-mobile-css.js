/**
 * Inject mobile CSS links into all book reader HTML pages.
 * Run: node scripts/inject-mobile-css.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Book pages and their relative CSS paths
const bookDirs = [
  { dir: 'books/PMPExamPrep', cssPrefix: '../../css' },
  { dir: 'books/pmbok6', cssPrefix: '../../css' },
];

const cssLinks = (prefix) => `<link rel="stylesheet" href="${prefix}/mobile-base.css">\n<link rel="stylesheet" href="${prefix}/book-reader-mobile.css">`;

let updated = 0;
let skipped = 0;

for (const { dir, cssPrefix } of bookDirs) {
  const dirPath = path.join(ROOT, dir);
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has mobile-base.css
    if (content.includes('mobile-base.css')) {
      skipped++;
      continue;
    }

    // Fix viewport
    content = content.replace(
      /content="width=device-width, initial-scale=1\.0"/,
      'content="width=device-width, initial-scale=1.0, viewport-fit=cover"'
    );

    // Inject CSS links before <style> tag
    const styleIdx = content.indexOf('<style>');
    if (styleIdx === -1) {
      console.warn(`No <style> found in ${file}, skipping`);
      skipped++;
      continue;
    }

    content = content.slice(0, styleIdx) + cssLinks(cssPrefix) + '\n' + content.slice(styleIdx);

    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`✓ ${dir}/${file}`);
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
