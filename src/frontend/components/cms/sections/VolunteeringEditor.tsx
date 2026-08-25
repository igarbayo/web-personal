'use client'

import React from 'react'
import CmsEntryFrame from '../CmsEntryFrame'
import DateField from '../DateField'
import ImagePicker from '../ImagePicker'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
import { CmsButton } from '../ui/CmsInput'
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
      <CmsSection
        title="09 · Voluntariado e Impacto Social"
        description="Iniciativas solidarias, tutorías arbitrales y programas comunitarios."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddEntry}>
            + Añadir Voluntariado
          </CmsButton>
        }
      >
        <div className="mb-6 pb-6 border-b border-border">
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
        </div>

        <div className="space-y-8">
          {Array.from({ length: entriesCount }).map((_, idx) => {
            const entryEs = bundle.es.volunteering?.entries?.[idx]
            const entryEn = bundle.en.volunteering?.entries?.[idx]
            const entryGl = bundle.gl.volunteering?.entries?.[idx]

            return (
              <CmsEntryFrame
                key={idx}
                index={idx}
                heading={entryEs?.title || 'Sin título'}
                timeline={false}
                onRemove={() => handleRemoveEntry(idx)}
                dateSlot={
                  <DateField
                    label="Fechas (MM/YYYY o YYYY)"
                    value={entryEs?.date || ''}
                    onChange={(val) => updateEntryField(idx, 'date', 'es', val)}
                    placeholder="10/2025 – 02/2026"
                  />
                }
                titleSlot={
                  <TrilingualField
                    label="Título del Voluntariado"
                    values={{
                      es: entryEs?.title || '',
                      en: entryEn?.title || '',
                      gl: entryGl?.title || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'title', lang, val)}
                    required
                    variant="title"
                  />
                }
                subtitleSlot={
                  <TrilingualField
                    label="Ubicación"
                    values={{
                      es: entryEs?.location || '',
                      en: entryEn?.location || '',
                      gl: entryGl?.location || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'location', lang, val)}
                    required
                    variant="subtitle"
                  />
                }
              >
                <TrilingualField
                  label="Descripción de la Actividad"
                  type="textarea"
                  rows={3}
                  values={{
                    es: entryEs?.description || '',
                    en: entryEn?.description || '',
                    gl: entryGl?.description || '',
                  }}
                  onChange={(lang, val) => updateEntryField(idx, 'description', lang, val)}
                  required
                />

                <ImagePicker
                  label="Galería de Fotos (Opcional)"
                  selected={entryEs?.images || []}
                  onChange={(imgs) => updateEntryImages(idx, imgs)}
                  multiple={true}
                />
              </CmsEntryFrame>
            )
          })}
        </div>
      </CmsSection>
    </div>
  )
}
