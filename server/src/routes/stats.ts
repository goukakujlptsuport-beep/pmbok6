import { Hono } from 'hono'
import { db } from '../db/client'
import { questionStats, srsCards, vocabTerms, quizSessions, highlights, readingProgress } from '../db/schema'
import { sql, eq, lte } from 'drizzle-orm'

const app = new Hono()

// GET /api/stats/summary
app.get('/summary', async (c) => {
  const now = Math.floor(Date.now() / 1000)

  const [totalQs]      = db.select({ n: sql<number>`count(*)` }).from(questionStats).all()
  const [correctQs]    = db.select({ n: sql<number>`count(*)` }).from(questionStats).where(eq(questionStats.correct, 1)).all()
  const [sessions]     = db.select({ n: sql<number>`count(*)` }).from(quizSessions).all()
  const [hlCount]      = db.select({ n: sql<number>`count(*)` }).from(highlights).all()
  const [chapDone]     = db.select({ n: sql<number>`count(*)` }).from(readingProgress).where(eq(readingProgress.status, 'done')).all()
  const [srsTotal]     = db.select({ n: sql<number>`count(*)` }).from(srsCards).where(eq(srsCards.itemType, 'vocab')).all()
  const [srsDue]       = db.select({ n: sql<number>`count(*)` }).from(srsCards).where(sql`${srsCards.itemType} = 'vocab' AND ${srsCards.nextReview} <= ${now}`).all()
  const [vocabTotal]   = db.select({ n: sql<number>`count(*)` }).from(vocabTerms).all()

  return c.json({
    questions: {
      total:   totalQs.n,
      correct: correctQs.n,
      pct:     totalQs.n > 0 ? Math.round(correctQs.n / totalQs.n * 100) : 0,
    },
    sessions: sessions.n,
    highlights: hlCount.n,
    reading: { chapsDone: chapDone.n },
    vocab: {
      total:     vocabTotal.n,
      srsActive: srsTotal.n,
      srsDue:    srsDue.n,
    },
  })
})

export default app
