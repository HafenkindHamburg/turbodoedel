'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const links = [
    { href: '/admin',            label: 'UMBAUTEN' },
    { href: '/admin/umbauten/neu', label: '+ NEU'  },
  ]

  return (
    <header className="sticky top-0 z-50 bg-bg-surface border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-[#111] rounded px-1 py-0.5">
            <Image
              src="/images/logo-sm.png"
              alt="Turbodoedel"
              width={89}
              height={40}
              className="h-7 w-auto"
            />
          </div>
          <span className="label text-amber">ADMIN</span>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`label transition-colors ${
                pathname === href ? 'text-amber' : 'text-text-faint hover:text-amber'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="label text-text-faint hover:text-amber transition-colors">
            WEBSITE →
          </Link>
          <button onClick={handleLogout} className="label text-text-faint hover:text-amber transition-colors">
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  )
}
