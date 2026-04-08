'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return
      const scrolled = window.scrollY
      bgRef.current.style.transform = `translateY(${scrolled * 0.4}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden border-b-2 border-amber">

      {/* Parallax-Hintergrundbild */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform scale-110">
        <Image
          src="/images/Chiptuning_Hero_Section.png"
          alt="Turbodoedel Hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dunkles Overlay damit Text lesbar bleibt */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Dekoratives Grid-Muster */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#c8902a 1px, transparent 1px), linear-gradient(90deg, #c8902a 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Inhalt */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <p className="label text-amber mb-6">// WENN&apos;S UM LEISTUNG GEHT</p>

        <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 text-white">
          MEHR LEISTUNG.
          <br />
          <span className="text-amber">KEIN KOMPROMISS.</span>
        </h1>

        <p className="text-white/80 text-lg max-w-xl leading-relaxed mb-10">
          Turbo-Umbauten &amp; Chiptuning auf höchstem Niveau —
          dokumentiert, messbar, TÜV-eingetragen.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/umbauten" className="btn-primary text-sm px-8 py-3">
            UMBAUTEN ANSEHEN &rarr;
          </Link>
          <Link href="/kontakt" className="btn-secondary text-sm px-8 py-3">
            KONTAKT
          </Link>
        </div>
      </div>

      {/* Gradient-Overlay unten */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-base to-transparent" />
    </section>
  )
}
