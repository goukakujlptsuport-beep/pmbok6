import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import * as schema from './schema'

const dbPath = process.env.DB_PATH || join(__dirname, '../../data/pmp.db')

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')
sqlite.pragma('busy_timeout = 5000')
sqlite.pragma('synchronous = NORMAL')

export const db = drizzle(sqlite, { schema })
export { sqlite }
