import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import marketsRouter from './routes/markets.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 3001
const dist = path.join(__dirname, '../client/dist')

app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length)
    res.redirect(301, req.path.slice(0, -1) + query)
    return
  }
  next()
})

app.use('/api/markets', marketsRouter)

if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(dist, 'index.html'))
  })
} else {
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })
}

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})
