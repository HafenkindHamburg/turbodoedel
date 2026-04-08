'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from './ImageUpload'
import GalerieUpload from './GalerieUpload'
import type { Umbau, UmbauInsert } from '@/lib/supabase/types'

type Props = {
  umbau?: Umbau
}

const STAGES = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 3+']

export default function UmbauForm({ umbau }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const istNeu = !umbau

  const [fahrzeug,     setFahrzeug]     = useState(umbau?.fahrzeug ?? '')
  const [psNachher,    setPsNachher]    = useState(umbau?.ps_nachher?.toString() ?? '')
  const [nmNachher,    setNmNachher]    = useState(umbau?.nm_nachher?.toString() ?? '')
  const [stage,        setStage]        = useState(umbau?.stage ?? 'Stage 2')
  const [psVorher,     setPsVorher]     = useState(umbau?.ps_vorher?.toString() ?? '')
  const [nmVorher,     setNmVorher]     = useState(umbau?.nm_vorher?.toString() ?? '')
  const [fotoFahrzeug, setFotoFahrzeug] = useState(umbau?.foto_fahrzeug ?? '')
  const [fotoDiagramm, setFotoDiagramm] = useState(umbau?.foto_diagramm ?? '')
  const [galerie,      setGalerie]      = useState<string[]>(umbau?.galerie ?? [])
  const [beschreibung, setBeschreibung] = useState(umbau?.beschreibung ?? '')
  const [komponenten,  setKomponenten]  = useState(umbau?.komponenten ?? '')
  const [tags,         setTags]         = useState(umbau?.tags.join(', ') ?? '')
  const [videoUrl,     setVideoUrl]     = useState(umbau?.video_url ?? '')
  const [laden,        setLaden]        = useState(false)
  const [fehler,       setFehler]       = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFehler(null)
    if (!fotoFahrzeug) { setFehler('Bitte ein Fahrzeugfoto hochladen.'); return }
    if (!fotoDiagramm) { setFehler('Bitte ein Prüfstandsdiagramm hochladen.'); return }
    setLaden(true)

    const daten: UmbauInsert = {
      fahrzeug:      fahrzeug.trim(),
      ps_nachher:    parseInt(psNachher, 10),
      nm_nachher:    parseInt(nmNachher, 10),
      stage,
      ps_vorher:     psVorher ? parseInt(psVorher, 10) : null,
      nm_vorher:     nmVorher ? parseInt(nmVorher, 10) : null,
      foto_fahrzeug: fotoFahrzeug,
      foto_diagramm: fotoDiagramm,
      galerie,
      beschreibung:  beschreibung.trim() || null,
      komponenten:   komponenten.trim() || null,
      tags:          tags.split(',').map((t) => t.trim()).filter(Boolean),
      video_url:     videoUrl.trim() || null,
    }

    const { error } = istNeu
      ? await supabase.from('umbauten').insert(daten)
      : await supabase.from('umbauten').update(daten).eq('id', umbau!.id)

    if (error) { setFehler(error.message); setLaden(false); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fehler && (
        <div className="bg-red-900/30 border border-red-700 px-4 py-3 text-red-300 text-sm">{fehler}</div>
      )}

      <div>
        <label className="label block mb-2">FAHRZEUG *</label>
        <input required value={fahrzeug} onChange={(e) => setFahrzeug(e.target.value)} className="field" placeholder="z.B. Golf 2 VR6" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label block mb-2">PS NACHHER *</label>
          <input required type="number" min="1" value={psNachher} onChange={(e) => setPsNachher(e.target.value)} className="field" placeholder="913" />
        </div>
        <div>
          <label className="label block mb-2">NM NACHHER *</label>
          <input required type="number" min="1" value={nmNachher} onChange={(e) => setNmNachher(e.target.value)} className="field" placeholder="992" />
        </div>
        <div>
          <label className="label block mb-2">STAGE *</label>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className="field">
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label block mb-2">PS VORHER</label>
          <input type="number" min="1" value={psVorher} onChange={(e) => setPsVorher(e.target.value)} className="field" placeholder="optional" />
        </div>
        <div>
          <label className="label block mb-2">NM VORHER</label>
          <input type="number" min="1" value={nmVorher} onChange={(e) => setNmVorher(e.target.value)} className="field" placeholder="optional" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ImageUpload label="FAHRZEUGFOTO" pfad="fahrzeugfotos" value={fotoFahrzeug || null} onChange={setFotoFahrzeug} required />
        <ImageUpload label="PRÜFSTANDSDIAGRAMM" pfad="diagramme" value={fotoDiagramm || null} onChange={setFotoDiagramm} required />
      </div>

      <GalerieUpload value={galerie} onChange={setGalerie} />

      <div>
        <label className="label block mb-2">BESCHREIBUNG</label>
        <textarea value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} rows={4} className="field resize-none" placeholder="Details zum Umbau…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label block mb-2">KOMPONENTEN</label>
          <textarea value={komponenten} onChange={(e) => setKomponenten(e.target.value)} rows={3} className="field resize-none" placeholder="Garrett GTX3582R, AEM ECU, Custom FMIC" />
        </div>
        <div>
          <label className="label block mb-2">TAGS</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="field" placeholder="VW, Twin-Turbo, Stage 3+" />
          <p className="text-text-faint text-xs mt-1">Komma-separiert</p>
        </div>
      </div>

      <div>
        <label className="label block mb-2">VIDEO-LINK (YouTube / Instagram)</label>
        <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="field" placeholder="https://youtube.com/watch?v=…" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={laden} className="btn-primary flex-1 py-3 disabled:opacity-50">
          {laden ? 'WIRD GESPEICHERT…' : istNeu ? 'SPEICHERN & VERÖFFENTLICHEN' : 'ÄNDERUNGEN SPEICHERN'}
        </button>
        <button type="button" onClick={() => router.push('/admin')} className="btn-secondary py-3 px-6">
          ABBRECHEN
        </button>
      </div>
    </form>
  )
}
