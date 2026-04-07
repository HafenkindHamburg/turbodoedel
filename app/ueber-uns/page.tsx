import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Über uns' }

export default function UeberUnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// ÜBER UNS</p>
      <h1 className="text-4xl font-black mb-8">Turbodoedel.de</h1>

      <div className="space-y-6 text-text-muted leading-relaxed">
        <p>
          Turbodoedel.de steht für kompromisslosen Leistungssport. Wir bauen Turbo-Systeme,
          die nicht nur auf dem Papier beeindrucken — sondern auf dem Prüfstand beweisen, was sie können.
        </p>
        <p>
          Jeder Umbau wird auf unserem eigenen Prüfstand vermessen und vollständig dokumentiert.
          Keine Fantasiezahlen — nur messbare, reproduzierbare Leistung.
        </p>
        <p>
          Unsere Philosophie: Qualität vor Quantität. Lieber ein perfekter Umbau als zehn halbfertige.
        </p>
      </div>
    </div>
  )
}
