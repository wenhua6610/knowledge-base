import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const CATEGORIES = [
  'AI训练师', 'AI评测', 'GEO', '前沿技术',
  '工具测评', '大佬访谈', '使用技巧', '人生感悟'
] as const

export type Category = typeof CATEGORIES[number]
export type PostType = 'article' | 'bookmark'

export interface PostMeta {
  slug: string
  title: string
  date: string
  category: Category
  tags: string[]
  summary: string
  type: PostType
  link?: string
}

const postsDir = path.join(process.cwd(), 'content', 'posts')

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))
  return files
    .map((filename): PostMeta => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(postsDir, filename), 'utf-8')
      const { data } = matter(raw)
      return {
        slug,
        title: data.title,
        date: data.date,
        category: data.category,
        tags: data.tags ?? [],
        summary: data.summary ?? '',
        type: data.type ?? 'article',
        link: data.link,
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): { meta: PostMeta; content: string } {
  const filepath = path.join(postsDir, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    meta: {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      tags: data.tags ?? [],
      summary: data.summary ?? '',
      type: data.type ?? 'article',
      link: data.link,
    },
    content,
  }
}
