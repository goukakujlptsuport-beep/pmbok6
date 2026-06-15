import 'dotenv/config'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { join } from 'path'
import { db } from './client'

const migrationsFolder = join(__dirname, '../../drizzle/migrations')

console.log('Running migrations from:', migrationsFolder)
migrate(db, { migrationsFolder })
console.log('Migrations complete ✓')
process.exit(0)
