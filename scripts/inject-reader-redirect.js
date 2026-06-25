/**
 * Inject redirection script into all chapter HTML pages so they open in the unified reader shell.
 * Run: node scripts/inject-reader-redirect.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const targets = [
  {
    dir: 'books/pmbok6',
    filter: (file) => file.endsWith('.html'),
    depth: '../../'
  },
  {
    dir: 'books/PMPExamPrep',
    filter: (file) => file.startsWith('rita_chap') && file.endsWith('.html'),
    depth: '../../'
  }
];

const redirectScript = (depth) => `<script>
  // Redirect to new unified reader shell
  (function() {
    var path = window.location.pathname;
    var matchPmbok = path.match(/books\\/pmbok6\\/(\\d+_[^\\/]+\\.html)/);
    var matchRita = path.match(/books\\/PMPExamPrep\\/(rita_chap\\d+\\.html)/);
    if (matchPmbok) {
      window.location.replace('${depth}reader.html?book=pmbok6&chap=' + matchPmbok[1].replace('.html', ''));
    } else if (matchRita) {
      window.location.replace('${depth}reader.html?book=rita&chap=' + matchRita[1].replace('.html', ''));
    }
  })();
</script>`;

let updated = 0;
let skipped = 0;

for (const target of targets) {
  const dirPath = path.join(ROOT, target.dir);
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory does not exist: ${target.dir}`);
    continue;
  }
  
  const files = fs.readdirSync(dirPath).filter(target.filter);

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if redirect script is already injected
    if (content.includes('Redirect to new unified reader shell')) {
      skipped++;
      continue;
    }

    // Insert right after <head> or before viewport meta
    const headIndex = content.indexOf('<head>');
    if (headIndex === -1) {
      console.warn(`No <head> tag found in ${target.dir}/${file}, skipping`);
      skipped++;
      continue;
    }

    const insertPosition = headIndex + 6; // right after <head>
    content = content.slice(0, insertPosition) + '\n' + redirectScript(target.depth) + content.slice(insertPosition);

    fs.writeFileSync(filePath, content, 'utf8');
    updated++;
    console.log(`✓ Injected redirect: ${target.dir}/${file}`);
  }
}

console.log(`\nRedirection Injection completed: ${updated} updated, ${skipped} skipped.`);
