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
    <Link href={`/umbauten/${umbau.id}`} className="card-base block group">
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
