import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db/client'
import { kvStore } from '../db/schema'
import { eq } from 'drizzle-orm'

const app = new Hono()

// GET /api/kv/:key
app.get('/:key', async (c) => {
  const key = c.req.param('key')
  const row = db.select().from(kvStore).where(eq(kvStore.key, key)).get()
  if (!row) return c.json({ error: 'not found' }, 404)
  return c.json({ key: row.key, value: row.value })
})

const KVSchema = z.object({ value: z.string() })

// PUT /api/kv/:key
app.put('/:key', zValidator('json', KVSchema), async (c) => {
  const key  = c.req.param('key')
  const { value } = c.req.valid('json')
  const now  = Math.floor(Date.now() / 1000)

  db.insert(kvStore).values({ key, value, updatedAt: now })
    .onConflictDoUpdate({ target: kvStore.key, set: { value, updatedAt: now } })
    .run()

  return c.json({ ok: true })
})

export default app
