'use client'

import { useState } from 'react'

export default function KontaktPage() {
  const [gesendet, setGesendet] = useState(false)
  const [laden, setLaden] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLaden(true)

    const form = e.currentTarget
    const data = {
      name:      (form.elements.namedItem('name')      as HTMLInputElement).value,
      email:     (form.elements.namedItem('email')     as HTMLInputElement).value,
      nachricht: (form.elements.namedItem('nachricht') as HTMLTextAreaElement).value,
    }

    console.log('Kontaktformular:', data)
    await new Promise((r) => setTimeout(r, 800))
    setGesendet(true)
    setLaden(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// KONTAKT</p>
      <h1 className="text-4xl font-black mb-12">Schreib uns</h1>

      {gesendet ? (
        <div className="bg-bg-surface border border-amber p-8 text-center">
          <p className="text-amber text-lg font-bold mb-2">Nachricht erhalten!</p>
          <p className="text-text-muted">Wir melden uns so schnell wie möglich bei dir.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label block mb-2">NAME *</label>
            <input name="name" required className="field" placeholder="Max Mustermann" />
          </div>
          <div>
            <label className="label block mb-2">E-MAIL *</label>
            <input name="email" type="email" required className="field" placeholder="max@beispiel.de" />
          </div>
          <div>
            <label className="label block mb-2">NACHRICHT *</label>
            <textarea name="nachricht" required rows={5} className="field resize-none" placeholder="Dein Fahrzeug, dein Vorhaben…" />
          </div>
          <button type="submit" disabled={laden} className="btn-primary w-full py-3 disabled:opacity-50">
            {laden ? 'WIRD GESENDET…' : 'NACHRICHT SENDEN'}
          </button>
        </form>
      )}
    </div>
  )
}
