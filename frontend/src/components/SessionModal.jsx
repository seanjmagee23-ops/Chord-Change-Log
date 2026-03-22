import { useState } from 'react'

export default function SessionModal({ onSave, onClose }) {
  const [chordChanges, setChordChanges] = useState('')

  const handleSave = () => {
    const count = parseInt(chordChanges)
    if (isNaN(count) || count < 0) return
    onSave(count)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-icon">🎸</div>
        <h2>Session Complete!</h2>
        <p>How many chord changes did you make?</p>
        <input
          type="number"
          min="0"
          value={chordChanges}
          onChange={e => setChordChanges(e.target.value)}
          placeholder="e.g. 42"
          className="modal-input"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={chordChanges === '' || parseInt(chordChanges) < 0}
          >
            Save to Log
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
