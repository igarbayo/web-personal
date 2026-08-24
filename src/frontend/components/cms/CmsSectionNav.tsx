'use client'

import React from 'react'

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

const SECTIONS: { id: CmsSectionTab; label: string; number: string }[] = [
  { id: 'header_meta', label: 'Cabecera & SEO', number: '01' },
  { id: 'summary', label: 'Sobre mí', number: '02' },
  { id: 'skills', label: 'Aptitudes', number: '03' },
  { id: 'education', label: 'Educación', number: '04' },
  { id: 'experience', label: 'Experiencia', number: '05' },
  { id: 'leadership', label: 'Premios & Liderazgo', number: '06' },
  { id: 'projects', label: 'Proyectos & Hackathons', number: '07' },
  { id: 'languages', label: 'Idiomas', number: '08' },
  { id: 'volunteering', label: 'Voluntariado', number: '09' },
  { id: 'certifications', label: 'Certificaciones', number: '10' },
  { id: 'media', label: 'Gestor de Medios', number: '11' },
]

export default function CmsSectionNav({ activeTab, onSelectTab }: CmsSectionNavProps) {
  return (
    <nav className="border-b border-border bg-surface/50 overflow-x-auto scrollbar-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1">
        {SECTIONS.map((sec) => {
          const isActive = activeTab === sec.id

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectTab(sec.id)}
              className={`px-3 py-2 text-xs font-mono font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-accent/10 text-accent font-bold border border-accent/30'
                  : 'text-muted hover:text-foreground hover:bg-surface/80 border border-transparent'
              }`}
            >
              <span
                className={`text-[10px] ${
                  isActive ? 'text-accent' : 'text-muted/60'
                }`}
              >
                {sec.number}
              </span>
              <span>{sec.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
