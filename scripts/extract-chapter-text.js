#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const CHAPTERS_DIR = path.join(__dirname, '../chapters');
const OUTPUT_DIR = path.join(__dirname, '../chapters-text');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all chapter files
const chapterFiles = fs.readdirSync(CHAPTERS_DIR)
  .filter(f => f.endsWith('.html'))
  .sort();

console.log(`Found ${chapterFiles.length} chapters to process\n`);

chapterFiles.forEach(filename => {
  const filepath = path.join(CHAPTERS_DIR, filename);
  const chapterName = filename.replace('.html', '');

  try {
    const htmlContent = fs.readFileSync(filepath, 'utf-8');
    const dom = new JSDOM(htmlContent);
    const doc = dom.window.document;

    // Extract all text nodes from body
    const bodyText = doc.body.textContent || '';

    // Clean up: normalize whitespace, remove excessive newlines
    const cleanText = bodyText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');

    // Write text file
    const textFilepath = path.join(OUTPUT_DIR, `${chapterName}.txt`);
    fs.writeFileSync(textFilepath, cleanText, 'utf-8');

    // Count sentences as rough estimate
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Write metadata file
    const metadata = {
      chapter: chapterName,
      totalSentences: sentences.length,
      textLength: cleanText.length,
      wordCount: cleanText.split(/\s+/).length
    };

    const metadataFilepath = path.join(OUTPUT_DIR, `${chapterName}.metadata.json`);
    fs.writeFileSync(metadataFilepath, JSON.stringify(metadata, null, 2), 'utf-8');

    console.log(`✓ ${chapterName}: ${sentences.length} sentences, ${cleanText.length} chars`);
  } catch (err) {
    console.error(`✗ ${chapterName}: ${err.message}`);
  }
});

console.log(`\n✓ Text extraction complete. Files saved to ${OUTPUT_DIR}`);
