import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: "Jimmy's Notes",
  description: '记一些觉得有意思的东西',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        <main style={{ paddingTop: 'var(--nav-h)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
