'use client'
import { useState } from 'react'
import type { PostMeta } from '@/lib/posts'
import { CATEGORIES } from '@/lib/categories'
import PostCard from '@/components/PostCard'

interface Props { posts: PostMeta[] }

export default function PostFeed({ posts }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const filtered = active ? posts.filter(p => p.category === active) : posts
  const tabs = ['全部', ...CATEGORIES]

  return (
    <>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {tabs.map(tab => {
          const isActive = tab === '全部' ? !active : active === tab
          return (
            <button
              key={tab}
              onClick={() => setActive(tab === '全部' ? null : tab)}
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: '.72rem', fontWeight: 500,
                padding: '5px 14px', borderRadius: '100px',
                border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                background: isActive ? 'rgba(var(--ac-rgb),.08)' : 'var(--surface)',
                color: isActive ? 'var(--accent)' : 'var(--text-2)',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Count */}
      <p style={{ fontSize: '.8rem', color: 'var(--text-3)', marginBottom: '20px', fontFamily: "'Inter',sans-serif" }}>
        {filtered.length} 条记录
      </p>

      {/* Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map(post => <PostCard key={post.slug} post={post} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '60px 0' }}>
          这个分类还没有内容
        </p>
      )}
    </>
  )
}
