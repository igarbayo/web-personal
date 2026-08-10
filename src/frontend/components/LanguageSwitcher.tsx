'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const LANGS = ['en', 'es', 'gl'] as const

export default function LanguageSwitcher({ currentLang, inline = false }: { currentLang: string; inline?: boolean }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function getLangHref(lang: string) {
    const segments = pathname.split('/')
    // En las rutas prefijadas (`/es/experience/`) se sustituye el idioma. En las
    // rutas sin prefijo del grupo (default) (`/experience/`) hay que prefijar,
    // no sustituir: si no, `segments[1] = lang` convertiría `/experience/` en
    // `/es/` y se perdería la sección.
    if ((LANGS as readonly string[]).includes(segments[1])) {
      segments[1] = lang
      return segments.join('/')
    }
    return pathname === '/' ? `/${lang}/` : `/${lang}${pathname}`
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (inline) {
    return (
      <div className="flex items-center gap-3">
        {LANGS.map((lang) => (
          <Link
            key={lang}
            href={getLangHref(lang)}
            className={`text-sm font-mono font-semibold transition-colors ${
              currentLang === lang ? 'text-accent' : 'text-muted hover:text-accent'
            }`}
          >
            {lang.toUpperCase()}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-muted hover:text-accent transition-colors p-1"
        aria-label="Change language"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-sm font-mono font-semibold">{currentLang.toUpperCase()}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded shadow-sm py-1 min-w-[60px] z-50">
          {LANGS.map((lang) => (
            <Link
              key={lang}
              href={getLangHref(lang)}
              onClick={() => setOpen(false)}
              className={`block px-3 py-1 text-sm font-mono transition-colors ${
                currentLang === lang
                  ? 'text-accent font-semibold'
                  : 'text-muted hover:text-accent'
              }`}
            >
              {lang.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
