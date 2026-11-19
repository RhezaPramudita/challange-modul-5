import { useState } from 'react'
import NotesBoard from './components/NotesBoard'
import PostsBoard from './components/PostsBoard'

export default function App() {
  const [tab, setTab] = useState<'notes' | 'posts'>('notes')

  return (
    <main>
      <h1>Challenge Modul 5</h1>
      <nav>
        <button className={tab === 'notes' ? 'active' : ''} onClick={() => setTab('notes')}>Tahap 1: Catatan</button>
        <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Tahap 2: Posts API</button>
      </nav>
      {tab === 'notes' ? <NotesBoard /> : <PostsBoard />}
    </main>
  )
}
