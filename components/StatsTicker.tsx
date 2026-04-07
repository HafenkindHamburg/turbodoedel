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
