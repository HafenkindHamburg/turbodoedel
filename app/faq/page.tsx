'use client'

import { useState } from 'react'

const FAQS = [
  {
    frage: 'Ist das Tuning TÜV-abnahmefähig?',
    antwort: 'Ja — wir arbeiten mit zertifizierten Prüfern zusammen. Umbauten können als Einzelabnahme eingetragen werden. Die genaue Machbarkeit hängt vom Fahrzeug und Umbauumfang ab.',
  },
  {
    frage: 'Verliere ich meine Garantie?',
    antwort: 'Bei Software-Optimierungen gilt dies je nach Hersteller unterschiedlich. Für ältere Fahrzeuge ohne aktive Herstellergarantie ist dies üblicherweise irrelevant. Wir beraten dich individuell.',
  },
  {
    frage: 'Wie läuft ein Umbau ab?',
    antwort: 'Kontakt aufnehmen → Beratungsgespräch → Angebot → Termin vereinbaren → Umbau + Prüfstandsmessung → Dokumentation und Übergabe.',
  },
  {
    frage: 'Bietet ihr Online-Tuning an?',
    antwort: 'Ja. Originaldatei aus der ECU auslesen, per E-Mail einsenden. Wir optimieren die Datei und senden sie zurück. Telefonische Begleitung inklusive.',
  },
  {
    frage: 'Was kostet ein Turbo-Umbau?',
    antwort: 'Das hängt stark vom Fahrzeug und Ziel ab. Wir erstellen ein individuelles Angebot nach Beratungsgespräch. Nimm einfach Kontakt auf.',
  },
]

export default function FAQPage() {
  const [offen, setOffen] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// FAQ</p>
      <h1 className="text-4xl font-black mb-12">Häufige Fragen</h1>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-bg-border">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-bg-surface transition-colors"
              onClick={() => setOffen(offen === i ? null : i)}
            >
              <span className="text-text-primary font-medium">{faq.frage}</span>
              <span className="text-amber ml-4 flex-shrink-0">{offen === i ? '−' : '+'}</span>
            </button>
            {offen === i && (
              <div className="px-6 pb-4 text-text-muted leading-relaxed border-t border-bg-border pt-4">
                {faq.antwort}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
