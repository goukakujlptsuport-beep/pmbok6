import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { studyLog } from '../db/schema'
import { sql } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const app = new Hono()

// GET /api/study-log?days=30
app.get('/', async (c) => {
  const days = parseInt(c.req.query('days') ?? '30', 10)
  const cutoff = Math.floor(Date.now() / 1000) - days * 86400

  const rows = db.select().from(studyLog)
    .where(sql`${studyLog.createdAt} >= ${cutoff}`)
    .all()
  return c.json({ log: rows })
})

// GET /api/study-log/streak
app.get('/streak', async (c) => {
  const rows = db.select({ localDate: studyLog.localDate })
    .from(studyLog)
    .groupBy(studyLog.localDate)
    .orderBy(sql`${studyLog.localDate} DESC`)
    .all()

  const dates = rows.map(r => r.localDate)
  let streak = 0
  const today = new Date().toISOString().slice(0, 10)

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    if (dates[i] === expected) streak++
    else break
  }

  return c.json({ streak, today })
})

const LogSchema = z.object({
  type:      z.string().min(1),
  book:      z.string().optional(),
  chap:      z.string().optional(),
  durationS: z.number().int().min(0),
  localDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

// POST /api/study-log
app.post('/', zValidator('json', LogSchema), async (c) => {
  const body = c.req.valid('json')
  const now  = Math.floor(Date.now() / 1000)
  const id   = randomUUID()

  db.insert(studyLog).values({
    id,
    type:      body.type,
    book:      body.book ?? null,
    chap:      body.chap ?? null,
    durationS: body.durationS,
    localDate: body.localDate,
    createdAt: now,
  }).run()

  return c.json({ ok: true, id }, 201)
})

export default app
