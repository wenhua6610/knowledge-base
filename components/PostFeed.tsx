'use client'
import { useState, useMemo } from 'react'
import type { PostMeta } from '@/lib/posts'
import { CATEGORIES } from '@/lib/categories'
import PostCard from '@/components/PostCard'

interface Props { posts: PostMeta[] }

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: '.72rem', fontWeight: 500,
        padding: '5px 14px', borderRadius: '100px',
        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        background: active ? 'rgba(var(--ac-rgb),.08)' : 'var(--surface)',
        color: active ? 'var(--accent)' : 'var(--text-2)',
        cursor: 'pointer', transition: 'all .2s',
      }}
    >
      {label}
    </button>
  )
}

export default function PostFeed({ posts }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<string | null>(null)

  // Derive sorted unique years from posts
  const years = useMemo(() => {
    const ys = Array.from(new Set(posts.map(p => p.date.slice(0, 4))))
    return ys.sort((a, b) => Number(b) - Number(a))
  }, [posts])

  const filtered = useMemo(() => posts.filter(p => {
    const catOk = !activeCategory || p.category === activeCategory
    const yearOk = !activeYear || p.date.startsWith(activeYear)
    return catOk && yearOk
  }), [posts, activeCategory, activeYear])

  return (
    <>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <FilterPill label="全部分类" active={!activeCategory} onClick={() => setActiveCategory(null)} />
        {CATEGORIES.map(cat => (
          <FilterPill
            key={cat} label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          />
        ))}
      </div>

      {/* Year filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px', alignItems: 'center' }}>
        <span style={{
          fontSize: '.68rem', fontFamily: "'JetBrains Mono',monospace",
          color: 'var(--text-3)', marginRight: '2px', letterSpacing: '.04em',
        }}>
          年份
        </span>
        <FilterPill label="全部" active={!activeYear} onClick={() => setActiveYear(null)} />
        {years.map(year => (
          <FilterPill
            key={year} label={year}
            active={activeYear === year}
            onClick={() => setActiveYear(activeYear === year ? null : year)}
          />
        ))}
      </div>

      {/* Count */}
      <p style={{ fontSize: '.8rem', color: 'var(--text-3)', marginBottom: '20px', fontFamily: "'Inter',sans-serif" }}>
        {filtered.length} 条记录
        {(activeCategory || activeYear) && (
          <button
            onClick={() => { setActiveCategory(null); setActiveYear(null) }}
            style={{
              marginLeft: '12px', fontSize: '.72rem',
              fontFamily: "'JetBrains Mono',monospace",
              color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              textDecoration: 'underline', textUnderlineOffset: '3px',
            }}
          >
            清除筛选
          </button>
        )}
      </p>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(post => <PostCard key={post.slug} post={post} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '60px 0' }}>
          没有符合条件的内容
        </p>
      )}
    </>
  )
}
