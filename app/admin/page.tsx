'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import type { Umbau } from '@/lib/supabase/types'

export default function AdminPage() {
  const supabase = createClient()

  const [umbauten,      setUmbauten]      = useState<Umbau[]>([])
  const [laden,         setLaden]         = useState(true)
  const [zuLoeschen,    setZuLoeschen]    = useState<Umbau | null>(null)
  const [loeschenLaden, setLoeschenLaden] = useState(false)

  useEffect(() => {
    supabase
      .from('umbauten')
      .select('*')
      .order('erstellt_am', { ascending: false })
      .then(({ data }) => {
        setUmbauten((data ?? []) as Umbau[])
        setLaden(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLoeschen() {
    if (!zuLoeschen) return
    setLoeschenLaden(true)
    await supabase.from('umbauten').delete().eq('id', zuLoeschen.id)
    setUmbauten((prev) => prev.filter((u) => u.id !== zuLoeschen.id))
    setZuLoeschen(null)
    setLoeschenLaden(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="label text-amber mb-1">ADMIN</p>
          <h1 className="text-2xl font-black text-text-primary">Umbauten verwalten</h1>
        </div>
        <Link href="/admin/umbauten/neu" className="btn-primary py-2 px-6">
          + NEUER EINTRAG
        </Link>
      </div>

      {laden ? (
        <p className="label text-text-faint">WIRD GELADEN…</p>
      ) : umbauten.length === 0 ? (
        <div className="py-20 text-center border border-bg-border">
          <p className="label text-text-faint mb-4">Noch keine Einträge.</p>
          <Link href="/admin/umbauten/neu" className="btn-primary py-2 px-6">ERSTEN UMBAU ANLEGEN</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {umbauten.map((umbau) => (
            <div key={umbau.id} className="bg-bg-surface border border-bg-border border-l-2 border-l-amber px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-text-primary font-bold">{umbau.fahrzeug} — {umbau.ps_nachher} PS</p>
                <p className="text-text-faint text-xs mt-0.5">
                  {new Date(umbau.erstellt_am).toLocaleDateString('de-DE')} · {umbau.stage}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/umbauten/${umbau.id}`} target="_blank" className="label text-text-faint hover:text-amber transition-colors">ANSEHEN</Link>
                <Link href={`/admin/umbauten/${umbau.id}`} className="label text-text-faint hover:text-amber transition-colors">BEARBEITEN</Link>
                <button onClick={() => setZuLoeschen(umbau)} className="label text-text-faint hover:text-red-400 transition-colors">LÖSCHEN</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="label text-text-faint text-center mt-6">
        {umbauten.length} Eintrag{umbauten.length !== 1 ? 'träge' : ''} gesamt
      </p>

      <ConfirmDialog
        offen={zuLoeschen !== null}
        titel="Eintrag löschen?"
        text={`"${zuLoeschen?.fahrzeug} — ${zuLoeschen?.ps_nachher} PS" wird dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.`}
        onBestaetigen={handleLoeschen}
        onAbbrechen={() => setZuLoeschen(null)}
        laden={loeschenLaden}
      />
    </div>
  )
}
