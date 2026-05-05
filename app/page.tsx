import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import CategoryFilter from '@/components/CategoryFilter'
import { Suspense } from 'react'

interface Props {
  searchParams: Promise<{ cat?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { cat } = await searchParams
  const allPosts = getAllPosts()
  const posts = cat ? allPosts.filter(p => p.category === cat) : allPosts

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

      <Suspense>
        <CategoryFilter active={cat} />
      </Suspense>

      <p style={{ fontSize: '.8rem', color: 'var(--text-3)', marginBottom: '20px', fontFamily: "'Inter',sans-serif" }}>
        {posts.length} 条记录
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: '60px 0' }}>
          这个分类还没有内容
        </p>
      )}
    </div>
  )
}
