import FadeInSection from '@/components/FadeInSection'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Leistungen' }

const LEISTUNGEN = [
  {
    title: 'Turbo-Umbauten',
    desc: 'Komplette Turbo- und Twin-Turbo-Umbauten für nahezu alle Fahrzeuge. Von Stage 1 bis Stage 3+ — alles aus einer Hand, auf eigenem Prüfstand vermessen.',
  },
  {
    title: 'Chiptuning / ECU-Optimierung',
    desc: 'Individuelle Software-Anpassungen für die Motorsteuerung. Mehr Leistung, besseres Ansprechverhalten, optimierter Verbrauch.',
  },
  {
    title: 'Online-Tuning',
    desc: 'ECU-Optimierung remote: Originaldatei einsenden, optimierte Datei zurückerhalten. Schnell, zuverlässig, mit telefonischer Beratung.',
  },
  {
    title: 'TÜV-Eintragung',
    desc: 'Umbauten sauber und legal — in Kooperation mit zertifizierten Prüfern für die TÜV-Eintragung und Einzelabnahme.',
  },
]

export default function LeistungenPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// LEISTUNGEN</p>
      <h1 className="text-4xl font-black mb-12">Was wir anbieten</h1>

      <div className="grid gap-6">
        {LEISTUNGEN.map((l, i) => (
          <FadeInSection key={l.title} delay={i * 80}>
            <div className="bg-bg-surface border border-bg-border border-l-2 border-l-amber p-6">
              <h2 className="text-text-primary font-bold text-lg mb-2">{l.title}</h2>
              <p className="text-text-muted leading-relaxed">{l.desc}</p>
            </div>
          </FadeInSection>
        ))}
      </div>
    </div>
  )
}
