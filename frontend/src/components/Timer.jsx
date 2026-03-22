import { useState, useEffect, useRef } from 'react'

const pad = n => String(n).padStart(2, '0')

export default function Timer({ onComplete }) {
  const [inputHours, setInputHours] = useState(0)
  const [inputMinutes, setInputMinutes] = useState(5)
  const [inputSeconds, setInputSeconds] = useState(0)
  const [remaining, setRemaining] = useState(null) // null = not started
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, onComplete])

  const totalInputSeconds = inputHours * 3600 + inputMinutes * 60 + inputSeconds

  const handleStart = () => {
    if (remaining === null) {
      if (totalInputSeconds <= 0) return
      setRemaining(totalInputSeconds)
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }

  const handleReset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setRemaining(null)
  }

  const display = remaining !== null ? remaining : totalInputSeconds
  const dH = Math.floor(display / 3600)
  const dM = Math.floor((display % 3600) / 60)
  const dS = display % 60

  const progress = remaining !== null && totalInputSeconds > 0
    ? remaining / totalInputSeconds
    : 1

  return (
    <div className="timer">
      <div className="timer-display">
        {remaining !== null ? (
          <div className="timer-countdown-wrap">
            <svg className="timer-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" className="timer-ring-bg" />
              <circle
                cx="60" cy="60" r="54"
                className="timer-ring-fill"
                strokeDasharray={`${339.292 * progress} 339.292`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
              />
            </svg>
            <span className="timer-countdown">
              {pad(dH)}:{pad(dM)}:{pad(dS)}
            </span>
          </div>
        ) : (
          <div className="timer-inputs">
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="23"
                value={inputHours}
                onChange={e => setInputHours(Math.max(0, parseInt(e.target.value) || 0))}
              />
              <label>hrs</label>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={inputMinutes}
                onChange={e => setInputMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              />
              <label>min</label>
            </div>
            <span className="timer-sep">:</span>
            <div className="timer-input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={inputSeconds}
                onChange={e => setInputSeconds(Math.max(0, parseInt(e.target.value) || 0))}
              />
              <label>sec</label>
            </div>
          </div>
        )}
      </div>

      <div className="timer-controls">
        {!isRunning && (
          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={remaining === 0 || (remaining === null && totalInputSeconds === 0)}
          >
            {remaining !== null && remaining > 0 ? '▶ Resume' : '▶ Start'}
          </button>
        )}
        {isRunning && (
          <button className="btn btn-secondary" onClick={handlePause}>
            ⏸ Pause
          </button>
        )}
        <button className="btn btn-ghost" onClick={handleReset} disabled={remaining === null}>
          ↺ Reset
        </button>
      </div>
    </div>
  )
}
