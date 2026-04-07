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
