import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { highlights } from '../db/schema'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const app = new Hono()

// GET /api/highlights?book=&chap=
app.get('/', async (c) => {
  const book = c.req.query('book')
  const chap = c.req.query('chap')
  if (!book || !chap) return c.json({ error: 'book and chap required' }, 400)

  const rows = db.select().from(highlights)
    .where(and(eq(highlights.book, book), eq(highlights.chap, chap)))
    .all()
  return c.json({ highlights: rows })
})

const HlSchema = z.object({
  id:        z.string().min(1).optional(),
  book:      z.string().min(1),
  chap:      z.string().min(1),
  color:     z.string().min(1),
  note:      z.string().nullable().optional(),
  text:      z.string().nullable().optional(),
  sxp:       z.string().min(1),
  so:        z.number().int(),
  exp:       z.string().min(1),
  eo:        z.number().int(),
})

// PUT /api/highlights — upsert one highlight
app.put('/', zValidator('json', HlSchema), async (c) => {
  const body = c.req.valid('json')
  const now  = Math.floor(Date.now() / 1000)
  const id   = body.id ?? randomUUID()

  db.insert(highlights).values({
    id,
    book:      body.book,
    chap:      body.chap,
    color:     body.color,
    note:      body.note ?? null,
    hlText:    body.text ?? null,
    sxp:       body.sxp,
    so:        body.so,
    exp:       body.exp,
    eo:        body.eo,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: [highlights.book, highlights.chap, highlights.sxp, highlights.so, highlights.exp, highlights.eo],
    set: {
      color:     body.color,
      note:      body.note ?? null,
      hlText:    body.text ?? null,
      updatedAt: now,
    },
  }).run()

  return c.json({ ok: true, id })
})

// DELETE /api/highlights/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  db.delete(highlights).where(eq(highlights.id, id)).run()
  return c.json({ ok: true })
})

export default app
