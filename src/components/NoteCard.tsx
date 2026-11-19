import type { Note } from '../types/note'

interface Props {
  note: Note
  onDelete: (id: string) => void
}

export default function NoteCard({ note, onDelete }: Props) {
  return (
    <div className="card">
      <span className="tag">{note.category}</span>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note.id)}>Hapus</button>
    </div>
  )
}
