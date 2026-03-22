import { useRef, useEffect, useCallback } from 'react'

const CHORDS = ['C', 'A', 'G', 'E', 'D', 'Am', 'Em', 'Dm']
const ITEM_HEIGHT = 52

export default function ChordScrollPicker({ label, value, onChange }) {
  const scrollRef = useRef(null)
  const snapTimer = useRef(null)

  // Sync scroll position when value changes externally
  useEffect(() => {
    const idx = CHORDS.indexOf(value)
    if (scrollRef.current && idx >= 0) {
      scrollRef.current.scrollTop = idx * ITEM_HEIGHT
    }
  }, [value])

  const handleScroll = useCallback(() => {
    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      if (!scrollRef.current) return
      const idx = Math.round(scrollRef.current.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(CHORDS.length - 1, idx))
      // Snap to nearest item
      scrollRef.current.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
      if (CHORDS[clamped] !== value) {
        onChange(CHORDS[clamped])
      }
    }, 80)
  }, [value, onChange])

  const handleClick = (chord, idx) => {
    scrollRef.current?.scrollTo({ top: idx * ITEM_HEIGHT, behavior: 'smooth' })
    onChange(chord)
  }

  return (
    <div className="chord-picker">
      <div className="chord-picker-label">{label}</div>
      <div className="chord-picker-wrapper">
        {/* Fade overlays */}
        <div className="chord-picker-fade-top" />
        <div className="chord-picker-fade-bottom" />
        {/* Center highlight bar */}
        <div className="chord-picker-highlight" />
        <div
          ref={scrollRef}
          className="chord-picker-scroll"
          onScroll={handleScroll}
        >
          {/* Padding so first/last items can center */}
          <div style={{ height: ITEM_HEIGHT * 2, flexShrink: 0 }} />
          {CHORDS.map((chord, idx) => (
            <div
              key={chord}
              className={`chord-picker-item${chord === value ? ' active' : ''}`}
              onClick={() => handleClick(chord, idx)}
            >
              {chord}
            </div>
          ))}
          <div style={{ height: ITEM_HEIGHT * 2, flexShrink: 0 }} />
        </div>
      </div>
    </div>
  )
}
