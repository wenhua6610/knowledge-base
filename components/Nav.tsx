'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 'var(--nav-h)', zIndex: 100,
      display: 'flex', alignItems: 'center',
      padding: '0 clamp(20px,5vw,40px)',
      transition: 'background .35s var(--ease-c), border-color .35s, box-shadow .35s',
      background: scrolled ? 'rgba(var(--bg-rgb),.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,.04)' : 'none',
    }}>
      <Link href="/" style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: '1rem',
        background: 'var(--gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        Jimmy&apos;s Notes
      </Link>
      <span style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'var(--text-3)', fontFamily: "'Inter',sans-serif" }}>
        记一些觉得有意思的东西
      </span>
    </nav>
  )
}
