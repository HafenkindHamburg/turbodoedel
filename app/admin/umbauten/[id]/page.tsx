import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import UmbauForm from '@/components/admin/UmbauForm'
import type { Metadata } from 'next'
import type { Umbau } from '@/lib/supabase/types'

type Props = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Umbau bearbeiten — Admin' }

export default async function BearbeitenPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: umbauRaw } = await supabase
    .from('umbauten')
    .select('*')
    .eq('id', id)
    .single()

  if (!umbauRaw) notFound()

  const umbau = umbauRaw as Umbau

  return (
    <div>
      <p className="label text-amber mb-2">UMBAU BEARBEITEN</p>
      <h1 className="text-2xl font-black text-text-primary mb-8">
        {umbau.fahrzeug} — {umbau.ps_nachher} PS
      </h1>
      <UmbauForm umbau={umbau} />
    </div>
  )
}
