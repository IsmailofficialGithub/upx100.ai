/**
 * Applies public.commissions DDL + seed from app/migrations/11_commissions.sql.
 *
 * Requires a Postgres connection string (Supabase: Project Settings → Database → URI).
 * Add to Backend/.env:
 *   DATABASE_URL=postgresql://postgres.[ref]:[password]@...pooler.supabase.com:6543/postgres
 *
 * Run from repo root or Backend:
 *   cd Backend && npm run db:commissions
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const url = process.env.DATABASE_URL || process.env.DIRECT_URL
if (!url) {
  console.error('Missing DATABASE_URL or DIRECT_URL in Backend/.env')
  console.error('Alternatively, paste the contents of app/migrations/11_commissions.sql into the Supabase SQL Editor.')
  process.exit(1)
}

const sqlPath = path.join(__dirname, '../app/migrations/11_commissions.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')

import pg from 'pg'

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await client.connect()
try {
  await client.query(sql)
  console.log('Done: ran app/migrations/11_commissions.sql (table + indexes + seed).')
} finally {
  await client.end()
}
