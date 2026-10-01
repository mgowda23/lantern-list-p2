import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

const { Pool } = pg

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
}

if (!config.user || !config.password || !config.host || !config.database) {
  throw new Error('Database settings are missing. Add PGUSER, PGPASSWORD, PGHOST, PGPORT, and PGDATABASE to server/.env.')
}

const pool = new Pool(config)

export default pool
