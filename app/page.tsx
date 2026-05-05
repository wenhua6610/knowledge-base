import { getAllPosts } from '@/lib/posts'
import PostFeed from '@/components/PostFeed'

export const dynamic = 'force-static'

export default function HomePage() {
  const posts = getAllPosts()

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk','Noto Sans SC',sans-serif",
          fontWeight: 700, fontSize: 'clamp(1.75rem,4vw,2.5rem)',
          lineHeight: 1.15, marginBottom: '10px',
        }}>
          <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Jimmy&apos;s Notes
          </span>
        </h1>
        <p style={{ color: 'var(--text-2)', fontSize: '.9375rem' }}>
          听到有意思的东西，搜一搜，用一用，顺手记下来。
        </p>
      </header>

      <PostFeed posts={posts} />
    </div>
  )
}
