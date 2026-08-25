'use client'

import React, { useEffect, useRef, useState } from 'react'

export type CmsSectionTab =
  | 'header_meta'
  | 'summary'
  | 'skills'
  | 'education'
  | 'experience'
  | 'leadership'
  | 'projects'
  | 'languages'
  | 'volunteering'
  | 'certifications'
  | 'media'

interface CmsSectionNavProps {
  activeTab: CmsSectionTab
  onSelectTab: (tab: CmsSectionTab) => void
}

type Section = { id: CmsSectionTab; label: string; number: string }

// El orden dentro de cada grupo sigue el de aparición real en la página
// pública correspondiente, no el numérico.
const GROUPS: { label: string; sections: Section[] }[] = [
  {
    label: 'Inicio',
    sections: [
      { id: 'header_meta', label: 'Cabecera & SEO', number: '01' },
      { id: 'summary', label: 'Sobre mí', number: '02' },
    ],
  },
  {
    label: 'Experiencia',
    sections: [
      { id: 'experience', label: 'Experiencia', number: '05' },
      { id: 'skills', label: 'Aptitudes', number: '03' },
      { id: 'volunteering', label: 'Voluntariado', number: '09' },
    ],
  },
  {
    label: 'Educación',
    sections: [
      { id: 'education', label: 'Educación', number: '04' },
      { id: 'leadership', label: 'Premios & Liderazgo', number: '06' },
      { id: 'languages', label: 'Idiomas', number: '08' },
      { id: 'certifications', label: 'Certificaciones', number: '10' },
    ],
  },
  {
    label: 'Proyectos',
    sections: [{ id: 'projects', label: 'Proyectos & Hackathons', number: '07' }],
  },
]

const MEDIA: Section = { id: 'media', label: 'Gestor de Medios', number: '11' }

export default function CmsSectionNav({ activeTab, onSelectTab }: CmsSectionNavProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenGroup(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <nav className="border-b border-border bg-surface">
      <div ref={navRef} className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center gap-5 py-2.5">
        {GROUPS.map((group, i) => {
          const isGroupActive = group.sections.some((sec) => sec.id === activeTab)
          const isOpen = openGroup === group.label
          const isLast = i === GROUPS.length - 1

          return (
            <div key={group.label} className="relative">
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : group.label)}
                aria-haspopup="true"
                aria-expanded={isOpen}
                className={`relative flex items-center gap-1.5 whitespace-nowrap text-xs font-mono pb-1.5 ${
                  isGroupActive ? 'text-accent font-bold' : 'text-muted hover:text-accent'
                }`}
              >
                {/* Copia fantasma en negrita: reserva el ancho para que el
                    cambio de peso al activarse no desplace la fila. */}
                <span className="block h-0 overflow-hidden font-bold" aria-hidden="true">
                  {group.label}
                </span>
                <span>{group.label}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
                {isGroupActive && (
                  <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-accent" />
                )}
              </button>

              {isOpen && (
                <div
                  className={`absolute top-full mt-1 z-50 min-w-[200px] py-1 bg-background border border-border rounded shadow-sm ${
                    isLast ? 'right-0' : 'left-0'
                  }`}
                >
                  {group.sections.map((sec) => {
                    const isActive = activeTab === sec.id
                    return (
                      <button
                        key={sec.id}
                        type="button"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => {
                          onSelectTab(sec.id)
                          setOpenGroup(null)
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs font-mono ${
                          isActive ? 'text-accent font-bold' : 'text-muted hover:text-accent'
                        }`}
                      >
                        <span className={isActive ? 'text-accent' : 'text-muted/60'}>{sec.number}</span>
                        <span>{sec.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        <span className="w-px h-4 bg-border" aria-hidden="true" />

        <button
          type="button"
          onClick={() => onSelectTab(MEDIA.id)}
          className={`relative whitespace-nowrap text-xs font-mono pb-1.5 ${
            activeTab === MEDIA.id ? 'text-accent font-bold' : 'text-muted hover:text-accent'
          }`}
        >
          <span className="block h-0 overflow-hidden font-bold" aria-hidden="true">
            {MEDIA.number} {MEDIA.label}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={activeTab === MEDIA.id ? 'text-accent' : 'text-muted/60'}>{MEDIA.number}</span>
            <span>{MEDIA.label}</span>
          </span>
          {activeTab === MEDIA.id && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 rounded-full bg-accent" />
          )}
        </button>
      </div>
    </nav>
  )
}
