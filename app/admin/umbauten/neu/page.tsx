import UmbauForm from '@/components/admin/UmbauForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Neuer Umbau — Admin' }

export default function NeuPage() {
  return (
    <div>
      <p className="label text-amber mb-2">NEUER UMBAU</p>
      <h1 className="text-2xl font-black text-text-primary mb-8">Eintrag anlegen</h1>
      <UmbauForm />
    </div>
  )
}
