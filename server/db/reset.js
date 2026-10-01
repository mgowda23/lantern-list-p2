import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')

try {
  await pool.query(schema)
  await pool.query(seed)
  const { rows } = await pool.query(
    'SELECT id, slug, name, city, region FROM markets ORDER BY id',
  )
  console.log(`Seeded ${rows.length} markets`)
  console.table(rows)
} catch (error) {
  console.error('Failed to reset the markets table')
  console.error(error)
  process.exitCode = 1
} finally {
  await pool.end()
}
