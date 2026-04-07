import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Turbodoedel.de',
    default:  'Turbodoedel.de — Turbo-Umbauten & Chiptuning',
  },
  description: 'Hochleistungs-Turbo-Umbauten und Chiptuning — dokumentiert, messbar, TÜV-eingetragen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-bg-base text-text-primary">
        <Nav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
