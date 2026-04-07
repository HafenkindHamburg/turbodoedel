'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadImage } from '@/lib/supabase/storage'

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function GalerieUpload({ value, onChange }: Props) {
  const [laden,  setLaden]  = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  async function handleDateien(e: React.ChangeEvent<HTMLInputElement>) {
    const dateien = Array.from(e.target.files ?? [])
    if (dateien.length === 0) return

    const ungueltige = dateien.filter((f) => !f.type.startsWith('image/'))
    if (ungueltige.length > 0) {
      setFehler('Nur Bilddateien erlaubt.')
      return
    }

    setFehler(null)
    setLaden(true)

    try {
      const urls = await Promise.all(
        dateien.map((datei) => uploadImage(datei, 'galerie'))
      )
      onChange([...value, ...urls])
    } catch (err) {
      setFehler(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
    } finally {
      setLaden(false)
    }
  }

  function entfernen(url: string) {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div>
      <label className="label block mb-2">GALERIE (weitere Fotos)</label>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url) => (
            <div key={url} className="relative aspect-[4/3] bg-bg-raised overflow-hidden border border-bg-border group">
              <Image src={url} alt="Galerie" fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => entfernen(url)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber label"
              >
                ENTFERNEN
              </button>
            </div>
          ))}
        </div>
      )}

      <label className={`block border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
        laden ? 'border-amber/50' : 'border-bg-border hover:border-amber'
      }`}>
        {laden ? (
          <p className="label text-amber">WIRD HOCHGELADEN…</p>
        ) : (
          <>
            <p className="label text-text-faint mb-1">BILDER HINZUFÜGEN</p>
            <p className="text-text-faint text-xs">Mehrere Dateien auswählbar</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleDateien}
          className="hidden"
          disabled={laden}
        />
      </label>

      {fehler && <p className="text-red-400 text-xs mt-2">{fehler}</p>}
    </div>
  )
}
