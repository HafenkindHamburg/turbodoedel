import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import VideoEmbed from '@/components/VideoEmbed'
import FadeInSection from '@/components/FadeInSection'
import { calcPsDelta, calcNmDelta } from '@/lib/utils'
import type { Metadata } from 'next'
import type { Umbau } from '@/lib/supabase/types'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('umbauten')
    .select('fahrzeug, ps_nachher')
    .eq('id', id)
    .single()

  if (!data) return { title: 'Umbau nicht gefunden' }

  const meta = data as { fahrzeug: string; ps_nachher: number }
  return {
    title: `${meta.fahrzeug} — ${meta.ps_nachher} PS`,
    description: `Turbo-Umbau: ${meta.fahrzeug} mit ${meta.ps_nachher} PS`,
  }
}

export default async function UmbauDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: umbauRaw } = await supabase
    .from('umbauten')
    .select('*')
    .eq('id', id)
    .single()

  if (!umbauRaw) notFound()

  const umbau = umbauRaw as Umbau
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
