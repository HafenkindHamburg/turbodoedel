'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { href: '/',           label: 'HOME'        },
  { href: '/umbauten',   label: 'UMBAUTEN'   },
  { href: '/leistungen', label: 'LEISTUNGEN' },
  { href: '/ueber-uns',  label: 'ÜBER UNS'   },
  { href: '/faq',        label: 'FAQ'         },
  { href: '/partner',    label: 'PARTNER'     },
]

export default function Nav() {
  const pathname = usePathname()

  return (
    <header className="nav-bg sticky top-0 z-50 border-b border-bg-border">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo — Dark/Light Version */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Turbodoedel_Logo_Dark.png"
            alt="Turbodoedel — Chiptuning & Performance"
            width={286}
            height={79}
            priority
            className="logo-dark h-[57px] w-auto"
          />
          <Image
            src="/images/Turbodoedel_Logo_Light.png"
            alt="Turbodoedel — Chiptuning & Performance"
            width={286}
            height={79}
            priority
            className="logo-light h-[57px] w-auto"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`label transition-colors hover:text-amber ${
                (href === '/' ? pathname === '/' : pathname.startsWith(href))
                  ? 'text-amber' : 'text-text-faint'
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

          {/* Dark/Light Toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
