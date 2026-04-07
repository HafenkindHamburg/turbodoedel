import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Partner' }

export default function PartnerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="label text-amber mb-3">// PARTNER</p>
      <h1 className="text-4xl font-black mb-12">Unsere Partner</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-bg-surface border border-bg-border border-l-2 border-l-amber p-6">
          <h2 className="text-text-primary font-bold mb-2">Exclusive-Tuningparts</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Zertifizierter Partner für TÜV-Eintragungen und Einzelabnahmen.
            Gemeinsam bieten wir legale Lösungen für anspruchsvolle Umbauten.
          </p>
        </div>
      </div>

      <p className="text-text-faint text-sm mt-10">
        Interessiert an einer Partnerschaft?{' '}
        <a href="/kontakt" className="text-amber hover:underline">Melde dich.</a>
      </p>
    </div>
  )
}
