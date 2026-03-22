import { useState, useMemo } from 'react'

const CHORDS = ['C', 'A', 'G', 'E', 'D', 'Am', 'Em', 'Dm']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export default function PracticeLog({ sessions, onDelete }) {
  const [filterPrimary, setFilterPrimary] = useState('')
  const [filterSecondary, setFilterSecondary] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    let data = [...sessions]
    if (filterPrimary) data = data.filter(s => s.primary_chord === filterPrimary)
    if (filterSecondary) data = data.filter(s => s.secondary_chord === filterSecondary)
    data.sort((a, b) => {
      const aVal = sortBy === 'date' ? a.date : a.chord_changes
      const bVal = sortBy === 'date' ? b.date : b.chord_changes
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [sessions, filterPrimary, filterSecondary, sortBy, sortDir])

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  const sortIndicator = (field) => {
    if (sortBy !== field) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const handleDeleteClick = (id) => {
    setConfirmDelete(id)
  }

  const handleConfirmDelete = () => {
    onDelete(confirmDelete)
    setConfirmDelete(null)
  }

  return (
    <section className="practice-log card">
      <div className="log-header">
        <h2 className="section-title">Practice Log</h2>
        <a href="/api/sessions/export" className="btn btn-accent" download="practice_log.csv">
          ↓ Export CSV
        </a>
      </div>

      <div className="log-filters">
        <div className="filter-group">
          <label>Primary Chord</label>
          <select value={filterPrimary} onChange={e => setFilterPrimary(e.target.value)}>
            <option value="">All</option>
            {CHORDS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Secondary Chord</label>
          <select value={filterSecondary} onChange={e => setFilterSecondary(e.target.value)}>
            <option value="">All</option>
            {CHORDS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <div className="sort-controls">
            <button
              className={`sort-btn${sortBy === 'date' ? ' active' : ''}`}
              onClick={() => toggleSort('date')}
            >
              Date{sortIndicator('date')}
            </button>
            <button
              className={`sort-btn${sortBy === 'chord_changes' ? ' active' : ''}`}
              onClick={() => toggleSort('chord_changes')}
            >
              Changes{sortIndicator('chord_changes')}
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎵</span>
          <p>{sessions.length === 0 ? 'No sessions yet. Start practicing!' : 'No sessions match your filters.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="log-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort('date')}>
                  Date{sortIndicator('date')}
                </th>
                <th>Primary Chord</th>
                <th>Secondary Chord</th>
                <th className="sortable" onClick={() => toggleSort('chord_changes')}>
                  Chord Changes{sortIndicator('chord_changes')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(session => (
                <tr key={session.id}>
                  <td className="date-cell">{formatDate(session.date)}</td>
                  <td>
                    <span className="chord-badge primary">{session.primary_chord}</span>
                  </td>
                  <td>
                    <span className="chord-badge secondary">{session.secondary_chord}</span>
                  </td>
                  <td className="changes-cell">{session.chord_changes}</td>
                  <td className="action-cell">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(session.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="log-footer">
        {filtered.length > 0 && (
          <p className="row-count">
            {filtered.length} session{filtered.length !== 1 ? 's' : ''}
            {sessions.length !== filtered.length && ` (filtered from ${sessions.length})`}
          </p>
        )}
      </div>

      {confirmDelete !== null && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal confirm-modal">
            <div className="modal-icon">🗑️</div>
            <h2>Delete Session?</h2>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
