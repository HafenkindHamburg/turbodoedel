'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/umbauten',   label: 'UMBAUTEN'   },
  { href: '/leistungen', label: 'LEISTUNGEN' },
  { href: '/ueber-uns',  label: 'ÜBER UNS'   },
  { href: '/faq',        label: 'FAQ'         },
  { href: '/partner',    label: 'PARTNER'     },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-bg-base/95 backdrop-blur-sm border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0">
          <span className="font-bold text-base tracking-widest text-text-primary">TURBO</span>
          <span className="font-bold text-base tracking-widest text-amber">DÖEDEL</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`label transition-colors hover:text-amber ${
                pathname.startsWith(href) ? 'text-amber' : 'text-text-faint'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Kontakt CTA */}
          <Link
            href="/kontakt"
            className="label border border-amber text-amber px-3 py-1.5 transition-colors hover:bg-amber hover:text-black"
          >
            KONTAKT
          </Link>
        </nav>
      </div>
    </header>
  )
}
