import { createClient } from '@/lib/supabase/server'
import UmbauGrid from '@/components/UmbauGrid'
import type { Metadata } from 'next'
import type { Umbau } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'Umbauten',
  description: 'Alle Turbo-Umbauten und Chiptuning-Referenzen von Turbodoedel.de',
}

export default async function UmbautenPage() {
  const supabase = await createClient()

  const { data: umbautenRaw } = await supabase
    .from('umbauten')
    .select('*')
    .order('erstellt_am', { ascending: false })

  const umbauten = (umbautenRaw ?? []) as Umbau[]

  const alleTags = Array.from(
    new Set(umbauten.flatMap((u) => u.tags))
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

      <UmbauGrid umbauten={umbauten} alleTags={alleTags} />
    </div>
  )
}
