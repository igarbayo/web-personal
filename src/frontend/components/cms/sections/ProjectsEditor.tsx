'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import CmsEntryFrame from '../CmsEntryFrame'
import DateField from '../DateField'
import ImagePicker from '../ImagePicker'
import LinksEditor from '../LinksEditor'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { EntryLink, ProjectEntry } from '@/lib/types'

interface ProjectsEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function ProjectsEditor({ bundle, onChange }: ProjectsEditorProps) {
  const entriesCount = bundle.es.projects?.entries?.length || 0

  const updateTitles = (field: 'title' | 'pageTitle', lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        projects: {
          ...bundle[lang].projects,
          [field]: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'title' | 'organization' | 'logoBorderColor',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date' || field === 'logoBorderColor') {
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].projects?.entries || [])]
        if (entries[index]) {
          entries[index] = {
            ...entries[index],
            [field]: val ? val : undefined,
          }
          nextBundle[l] = {
            ...nextBundle[l],
            projects: { ...nextBundle[l].projects, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].projects?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          projects: { ...nextBundle[lang].projects, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateLogosOrImages = (
    index: number,
    field: 'logo' | 'logoDark' | 'images',
    items: string[]
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].projects?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          [field]: items.length > 0 ? items : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          projects: { ...nextBundle[l].projects, entries },
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
      const entries = [...(nextBundle[l].projects?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], bullets: updated[l] || [] }
        nextBundle[l] = {
          ...nextBundle[l],
          projects: { ...nextBundle[l].projects, entries },
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
      const entries = [...(nextBundle[l].projects?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: updated[l].length > 0 ? updated[l] : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          projects: { ...nextBundle[l].projects, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: ProjectEntry = {
      date: '2026',
      title: 'Nuevo Proyecto / Software',
      organization: '[GitHub](https://github.com/...)',
      bullets: ['Descripción y tecnologías utilizadas...'],
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [{ ...newEntry }, ...(nextBundle[l].projects?.entries || [])]
      nextBundle[l] = {
        ...nextBundle[l],
        projects: { ...nextBundle[l].projects, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].projects?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        projects: { ...nextBundle[l].projects, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsSection
        title="07 · Proyectos y Competiciones (Portfolio)"
        description="Hackathons, proyectos open-source, algoritmos y herramientas."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddEntry}>
            + Añadir Proyecto
          </CmsButton>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.projects?.title || '',
              en: bundle.en.projects?.title || '',
              gl: bundle.gl.projects?.title || '',
            }}
            onChange={(lang, val) => updateTitles('title', lang, val)}
            required
          />
          <TrilingualField
            label="Título de la Página Dedicada (/projects)"
            values={{
              es: bundle.es.projects?.pageTitle || '',
              en: bundle.en.projects?.pageTitle || '',
              gl: bundle.gl.projects?.pageTitle || '',
            }}
            onChange={(lang, val) => updateTitles('pageTitle', lang, val)}
            required
          />
        </div>

        <div className="space-y-8">
          {Array.from({ length: entriesCount }).map((_, idx) => {
            const entryEs = bundle.es.projects?.entries?.[idx]
            const entryEn = bundle.en.projects?.entries?.[idx]
            const entryGl = bundle.gl.projects?.entries?.[idx]

            return (
              <CmsEntryFrame
                key={idx}
                index={idx}
                heading={entryEs?.title || 'Sin título'}
                timeline={false}
                onRemove={() => handleRemoveEntry(idx)}
                dateSlot={
                  <DateField
                    label="Fechas (YYYY o MM/YYYY)"
                    value={entryEs?.date || ''}
                    onChange={(val) => updateEntryField(idx, 'date', 'es', val)}
                    placeholder="2026 o 2025 – {present}"
                  />
                }
                logoSlot={
                  <div className="space-y-3">
                    <ImagePicker
                      label="Logo"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateLogosOrImages(idx, 'logo', logos)}
                      multiple={true}
                      compact
                    />
                    <ImagePicker
                      label="Logo oscuro"
                      selected={entryEs?.logoDark || []}
                      onChange={(logos) => updateLogosOrImages(idx, 'logoDark', logos)}
                      multiple={true}
                      compact
                    />
                    <div>
                      <CmsLabel>Color de borde (opcional)</CmsLabel>
                      <CmsInput
                        value={entryEs?.logoBorderColor || ''}
                        onChange={(e) =>
                          updateEntryField(idx, 'logoBorderColor', 'es', e.target.value)
                        }
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                }
                titleSlot={
                  <TrilingualField
                    label="Nombre del Proyecto"
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
                    label="Organización / Enlace (Opcional, formato [Texto](url))"
                    values={{
                      es: entryEs?.organization || '',
                      en: entryEn?.organization || '',
                      gl: entryGl?.organization || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'organization', lang, val)}
                    variant="subtitle"
                  />
                }
              >
                <BulletListEditor
                  label="Viñetas y Detalles Técnicos"
                  bullets={{
                    es: entryEs?.bullets || [],
                    en: entryEn?.bullets || [],
                    gl: entryGl?.bullets || [],
                  }}
                  onChange={(updated) => updateBullets(idx, updated)}
                />

                <LinksEditor
                  label="Enlaces (GitHub, Devpost, Demo)"
                  links={{
                    es: entryEs?.links || [],
                    en: entryEn?.links || [],
                    gl: entryGl?.links || [],
                  }}
                  onChange={(updated) => updateLinks(idx, updated)}
                  defaultLabel="GitHub"
                  urlPlaceholder="https://github.com/..."
                />

                <ImagePicker
                  label="Galería de Capturas del Proyecto (Opcional)"
                  selected={entryEs?.images || []}
                  onChange={(imgs) => updateLogosOrImages(idx, 'images', imgs)}
                  multiple={true}
                  helpText="Las imágenes deben estar optimizadas en .webp."
                />
              </CmsEntryFrame>
            )
          })}
        </div>
      </CmsSection>
    </div>
  )
}
