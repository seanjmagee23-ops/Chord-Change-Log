# Chord Change Log

A Guitar Chord Practice Tracker app built with React (Vite) + Node.js/Express + SQLite.

## Features

- **Practice Session Setup** — pick a date, choose Primary and Secondary chords from a scroll-select wheel, set a countdown timer with Start/Pause/Reset
- **Session Complete Modal** — when the timer hits zero, an audio alert plays and a modal appears to log your chord change count
- **Practice Log Table** — view all sessions, filter by chord, sort by date or chord changes, delete entries, and export as CSV
- **Dark music-inspired theme** — warm amber/orange accents on a dark background, mobile-friendly

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18, Vite 5            |
| Backend  | Node.js, Express 4          |
| Database | SQLite via `node:sqlite` (Node.js 22.5+ built-in) |

## Project Structure

```
chord-change-log/
├── backend/
│   ├── server.js          # Express API
│   ├── package.json
│   └── practice_log.db    # Created automatically on first run
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── SessionSetup.jsx
│   │       ├── ChordScrollPicker.jsx
│   │       ├── Timer.jsx
│   │       ├── SessionModal.jsx
│   │       └── PracticeLog.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json           # Root — runs both with concurrently
└── README.md
```

## Setup & Installation

### Prerequisites
- Node.js 18+ (includes npm)

### Install dependencies

From the project root, run:

```bash
npm run install:all
```

This installs root, backend, and frontend dependencies in one command.

Or install manually:

```bash
# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### Run the app

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend** → http://localhost:3001
- **Frontend** → http://localhost:5173 (open this in your browser)

The Vite dev server proxies all `/api/*` requests to the backend, so no CORS issues.

> **Alternative:** Run them in separate terminals:
> ```bash
> # Terminal 1
> cd backend && npm run dev
>
> # Terminal 2
> cd frontend && npm run dev
> ```

## API Reference

| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/sessions`           | Get all sessions          |
| POST   | `/api/sessions`           | Save a new session        |
| DELETE | `/api/sessions/:id`       | Delete a session by ID    |
| GET    | `/api/sessions/export`    | Download all sessions as CSV |

### POST `/api/sessions` body

```json
{
  "date": "2026-03-21",
  "primary_chord": "C",
  "secondary_chord": "G",
  "chord_changes": 42
}
```

## Chord Options

`C`, `A`, `G`, `E`, `D`, `Am`, `Em`, `Dm`
