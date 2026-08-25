'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import CmsEntryFrame from '../CmsEntryFrame'
import DateField from '../DateField'
import ImagePicker from '../ImagePicker'
import LinksEditor from '../LinksEditor'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
import { CmsButton } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { EntryLink, ExperienceEntry } from '@/lib/types'

interface ExperienceEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function ExperienceEditor({ bundle, onChange }: ExperienceEditorProps) {
  const entriesCount = bundle.es.experience?.entries?.length || 0

  const updateTitles = (field: 'title' | 'pageTitle', lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        experience: {
          ...bundle[lang].experience,
          [field]: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'title' | 'company' | 'note',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date') {
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].experience?.entries || [])]
        if (entries[index]) {
          entries[index] = { ...entries[index], date: val }
          nextBundle[l] = {
            ...nextBundle[l],
            experience: { ...nextBundle[l].experience, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].experience?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          experience: { ...nextBundle[lang].experience, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateLogos = (
    index: number,
    field: 'logo' | 'logoDark' | 'images',
    logos: string[]
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].experience?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          [field]: logos.length > 0 ? logos : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          experience: { ...nextBundle[l].experience, entries },
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
      const entries = [...(nextBundle[l].experience?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], bullets: updated[l] || [] }
        nextBundle[l] = {
          ...nextBundle[l],
          experience: { ...nextBundle[l].experience, entries },
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
      const entries = [...(nextBundle[l].experience?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: updated[l].length > 0 ? updated[l] : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          experience: { ...nextBundle[l].experience, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: ExperienceEntry = {
      date: '07/2026 – {present}',
      title: 'Puesto / Rol Profesional',
      company: '[Nombre Empresa](https://empresa.com)',
      bullets: ['Responsabilidad o logro alcanzado...'],
      logo: ['citius.webp'],
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [{ ...newEntry }, ...(nextBundle[l].experience?.entries || [])]
      nextBundle[l] = {
        ...nextBundle[l],
        experience: { ...nextBundle[l].experience, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].experience?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        experience: { ...nextBundle[l].experience, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsSection
        title="05 · Trayectoria y Experiencia Profesional"
        description="Puestos, empresas, fechas, viñetas de impacto y enlaces."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddEntry}>
            + Añadir Experiencia
          </CmsButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.experience?.title || '',
              en: bundle.en.experience?.title || '',
              gl: bundle.gl.experience?.title || '',
            }}
            onChange={(lang, val) => updateTitles('title', lang, val)}
            required
          />
          <TrilingualField
            label="Título de la Página Dedicada (/experience)"
            values={{
              es: bundle.es.experience?.pageTitle || '',
              en: bundle.en.experience?.pageTitle || '',
              gl: bundle.gl.experience?.pageTitle || '',
            }}
            onChange={(lang, val) => updateTitles('pageTitle', lang, val)}
            required
          />
        </div>

        <div className="space-y-8">
          {Array.from({ length: entriesCount }).map((_, idx) => {
            const entryEs = bundle.es.experience?.entries?.[idx]
            const entryEn = bundle.en.experience?.entries?.[idx]
            const entryGl = bundle.gl.experience?.entries?.[idx]

            return (
              <CmsEntryFrame
                key={idx}
                index={idx}
                heading={entryEs?.title || 'Sin título'}
                timeline
                onRemove={() => handleRemoveEntry(idx)}
                dateSlot={
                  <DateField
                    label="Fechas (MM/YYYY)"
                    value={entryEs?.date || ''}
                    onChange={(val) => updateEntryField(idx, 'date', 'es', val)}
                    placeholder="07/2025 – 09/2025"
                  />
                }
                logoSlot={
                  <div className="space-y-3">
                    <ImagePicker
                      label="Logo"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateLogos(idx, 'logo', logos)}
                      multiple={true}
                      compact
                    />
                    <ImagePicker
                      label="Logo oscuro"
                      selected={entryEs?.logoDark || []}
                      onChange={(logos) => updateLogos(idx, 'logoDark', logos)}
                      multiple={true}
                      compact
                    />
                  </div>
                }
                titleSlot={
                  <TrilingualField
                    label="Puesto / Cargo"
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
                    label="Empresa / Entidad (Soporta enlace Markdown [Empresa](https://...))"
                    values={{
                      es: entryEs?.company || '',
                      en: entryEn?.company || '',
                      gl: entryGl?.company || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'company', lang, val)}
                    required
                    variant="subtitle"
                  />
                }
              >
                <BulletListEditor
                  label="Logros y Viñetas de Experiencia"
                  bullets={{
                    es: entryEs?.bullets || [],
                    en: entryEn?.bullets || [],
                    gl: entryGl?.bullets || [],
                  }}
                  onChange={(updated) => updateBullets(idx, updated)}
                />

                <TrilingualField
                  label="Nota (opcional, en cursiva bajo las viñetas)"
                  type="textarea"
                  rows={2}
                  values={{
                    es: entryEs?.note || '',
                    en: entryEn?.note || '',
                    gl: entryGl?.note || '',
                  }}
                  onChange={(lang, val) => updateEntryField(idx, 'note', lang, val)}
                  variant="meta"
                />

                <LinksEditor
                  label="Enlaces Externos (ej. Memoria)"
                  links={{
                    es: entryEs?.links || [],
                    en: entryEn?.links || [],
                    gl: entryGl?.links || [],
                  }}
                  onChange={(updated) => updateLinks(idx, updated)}
                  defaultLabel="Memoria"
                />

                <ImagePicker
                  label="Galería de Fotos (Opcional)"
                  selected={entryEs?.images || []}
                  onChange={(imgs) => updateLogos(idx, 'images', imgs)}
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
