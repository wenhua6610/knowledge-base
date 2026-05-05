import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', '') }
  catch { return url }
}

interface Props { post: PostMeta }

export default function PostCard({ post }: Props) {
  const isBookmark = post.type === 'bookmark'
  const href = isBookmark ? post.link! : `/${post.slug}`
  const target = isBookmark ? '_blank' : undefined
  const rel = isBookmark ? 'noopener noreferrer' : undefined

  return (
    <Link href={href} target={target} rel={rel} style={{ display: 'block', textDecoration: 'none' }}>
      <article style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        padding: '20px 24px',
        transition: 'border-color .25s, transform .25s var(--ease-s), box-shadow .25s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = 'var(--border-hover)'
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 12px 40px rgba(0,0,0,.07)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'var(--border)'
          el.style.transform = 'none'
          el.style.boxShadow = 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span className="tag">{post.category}</span>
          {isBookmark && (
            <span style={{ fontSize: '.68rem', color: 'var(--text-3)', fontFamily: "'JetBrains Mono',monospace" }}>
              🔗 {getDomain(post.link!)}
            </span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--text-3)', fontFamily: "'Inter',sans-serif" }}>
            {formatDate(post.date)}
          </span>
        </div>

        <h2 style={{
          fontFamily: "'Space Grotesk','Noto Sans SC',sans-serif",
          fontWeight: 600, fontSize: '1rem',
          color: 'var(--text)', marginBottom: '8px', lineHeight: 1.4,
        }}>
          {isBookmark && <span style={{ marginRight: '6px', opacity: .6 }}>↗</span>}
          {post.title}
        </h2>

        {post.summary && (
          <p style={{
            fontSize: '.875rem', color: 'var(--text-2)',
            lineHeight: 1.7, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.summary}
          </p>
        )}

        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
            {post.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '.65rem', fontFamily: "'JetBrains Mono',monospace",
                color: 'var(--text-3)', background: 'var(--surface-alt)',
                border: '1px solid var(--border)', borderRadius: '100px', padding: '2px 8px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
