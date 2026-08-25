'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import ImagePicker from '../ImagePicker'
import LinksEditor from '../LinksEditor'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { EducationEntry, EntryLink } from '@/lib/types'

interface EducationEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function EducationEditor({ bundle, onChange }: EducationEditorProps) {
  const entriesCount = bundle.es.education?.entries?.length || 0

  const updateTitles = (field: 'title' | 'pageTitle', lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        education: {
          ...bundle[lang].education,
          [field]: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'degree' | 'institution',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date') {
      // Date is shared across languages
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].education?.entries || [])]
        if (entries[index]) {
          entries[index] = { ...entries[index], date: val }
          nextBundle[l] = {
            ...nextBundle[l],
            education: { ...nextBundle[l].education, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].education?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          education: { ...nextBundle[lang].education, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateEntryLogo = (index: number, logos: string[]) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].education?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], logo: logos }
        nextBundle[l] = {
          ...nextBundle[l],
          education: { ...nextBundle[l].education, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const updateEntryBullets = (
    index: number,
    updatedBullets: { es: string[]; en: string[]; gl: string[] }
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].education?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], bullets: updatedBullets[l] || [] }
        nextBundle[l] = {
          ...nextBundle[l],
          education: { ...nextBundle[l].education, entries },
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
      const entries = [...(nextBundle[l].education?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: updated[l].length > 0 ? updated[l] : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          education: { ...nextBundle[l].education, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: EducationEntry = {
      date: '09/2021 – 06/2027',
      degree: 'Nuevo Grado / Titulación',
      institution: 'Universidade de Santiago de Compostela',
      bullets: ['Asignaturas relevantes...'],
      logo: ['usc.webp'],
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].education?.entries || []), { ...newEntry }]
      nextBundle[l] = {
        ...nextBundle[l],
        education: { ...nextBundle[l].education, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].education?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        education: { ...nextBundle[l].education, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsCard
        title="Sección: Formación y Educación"
        description="Titulaciones académicas, notas, honores y asignaturas destacadas."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Titulación
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TrilingualField
              label="Título de la Sección"
              values={{
                es: bundle.es.education?.title || '',
                en: bundle.en.education?.title || '',
                gl: bundle.gl.education?.title || '',
              }}
              onChange={(lang, val) => updateTitles('title', lang, val)}
              required
            />
            <TrilingualField
              label="Título de la Página Dedicada (/education)"
              values={{
                es: bundle.es.education?.pageTitle || '',
                en: bundle.en.education?.pageTitle || '',
                gl: bundle.gl.education?.pageTitle || '',
              }}
              onChange={(lang, val) => updateTitles('pageTitle', lang, val)}
              required
            />
          </div>

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.education?.entries?.[idx]
              const entryEn = bundle.en.education?.entries?.[idx]
              const entryGl = bundle.gl.education?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Titulación #{idx + 1}: {entryEs?.degree || 'Sin título'}
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
                      <CmsLabel required>
                        Fechas (Formato obligatorio MM/YYYY)
                      </CmsLabel>
                      <CmsInput
                        value={entryEs?.date || ''}
                        onChange={(e) =>
                          updateEntryField(idx, 'date', 'es', e.target.value)
                        }
                        placeholder="09/2021 – 06/2027"
                      />
                      <p className="text-[11px] text-muted font-mono mt-1">
                        Siempre años de 4 cifras (ej. 2026).
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <ImagePicker
                        label="Logotipo de la Institución"
                        selected={entryEs?.logo || []}
                        onChange={(logos) => updateEntryLogo(idx, logos)}
                        multiple={false}
                      />
                    </div>
                  </div>

                  <TrilingualField
                    label="Nombre del Grado / Titulación"
                    values={{
                      es: entryEs?.degree || '',
                      en: entryEn?.degree || '',
                      gl: entryGl?.degree || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'degree', lang, val)}
                    required
                  />

                  <TrilingualField
                    label="Institución / Universidad"
                    values={{
                      es: entryEs?.institution || '',
                      en: entryEn?.institution || '',
                      gl: entryGl?.institution || '',
                    }}
                    onChange={(lang, val) =>
                      updateEntryField(idx, 'institution', lang, val)
                    }
                    required
                  />

                  <BulletListEditor
                    label="Viñetas (Asignaturas, TFG, Notas)"
                    bullets={{
                      es: entryEs?.bullets || [],
                      en: entryEn?.bullets || [],
                      gl: entryGl?.bullets || [],
                    }}
                    onChange={(updated) => updateEntryBullets(idx, updated)}
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
