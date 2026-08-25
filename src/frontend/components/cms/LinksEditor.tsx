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
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <CmsLabel>{label} ({count})</CmsLabel>
        <CmsButton type="button" size="sm" variant="secondary" onClick={handleAdd}>
          + Añadir Enlace
        </CmsButton>
      </div>

      {count === 0 ? (
        <div className="p-4 border border-dashed border-border rounded-lg text-center text-xs text-muted font-mono">
          No hay enlaces añadidos. Pulsa &quot;+ Añadir Enlace&quot; para agregar uno.
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="bg-surface/50 border border-border rounded-lg p-3 space-y-2 relative group"
            >
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="font-mono text-xs text-muted font-bold">
                  Enlace #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-xs px-1.5 py-0.5 rounded text-red-500 hover:bg-red-500/10"
                  title="Eliminar enlace"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
