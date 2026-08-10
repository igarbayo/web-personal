'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
// import Image from 'next/image' // comentado junto con el avatar del Navbar (silueta.webp)
import type { Dictionary } from '@/lib/types'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { path: '',            labelKey: 'home'       },
  { path: '/experience', labelKey: 'experience' },
  { path: '/education',  labelKey: 'education'  },
  { path: '/projects',   labelKey: 'projects'   },
] as const

interface NavbarProps {
  dict: Dictionary
  lang: string
}

export default function Navbar({ dict, lang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  function isActive(path: string): boolean {
    // `trailingSlash: true` hace que usePathname devuelva `/en/education/`,
    // así que se normaliza antes de comparar con `/en/education`.
    const current = pathname.replace(/\/$/, '') || '/'
    // Se aceptan las dos formas: la prefijada por idioma (`/en/education`) y la
    // sin prefijo (`/education`), que son las puertas de entrada del grupo
    // (default). Sin esto, en `/experience/` no se marcaría ningún ítem activo
    // y el subrayado deslizante desaparecería.
    const prefixed = `/${lang}${path}`
    return path === ''
      ? current === prefixed || current === '/'
      : current.startsWith(prefixed) || current.startsWith(path)
  }

  // Sliding underline indicator for the desktop nav.
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
  const activeIndex = NAV_ITEMS.findIndex((item) => isActive(item.path))

  useEffect(() => {
    function update() {
      const el = itemRefs.current[activeIndex]
      setIndicator(el ? { left: el.offsetLeft, width: el.offsetWidth } : null)
    }
    update()
    window.addEventListener('resize', update)
    // Re-measure once the webfont settles (metrics shift after Inter loads).
    document.fonts?.ready.then(update).catch(() => {})
    return () => window.removeEventListener('resize', update)
  }, [activeIndex])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border [box-shadow:0_4px_20px_rgba(0,0,0,0.035)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-3 min-h-14 py-2 flex items-center justify-between gap-6">
          {/* Left: avatar + name.
              NOTA: el avatar (silueta.webp) queda COMENTADO a propósito, pendiente de decisión.
              Para reactivarlo: descomentar el <Image> y volver a poner `flex items-center gap-2` en el className del <Link>. */}
          <Link href={`/${lang}`} className="text-xl font-semibold text-foreground leading-tight min-w-0 hover:text-accent transition-colors">
            {/* <Image
              src="/silueta.webp"
              alt=""
              width={866}
              height={866}
              priority
              className="h-[1.25em] w-auto shrink-0"
            /> */}
            {dict.header.name}
          </Link>

          {/* Right: desktop nav links + lang switcher */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative flex items-center gap-6">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(item.path)
                const label = dict.nav[item.labelKey]
                return (
                  <Link
                    key={item.path}
                    href={`/${lang}${item.path}`}
                    ref={(el) => { itemRefs.current[i] = el }}
                    className={`grid text-base transition-colors ${active ? 'text-accent' : 'text-muted hover:text-accent'}`}
                  >
                    {/* Ghost copy in bold reserves the width so hover/active bold never shifts layout */}
                    <span aria-hidden className="col-start-1 row-start-1 font-semibold invisible">{label}</span>
                    <span className={`col-start-1 row-start-1 ${active ? 'font-semibold' : 'font-normal hover:font-semibold'}`}>
                      {label}
                    </span>
                  </Link>
                )
              })}
              {indicator && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1 h-0.5 rounded-full bg-accent transition-all duration-300 ease-out"
                  style={{ left: indicator.left, width: indicator.width }}
                />
              )}
            </div>
            <ThemeToggle />
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              className="text-muted hover:text-accent transition-colors p-1 relative z-[101]"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay — outside <nav> to avoid backdrop-filter containing block issues */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-10">
          <button
            className="absolute top-4 right-5 text-muted hover:text-accent transition-colors p-1"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={`/${lang}${item.path}`}
              className={`text-3xl font-semibold transition-colors ${
                isActive(item.path) ? 'text-accent underline decoration-2 underline-offset-8 decoration-accent' : 'text-foreground hover:text-accent'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {dict.nav[item.labelKey]}
            </Link>
          ))}
          <div className="border-t border-border pt-6 flex flex-col items-center gap-4">
            <LanguageSwitcher currentLang={lang} inline />
            <ThemeToggle inline />
          </div>
        </div>
      )}
    </>
  )
}
