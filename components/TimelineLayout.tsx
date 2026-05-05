'use client'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { CATEGORIES } from '@/lib/categories'
import PostCard from './PostCard'

const MO = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const SLOT = 36   // px per month row on the timeline
const LINE_X = 74 // x-position of the vertical line within the 84px column

function uniqMonths(posts: PostMeta[]) {
  const s = new Set(posts.map(p => p.date.slice(0, 7)))
  return Array.from(s).sort((a, b) => b.localeCompare(a)) // newest first
}

// ── Category pill ─────────────────────────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', fontWeight: 500,
      padding: '5px 14px', borderRadius: '100px',
      border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      background: active ? 'rgba(var(--ac-rgb),.08)' : 'var(--surface)',
      color: active ? 'var(--accent)' : 'var(--text-2)',
      cursor: 'pointer', transition: 'all .2s',
    }}>{label}</button>
  )
}

// ── Timeline sidebar ──────────────────────────────────────────────────────────
function TimelineBar({ months, active, onChange }: {
  months: string[]
  active: string | null
  onChange: (m: string | null) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  // Map a clientY to the nearest month index
  const snap = useCallback((clientY: number) => {
    if (!trackRef.current || months.length === 0) return
    const { top, height } = trackRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(0.9999, (clientY - top) / height))
    const idx = Math.floor(pct * months.length)
    onChange(months[idx])
  }, [months, onChange])

  useEffect(() => {
    const mv  = (e: MouseEvent)     => { if (dragging.current) snap(e.clientY) }
    const up  = ()                  => { dragging.current = false }
    const tm  = (e: TouchEvent)     => { if (dragging.current) snap(e.touches[0].clientY) }
    window.addEventListener('mousemove', mv)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', tm, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', mv)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend', up)
    }
  }, [snap])

  const activeIdx = active ? months.indexOf(active) : -1
  const handleY   = activeIdx >= 0 ? (activeIdx + 0.5) * SLOT : null

  if (months.length === 0) return null

  return (
    <div style={{
      position: 'sticky',
      top: 'calc(var(--nav-h) + 32px)',
      width: '84px',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* "全部" toggle */}
      <button
        onClick={() => onChange(null)}
        style={{
          display: 'block', width: '100%', marginBottom: '18px',
          fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem',
          padding: '4px 0', borderRadius: '100px', textAlign: 'center',
          border: `1.5px solid ${!active ? 'var(--accent)' : 'var(--border)'}`,
          background: !active ? 'rgba(var(--ac-rgb),.08)' : 'transparent',
          color: !active ? 'var(--accent)' : 'var(--text-3)',
          cursor: 'pointer', transition: 'all .2s',
        }}
      >全部</button>

      {/* Draggable track */}
      <div
        ref={trackRef}
        onMouseDown={e => { dragging.current = true; snap(e.clientY); e.preventDefault() }}
        onTouchStart={e => { dragging.current = true; snap(e.touches[0].clientY) }}
        style={{ position: 'relative', height: `${months.length * SLOT}px`, cursor: 'pointer' }}
      >
        {/* Background rail */}
        <div style={{
          position: 'absolute',
          left: `${LINE_X}px`, top: 0, bottom: 0,
          width: '2px',
          background: 'var(--border)',
          transform: 'translateX(-50%)',
        }} />

        {/* Accent fill — from top down to handle */}
        {handleY !== null && (
          <div style={{
            position: 'absolute',
            left: `${LINE_X}px`, top: 0,
            height: `${handleY}px`,
            width: '2px',
            background: 'var(--accent)',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            transition: 'height .08s',
          }} />
        )}

        {/* Month rows */}
        {months.map((m, i) => {
          const [yr, mo] = m.split('-')
          const y = (i + 0.5) * SLOT
          const isActive = m === active
          const firstOfYear = i === 0 || months[i - 1].slice(0, 4) !== yr

          return (
            <div key={m}>
              {/* Year label — floats just above the first month of that year */}
              {firstOfYear && (
                <div style={{
                  position: 'absolute',
                  right: `${84 - LINE_X + 6}px`,
                  top: `${i * SLOT - (i === 0 ? 2 : 8)}px`,
                  fontSize: '.55rem',
                  fontFamily: "'JetBrains Mono',monospace",
                  color: 'var(--text-3)',
                  fontWeight: 700,
                  letterSpacing: '.06em',
                  lineHeight: 1,
                }}>
                  {yr}
                </div>
              )}

              {/* Month label */}
              <div
                onClick={e => { e.stopPropagation(); onChange(isActive ? null : m) }}
                style={{
                  position: 'absolute',
                  right: `${84 - LINE_X + 6}px`,
                  top: `${y}px`,
                  transform: 'translateY(-50%)',
                  fontSize: '.63rem',
                  fontFamily: "'Noto Sans SC',sans-serif",
                  color: isActive ? 'var(--accent)' : 'var(--text-3)',
                  fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'color .15s, font-weight .15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {MO[+mo - 1]}
              </div>

              {/* Dot on the rail */}
              <div style={{
                position: 'absolute',
                left: `${LINE_X}px`, top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                width: isActive ? '8px' : '5px',
                height: isActive ? '8px' : '5px',
                borderRadius: '50%',
                background: isActive ? 'var(--accent)' : '#c4c4d8',
                transition: 'all .15s',
                zIndex: 1,
                pointerEvents: 'none',
              }} />
            </div>
          )
        })}

        {/* Draggable handle ring */}
        {handleY !== null && (
          <div style={{
            position: 'absolute',
            left: `${LINE_X}px`, top: `${handleY}px`,
            transform: 'translate(-50%, -50%)',
            width: '16px', height: '16px',
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 0 4px rgba(var(--ac-rgb),.18), 0 2px 8px rgba(var(--ac-rgb),.35)',
            zIndex: 2,
            pointerEvents: 'none',
            transition: 'top .08s',
          }} />
        )}
      </div>
    </div>
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function TimelineLayout({ posts }: { posts: PostMeta[] }) {
  const [cat,   setCat]   = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)

  // Posts after category filter
  const catPosts = useMemo(
    () => cat ? posts.filter(p => p.category === cat) : posts,
    [posts, cat]
  )

  // Months available in current category
  const months = useMemo(() => uniqMonths(catPosts), [catPosts])

  // If the stored month isn't in the current view, treat as "all"
  const activeMonth = month && months.includes(month) ? month : null

  // Final filtered list
  const filtered = useMemo(
    () => activeMonth ? catPosts.filter(p => p.date.startsWith(activeMonth)) : catPosts,
    [catPosts, activeMonth]
  )

  return (
    <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

      {/* ── Left: timeline ── */}
      <TimelineBar months={months} active={activeMonth} onChange={setMonth} />

      {/* ── Right: content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <Pill label="全部" active={!cat} onClick={() => setCat(null)} />
          {CATEGORIES.map(c => (
            <Pill key={c} label={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)} />
          ))}
        </div>

        {/* Record count + active time label */}
        <p style={{
          fontSize: '.8rem', color: 'var(--text-3)',
          marginBottom: '20px', fontFamily: "'Inter',sans-serif",
        }}>
          {filtered.length} 条记录
          {activeMonth && (
            <span style={{
              marginLeft: '10px',
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '.72rem',
              color: 'var(--accent)',
            }}>
              · {activeMonth.slice(0, 4)} 年 {MO[+activeMonth.slice(5, 7) - 1]}
            </span>
          )}
        </p>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(p => <PostCard key={p.slug} post={p} />)}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '60px 0' }}>
            没有符合条件的内容
          </p>
        )}
      </div>
    </div>
  )
}
