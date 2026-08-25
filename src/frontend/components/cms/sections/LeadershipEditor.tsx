'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import ImagePicker from '../ImagePicker'
import LinksEditor from '../LinksEditor'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { EntryLink, LeadershipEntry } from '@/lib/types'

interface LeadershipEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function LeadershipEditor({ bundle, onChange }: LeadershipEditorProps) {
  const entriesCount = bundle.es.leadership?.entries?.length || 0

  const updateTitle = (lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        leadership: {
          ...bundle[lang].leadership,
          title: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'title' | 'organization',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date') {
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].leadership?.entries || [])]
        if (entries[index]) {
          entries[index] = { ...entries[index], date: val }
          nextBundle[l] = {
            ...nextBundle[l],
            leadership: { ...nextBundle[l].leadership, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].leadership?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          leadership: { ...nextBundle[lang].leadership, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateEntryImages = (
    index: number,
    field: 'logo' | 'images',
    items: string[]
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].leadership?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          [field]: items.length > 0 ? items : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          leadership: { ...nextBundle[l].leadership, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const updateBullets = (
    index: number,
    updated: { es: string[]; en: string[]; gl: string[] }
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].leadership?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], bullets: updated[l] || [] }
        nextBundle[l] = {
          ...nextBundle[l],
          leadership: { ...nextBundle[l].leadership, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const updateLinks = (
    index: number,
    updated: { es: EntryLink[]; en: EntryLink[]; gl: EntryLink[] }
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].leadership?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: updated[l].length > 0 ? updated[l] : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          leadership: { ...nextBundle[l].leadership, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: LeadershipEntry = {
      date: '2026',
      title: 'Nuevo Reconocimiento / Premio',
      organization: 'Entidad Organizadora',
      bullets: ['Detalles del premio...'],
      logo: ['bankinter.webp'],
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [{ ...newEntry }, ...(nextBundle[l].leadership?.entries || [])]
      nextBundle[l] = {
        ...nextBundle[l],
        leadership: { ...nextBundle[l].leadership, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].leadership?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        leadership: { ...nextBundle[l].leadership, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsCard
        title="Sección: Premios y Liderazgo"
        description="Reconocimientos nacionales, hackathons y premios académicos."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Reconocimiento
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.leadership?.title || '',
              en: bundle.en.leadership?.title || '',
              gl: bundle.gl.leadership?.title || '',
            }}
            onChange={(lang, val) => updateTitle(lang, val)}
            required
          />

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.leadership?.entries?.[idx]
              const entryEn = bundle.en.leadership?.entries?.[idx]
              const entryGl = bundle.gl.leadership?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Premio #{idx + 1}: {entryEs?.title || 'Sin título'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(idx)}
                      className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded font-mono"
                    >
                      ✕ Eliminar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <CmsLabel required>Fechas (MM/YYYY o YYYY)</CmsLabel>
                      <CmsInput
                        value={entryEs?.date || ''}
                        onChange={(e) =>
                          updateEntryField(idx, 'date', 'es', e.target.value)
                        }
                        placeholder="10/2023 – 06/2024"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TrilingualField
                        label="Título del Premio / Logro"
                        values={{
                          es: entryEs?.title || '',
                          en: entryEn?.title || '',
                          gl: entryGl?.title || '',
                        }}
                        onChange={(lang, val) => updateEntryField(idx, 'title', lang, val)}
                        required
                      />
                    </div>
                  </div>

                  <TrilingualField
                    label="Organización / Entidad"
                    values={{
                      es: entryEs?.organization || '',
                      en: entryEn?.organization || '',
                      gl: entryGl?.organization || '',
                    }}
                    onChange={(lang, val) =>
                      updateEntryField(idx, 'organization', lang, val)
                    }
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImagePicker
                      label="Logo de la Entidad"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateEntryImages(idx, 'logo', logos)}
                      multiple={false}
                    />
                    <ImagePicker
                      label="Galería de Fotos del Evento (Opcional)"
                      selected={entryEs?.images || []}
                      onChange={(imgs) => updateEntryImages(idx, 'images', imgs)}
                      multiple={true}
                    />
                  </div>

                  <BulletListEditor
                    label="Detalles y Viñetas del Reconocimiento"
                    bullets={{
                      es: entryEs?.bullets || [],
                      en: entryEn?.bullets || [],
                      gl: entryGl?.bullets || [],
                    }}
                    onChange={(updated) => updateBullets(idx, updated)}
                  />

                  <LinksEditor
                    label="Enlaces de Prensa / Verificación"
                    links={{
                      es: entryEs?.links || [],
                      en: entryEn?.links || [],
                      gl: entryGl?.links || [],
                    }}
                    onChange={(updated) => updateLinks(idx, updated)}
                    defaultLabel="Noticia"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </CmsCard>
    </div>
  )
}
