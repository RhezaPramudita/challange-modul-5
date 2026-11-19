import express from 'express'
import cors from 'cors'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diisi di server/.env')

const sql = neon(process.env.DATABASE_URL)
const app = express()

app.use(cors())
app.use(express.json())

await sql`CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)`

app.get('/api/posts', async (req, res) => {
  const search = String(req.query.search ?? '')
  const posts = await sql`SELECT * FROM posts WHERE title ILIKE ${'%' + search + '%'} ORDER BY id DESC`
  res.json(posts)
})

app.post('/api/posts', async (req, res) => {
  const { title, body } = req.body ?? {}
  if (typeof title !== 'string' || !title.trim() || typeof body !== 'string' || !body.trim()) {
    return res.status(400).json({ message: 'title dan body wajib diisi' })
  }
  const [post] = await sql`INSERT INTO posts (title, body) VALUES (${title.trim()}, ${body.trim()}) RETURNING *`
  res.status(201).json(post)
})

app.delete('/api/posts/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'id tidak valid' })
  const rows = await sql`DELETE FROM posts WHERE id = ${id} RETURNING id`
  if (rows.length === 0) return res.status(404).json({ message: 'Post tidak ditemukan' })
  res.status(204).end()
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan pada server' })
})

const port = process.env.PORT ?? 3000
app.listen(port, () => console.log(`API jalan di http://localhost:${port}`))
