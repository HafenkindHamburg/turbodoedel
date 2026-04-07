'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadImage } from '@/lib/supabase/storage'

type Props = {
  label: string
  pfad: string
  value: string | null
  onChange: (url: string) => void
  required?: boolean
}

export default function ImageUpload({ label, pfad, value, onChange, required }: Props) {
  const [laden,  setLaden]  = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleDatei(e: React.ChangeEvent<HTMLInputElement>) {
    const datei = e.target.files?.[0]
    if (!datei) return

    if (!datei.type.startsWith('image/')) {
      setFehler('Nur Bilddateien erlaubt (JPG, PNG, WebP).')
      return
    }
    if (datei.size > 10 * 1024 * 1024) {
      setFehler('Datei zu groß (max. 10 MB).')
      return
    }

    setFehler(null)
    setLaden(true)

    try {
      const url = await uploadImage(datei, pfad)
      onChange(url)
    } catch (err) {
      setFehler(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
    } finally {
      setLaden(false)
    }
  }

  return (
    <div>
      <label className="label block mb-2">
        {label}{required && ' *'}
      </label>

      {value && (
        <div className="relative w-full aspect-video bg-bg-raised mb-3 overflow-hidden border border-bg-border">
          <Image src={value} alt={label} fill className="object-contain" sizes="600px" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-bg-base border border-bg-border text-text-muted text-xs px-2 py-1 hover:border-amber hover:text-amber transition-colors"
          >
            ENTFERNEN
          </button>
        </div>
      )}

      {!value && (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            laden ? 'border-amber/50' : 'border-bg-border hover:border-amber'
          }`}
        >
          {laden ? (
            <p className="label text-amber">WIRD HOCHGELADEN…</p>
          ) : (
            <>
              <p className="label text-text-faint mb-1">DATEI AUSWÄHLEN</p>
              <p className="text-text-faint text-xs">JPG, PNG, WebP — max. 10 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleDatei}
        className="hidden"
      />

      {fehler && <p className="text-red-400 text-xs mt-2">{fehler}</p>}
    </div>
  )
}
