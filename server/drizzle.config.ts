import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'
import { join } from 'path'

config()

export default {
  schema:      './src/db/schema.ts',
  out:         './drizzle/migrations',
  dialect:     'sqlite',
  dbCredentials: {
    url: process.env.DB_PATH || join(__dirname, 'data/pmp.db'),
  },
} satisfies Config
