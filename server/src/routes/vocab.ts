import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { vocabTerms, srsCards } from '../db/schema'
import { eq, sql, and, lte } from 'drizzle-orm'

const app = new Hono()

// GET /api/vocab?cat=&limit=50
app.get('/', async (c) => {
  const cat   = c.req.query('cat')
  const limit = Math.min(parseInt(c.req.query('limit') ?? '50', 10), 200)

  const rows = cat
    ? db.select().from(vocabTerms).where(eq(vocabTerms.category, cat)).limit(limit).all()
    : db.select().from(vocabTerms).limit(limit).all()

  return c.json({ terms: rows, total: rows.length })
})

// GET /api/vocab/srs/due?limit=20
app.get('/srs/due', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100)
  const now   = Math.floor(Date.now() / 1000)

  const dueCards = db.select().from(srsCards)
    .where(and(eq(srsCards.itemType, 'vocab'), lte(srsCards.nextReview, now)))
    .limit(limit)
    .all()

  if (!dueCards.length) return c.json({ cards: [] })

  const ids = dueCards.map(c => c.itemId)
  const terms = db.select().from(vocabTerms)
    .where(sql`${vocabTerms.id} IN (${sql.join(ids.map(id => sql`${id}`), sql`, `)})`)
    .all()

  const termMap = new Map(terms.map(t => [t.id, t]))
  const cards = dueCards
    .map(card => ({ srs: card, term: termMap.get(card.itemId) }))
    .filter(c => c.term)

  return c.json({ cards })
})

// SM-2 algorithm
function sm2(ease: number, interval: number, reps: number, score: number) {
  if (score < 3) {
    return { ease, interval: 1, repetitions: 0 }
  }
  const newEase = Math.max(1.3, ease + 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02))
  let newInterval: number
  if (reps === 0)      newInterval = 1
  else if (reps === 1) newInterval = 6
  else                 newInterval = Math.round(interval * newEase)
  return { ease: newEase, interval: newInterval, repetitions: reps + 1 }
}

const ReviewSchema = z.object({
  itemId: z.string().min(1),
  score:  z.number().int().min(0).max(5),
})

// POST /api/vocab/srs/review
app.post('/srs/review', zValidator('json', ReviewSchema), async (c) => {
  const { itemId, score } = c.req.valid('json')
  const now = Math.floor(Date.now() / 1000)

  const existing = db.select().from(srsCards).where(eq(srsCards.itemId, itemId)).get()
  const prev = existing ?? { ease: 2.5, interval: 1, repetitions: 0 }

  const next = sm2(prev.ease!, prev.interval!, prev.repetitions!, score)
  const nextReview = now + next.interval * 86400

  db.insert(srsCards).values({
    itemId,
    itemType:    'vocab',
    ease:        next.ease,
    interval:    next.interval,
    repetitions: next.repetitions,
    nextReview,
    lastScore:   score,
    updatedAt:   now,
  }).onConflictDoUpdate({
    target: srsCards.itemId,
    set: {
      ease:        next.ease,
      interval:    next.interval,
      repetitions: next.repetitions,
      nextReview,
      lastScore:   score,
      updatedAt:   now,
    },
  }).run()

  return c.json({ ok: true, nextReview, interval: next.interval })
})

export default app
