import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getAllPosts, getPostBySlug, CATEGORIES } from './posts'

const fixtureDir = path.join(process.cwd(), 'content', 'posts')
const fixture1 = path.join(fixtureDir, '2025-01-01-test-article.mdx')
const fixture2 = path.join(fixtureDir, '2025-02-01-test-bookmark.mdx')

beforeAll(() => {
  fs.mkdirSync(fixtureDir, { recursive: true })
  fs.writeFileSync(fixture1, `---
title: "Test Article"
date: "2025-01-01"
category: "工具测评"
tags: ["test"]
summary: "A test article"
type: "article"
---
Hello world`)
  fs.writeFileSync(fixture2, `---
title: "Test Bookmark"
date: "2025-02-01"
category: "前沿技术"
tags: ["link"]
summary: "A test bookmark"
type: "bookmark"
link: "https://example.com"
---
`)
})

afterAll(() => {
  fs.unlinkSync(fixture1)
  fs.unlinkSync(fixture2)
})

describe('getAllPosts', () => {
  it('returns posts sorted newest first', () => {
    const posts = getAllPosts()
    const testPosts = posts.filter(p => p.slug.includes('test'))
    expect(new Date(testPosts[0].date) >= new Date(testPosts[1].date)).toBe(true)
  })

  it('parses article type correctly', () => {
    const posts = getAllPosts()
    const article = posts.find(p => p.slug === '2025-01-01-test-article')!
    expect(article.type).toBe('article')
    expect(article.title).toBe('Test Article')
    expect(article.category).toBe('工具测评')
    expect(article.link).toBeUndefined()
  })

  it('parses bookmark type with link', () => {
    const posts = getAllPosts()
    const bookmark = posts.find(p => p.slug === '2025-02-01-test-bookmark')!
    expect(bookmark.type).toBe('bookmark')
    expect(bookmark.link).toBe('https://example.com')
  })
})

describe('getPostBySlug', () => {
  it('returns meta and content', () => {
    const { meta, content } = getPostBySlug('2025-01-01-test-article')
    expect(meta.title).toBe('Test Article')
    expect(content.trim()).toBe('Hello world')
  })
})

describe('CATEGORIES', () => {
  it('has 8 categories', () => {
    expect(CATEGORIES).toHaveLength(8)
  })
})
