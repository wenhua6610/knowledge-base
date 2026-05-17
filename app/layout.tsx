import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import 'highlight.js/styles/github-dark-dimmed.css'
import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
const PixelCat = dynamic(() => import('@/components/PixelCat'), { ssr: false })

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Jimmy's Notes",
  description: '记一些觉得有意思的东西',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [
    spaceGrotesk.className,
    inter.className,
    jetbrainsMono.className,
  ].join(' ')

  return (
    <html lang="zh-CN">
      <body className={fontClasses}>
        <Nav />
        <main style={{ paddingTop: 'var(--nav-h)' }}>{children}</main>
        <PixelCat />
      </body>
    </html>
  )
}
