import 'dotenv/config'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { db } from './client'
import { vocabTerms, questions } from './schema'

const ROOT = join(__dirname, '../../../')

// ── VOCAB TERMS ───────────────────────────────────────────────────
const vocabPath = join(ROOT, 'lib/vocab-terms.js')
const vocabSrc  = readFileSync(vocabPath, 'utf8')

// Extract TERMS array by providing a mock window object
const mockWindow: Record<string, unknown> = {}
const wrappedCode = vocabSrc
  .replace('window.PMVocabTerms = TERMS', 'mockWindow.PMVocabTerms = TERMS')
  .replace('(function () {', '(function (mockWindow) {')
  .replace('})();', '})(mockWindow);')

// eslint-disable-next-line no-new-func
new Function('mockWindow', wrappedCode.slice(wrappedCode.indexOf('(function')))(mockWindow)

interface VocabTerm { vi: string; en: string; cat: string; desc: string; example: string }
const terms = (mockWindow.PMVocabTerms as VocabTerm[]) || []

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').slice(0, 80)
}

const seen = new Set<string>()
let vocabCount = 0

for (const t of terms) {
  let id = slugify(t.en)
  // Dedup slugs
  if (seen.has(id)) { let n = 2; while (seen.has(`${id}-${n}`)) n++; id = `${id}-${n}` }
  seen.add(id)

  db.insert(vocabTerms).values({
    id,
    en:        t.en,
    vi:        t.vi,
    descVi:    t.desc    || null,
    exampleVi: t.example || null,
    category:  t.cat     || null,
    difficulty: 3,
  }).onConflictDoNothing().run()
  vocabCount++
}
console.log(`Vocab: seeded ${vocabCount} terms ✓`)

// ── QUESTIONS ────────────────────────────────────────────────────
const quizDir = join(ROOT, 'books/pmbok6/quiz/rita')
let qCount = 0

if (existsSync(quizDir)) {
  const files = readdirSync(quizDir).filter(f => f.endsWith('.json'))

  for (const file of files) {
    const data = JSON.parse(readFileSync(join(quizDir, file), 'utf8'))
    const chap = String(data.chapterNum).padStart(2, '0')

    for (const q of (data.questions || [])) {
      db.insert(questions).values({
        id:        q.id,
        source:    'rita',
        chap,
        type:      'mc',
        question:  q.q,
        options:   q.opts ? JSON.stringify(q.opts) : null,
        answer:    q.ans,
        explainVi: q.exp  || null,
        createdAt: Math.floor(Date.now() / 1000),
      }).onConflictDoNothing().run()
      qCount++
    }
  }
}
console.log(`Questions: seeded ${qCount} questions ✓`)
process.exit(0)
