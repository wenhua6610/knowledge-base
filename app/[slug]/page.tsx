import { getAllPosts, getPostBySlug } from '@/lib/posts'
import MdxContent from '@/components/MdxContent'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return getAllPosts()
    .filter(p => p.type === 'article')
    .map(p => ({ slug: p.slug }))
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface Props { params: Promise<{ slug: string }> }

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  let post: ReturnType<typeof getPostBySlug>
  try { post = getPostBySlug(slug) } catch { notFound() }

  const { meta, content } = post
  if (meta.type === 'bookmark') notFound()

  const allPosts = getAllPosts().filter(p => p.type === 'article')
  const idx = allPosts.findIndex(p => p.slug === slug)
  const prev = idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  const next = idx > 0 ? allPosts[idx - 1] : null

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <nav style={{ fontSize: '.8rem', color: 'var(--text-3)', marginBottom: '28px', display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--text-3)', transition: 'color .2s' }}>首页</Link>
        <span>›</span>
        <span className="tag" style={{ cursor: 'default' }}>{meta.category}</span>
      </nav>

      <header style={{ marginBottom: '36px', maxWidth: '680px' }}>
        <h1 style={{
          fontFamily: "'Space Grotesk','Noto Sans SC',sans-serif",
          fontWeight: 700, fontSize: 'clamp(1.5rem,3.5vw,2rem)',
          lineHeight: 1.25, marginBottom: '12px',
        }}>
          {meta.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <time style={{ fontSize: '.82rem', color: 'var(--text-3)', fontFamily: "'Inter',sans-serif" }}>
            {formatDate(meta.date)}
          </time>
          {meta.tags.map(tag => (
            <Link key={tag} href={`/?q=${encodeURIComponent(tag)}`} className="tag">
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <MdxContent source={content} />

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px',
        marginTop: '56px', borderTop: '1px solid var(--border)', paddingTop: '32px',
      }}>
        {prev ? (
          <Link href={`/${prev.slug}`} style={{
            padding: '16px', borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)', display: 'block',
            transition: 'border-color .2s',
          }}>
            <p style={{ fontSize: '.72rem', color: 'var(--text-3)', marginBottom: '4px' }}>← 上一篇</p>
            <p style={{ fontSize: '.875rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/${next.slug}`} style={{
            padding: '16px', borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)', display: 'block', textAlign: 'right',
            transition: 'border-color .2s',
          }}>
            <p style={{ fontSize: '.72rem', color: 'var(--text-3)', marginBottom: '4px' }}>下一篇 →</p>
            <p style={{ fontSize: '.875rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>{next.title}</p>
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}
