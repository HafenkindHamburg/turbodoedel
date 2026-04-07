# Turbodoedel.de — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js-Projekt aufsetzen mit Supabase-Integration, Datenbank-Schema, Design-System-Grundlagen (Tailwind Dark-Theme) und globalem Layout (Navigation + Footer).

**Architecture:** Next.js 14 App Router. Supabase stellt PostgreSQL (Umbauten-Daten), Storage (Bilder) und Auth (Admin-Login) bereit. Tailwind CSS mit custom Design-Tokens für das Dark+Industrial-Theme. Server Components für alle öffentlichen Seiten (kein unnötiges Client-Bundle).

**Tech Stack:** Next.js 14, Supabase JS v2, Tailwind CSS 3, TypeScript, Jest + React Testing Library

---

## File Map

```
turbodoedel/
├── app/
│   ├── layout.tsx                  # Root layout: <html>, Nav, Footer
│   ├── globals.css                 # Tailwind directives + CSS custom properties
│   └── page.tsx                    # Placeholder-Homepage (ersetzt in Plan 2)
├── components/
│   ├── Nav.tsx                     # Sticky Navigation
│   └── Footer.tsx                  # Footer mit Social Links
├── lib/
│   └── supabase/
│       ├── client.ts               # Browser-seitiger Supabase-Client (singleton)
│       ├── server.ts               # Server-seitiger Supabase-Client (cookies)
│       └── types.ts                # Generierte DB-Typen (Umbau, etc.)
├── supabase/
│   └── migrations/
│       └── 001_create_umbauten.sql # Initiales DB-Schema
├── proxy.ts                         # Auth-Guard für /admin (wird in Plan 3 erweitert)
├── .env.local                      # NEXT_PUBLIC_SUPABASE_URL + ANON_KEY (nicht committen!)
└── __tests__/
    └── lib/
        └── supabase/
            └── types.test.ts       # Typ-Validierungstests
```

---

## Task 1: Next.js-Projekt scaffolden

**Files:**
- Create: `turbodoedel/` (Projektwurzel)

- [ ] **Step 1: Projekt erstellen**

```bash
cd /Users/marchansen/Documents/Claude/Projects
npx create-next-app@latest turbodoedel \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"
cd turbodoedel
```

- [ ] **Step 2: Supabase-Abhängigkeiten installieren**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 3: Test-Dependencies installieren**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 4: Jest konfigurieren**

Erstelle `jest.config.ts`:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Erstelle `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: package.json Test-Script ergänzen**

In `package.json` unter `"scripts"` ergänzen:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 6: Verify — Dev-Server startet**

```bash
npm run dev
```

Erwartung: Server läuft auf http://localhost:3000, Standard-Next.js-Seite sichtbar.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Supabase and Jest"
```

---

## Task 2: Tailwind Design-System konfigurieren (v4 CSS-first)

**Files:**
- Modify: `app/globals.css`

> **Tailwind v4 Hinweis:** Kein `tailwind.config.ts` nötig. Konfiguration erfolgt CSS-first via `@theme {}` in `globals.css`. Custom colors als `--color-*` Variablen werden von v4 automatisch als Utility-Klassen generiert (z.B. `bg-bg-base`, `text-amber`, `border-bg-border`).

- [ ] **Step 1: globals.css ersetzen**

```css
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-bg-base: #0a0a0a;
  --color-bg-surface: #111111;
  --color-bg-raised: #1a1a1a;
  --color-bg-border: #2a2a2a;

  /* Akzent: Gold/Amber */
  --color-amber: #c8902a;
  --color-amber-light: #e0a83a;
  --color-amber-dark: #a07020;

  /* Text */
  --color-text-primary: #ffffff;
  --color-text-secondary: #dddddd;
  --color-text-muted: #aaaaaa;
  --color-text-faint: #666666;

  /* Supabase-Grün (nur Admin-UI) */
  --color-supa: #3ecf8e;

  /* Fonts */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), monospace;

  /* Animations */
  --animate-ticker: ticker 30s linear infinite;
  --animate-fade-up: fadeUp 0.6s ease forwards;

  /* Keyframes */
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    0%   { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }
}

@layer base {
  :root { color-scheme: dark; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-bg-surface); }
  ::-webkit-scrollbar-thumb { background: var(--color-bg-border); border-radius: 9999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-amber); }
}

@layer components {
  .label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }
  .card-base {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-bg-border);
    transition: all 0.2s;
    cursor: pointer;
  }
  .card-base:hover {
    transform: translateY(-4px);
    border-color: var(--color-amber);
  }
  .field {
    background: var(--color-bg-surface);
    border: 1px solid var(--color-bg-border);
    padding: 0.5rem 0.75rem;
    color: var(--color-text-primary);
    font-size: 0.875rem;
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
  }
  .field:focus { border-color: var(--color-amber); }
  .btn-primary {
    background: var(--color-amber);
    color: black;
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    padding: 0.5rem 1rem;
    transition: background-color 0.15s;
  }
  .btn-primary:hover { background: var(--color-amber-light); }
  .btn-primary:active { background: var(--color-amber-dark); }
  .btn-secondary {
    background: var(--color-bg-raised);
    border: 1px solid var(--color-bg-border);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    transition: all 0.15s;
  }
  .btn-secondary:hover {
    border-color: var(--color-amber);
    color: var(--color-text-primary);
  }
}
```

- [ ] **Step 2: Dev-Server prüfen — keine CSS-Fehler**

```bash
npm run dev
```

Erwartung: Seite im Browser lädt, schwarzer Hintergrund sichtbar (Design-System aktiv).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add dark+industrial design system tokens (Tailwind v4 CSS-first)"
```

---

## Task 3: Supabase-Clients einrichten

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/types.ts`
- Create: `.env.local`

- [ ] **Step 1: .env.local erstellen (NICHT committen)**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=DEIN-ANON-KEY
EOF
```

`.env.local` zu `.gitignore` hinzufügen (ist normalerweise schon drin, prüfen):

```bash
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

- [ ] **Step 2: Browser-Client erstellen** (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Server-Client erstellen** (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './types'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — set-Aufrufe werden ignoriert
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Datenbank-Typen definieren** (`lib/supabase/types.ts`)

```typescript
export type Umbau = {
  id: string
  fahrzeug: string
  ps_nachher: number
  nm_nachher: number
  stage: string
  ps_vorher: number | null
  nm_vorher: number | null
  foto_fahrzeug: string
  foto_diagramm: string
  galerie: string[]
  beschreibung: string | null
  komponenten: string | null
  tags: string[]
  video_url: string | null
  erstellt_am: string
}

export type UmbauInsert = Omit<Umbau, 'id' | 'erstellt_am'>
export type UmbauUpdate = Partial<UmbauInsert>

export type Database = {
  public: {
    Tables: {
      umbauten: {
        Row: Umbau
        Insert: UmbauInsert
        Update: UmbauUpdate
      }
    }
  }
}
```

- [ ] **Step 5: Test für Typen schreiben** (`__tests__/lib/supabase/types.test.ts`)

```typescript
import type { Umbau, UmbauInsert } from '@/lib/supabase/types'

describe('Umbau types', () => {
  it('Umbau hat alle Pflichtfelder', () => {
    const umbau: Umbau = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fahrzeug: 'Golf 2 VR6',
      ps_nachher: 913,
      nm_nachher: 992,
      stage: 'Stage 3+',
      ps_vorher: null,
      nm_vorher: null,
      foto_fahrzeug: 'https://example.com/foto.jpg',
      foto_diagramm: 'https://example.com/diagramm.jpg',
      galerie: [],
      beschreibung: null,
      komponenten: null,
      tags: ['VW', 'Stage3+'],
      video_url: null,
      erstellt_am: '2025-03-14T10:00:00Z',
    }
    expect(umbau.fahrzeug).toBe('Golf 2 VR6')
    expect(umbau.ps_nachher).toBe(913)
  })

  it('UmbauInsert hat kein id oder erstellt_am', () => {
    const insert: UmbauInsert = {
      fahrzeug: 'Audi RS4',
      ps_nachher: 662,
      nm_nachher: 880,
      stage: 'Stage 2',
      ps_vorher: 420,
      nm_vorher: 560,
      foto_fahrzeug: 'https://example.com/foto.jpg',
      foto_diagramm: 'https://example.com/diagramm.jpg',
      galerie: [],
      beschreibung: 'Umbau mit...',
      komponenten: 'Garrett GTX',
      tags: ['Audi'],
      video_url: null,
    }
    // TypeScript würde id/erstellt_am als Fehler markieren
    expect(insert.fahrzeug).toBe('Audi RS4')
  })
})
```

- [ ] **Step 6: Tests laufen lassen**

```bash
npm test -- --testPathPattern="types.test"
```

Erwartung: 2 Tests PASS

- [ ] **Step 7: Commit**

```bash
git add lib/ __tests__/ .gitignore
git commit -m "feat: add Supabase client setup and database types"
```

---

## Task 4: Supabase-Datenbank-Schema

**Files:**
- Create: `supabase/migrations/001_create_umbauten.sql`

- [ ] **Step 1: Migration-Datei erstellen**

```bash
mkdir -p supabase/migrations
```

Erstelle `supabase/migrations/001_create_umbauten.sql`:

```sql
-- Umbauten-Tabelle
CREATE TABLE IF NOT EXISTS public.umbauten (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fahrzeug      text NOT NULL,
  ps_nachher    integer NOT NULL CHECK (ps_nachher > 0),
  nm_nachher    integer NOT NULL CHECK (nm_nachher > 0),
  stage         text NOT NULL CHECK (stage IN ('Stage 1', 'Stage 2', 'Stage 3', 'Stage 3+')),
  ps_vorher     integer CHECK (ps_vorher IS NULL OR ps_vorher > 0),
  nm_vorher     integer CHECK (nm_vorher IS NULL OR nm_vorher > 0),
  foto_fahrzeug text NOT NULL,
  foto_diagramm text NOT NULL,
  galerie       text[] NOT NULL DEFAULT '{}',
  beschreibung  text,
  komponenten   text,
  tags          text[] NOT NULL DEFAULT '{}',
  video_url     text,
  erstellt_am   timestamptz NOT NULL DEFAULT now()
);

-- Index für Sortierung nach Datum (häufigste Abfrage)
CREATE INDEX idx_umbauten_erstellt_am ON public.umbauten(erstellt_am DESC);

-- Index für Tag-Filter
CREATE INDEX idx_umbauten_tags ON public.umbauten USING GIN(tags);

-- Row Level Security aktivieren
ALTER TABLE public.umbauten ENABLE ROW LEVEL SECURITY;

-- Öffentlich: Lesen erlaubt
CREATE POLICY "umbauten_select_public"
  ON public.umbauten FOR SELECT
  USING (true);

-- Nur eingeloggte Admins dürfen schreiben/ändern/löschen
CREATE POLICY "umbauten_insert_admin"
  ON public.umbauten FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "umbauten_update_admin"
  ON public.umbauten FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "umbauten_delete_admin"
  ON public.umbauten FOR DELETE
  TO authenticated
  USING (true);

-- Storage Bucket für Bilder
INSERT INTO storage.buckets (id, name, public)
VALUES ('umbauten', 'umbauten', true)
ON CONFLICT DO NOTHING;

-- Storage Policy: Öffentlich lesbar
CREATE POLICY "storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'umbauten');

-- Storage Policy: Nur Admins dürfen hochladen
CREATE POLICY "storage_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'umbauten');

CREATE POLICY "storage_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'umbauten');
```

- [ ] **Step 2: Migration in Supabase ausführen**

Im Supabase-Dashboard → SQL Editor → Inhalt der Datei einfügen und ausführen.

Oder via Supabase CLI (wenn installiert):

```bash
npx supabase db push
```

- [ ] **Step 3: Verify — Tabelle existiert**

Im Supabase Dashboard → Table Editor: Tabelle `umbauten` mit allen Spalten sichtbar.
Im Storage: Bucket `umbauten` sichtbar.

- [ ] **Step 4: Testdaten einfügen (für Entwicklung)**

Im Supabase SQL Editor:

```sql
INSERT INTO public.umbauten
  (fahrzeug, ps_nachher, nm_nachher, stage, ps_vorher, nm_vorher,
   foto_fahrzeug, foto_diagramm, beschreibung, tags)
VALUES
  ('Golf 2 VR6', 913, 992, 'Stage 3+', 148, 220,
   'https://picsum.photos/seed/golf2/800/600',
   'https://picsum.photos/seed/diagramm1/800/600',
   'Komplettumbau mit Einzeldrosselanlage und Twin-Turbo-Setup.',
   ARRAY['VW', 'Twin-Turbo', 'Stage 3+']),
  ('Audi RS4', 662, 880, 'Stage 2', 420, 560,
   'https://picsum.photos/seed/rs4/800/600',
   'https://picsum.photos/seed/diagramm2/800/600',
   'Stage 2 Upgrade mit überarbeiteter Ladeluftkühlung.',
   ARRAY['Audi', 'Stage 2']),
  ('BMW M3', 580, 680, 'Stage 2', 431, 550,
   'https://picsum.photos/seed/m3/800/600',
   'https://picsum.photos/seed/diagramm3/800/600',
   NULL,
   ARRAY['BMW', 'Stage 2']);
```

- [ ] **Step 5: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase database schema with RLS policies"
```

---

## Task 5: Navigation und Footer

**Files:**
- Create: `components/Nav.tsx`
- Create: `components/Footer.tsx`
- Modify: `app/layout.tsx`
- Create: `__tests__/components/Nav.test.tsx`

- [ ] **Step 1: Failing Test für Nav schreiben**

```typescript
// __tests__/components/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

describe('Nav', () => {
  it('zeigt Logo an', () => {
    render(<Nav />)
    expect(screen.getByText(/TURBO/i)).toBeInTheDocument()
    expect(screen.getByText(/DÖEDEL/i)).toBeInTheDocument()
  })

  it('enthält Umbauten-Link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /umbauten/i })).toHaveAttribute('href', '/umbauten')
  })

  it('enthält Kontakt-Link als CTA', () => {
    render(<Nav />)
    const kontaktLink = screen.getByRole('link', { name: /kontakt/i })
    expect(kontaktLink).toHaveAttribute('href', '/kontakt')
    // CTA hat amber-Border
    expect(kontaktLink.className).toMatch(/border/)
  })
})
```

- [ ] **Step 2: Test ausführen — erwarte FAIL**

```bash
npm test -- --testPathPattern="Nav.test"
```

Erwartung: FAIL — `Cannot find module '@/components/Nav'`

- [ ] **Step 3: Nav-Komponente implementieren** (`components/Nav.tsx`)

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/umbauten',   label: 'UMBAUTEN'  },
  { href: '/leistungen', label: 'LEISTUNGEN' },
  { href: '/ueber-uns',  label: 'ÜBER UNS'  },
  { href: '/faq',        label: 'FAQ'        },
  { href: '/partner',    label: 'PARTNER'    },
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
```

- [ ] **Step 4: Footer-Komponente implementieren** (`components/Footer.tsx`)

```typescript
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-bg-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center">
              <span className="font-bold tracking-widest text-text-primary">TURBO</span>
              <span className="font-bold tracking-widest text-amber">DÖEDEL</span>
            </div>
            <p className="text-text-faint text-xs mt-2">Wenn's um Leistung geht.</p>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div>
              <p className="label mb-3">SEITEN</p>
              <ul className="space-y-2">
                {[
                  ['/umbauten',   'Umbauten'],
                  ['/leistungen', 'Leistungen'],
                  ['/faq',        'FAQ'],
                  ['/partner',    'Partner'],
                  ['/ueber-uns',  'Über uns'],
                  ['/kontakt',    'Kontakt'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-text-faint text-xs hover:text-amber transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label mb-3">SOCIAL</p>
              <ul className="space-y-2">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                     className="text-text-faint text-xs hover:text-amber transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                     className="text-text-faint text-xs hover:text-amber transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-bg-border mt-8 pt-6 flex justify-between items-center">
          <span className="text-text-faint text-xs">
            © {new Date().getFullYear()} Turbodoedel.de
          </span>
          <Link href="/admin" className="text-bg-border text-xs hover:text-text-faint transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Root Layout aktualisieren** (`app/layout.tsx`)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Turbodoedel.de',
    default:  'Turbodoedel.de — Turbo-Umbauten & Chiptuning',
  },
  description: 'Hochleistungs-Turbo-Umbauten und Chiptuning — dokumentiert, messbar, TÜV-eingetragen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Placeholder-Homepage** (`app/page.tsx`)

```typescript
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-text-faint label">Homepage — kommt in Plan 2</p>
    </div>
  )
}
```

- [ ] **Step 7: Tests ausführen**

```bash
npm test -- --testPathPattern="Nav.test"
```

Erwartung: 3 Tests PASS

- [ ] **Step 8: Visuell prüfen**

```bash
npm run dev
```

Browser öffnen: Navigation und Footer sichtbar, Amber-Akzente, dunkler Hintergrund.

- [ ] **Step 9: Commit**

```bash
git add app/ components/ __tests__/
git commit -m "feat: add Nav, Footer and root layout"
```

---

## Task 6: Auth-Proxy (Basis)

**Files:**
- Create: `proxy.ts`

- [ ] **Step 1: Proxy erstellen**

```typescript
// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // /admin-Routen schützen (außer /admin/login)
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !user
  ) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 2: Verify — Build läuft ohne Fehler**

```bash
npm run build
```

Erwartung: Build erfolgreich, keine TypeScript-Fehler.

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: add auth proxy for /admin routes"
```

---

## Abschluss Plan 1

- [ ] **Finaler Build-Check**

```bash
npm run build && npm test
```

Erwartung: Build grün, alle Tests PASS.

- [ ] **Gesamtcommit (falls nötig)**

```bash
git add -A
git commit -m "chore: plan 1 complete — foundation, design system, Supabase, Nav/Footer, proxy"
```

**Plan 1 abgeschlossen.** Weiter mit Plan 2: Öffentliches Frontend.
