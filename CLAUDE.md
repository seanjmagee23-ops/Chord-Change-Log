# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies (run once after cloning)
npm run install:all

# Start both servers together (recommended)
npm run dev

# Start individually
cd backend && npm run dev     # Express on :3001
cd frontend && npm run dev    # Vite on :5173
```

There are no tests or linting configured in this project.

## Architecture

This is a monorepo with two independent Node.js projects — `backend/` and `frontend/` — started together via `concurrently` from the root `package.json`.

### Data flow
```
Browser → React (fetch) → Vite proxy (/api/*) → Express :3001 → node:sqlite → practice_log.db
```

All API calls from the frontend use relative paths (`/api/...`). Vite proxies these to `http://localhost:3001` during development — configured in `frontend/vite.config.js`. There is no production build setup.

### Backend (`backend/server.js`)
- Single-file Express server, no router abstraction
- Uses Node.js built-in `node:sqlite` (`DatabaseSync`) — **requires Node.js 22.5+**
- `practice_log.db` is created automatically on first run in the `backend/` directory
- Route ordering matters: `/api/sessions/export` must stay above `/api/sessions/:id` to avoid the string `"export"` being matched as an ID
- `lastInsertRowid` from `node:sqlite` returns a `BigInt` — must be converted with `Number()` before use

### Frontend (`frontend/src/`)
- `App.jsx` is the single source of truth for the `sessions` array. It fetches on mount and passes data + handlers down as props — no global state library
- `SessionSetup` → owns the timer and chord selection state, calls `onSessionSaved(newSession)` with the API response object so `App` can prepend it to the list without a full refetch
- `ChordScrollPicker` — custom scroll-snap wheel picker. Uses a debounced scroll handler to snap to the nearest item. Padding divs above and below the chord list enable the first and last items to center in the viewport
- `Timer` — controlled by local state only. Switches between an editable input view (when not started) and a live countdown display (once started). Calls `onComplete` when it reaches zero
- `PracticeLog` — filtering and sorting are purely derived from props via `useMemo`, no separate fetch

### Chord options
The chord list `['C', 'A', 'G', 'E', 'D', 'Am', 'Em', 'Dm']` is duplicated in `ChordScrollPicker.jsx` and `PracticeLog.jsx`. If it changes, update both.

### Styling
All styles are in a single file: `frontend/src/App.css`. CSS custom properties (variables) are defined at the top of that file under `:root` and control the entire colour scheme.
