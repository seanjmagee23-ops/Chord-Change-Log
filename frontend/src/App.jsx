import { useState, useEffect } from 'react'
import SessionSetup from './components/SessionSetup'
import PracticeLog from './components/PracticeLog'

function App() {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      console.error('Failed to fetch sessions:', err)
    }
  }

  const handleSessionSaved = (newSession) => {
    setSessions(prev => [newSession, ...prev])
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Failed to delete session:', err)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <span className="guitar-icon">🎸</span>
          <h1>Chord Change Log</h1>
          <p className="tagline">Track your guitar chord practice</p>
        </div>
      </header>
      <main className="app-main">
        <SessionSetup onSessionSaved={handleSessionSaved} />
        <PracticeLog sessions={sessions} onDelete={handleDelete} />
      </main>
    </div>
  )
}

export default App
