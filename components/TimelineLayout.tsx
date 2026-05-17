'use client'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
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

// ── Search input ──────────────────────────────────────────────────────────────
function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '0 14px',
      borderRadius: '12px',
      border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
      background: 'var(--surface)',
      transition: 'border-color .2s',
      marginBottom: '20px',
    }}>
      {/* magnifier icon */}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: focused ? 1 : 0.4, transition: 'opacity .2s' }}>
        <circle cx="6.5" cy="6.5" r="5" stroke="var(--accent)" strokeWidth="1.6"/>
        <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="搜索标题、摘要、标签…"
        style={{
          flex: 1,
          border: 'none', outline: 'none',
          background: 'transparent',
          fontFamily: "'Noto Sans SC','Inter',sans-serif",
          fontSize: '.875rem',
          color: 'var(--text)',
          padding: '10px 0',
          lineHeight: 1,
        }}
      />
      {/* clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            border: 'none', background: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: '1rem', lineHeight: 1,
            padding: '0 2px', display: 'flex', alignItems: 'center',
          }}
          aria-label="清除搜索"
        >×</button>
      )}
    </div>
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function TimelineLayout({ posts }: { posts: PostMeta[] }) {
  const searchParams = useSearchParams()
  const [cat,   setCat]   = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  // 1. Category filter
  const catPosts = useMemo(
    () => cat ? posts.filter(p => p.category === cat) : posts,
    [posts, cat]
  )

  // 2. Search filter (applied on top of category)
  const searchPosts = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catPosts
    return catPosts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.summary ?? '').toLowerCase().includes(q) ||
      p.tags.join(' ').toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    )
  }, [catPosts, query])

  // Timeline reflects category + search results
  const months = useMemo(() => uniqMonths(searchPosts), [searchPosts])

  // If stored month vanished from current view, treat as "all"
  const activeMonth = month && months.includes(month) ? month : null

  // 3. Month filter (from timeline drag)
  const filtered = useMemo(
    () => activeMonth ? searchPosts.filter(p => p.date.startsWith(activeMonth)) : searchPosts,
    [searchPosts, activeMonth]
  )

  return (
    <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

      {/* ── Left: timeline ── */}
      <div className="timeline-sidebar">
        <TimelineBar months={months} active={activeMonth} onChange={setMonth} />
      </div>

      {/* ── Right: content ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Search */}
        <SearchBox value={query} onChange={v => { setQuery(v); setMonth(null) }} />

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <Pill label="全部" active={!cat} onClick={() => setCat(null)} />
          {CATEGORIES.map(c => (
            <Pill key={c} label={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)} />
          ))}
        </div>

        {/* Record count */}
        <p style={{
          fontSize: '.8rem', color: 'var(--text-3)',
          marginBottom: '20px', fontFamily: "'Inter',sans-serif",
        }}>
          {filtered.length} 条记录
          {query.trim() && (
            <span style={{ marginLeft: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--accent)' }}>
              · 搜索&ldquo;{query.trim()}&rdquo;
            </span>
          )}
          {activeMonth && (
            <span style={{ marginLeft: '10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem', color: 'var(--accent)' }}>
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
            {query.trim() ? <>没有找到与&ldquo;{query.trim()}&rdquo;相关的内容</> : '没有符合条件的内容'}
          </p>
        )}
      </div>
    </div>
  )
}
