const express = require('express');
const cors = require('cors');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new DatabaseSync(path.join(__dirname, 'practice_log.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    primary_chord TEXT NOT NULL,
    secondary_chord TEXT NOT NULL,
    chord_changes INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET CSV export — must come before /:id to avoid route conflict
app.get('/api/sessions/export', (req, res) => {
  const sessions = db.prepare('SELECT * FROM sessions ORDER BY date DESC, created_at DESC').all();
  const rows = [
    'ID,Date,Primary Chord,Secondary Chord,Chord Changes',
    ...sessions.map(s =>
      `${s.id},${s.date},${s.primary_chord},${s.secondary_chord},${s.chord_changes}`
    )
  ];
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="practice_log.csv"');
  res.send(rows.join('\n'));
});

// GET all sessions
app.get('/api/sessions', (req, res) => {
  const sessions = db.prepare('SELECT * FROM sessions ORDER BY date DESC, created_at DESC').all();
  res.json(sessions);
});

// POST new session
app.post('/api/sessions', (req, res) => {
  const { date, primary_chord, secondary_chord, chord_changes } = req.body;
  if (!date || !primary_chord || !secondary_chord || chord_changes === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const stmt = db.prepare(
    'INSERT INTO sessions (date, primary_chord, secondary_chord, chord_changes) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(date, primary_chord, secondary_chord, Number(chord_changes));
  // lastInsertRowid is a BigInt in node:sqlite
  const id = Number(result.lastInsertRowid);
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
  res.status(201).json(session);
});

// DELETE session
app.delete('/api/sessions/:id', (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ message: 'Session deleted' });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
