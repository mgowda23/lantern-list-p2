import { Router } from 'express'
import pool from '../config/db.js'

const router = Router()

const columns = `
  id, slug, name, city, region, specialty, hours,
  price_range, best_for, vibe, description,
  image, image_alt, photo_credit
`

function readParam(value) {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return ''
  return raw.trim().slice(0, 80).replace(/[%_]/g, '')
}

function toMarket(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    region: row.region,
    specialty: row.specialty,
    hours: row.hours,
    priceRange: row.price_range,
    bestFor: row.best_for,
    vibe: row.vibe,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    photoCredit: row.photo_credit,
  }
}

router.get('/', async (req, res) => {
  const region = readParam(req.query.region) || null
  const specialty = readParam(req.query.specialty) || null

  try {
    const marketsResult = await pool.query(
      `SELECT ${columns}
       FROM markets
       WHERE ($1::text IS NULL OR region ILIKE $1)
         AND ($2::text IS NULL OR specialty ILIKE '%' || $2 || '%')
       ORDER BY id`,
      [region, specialty],
    )
    const regionsResult = await pool.query(
      'SELECT DISTINCT region FROM markets ORDER BY region',
    )
    const totalResult = await pool.query('SELECT COUNT(*)::int AS total FROM markets')

    res.json({
      markets: marketsResult.rows.map(toMarket),
      regions: regionsResult.rows.map((row) => row.region),
      total: totalResult.rows[0].total,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load markets' })
  }
})

router.get('/:slug', async (req, res) => {
  const slug = readParam(req.params.slug)

  try {
    const result = await pool.query(
      `SELECT ${columns} FROM markets WHERE slug = $1`,
      [slug],
    )
    const market = result.rows[0]
    if (!market) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json(toMarket(market))
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not load market' })
  }
})

export default router
