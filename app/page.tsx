import { createClient } from '@/lib/supabase/server'
import ParallaxHero from '@/components/ParallaxHero'
import StatsTicker from '@/components/StatsTicker'
import UmbauCard from '@/components/UmbauCard'
import FadeInSection from '@/components/FadeInSection'
import Link from 'next/link'
import type { Umbau } from '@/lib/supabase/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: umbautenRaw } = await supabase
    .from('umbauten')
    .select('*')
    .order('erstellt_am', { ascending: false })
    .limit(20)

  const umbauten = (umbautenRaw ?? []) as Umbau[]

  const teaser = umbauten.slice(0, 3)
  const tickerData = umbauten.slice(0, 8).map((u) => ({
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
              &quot;Jeder Umbau ist ein Unikat.
              <br />
              <span className="text-amber">Jede PS-Zahl ist beweisbar.&quot;</span>
            </blockquote>
            <p className="text-text-faint text-sm mt-6">
              Alle Referenzen mit Prüfstandsdiagramm &amp; vollständiger Dokumentation
            </p>
          </div>
        </section>
      </FadeInSection>
    </>
  )
}
