import 'dotenv/config'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { join } from 'path'
import { corsMiddleware } from './middleware/cors'

import highlightsRouter  from './routes/highlights'
import progressRouter    from './routes/progress'
import studyLogRouter    from './routes/study-log'
import vocabRouter       from './routes/vocab'
import questionsRouter   from './routes/questions'
import quizSessionRouter from './routes/quiz-sessions'
import statsRouter       from './routes/stats'
import kvRouter          from './routes/kv'

const app = new Hono()

app.use('*', logger())
app.use('*', corsMiddleware)

// ── Health ────────────────────────────────────────────────────────
app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }))

// ── API routes (must be before static fallback) ───────────────────
app.route('/api/highlights',    highlightsRouter)
app.route('/api/progress',      progressRouter)
app.route('/api/study-log',     studyLogRouter)
app.route('/api/vocab',         vocabRouter)
app.route('/api/questions',     questionsRouter)
app.route('/api/quiz-sessions', quizSessionRouter)
app.route('/api/stats',         statsRouter)
app.route('/api/kv',            kvRouter)

// ── Root → Library ───────────────────────────────────────────────
app.get('/', (c) => c.redirect('/home.html'))

// ── Static files (pmp/ root) ──────────────────────────────────────
// server/ is one level deep, so '../' maps to the pmp/ root
const staticRoot = join(__dirname, '../../')
app.use('/*', serveStatic({ root: staticRoot }))

// SPA fallback — serve index/home for unknown paths
app.get('*', (c) => {
  return c.redirect('/home.html')
})

// ── Start ─────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT ?? '3000', 10)
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\nPMP server running → http://localhost:${PORT}`)
  console.log(`  • API health  : http://localhost:${PORT}/api/health`)
  console.log(`  • Home        : http://localhost:${PORT}/home.html`)
  console.log(`  • Rita Ch1    : http://localhost:${PORT}/books/PMPExamPrep/rita_chap01.html`)
})

export default app
