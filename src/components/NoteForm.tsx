import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Note } from '../types/note'

interface Props {
  onAdd: (note: Note) => void
}

export default function NoteForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Umum')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ id: crypto.randomUUID(), title: title.trim(), content: content.trim(), category })
    setTitle('')
    setContent('')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input placeholder="Judul" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Isi catatan" value={content} onChange={(e) => setContent(e.target.value)} />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Umum</option>
        <option>Kuliah</option>
        <option>Pribadi</option>
      </select>
      <button type="submit">Tambah</button>
    </form>
  )
}
