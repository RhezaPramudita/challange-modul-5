import { useState } from 'react'
import type { Note } from '../types/note'
import { useLocalStorage } from '../hooks/useLocalStorage'
import NoteForm from './NoteForm'
import NoteCard from './NoteCard'

export default function NotesBoard() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  const [search, setSearch] = useState('')

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <section>
      <h2>Tahap 1 — Papan Catatan Lokal</h2>
      <NoteForm onAdd={(note) => setNotes([note, ...notes])} />
      <input className="search" placeholder="Cari judul..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered.length === 0 && <p className="info">Belum ada catatan.</p>}
      <div className="grid">
        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={(id) => setNotes(notes.filter((n) => n.id !== id))} />
        ))}
      </div>
    </section>
  )
}
