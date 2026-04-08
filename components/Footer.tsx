import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-bg-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="bg-[#111] rounded px-2 py-1 inline-block">
              <Image
                src="/images/logo-lg.png"
                alt="Turbodoedel — Chiptuning & Performance"
                width={267}
                height={120}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-text-faint text-xs mt-3">Wenn&apos;s um Leistung geht.</p>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div>
              <p className="label mb-3">SEITEN</p>
              <ul className="space-y-2">
                {[
                  ['/umbauten',   'Umbauten'],
                  ['/leistungen', 'Leistungen'],
                  ['/faq',        'FAQ'],
                  ['/partner',    'Partner'],
                  ['/ueber-uns',  'Über uns'],
                  ['/kontakt',    'Kontakt'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-text-faint text-xs hover:text-amber transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label mb-3">SOCIAL</p>
              <ul className="space-y-2">
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                     className="text-text-faint text-xs hover:text-amber transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                     className="text-text-faint text-xs hover:text-amber transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-bg-border mt-8 pt-6 flex justify-between items-center">
          <span className="text-text-faint text-xs">
            &copy; {new Date().getFullYear()} Turbodoedel.de
          </span>
          <Link href="/admin" className="text-bg-border text-xs hover:text-text-faint transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
