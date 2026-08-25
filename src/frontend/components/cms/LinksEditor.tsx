'use client'

import React from 'react'
import TrilingualField, { LangKey } from './TrilingualField'
import { CmsButton, CmsInput, CmsLabel } from './ui/CmsInput'
import type { EntryLink } from '@/lib/types'

interface LinksEditorProps {
  label?: string
  links: {
    es: EntryLink[]
    en: EntryLink[]
    gl: EntryLink[]
  }
  onChange: (updated: { es: EntryLink[]; en: EntryLink[]; gl: EntryLink[] }) => void
  defaultLabel?: string
  urlPlaceholder?: string
}

/**
 * Antes cada editor (Experiencia, Liderazgo, Proyectos) llevaba su propia
 * copia de este bloque, con un único `<input>` de etiqueta que escribía en
 * `es`, `en` y `gl` a la vez. La URL sí debe compartirse — el mismo documento
 * no cambia de sitio según el idioma de la página — pero la etiqueta es
 * texto visible y tiene que traducirse, de ahí `TrilingualField` por enlace.
 */
export default function LinksEditor({
  label = 'Enlaces',
  links,
  onChange,
  defaultLabel = 'Enlace',
  urlPlaceholder = 'https://...',
}: LinksEditorProps) {
  // `es` como fuente de longitud: mismo criterio que `BulletListEditor.maxLen`,
  // asumiendo que los tres idiomas se mantienen con el mismo número de enlaces
  // porque añadir/eliminar siempre toca a los tres a la vez.
  const count = links.es?.length || 0

  const handleUpdateLabel = (index: number, lang: LangKey, value: string) => {
    const next = {
      es: [...(links.es || [])],
      en: [...(links.en || [])],
      gl: [...(links.gl || [])],
    }
    if (next[lang][index]) {
      next[lang][index] = { ...next[lang][index], label: value }
      onChange(next)
    }
  }

  const handleUpdateUrl = (index: number, value: string) => {
    const next = {
      es: [...(links.es || [])],
      en: [...(links.en || [])],
      gl: [...(links.gl || [])],
    }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      if (next[l][index]) next[l][index] = { ...next[l][index], url: value }
    })
    onChange(next)
  }

  const handleAdd = () => {
    const newLink: EntryLink = { label: defaultLabel, url: 'https://...' }
    onChange({
      es: [...(links.es || []), { ...newLink }],
      en: [...(links.en || []), { ...newLink }],
      gl: [...(links.gl || []), { ...newLink }],
    })
  }

  const handleRemove = (index: number) => {
    onChange({
      es: (links.es || []).filter((_, i) => i !== index),
      en: (links.en || []).filter((_, i) => i !== index),
      gl: (links.gl || []).filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <CmsLabel>{label} ({count})</CmsLabel>
        <CmsButton type="button" size="sm" variant="secondary" onClick={handleAdd}>
          + Añadir Enlace
        </CmsButton>
      </div>

      {count === 0 ? (
        <div className="p-4 border border-dashed border-border rounded-md text-center text-xs text-muted font-mono">
          No hay enlaces añadidos. Pulsa &quot;+ Añadir Enlace&quot; para agregar uno.
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2 border border-border rounded-lg px-3 py-2">
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 12 12"
                    className="w-3 h-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5" />
                  </svg>
                  Enlace #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-danger hover:bg-danger/10 px-1 rounded"
                  title="Eliminar enlace"
                >
                  ✕
                </button>
              </div>

              <TrilingualField
                label="Etiqueta"
                values={{
                  es: links.es?.[index]?.label || '',
                  en: links.en?.[index]?.label || '',
                  gl: links.gl?.[index]?.label || '',
                }}
                onChange={(lang, val) => handleUpdateLabel(index, lang, val)}
                required
              />
              <div>
                <CmsLabel>URL (compartida en los 3 idiomas)</CmsLabel>
                <CmsInput
                  value={links.es?.[index]?.url || ''}
                  onChange={(e) => handleUpdateUrl(index, e.target.value)}
                  placeholder={urlPlaceholder}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
