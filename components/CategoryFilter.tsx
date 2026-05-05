'use client'
import { useRouter, usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/categories'

interface Props { active?: string }

export default function CategoryFilter({ active }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function navigate(cat: string | null) {
    const url = cat ? `${pathname}?cat=${encodeURIComponent(cat)}` : pathname
    router.push(url)
  }

  const tabs = ['全部', ...CATEGORIES]

  return (
    <div style={{
      display: 'flex', gap: '8px', flexWrap: 'wrap',
      marginBottom: '32px',
    }}>
      {tabs.map(tab => {
        const isActive = tab === '全部' ? !active : active === tab
        return (
          <button
            key={tab}
            onClick={() => navigate(tab === '全部' ? null : tab)}
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: '.72rem', fontWeight: 500,
              padding: '5px 14px', borderRadius: '100px',
              border: `1.5px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              background: isActive ? 'rgba(var(--ac-rgb),.08)' : 'var(--surface)',
              color: isActive ? 'var(--accent)' : 'var(--text-2)',
              cursor: 'pointer',
              transition: 'all .2s',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
