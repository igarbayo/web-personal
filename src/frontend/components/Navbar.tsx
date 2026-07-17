'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { Dictionary } from '@/lib/types'
import LanguageSwitcher from './LanguageSwitcher'

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
    const fullPath = `/${lang}${path}`
    return path === '' ? pathname === fullPath : pathname.startsWith(fullPath)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border [box-shadow:0_8px_32px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-3 min-h-14 py-2 flex items-center justify-between gap-6">
          {/* Left: name */}
          <Link href={`/${lang}`} className="font-serif text-xl font-semibold text-foreground leading-tight min-w-0 hover:text-accent transition-colors">
            {dict.header.name}
          </Link>

          {/* Right: desktop nav links + lang switcher */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={`/${lang}${item.path}`}
                className={`font-serif text-base transition-colors ${
                  isActive(item.path)
                    ? 'text-accent font-semibold'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {dict.nav[item.labelKey]}
              </Link>
            ))}
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              className="text-muted hover:text-foreground transition-colors p-1 relative z-[101]"
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
            className="absolute top-4 right-5 text-muted hover:text-foreground transition-colors p-1"
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
              className={`font-serif text-3xl font-semibold transition-colors ${
                isActive(item.path) ? 'text-accent' : 'text-foreground hover:text-accent'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {dict.nav[item.labelKey]}
            </Link>
          ))}
          <div className="border-t border-border pt-6">
            <LanguageSwitcher currentLang={lang} inline />
          </div>
        </div>
      )}
    </>
  )
}
