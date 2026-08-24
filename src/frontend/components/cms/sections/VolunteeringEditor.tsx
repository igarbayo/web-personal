'use client'

import React from 'react'
import ImagePicker from '../ImagePicker'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { VolunteeringEntry } from '@/lib/types'

interface VolunteeringEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function VolunteeringEditor({ bundle, onChange }: VolunteeringEditorProps) {
  const entriesCount = bundle.es.volunteering?.entries?.length || 0

  const updateTitle = (lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        volunteering: {
          ...bundle[lang].volunteering,
          title: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'title' | 'location' | 'description',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date') {
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].volunteering?.entries || [])]
        if (entries[index]) {
          entries[index] = { ...entries[index], date: val }
          nextBundle[l] = {
            ...nextBundle[l],
            volunteering: { ...nextBundle[l].volunteering, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].volunteering?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          volunteering: { ...nextBundle[lang].volunteering, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateEntryImages = (index: number, images: string[]) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].volunteering?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          images: images.length > 0 ? images : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          volunteering: { ...nextBundle[l].volunteering, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: VolunteeringEntry = {
      date: '2026',
      title: 'Nuevo Voluntariado',
      location: 'Galicia, España',
      description: 'Descripción de la actividad solidaria...',
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [{ ...newEntry }, ...(nextBundle[l].volunteering?.entries || [])]
      nextBundle[l] = {
        ...nextBundle[l],
        volunteering: { ...nextBundle[l].volunteering, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].volunteering?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        volunteering: { ...nextBundle[l].volunteering, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsCard
        title="Sección: Voluntariado e Impacto Social"
        description="Iniciativas solidarias, tutorías arbitrales y programas comunitarios."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Voluntariado
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.volunteering?.title || '',
              en: bundle.en.volunteering?.title || '',
              gl: bundle.gl.volunteering?.title || '',
            }}
            onChange={(lang, val) => updateTitle(lang, val)}
            required
          />

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.volunteering?.entries?.[idx]
              const entryEn = bundle.en.volunteering?.entries?.[idx]
              const entryGl = bundle.gl.volunteering?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Voluntariado #{idx + 1}: {entryEs?.title || 'Sin título'}
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
                        placeholder="10/2025 – 02/2026"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TrilingualField
                        label="Título del Voluntariado"
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
                    label="Ubicación"
                    values={{
                      es: entryEs?.location || '',
                      en: entryEn?.location || '',
                      gl: entryGl?.location || '',
                    }}
                    onChange={(lang, val) =>
                      updateEntryField(idx, 'location', lang, val)
                    }
                    required
                  />

                  <TrilingualField
                    label="Descripción de la Actividad"
                    type="textarea"
                    rows={3}
                    values={{
                      es: entryEs?.description || '',
                      en: entryEn?.description || '',
                      gl: entryGl?.description || '',
                    }}
                    onChange={(lang, val) =>
                      updateEntryField(idx, 'description', lang, val)
                    }
                    required
                  />

                  <ImagePicker
                    label="Galería de Fotos (Opcional)"
                    selected={entryEs?.images || []}
                    onChange={(imgs) => updateEntryImages(idx, imgs)}
                    multiple={true}
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
