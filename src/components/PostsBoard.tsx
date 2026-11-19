import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Post } from '../types/post'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/posts'

export default function PostsBoard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  // Bonus: kirim ?search= ke backend setiap kata kunci berubah
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    fetch(`${API_URL}?search=${encodeURIComponent(search)}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setPosts)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(`Gagal memuat data: ${err.message}. Server mati?`)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [search])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPosts([await res.json(), ...posts])
      setTitle('')
      setBody('')
    } catch (err) {
      setError(`Gagal menambah post: ${(err as Error).message}`)
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPosts(posts.filter((p) => p.id !== id))
    } catch (err) {
      setError(`Gagal menghapus post: ${(err as Error).message}`)
    }
  }

  return (
    <section>
      <h2>Tahap 2 — Posts dari REST API</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Judul post" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Isi post" value={body} onChange={(e) => setBody(e.target.value)} required />
        <button type="submit">Kirim Post</button>
      </form>
      <input className="search" placeholder="Cari post..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {loading && <p className="info">Memuat...</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {posts.map((post) => (
          <div className="card" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <button onClick={() => handleDelete(post.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </section>
  )
}
