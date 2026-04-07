# Turbodoedel.de — Plan 2: Öffentliches Frontend

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alle öffentlichen Seiten der Website implementieren: Homepage mit Parallax-Effekten, Umbauten Card-Grid mit Filter, Umbau-Detailseite und alle statischen Seiten (Leistungen, Über uns, FAQ, Partner, Kontakt).

**Architecture:** Next.js Server Components lesen Supabase-Daten serverseitig — kein Client-Fetching für öffentliche Seiten. Parallax und Animationen sind reine CSS/Intersection-Observer-Implementierungen ohne externe Libraries. Das Filter-System auf der Umbauten-Seite ist ein Client Component (interaktiv), der Rest ist Server Components.

**Tech Stack:** Next.js 14 App Router, Supabase Server Client (Plan 1), Tailwind CSS (Plan 1), React Intersection Observer (kein npm-Paket — nativer Browser-API)

**Voraussetzung:** Plan 1 abgeschlossen (Foundation, Design-System, Supabase-Typen, Nav/Footer).

---

## File Map

```
app/
├── page.tsx                        # Homepage (ersetzt Placeholder aus Plan 1)
├── umbauten/
│   ├── page.tsx                    # Umbauten-Grid (Server Component + Client-Filter)
│   └── [id]/
│       └── page.tsx                # Umbau-Detailseite (Server Component)
├── leistungen/page.tsx             # Statische Leistungen-Seite
├── ueber-uns/page.tsx              # Statische Über-uns-Seite
├── faq/page.tsx                    # Statische FAQ-Seite
├── partner/page.tsx                # Statische Partner-Seite
└── kontakt/page.tsx                # Kontakt-Seite mit Formular
components/
├── StatsTicker.tsx                 # Laufender Ticker (Client Component, Animation)
├── ParallaxHero.tsx                # Hero mit Parallax-Scroll (Client Component)
├── UmbauCard.tsx                   # Card für Grid + Teaser
├── UmbauGrid.tsx                   # Grid-Container mit Filter-Logik (Client Component)
├── FadeInSection.tsx               # Intersection Observer fade-in Wrapper
└── VideoEmbed.tsx                  # YouTube/Instagram Embed (Client Component)
__tests__/
├── components/
│   ├── UmbauCard.test.tsx
│   ├── UmbauGrid.test.tsx
│   └── StatsTicker.test.tsx
└── lib/
    └── utils.test.ts               # ps-delta Berechnung etc.
lib/
└── utils.ts                        # Hilfsfunktionen (PS-Delta, URL-Cleanup)
```

---

## Task 1: Hilfsfunktionen

**Files:**
- Create: `lib/utils.ts`
- Create: `__tests__/lib/utils.test.ts`

- [ ] **Step 1: Failing Tests schreiben**

```typescript
// __tests__/lib/utils.test.ts
import { calcPsDelta, calcNmDelta, formatPs, getYoutubeId } from '@/lib/utils'

describe('calcPsDelta', () => {
  it('berechnet positiven Delta', () => {
    expect(calcPsDelta(913, 148)).toBe(765)
  })

  it('gibt null zurück wenn ps_vorher null', () => {
    expect(calcPsDelta(913, null)).toBeNull()
  })
})

describe('calcNmDelta', () => {
  it('berechnet positiven Delta', () => {
    expect(calcNmDelta(992, 220)).toBe(772)
  })

  it('gibt null zurück wenn nm_vorher null', () => {
    expect(calcNmDelta(992, null)).toBeNull()
  })
})

describe('formatPs', () => {
  it('formatiert PS-Zahl mit Einheit', () => {
    expect(formatPs(913)).toBe('913 PS')
  })
})

describe('getYoutubeId', () => {
  it('extrahiert ID aus standard URL', () => {
    expect(getYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrahiert ID aus youtu.be URL', () => {
    expect(getYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('gibt null für non-YouTube-URL zurück', () => {
    expect(getYoutubeId('https://instagram.com/p/abc')).toBeNull()
  })

  it('gibt null für null-Input zurück', () => {
    expect(getYoutubeId(null)).toBeNull()
  })
})
```

- [ ] **Step 2: Tests ausführen — erwarte FAIL**

```bash
npm test -- --testPathPattern="utils.test"
```

Erwartung: FAIL — `Cannot find module '@/lib/utils'`

- [ ] **Step 3: utils.ts implementieren** (`lib/utils.ts`)

```typescript
export function calcPsDelta(psNachher: number, psVorher: number | null): number | null {
  if (psVorher === null) return null
  return psNachher - psVorher
}

export function calcNmDelta(nmNachher: number, nmVorher: number | null): number | null {
  if (nmVorher === null) return null
  return nmNachher - nmVorher
}

export function formatPs(ps: number): string {
  return `${ps} PS`
}

export function getYoutubeId(url: string | null): string | null {
  if (!url) return null

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
```

- [ ] **Step 4: Tests ausführen — erwarte PASS**

```bash
npm test -- --testPathPattern="utils.test"
```

Erwartung: 7 Tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/utils.ts __tests__/lib/utils.test.ts
git commit -m "feat: add utility functions with tests"
```

---

## Task 2: UmbauCard-Komponente

**Files:**
- Create: `components/UmbauCard.tsx`
- Create: `__tests__/components/UmbauCard.test.tsx`

- [ ] **Step 1: Failing Tests schreiben**

```typescript
// __tests__/components/UmbauCard.test.tsx
import { render, screen } from '@testing-library/react'
import UmbauCard from '@/components/UmbauCard'
import type { Umbau } from '@/lib/supabase/types'

const mockUmbau: Umbau = {
  id: 'test-id-123',
  fahrzeug: 'Golf 2 VR6',
  ps_nachher: 913,
  nm_nachher: 992,
  stage: 'Stage 3+',
  ps_vorher: 148,
  nm_vorher: 220,
  foto_fahrzeug: 'https://example.com/foto.jpg',
  foto_diagramm: 'https://example.com/diagramm.jpg',
  galerie: [],
  beschreibung: 'Testbeschreibung',
  komponenten: null,
  tags: ['VW', 'Stage 3+'],
  video_url: null,
  erstellt_am: new Date().toISOString(),
}

describe('UmbauCard', () => {
  it('zeigt Fahrzeugbezeichnung an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('Golf 2 VR6')).toBeInTheDocument()
  })

  it('zeigt PS-Zahl an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('913')).toBeInTheDocument()
  })

  it('zeigt Stage an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('Stage 3+')).toBeInTheDocument()
  })

  it('verlinkt auf Detailseite', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/umbauten/test-id-123')
  })

  it('zeigt NEU-Badge für aktuelle Einträge (< 7 Tage)', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('NEU')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Tests ausführen — erwarte FAIL**

```bash
npm test -- --testPathPattern="UmbauCard.test"
```

Erwartung: FAIL — `Cannot find module '@/components/UmbauCard'`

- [ ] **Step 3: UmbauCard implementieren** (`components/UmbauCard.tsx`)

```typescript
import Link from 'next/link'
import Image from 'next/image'
import type { Umbau } from '@/lib/supabase/types'

type Props = {
  umbau: Umbau
}

function isNeu(erstelltAm: string): boolean {
  const diff = Date.now() - new Date(erstelltAm).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000 // 7 Tage
}

export default function UmbauCard({ umbau }: Props) {
  const neu = isNeu(umbau.erstellt_am)

  return (
    <Link href={`/umbauten/${umbau.id}`} className="card-base block">
      {/* Fahrzeugfoto */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-raised">
        <Image
          src={umbau.foto_fahrzeug}
          alt={umbau.fahrzeug}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {neu && (
          <span className="absolute top-2 right-2 bg-amber text-black text-[9px] font-bold px-2 py-0.5 tracking-widest">
            NEU
          </span>
        )}
      </div>

      {/* Inhalt */}
      <div className="p-4">
        <p className="label text-amber mb-1">{umbau.fahrzeug}</p>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-mono text-2xl font-black text-text-primary">{umbau.ps_nachher}</span>
          <span className="text-text-faint text-xs">PS</span>
          <span className="text-text-faint text-xs">/ {umbau.nm_nachher} NM</span>
        </div>

        <p className="text-amber text-xs mb-2">{umbau.stage}</p>

        {umbau.beschreibung && (
          <p className="text-text-faint text-xs leading-relaxed line-clamp-2">
            {umbau.beschreibung}
          </p>
        )}

        {/* Tags */}
        {umbau.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {umbau.tags.map((tag) => (
              <span
                key={tag}
                className="bg-bg-raised border border-bg-border text-text-faint text-[9px] px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Tests ausführen — erwarte PASS**

```bash
npm test -- --testPathPattern="UmbauCard.test"
```

Erwartung: 5 Tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/UmbauCard.tsx __tests__/components/UmbauCard.test.tsx
git commit -m "feat: add UmbauCard component with tests"
```

---

## Task 3: StatsTicker-Komponente

**Files:**
- Create: `components/StatsTicker.tsx`
- Create: `__tests__/components/StatsTicker.test.tsx`

- [ ] **Step 1: Failing Test schreiben**

```typescript
// __tests__/components/StatsTicker.test.tsx
import { render, screen } from '@testing-library/react'
import StatsTicker from '@/components/StatsTicker'
import type { Umbau } from '@/lib/supabase/types'

const mockUmbauten: Pick<Umbau, 'id' | 'fahrzeug' | 'ps_nachher' | 'nm_nachher'>[] = [
  { id: '1', fahrzeug: 'Golf 2 VR6', ps_nachher: 913, nm_nachher: 992 },
  { id: '2', fahrzeug: 'Audi RS4',   ps_nachher: 662, nm_nachher: 880 },
]

describe('StatsTicker', () => {
  it('zeigt alle Fahrzeugbezeichnungen', () => {
    render(<StatsTicker umbauten={mockUmbauten} />)
    // Doppelt im DOM wegen Loop-Duplikation
    const golfElems = screen.getAllByText('Golf 2 VR6')
    expect(golfElems.length).toBeGreaterThanOrEqual(1)
  })

  it('zeigt PS-Zahlen', () => {
    render(<StatsTicker umbauten={mockUmbauten} />)
    const ps = screen.getAllByText('913 PS')
    expect(ps.length).toBeGreaterThanOrEqual(1)
  })
})
```

- [ ] **Step 2: Test ausführen — erwarte FAIL**

```bash
npm test -- --testPathPattern="StatsTicker.test"
```

Erwartung: FAIL — `Cannot find module '@/components/StatsTicker'`

- [ ] **Step 3: StatsTicker implementieren** (`components/StatsTicker.tsx`)

```typescript
'use client'

import type { Umbau } from '@/lib/supabase/types'

type Props = {
  umbauten: Pick<Umbau, 'id' | 'fahrzeug' | 'ps_nachher' | 'nm_nachher'>[]
}

export default function StatsTicker({ umbauten }: Props) {
  // Inhalte doppeln für nahtlosen Loop
  const items = [...umbauten, ...umbauten]

  return (
    <div className="bg-bg-surface border-y border-bg-border py-3 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: 'max-content' }}>
        {items.map((u, i) => (
          <div key={`${u.id}-${i}`} className="flex items-center gap-8 px-8">
            <div className="text-center">
              <div className="font-mono text-xl font-black text-amber">{u.ps_nachher} PS</div>
              <div className="label text-text-faint">{u.fahrzeug}</div>
            </div>
            <div className="text-bg-border text-2xl select-none">|</div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Tests ausführen — erwarte PASS**

```bash
npm test -- --testPathPattern="StatsTicker.test"
```

Erwartung: 2 Tests PASS

- [ ] **Step 5: Commit**

```bash
git add components/StatsTicker.tsx __tests__/components/StatsTicker.test.tsx
git commit -m "feat: add StatsTicker component with loop animation"
```

---

## Task 4: FadeInSection + ParallaxHero

**Files:**
- Create: `components/FadeInSection.tsx`
- Create: `components/ParallaxHero.tsx`

- [ ] **Step 1: FadeInSection implementieren** (`components/FadeInSection.tsx`)

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number // ms
}

export default function FadeInSection({ children, className = '', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: ParallaxHero implementieren** (`components/ParallaxHero.tsx`)

```typescript
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return
      const scrolled = window.scrollY
      bgRef.current.style.transform = `translateY(${scrolled * 0.4}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden border-b-2 border-amber">
      {/* Parallax-Hintergrund */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(200,144,42,0.06) 0%, transparent 60%), linear-gradient(160deg, #0a0a0a 0%, #1a1208 100%)',
        }}
      />

      {/* Dekoratives Grid-Muster */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#c8902a 1px, transparent 1px), linear-gradient(90deg, #c8902a 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Inhalt */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <p className="label text-amber mb-6">// WENN'S UM LEISTUNG GEHT</p>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
          MEHR LEISTUNG.
          <br />
          <span className="text-amber">KEIN KOMPROMISS.</span>
        </h1>

        <p className="text-text-muted text-lg max-w-xl leading-relaxed mb-10">
          Turbo-Umbauten & Chiptuning auf höchstem Niveau —
          dokumentiert, messbar, TÜV-eingetragen.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/umbauten" className="btn-primary text-sm px-8 py-3">
            UMBAUTEN ANSEHEN →
          </Link>
          <Link href="/kontakt" className="btn-secondary text-sm px-8 py-3">
            KONTAKT
          </Link>
        </div>
      </div>

      {/* Gradient-Overlay unten */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-base to-transparent" />
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/FadeInSection.tsx components/ParallaxHero.tsx
git commit -m "feat: add FadeInSection and ParallaxHero components"
```

---

## Task 5: Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Homepage implementieren**

```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import ParallaxHero from '@/components/ParallaxHero'
import StatsTicker from '@/components/StatsTicker'
import UmbauCard from '@/components/UmbauCard'
import FadeInSection from '@/components/FadeInSection'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createClient()

  const { data: umbauten } = await supabase
    .from('umbauten')
    .select('*')
    .order('erstellt_am', { ascending: false })
    .limit(20)

  const teaser = (umbauten ?? []).slice(0, 3)
  const tickerData = (umbauten ?? []).slice(0, 8).map((u) => ({
    id: u.id,
    fahrzeug: u.fahrzeug,
    ps_nachher: u.ps_nachher,
    nm_nachher: u.nm_nachher,
  }))

  return (
    <>
      <ParallaxHero />

      {/* Stats-Ticker */}
      {tickerData.length > 0 && <StatsTicker umbauten={tickerData} />}

      {/* Neueste Umbauten */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="label text-amber mb-2">// AKTUELLE UMBAUTEN</p>
              <h2 className="text-3xl font-black text-text-primary">Neueste Referenzen</h2>
            </div>
            <Link href="/umbauten" className="text-amber text-xs border-b border-amber pb-0.5 hover:text-amber-light transition-colors">
              ALLE ANSEHEN →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teaser.map((umbau) => (
              <UmbauCard key={umbau.id} umbau={umbau} />
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Statement-Sektion */}
      <FadeInSection delay={100}>
        <section className="border-y border-bg-border bg-bg-surface">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <p className="label text-amber mb-6">// PHILOSOPHIE</p>
            <blockquote className="text-3xl md:text-4xl font-black leading-snug text-text-primary">
              "Jeder Umbau ist ein Unikat.
              <br />
              <span className="text-amber">Jede PS-Zahl ist beweisbar."</span>
            </blockquote>
            <p className="text-text-faint text-sm mt-6">
              Alle Referenzen mit Prüfstandsdiagramm & vollständiger Dokumentation
            </p>
          </div>
        </section>
      </FadeInSection>
    </>
  )
}
```

- [ ] **Step 2: Visuell prüfen**

```bash
npm run dev
```

Browser: Homepage zeigt Hero, Stats-Ticker, 3 Umbau-Cards, Statement-Sektion.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: implement homepage with parallax hero and teaser grid"
```

---

## Task 6: Umbauten-Grid mit Filter

**Files:**
- Create: `components/UmbauGrid.tsx`
- Create: `app/umbauten/page.tsx`

- [ ] **Step 1: UmbauGrid implementieren** (`components/UmbauGrid.tsx`)

```typescript
'use client'

import { useState, useMemo } from 'react'
import UmbauCard from './UmbauCard'
import type { Umbau } from '@/lib/supabase/types'

type Props = {
  umbauten: Umbau[]
  alleTags: string[]
}

export default function UmbauGrid({ umbauten, alleTags }: Props) {
  const [aktiverTag, setAktiverTag] = useState<string | null>(null)
  const [suche, setSuche] = useState('')

  const gefiltert = useMemo(() => {
    return umbauten.filter((u) => {
      const tagMatch = aktiverTag ? u.tags.includes(aktiverTag) : true
      const sucheMatch = suche
        ? u.fahrzeug.toLowerCase().includes(suche.toLowerCase()) ||
          u.tags.some((t) => t.toLowerCase().includes(suche.toLowerCase()))
        : true
      return tagMatch && sucheMatch
    })
  }, [umbauten, aktiverTag, suche])

  return (
    <div>
      {/* Filter-Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="label mr-2">FILTER:</span>

        <button
          onClick={() => setAktiverTag(null)}
          className={`label px-3 py-1.5 border transition-colors ${
            aktiverTag === null
              ? 'bg-amber text-black border-amber'
              : 'border-bg-border text-text-faint hover:border-amber hover:text-amber'
          }`}
        >
          ALLE
        </button>

        {alleTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setAktiverTag(tag === aktiverTag ? null : tag)}
            className={`label px-3 py-1.5 border transition-colors ${
              aktiverTag === tag
                ? 'bg-amber text-black border-amber'
                : 'border-bg-border text-text-faint hover:border-amber hover:text-amber'
            }`}
          >
            {tag}
          </button>
        ))}

        {/* Suche */}
        <div className="ml-auto flex items-center gap-2 bg-bg-surface border border-bg-border px-3 py-1.5">
          <svg className="w-3 h-3 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Suche…"
            className="bg-transparent text-xs text-text-primary placeholder-text-faint outline-none w-32"
          />
        </div>
      </div>

      {/* Grid */}
      {gefiltert.length === 0 ? (
        <div className="py-20 text-center">
          <p className="label text-text-faint">Keine Umbauten gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gefiltert.map((umbau) => (
            <UmbauCard key={umbau.id} umbau={umbau} />
          ))}
        </div>
      )}

      <p className="label text-text-faint mt-8 text-center">
        {gefiltert.length} von {umbauten.length} Umbau{umbauten.length !== 1 ? 'ten' : ''}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Umbauten-Seite implementieren** (`app/umbauten/page.tsx`)

```typescript
import { createClient } from '@/lib/supabase/server'
import UmbauGrid from '@/components/UmbauGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Umbauten',
  description: 'Alle Turbo-Umbauten und Chiptuning-Referenzen von Turbodoedel.de',
}

export default async function UmbautenPage() {
  const supabase = createClient()

  const { data: umbauten } = await supabase
    .from('umbauten')
    .select('*')
    .order('erstellt_am', { ascending: false })

  const alleTags = Array.from(
    new Set((umbauten ?? []).flatMap((u) => u.tags))
  ).sort()

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="label text-amber mb-3">// REFERENZEN</p>
        <h1 className="text-4xl font-black text-text-primary">Turbo-Umbauten</h1>
        <p className="text-text-muted mt-3 max-w-xl">
          Alle dokumentierten Umbauten — mit Prüfstandsdiagramm, Vorher/Nachher-Vergleich und vollständiger Teile-Dokumentation.
        </p>
      </div>

      <UmbauGrid umbauten={umbauten ?? []} alleTags={alleTags} />
    </div>
  )
}
```

- [ ] **Step 3: Visuell prüfen**

```bash
npm run dev
```

Browser: `/umbauten` zeigt Card-Grid mit Filter-Buttons und Suchfeld.

- [ ] **Step 4: Commit**

```bash
git add components/UmbauGrid.tsx app/umbauten/
git commit -m "feat: add Umbauten grid page with filter and search"
```

---

## Task 7: Umbau-Detailseite

**Files:**
- Create: `app/umbauten/[id]/page.tsx`
- Create: `components/VideoEmbed.tsx`

- [ ] **Step 1: VideoEmbed implementieren** (`components/VideoEmbed.tsx`)

```typescript
'use client'

import { getYoutubeId } from '@/lib/utils'

type Props = {
  url: string
}

export default function VideoEmbed({ url }: Props) {
  const youtubeId = getYoutubeId(url)

  if (youtubeId) {
    return (
      <div className="relative aspect-video bg-bg-raised">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Prüfstandsvideo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  // Fallback: Direktlink
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-bg-surface border border-bg-border p-4 hover:border-amber transition-colors"
    >
      <div className="bg-amber w-8 h-8 flex items-center justify-center flex-shrink-0">
        <span className="text-black text-xs">▶</span>
      </div>
      <span className="text-text-muted text-sm">Video ansehen</span>
    </a>
  )
}
```

- [ ] **Step 2: Detailseite implementieren** (`app/umbauten/[id]/page.tsx`)

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import VideoEmbed from '@/components/VideoEmbed'
import FadeInSection from '@/components/FadeInSection'
import { calcPsDelta, calcNmDelta } from '@/lib/utils'
import type { Metadata } from 'next'

type Props = { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('umbauten')
    .select('fahrzeug, ps_nachher')
    .eq('id', params.id)
    .single()

  if (!data) return { title: 'Umbau nicht gefunden' }

  return {
    title: `${data.fahrzeug} — ${data.ps_nachher} PS`,
    description: `Turbo-Umbau: ${data.fahrzeug} mit ${data.ps_nachher} PS`,
  }
}

export default async function UmbauDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: umbau } = await supabase
    .from('umbauten')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!umbau) notFound()

  const psDelta = calcPsDelta(umbau.ps_nachher, umbau.ps_vorher)
  const nmDelta = calcNmDelta(umbau.nm_nachher, umbau.nm_vorher)
  const komponenten = umbau.komponenten
    ? umbau.komponenten.split(',').map((k) => k.trim()).filter(Boolean)
    : []

  return (
    <article>
      {/* Hero-Bild */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden border-b-2 border-amber">
        <Image
          src={umbau.foto_fahrzeug}
          alt={umbau.fahrzeug}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/40 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <p className="label text-amber">{umbau.fahrzeug} · {umbau.stage}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Zurück-Link */}
        <Link href="/umbauten" className="label text-text-faint hover:text-amber transition-colors mb-8 inline-block">
          ← ALLE UMBAUTEN
        </Link>

        {/* PS/NM Headline */}
        <FadeInSection>
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono text-6xl font-black text-text-primary">{umbau.ps_nachher}</span>
            <span className="font-mono text-3xl font-black text-amber">PS</span>
            <span className="text-text-faint text-xl">/ {umbau.nm_nachher} NM</span>
          </div>
        </FadeInSection>

        {/* Vorher / Nachher */}
        {(umbau.ps_vorher || umbau.nm_vorher) && (
          <FadeInSection delay={50}>
            <div className="bg-bg-surface border border-bg-border p-6 mb-8 grid grid-cols-3 gap-4">
              <div>
                <p className="label text-text-faint mb-1">VORHER</p>
                <p className="font-mono text-lg font-bold text-text-muted">
                  {umbau.ps_vorher} PS / {umbau.nm_vorher} NM
                </p>
              </div>
              <div>
                <p className="label text-amber mb-1">NACHHER</p>
                <p className="font-mono text-lg font-bold text-amber">
                  {umbau.ps_nachher} PS / {umbau.nm_nachher} NM
                </p>
              </div>
              {(psDelta || nmDelta) && (
                <div>
                  <p className="label text-text-faint mb-1">ZUWACHS</p>
                  <p className="font-mono text-lg font-bold text-text-primary">
                    {psDelta ? `+${psDelta} PS` : ''}{nmDelta ? ` / +${nmDelta} NM` : ''}
                  </p>
                </div>
              )}
            </div>
          </FadeInSection>
        )}

        {/* Prüfstandsdiagramm */}
        <FadeInSection delay={100}>
          <div className="mb-8">
            <p className="label text-amber mb-3">PRÜFSTANDSDIAGRAMM</p>
            <div className="relative aspect-[16/9] bg-bg-raised overflow-hidden border border-bg-border">
              <Image
                src={umbau.foto_diagramm}
                alt={`Prüfstandsdiagramm ${umbau.fahrzeug}`}
                fill
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        </FadeInSection>

        {/* Beschreibung */}
        {umbau.beschreibung && (
          <FadeInSection delay={150}>
            <div className="mb-8">
              <p className="label text-amber mb-3">BESCHREIBUNG</p>
              <p className="text-text-muted leading-relaxed">{umbau.beschreibung}</p>
            </div>
          </FadeInSection>
        )}

        {/* Komponenten */}
        {komponenten.length > 0 && (
          <FadeInSection delay={200}>
            <div className="mb-8">
              <p className="label text-amber mb-3">KOMPONENTEN</p>
              <div className="flex flex-wrap gap-2">
                {komponenten.map((k) => (
                  <span key={k} className="bg-bg-surface border border-bg-border text-text-muted text-xs px-3 py-1">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Tags */}
        {umbau.tags.length > 0 && (
          <FadeInSection delay={250}>
            <div className="mb-8">
              <p className="label text-amber mb-3">TAGS</p>
              <div className="flex flex-wrap gap-2">
                {umbau.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/umbauten?tag=${encodeURIComponent(tag)}`}
                    className="bg-bg-raised border border-bg-border text-text-faint text-xs px-3 py-1 hover:border-amber hover:text-amber transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Galerie */}
        {umbau.galerie.length > 0 && (
          <FadeInSection delay={300}>
            <div className="mb-8">
              <p className="label text-amber mb-3">GALERIE</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {umbau.galerie.map((url, i) => (
                  <div key={i} className="relative aspect-[4/3] bg-bg-raised overflow-hidden">
                    <Image
                      src={url}
                      alt={`${umbau.fahrzeug} Foto ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Video */}
        {umbau.video_url && (
          <FadeInSection delay={350}>
            <div className="mb-8">
              <p className="label text-amber mb-3">VIDEO</p>
              <VideoEmbed url={umbau.video_url} />
            </div>
          </FadeInSection>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 3: next.config.js — externe Bild-Domains erlauben**

In `next.config.js` (oder `next.config.ts`):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Für Testdaten (picsum)
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

module.exports = nextConfig
```

- [ ] **Step 4: Visuell prüfen**

```bash
npm run dev
```

Browser: Klick auf eine Card → Detailseite mit Hero, PS-Headline, Vorher/Nachher, Diagramm.

- [ ] **Step 5: Commit**

```bash
git add app/umbauten/ components/VideoEmbed.tsx next.config.js
git commit -m "feat: add Umbau detail page with all content sections"
```

---

## Task 8: Statische Seiten

**Files:**
- Create: `app/leistungen/page.tsx`
- Create: `app/ueber-uns/page.tsx`
- Create: `app/faq/page.tsx`
- Create: `app/partner/page.tsx`
- Create: `app/kontakt/page.tsx`

- [ ] **Step 1: Leistungen-Seite** (`app/leistungen/page.tsx`)

```typescript
import FadeInSection from '@/components/FadeInSection'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leistungen' }

const LEISTUNGEN = [
  {
    title: 'Turbo-Umbauten',
    desc: 'Komplette Turbo- und Twin-Turbo-Umbauten für nahezu alle Fahrzeuge. Von Stage 1 bis Stage 3+ — alles aus einer Hand, auf eigenem Prüfstand vermessen.',
  },
  {
    title: 'Chiptuning / ECU-Optimierung',
    desc: 'Individuelle Software-Anpassungen für die Motorsteuerung. Mehr Leistung, besseres Ansprechverhalten, optimierter Verbrauch.',
  },
  {
    title: 'Online-Tuning',
    desc: 'ECU-Optimierung remote: Originaldatei einsenden, optimierte Datei zurückerhalten. Schnell, zuverlässig, mit telefonischer Beratung.',
  },
  {
    title: 'TÜV-Eintragung',
    desc: 'Umbauten sauber und legal — in Kooperation mit zertifizierten Prüfern für die TÜV-Eintragung und Einzelabnahme.',
  },
]

export default function LeistungenPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// LEISTUNGEN</p>
      <h1 className="text-4xl font-black mb-12">Was wir anbieten</h1>

      <div className="grid gap-6">
        {LEISTUNGEN.map((l, i) => (
          <FadeInSection key={l.title} delay={i * 80}>
            <div className="bg-bg-surface border border-bg-border border-l-2 border-l-amber p-6">
              <h2 className="text-text-primary font-bold text-lg mb-2">{l.title}</h2>
              <p className="text-text-muted leading-relaxed">{l.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: FAQ-Seite** (`app/faq/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

const FAQS = [
  {
    frage: 'Ist das Tuning TÜV-abnahmefähig?',
    antwort: 'Ja — wir arbeiten mit zertifizierten Prüfern zusammen. Umbauten können als Einzelabnahme eingetragen werden. Die genaue Machbarkeit hängt vom Fahrzeug und Umbauumfang ab.',
  },
  {
    frage: 'Verliere ich meine Garantie?',
    antwort: 'Bei Software-Optimierungen gilt dies je nach Hersteller unterschiedlich. Für ältere Fahrzeuge ohne aktive Herstellergarantie ist dies üblicherweise irrelevant. Wir beraten dich individuell.',
  },
  {
    frage: 'Wie läuft ein Umbau ab?',
    antwort: 'Kontakt aufnehmen → Beratungsgespräch → Angebot → Termin vereinbaren → Umbau + Prüfstandsmessung → Dokumentation und Übergabe.',
  },
  {
    frage: 'Bietet ihr Online-Tuning an?',
    antwort: 'Ja. Originaldatei aus der ECU auslesen, per E-Mail einsenden. Wir optimieren die Datei und senden sie zurück. Telefonische Begleitung inklusive.',
  },
  {
    frage: 'Was kostet ein Turbo-Umbau?',
    antwort: 'Das hängt stark vom Fahrzeug und Ziel ab. Wir erstellen ein individuelles Angebot nach Beratungsgespräch. Nimm einfach Kontakt auf.',
  },
]

export default function FAQPage() {
  const [offen, setOffen] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// FAQ</p>
      <h1 className="text-4xl font-black mb-12">Häufige Fragen</h1>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-bg-border">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-bg-surface transition-colors"
              onClick={() => setOffen(offen === i ? null : i)}
            >
              <span className="text-text-primary font-medium">{faq.frage}</span>
              <span className="text-amber ml-4 flex-shrink-0">{offen === i ? '−' : '+'}</span>
            </button>
            {offen === i && (
              <div className="px-6 pb-4 text-text-muted leading-relaxed border-t border-bg-border pt-4">
                {faq.antwort}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Über-uns-Seite** (`app/ueber-uns/page.tsx`)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Über uns' }

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// ÜBER UNS</p>
      <h1 className="text-4xl font-black mb-8">Turbodoedel.de</h1>

      <div className="space-y-6 text-text-muted leading-relaxed">
        <p>
          Turbodoedel.de steht für kompromisslosen Leistungssport. Wir bauen Turbo-Systeme,
          die nicht nur auf dem Papier beeindrucken — sondern auf dem Prüfstand beweisen, was sie können.
        </p>
        <p>
          Jeder Umbau wird auf unserem eigenen Prüfstand vermessen und vollständig dokumentiert.
          Keine Fantasiezahlen — nur messbare, reproduzierbare Leistung.
        </p>
        <p>
          Unsere Philosophie: Qualität vor Quantität. Lieber ein perfekter Umbau als zehn halbfertige.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Partner-Seite** (`app/partner/page.tsx`)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Partner' }

export default function PartnerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// PARTNER</p>
      <h1 className="text-4xl font-black mb-12">Unsere Partner</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-bg-border border-l-2 border-l-amber p-6">
          <h2 className="text-text-primary font-bold mb-2">Exclusive-Tuningparts</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Zertifizierter Partner für TÜV-Eintragungen und Einzelabnahmen.
            Gemeinsam bieten wir legale Lösungen für anspruchsvolle Umbauten.
          </p>
        </div>
      </div>

      <p className="text-text-faint text-sm mt-10">
        Interessiert an einer Partnerschaft? <a href="/kontakt" className="text-amber hover:underline">Melde dich.</a>
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Kontakt-Seite** (`app/kontakt/page.tsx`)

```typescript
'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

export default function KontaktPage() {
  const [gesendet, setGesendet] = useState(false)
  const [laden, setLaden] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLaden(true)

    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      nachricht: (form.elements.namedItem('nachricht') as HTMLTextAreaElement).value,
    }

    // Kontaktformular: Spec markiert E-Mail-Versand als "Offene Entscheidung".
    // Vorläufig wird das Formular ohne Backend-Versand umgesetzt (simuliert).
    // Für echten E-Mail-Versand: Resend oder SendGrid API-Route ergänzen.
    console.log('Kontaktformular:', data)
    await new Promise((r) => setTimeout(r, 800)) // Simuliertes Senden
    setGesendet(true)
    setLaden(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// KONTAKT</p>
      <h1 className="text-4xl font-black mb-12">Schreib uns</h1>

      {gesendet ? (
        <div className="bg-bg-surface border border-amber p-8 text-center">
          <p className="text-amber text-lg font-bold mb-2">Nachricht erhalten!</p>
          <p className="text-text-muted">Wir melden uns so schnell wie möglich bei dir.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label block mb-2">NAME *</label>
            <input name="name" required className="field" placeholder="Max Mustermann" />
          </div>
          <div>
            <label className="label block mb-2">E-MAIL *</label>
            <input name="email" type="email" required className="field" placeholder="max@beispiel.de" />
          </div>
          <div>
            <label className="label block mb-2">NACHRICHT *</label>
            <textarea name="nachricht" required rows={5} className="field resize-none" placeholder="Dein Fahrzeug, dein Vorhaben…" />
          </div>
          <button type="submit" disabled={laden} className="btn-primary w-full py-3 disabled:opacity-50">
            {laden ? 'WIRD GESENDET…' : 'NACHRICHT SENDEN'}
          </button>
        </form>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/leistungen/ app/ueber-uns/ app/faq/ app/partner/ app/kontakt/
git commit -m "feat: add all static pages (Leistungen, FAQ, Über uns, Partner, Kontakt)"
```

---

## Abschluss Plan 2

- [ ] **Alle Tests ausführen**

```bash
npm test
```

Erwartung: Alle Tests PASS

- [ ] **Build-Check**

```bash
npm run build
```

Erwartung: Kein TypeScript-Fehler, alle Seiten gebaut.

- [ ] **Vollständiger visueller Check**

```bash
npm run dev
```

Alle Routen durchklicken: `/`, `/umbauten`, `/umbauten/[id]`, `/leistungen`, `/faq`, `/ueber-uns`, `/partner`, `/kontakt`

**Plan 2 abgeschlossen.** Weiter mit Plan 3: Admin-Panel.
