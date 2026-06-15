import { Hono } from 'hono'
import { db } from '../db/client'
import { questions } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'

const app = new Hono()

// GET /api/questions?source=rita&chap=01&limit=20
app.get('/', async (c) => {
  const source = c.req.query('source')
  const chap   = c.req.query('chap')
  const limit  = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100)

  let rows
  if (source && chap) {
    rows = db.select().from(questions)
      .where(and(eq(questions.source, source), eq(questions.chap, chap)))
      .limit(limit).all()
  } else if (source) {
    rows = db.select().from(questions)
      .where(eq(questions.source, source))
      .limit(limit).all()
  } else {
    rows = db.select().from(questions).limit(limit).all()
  }

  return c.json({ questions: rows, total: rows.length })
})

// GET /api/questions/random?source=rita&chap=01&n=10
app.get('/random', async (c) => {
  const source = c.req.query('source')
  const chap   = c.req.query('chap')
  const n      = Math.min(parseInt(c.req.query('n') ?? '10', 10), 50)

  let rows
  if (source && chap) {
    rows = db.select().from(questions)
      .where(and(eq(questions.source, source), eq(questions.chap, chap)))
      .orderBy(sql`RANDOM()`).limit(n).all()
  } else if (source) {
    rows = db.select().from(questions)
      .where(eq(questions.source, source))
      .orderBy(sql`RANDOM()`).limit(n).all()
  } else {
    rows = db.select().from(questions).orderBy(sql`RANDOM()`).limit(n).all()
  }

  return c.json({ questions: rows })
})

// GET /api/questions/:id
app.get('/:id', async (c) => {
  const id  = c.req.param('id')
  const row = db.select().from(questions).where(eq(questions.id, id)).get()
  if (!row) return c.json({ error: 'not found' }, 404)
  return c.json(row)
})

export default app
