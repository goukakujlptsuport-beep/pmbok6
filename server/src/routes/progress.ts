import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { readingProgress } from '../db/schema'
import { eq, sql } from 'drizzle-orm'

const app = new Hono()

// GET /api/progress?book=
app.get('/', async (c) => {
  const book = c.req.query('book')
  if (!book) return c.json({ error: 'book required' }, 400)

  const rows = db.select().from(readingProgress)
    .where(eq(readingProgress.book, book))
    .all()
  return c.json({ progress: rows })
})

const ProgressSchema = z.object({
  book:      z.string().min(1),
  chap:      z.string().min(1),
  status:    z.enum(['not_started', 'reading', 'done']).optional(),
  scrollPct: z.number().min(0).max(100).optional(),
  deltaS:    z.number().int().min(0).optional(),
})

// PUT /api/progress
app.put('/', zValidator('json', ProgressSchema), async (c) => {
  const body = c.req.valid('json')
  const now  = Math.floor(Date.now() / 1000)

  const set: Record<string, unknown> = { lastRead: now }
  if (body.status    !== undefined) set.status    = body.status
  if (body.scrollPct !== undefined) set.scrollPct = body.scrollPct
  if (body.deltaS    !== undefined) set.timeSpent = sql`${readingProgress.timeSpent} + ${body.deltaS}`

  db.insert(readingProgress).values({
    book:      body.book,
    chap:      body.chap,
    status:    body.status ?? 'reading',
    scrollPct: body.scrollPct ?? 0,
    timeSpent: body.deltaS ?? 0,
    lastRead:  now,
  }).onConflictDoUpdate({
    target: [readingProgress.book, readingProgress.chap],
    set,
  }).run()

  return c.json({ ok: true })
})

export default app
