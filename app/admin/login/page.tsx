'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email,    setEmail]    = useState('')
  const [passwort, setPasswort] = useState('')
  const [fehler,   setFehler]   = useState<string | null>(null)
  const [laden,    setLaden]    = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setFehler(null)
    setLaden(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: passwort,
    })

    if (error) {
      setFehler('Ungültige E-Mail oder falsches Passwort.')
      setLaden(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="bg-[#111] rounded px-3 py-2 inline-block mb-3">
            <Image
              src="/images/logo-lg.png"
              alt="Turbodoedel"
              width={267}
              height={120}
              className="h-16 w-auto"
            />
          </div>
          <p className="label text-text-faint">Admin-Bereich</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="label block mb-2">E-MAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              placeholder="admin@turbodoedel.de"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label block mb-2">PASSWORT</label>
            <input
              type="password"
              required
              value={passwort}
              onChange={(e) => setPasswort(e.target.value)}
              className="field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {fehler && (
            <p className="text-red-400 text-xs">{fehler}</p>
          )}

          <button
            type="submit"
            disabled={laden}
            className="btn-primary w-full py-3 mt-2 disabled:opacity-50"
          >
            {laden ? 'WIRD EINGELOGGT…' : 'EINLOGGEN'}
          </button>
        </form>
      </div>
    </div>
  )
}
