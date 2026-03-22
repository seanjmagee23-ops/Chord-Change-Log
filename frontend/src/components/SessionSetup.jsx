import { useState } from 'react'
import ChordScrollPicker from './ChordScrollPicker'
import Timer from './Timer'
import SessionModal from './SessionModal'

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

function playAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    // Three ascending beeps
    const notes = [660, 880, 1100]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.25)
      gain.gain.setValueAtTime(0.5, ctx.currentTime + i * 0.25)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.4)
      osc.start(ctx.currentTime + i * 0.25)
      osc.stop(ctx.currentTime + i * 0.25 + 0.4)
    })
  } catch (e) {
    console.warn('Audio playback failed:', e)
  }
}

export default function SessionSetup({ onSessionSaved }) {
  const [date, setDate] = useState(today())
  const [primaryChord, setPrimaryChord] = useState('C')
  const [secondaryChord, setSecondaryChord] = useState('A')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleTimerComplete = () => {
    playAlert()
    setShowModal(true)
  }

  const handleSave = async (chordChanges) => {
    setSaving(true)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          primary_chord: primaryChord,
          secondary_chord: secondaryChord,
          chord_changes: chordChanges
        })
      })
      const newSession = await res.json()
      setShowModal(false)
      onSessionSaved(newSession)
    } catch (err) {
      console.error('Failed to save session:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="session-setup card">
      <h2 className="section-title">Practice Session</h2>

      <div className="session-date-row">
        <div className="form-group">
          <label htmlFor="session-date">Date</label>
          <input
            id="session-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="date-input"
          />
        </div>
      </div>

      <div className="chord-selectors">
        <ChordScrollPicker
          label="Primary Chord"
          value={primaryChord}
          onChange={setPrimaryChord}
        />
        <div className="chord-vs">VS</div>
        <ChordScrollPicker
          label="Secondary Chord"
          value={secondaryChord}
          onChange={setSecondaryChord}
        />
      </div>

      <Timer onComplete={handleTimerComplete} />

      {showModal && (
        <SessionModal
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          saving={saving}
        />
      )}
    </section>
  )
}
