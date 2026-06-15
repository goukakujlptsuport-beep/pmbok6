import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { quizSessions, questionStats } from '../db/schema'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const app = new Hono()

// GET /api/quiz-sessions?limit=20
app.get('/', async (c) => {
  const limit = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 100)
  const rows  = db.select().from(quizSessions)
    .orderBy(desc(quizSessions.startedAt))
    .limit(limit).all()
  return c.json({ sessions: rows })
})

const SessionStartSchema = z.object({
  mode:   z.string().min(1),
  source: z.string().optional(),
  chap:   z.string().optional(),
  total:  z.number().int().min(1),
})

// POST /api/quiz-sessions
app.post('/', zValidator('json', SessionStartSchema), async (c) => {
  const body = c.req.valid('json')
  const now  = Math.floor(Date.now() / 1000)
  const id   = randomUUID()

  db.insert(quizSessions).values({
    id,
    mode:      body.mode,
    source:    body.source ?? null,
    chap:      body.chap   ?? null,
    total:     body.total,
    correct:   0,
    startedAt: now,
  }).run()

  return c.json({ ok: true, id }, 201)
})

const AnswerSchema = z.object({
  questionId: z.string().min(1),
  correct:    z.boolean(),
  timeMs:     z.number().int().optional(),
})

// POST /api/quiz-sessions/:id/answers
app.post('/:id/answers', zValidator('json', AnswerSchema), async (c) => {
  const sessionId = c.req.param('id')
  const body      = c.req.valid('json')
  const now       = Math.floor(Date.now() / 1000)

  const session = db.select().from(quizSessions).where(eq(quizSessions.id, sessionId)).get()
  if (!session) return c.json({ error: 'session not found' }, 404)

  db.insert(questionStats).values({
    id:         randomUUID(),
    questionId: body.questionId,
    sessionId,
    answeredAt: now,
    correct:    body.correct ? 1 : 0,
    timeMs:     body.timeMs ?? null,
  }).run()

  if (body.correct) {
    db.update(quizSessions)
      .set({ correct: session.correct + 1 })
      .where(eq(quizSessions.id, sessionId))
      .run()
  }

  return c.json({ ok: true })
})

const FinishSchema = z.object({ durationS: z.number().int().optional() })

// PUT /api/quiz-sessions/:id/finish
app.put('/:id/finish', zValidator('json', FinishSchema), async (c) => {
  const sessionId = c.req.param('id')
  const body      = c.req.valid('json')
  const now       = Math.floor(Date.now() / 1000)

  db.update(quizSessions)
    .set({ finishedAt: now, durationS: body.durationS ?? null })
    .where(eq(quizSessions.id, sessionId))
    .run()

  const session = db.select().from(quizSessions).where(eq(quizSessions.id, sessionId)).get()
  return c.json({ ok: true, session })
})

export default app
