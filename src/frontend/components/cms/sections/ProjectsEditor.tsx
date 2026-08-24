'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import ImagePicker from '../ImagePicker'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
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

  const updateLinks = (index: number, links: EntryLink[]) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].projects?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: links.length > 0 ? links : undefined,
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
      <CmsCard
        title="Sección: Proyectos y Competiciones (Portfolio)"
        description="Hackathons, proyectos open-source, algoritmos y herramientas."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Proyecto
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.projects?.entries?.[idx]
              const entryEn = bundle.en.projects?.entries?.[idx]
              const entryGl = bundle.gl.projects?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Proyecto #{idx + 1}: {entryEs?.title || 'Sin título'}
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
                      <CmsLabel required>Fechas (YYYY o MM/YYYY)</CmsLabel>
                      <CmsInput
                        value={entryEs?.date || ''}
                        onChange={(e) =>
                          updateEntryField(idx, 'date', 'es', e.target.value)
                        }
                        placeholder="2026 o 2025 – presente"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TrilingualField
                        label="Nombre del Proyecto"
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
                    label="Organización / Enlace (Opcional, formato [Texto](url))"
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
                      label="Logo del Proyecto (Modo Claro)"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateLogosOrImages(idx, 'logo', logos)}
                      multiple={true}
                    />
                    <ImagePicker
                      label="Logo del Proyecto (Modo Oscuro)"
                      selected={entryEs?.logoDark || []}
                      onChange={(logos) => updateLogosOrImages(idx, 'logoDark', logos)}
                      multiple={true}
                    />
                  </div>

                  <ImagePicker
                    label="Galería de Capturas del Proyecto (Opcional)"
                    selected={entryEs?.images || []}
                    onChange={(imgs) => updateLogosOrImages(idx, 'images', imgs)}
                    multiple={true}
                    helpText="Las imágenes deben estar optimizadas en .webp."
                  />

                  <BulletListEditor
                    label="Viñetas y Detalles Técnicos"
                    bullets={{
                      es: entryEs?.bullets || [],
                      en: entryEn?.bullets || [],
                      gl: entryGl?.bullets || [],
                    }}
                    onChange={(updated) => updateBullets(idx, updated)}
                  />

                  {/* Links / GitHub / Devpost */}
                  <div className="pt-2">
                    <CmsLabel>Chips de Enlaces (GitHub, Devpost, Demo)</CmsLabel>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(entryEs?.links || []).map((link, lIdx) => (
                        <div
                          key={lIdx}
                          className="flex items-center gap-2 bg-surface border border-border rounded-lg p-2 text-xs font-mono"
                        >
                          <input
                            value={link.label}
                            onChange={(e) => {
                              const copy = [...(entryEs?.links || [])]
                              copy[lIdx] = { ...copy[lIdx], label: e.target.value }
                              updateLinks(idx, copy)
                            }}
                            placeholder="GitHub, Web..."
                            className="bg-background border border-border rounded px-1.5 py-0.5 text-xs w-28"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => {
                              const copy = [...(entryEs?.links || [])]
                              copy[lIdx] = { ...copy[lIdx], url: e.target.value }
                              updateLinks(idx, copy)
                            }}
                            placeholder="https://github.com/..."
                            className="bg-background border border-border rounded px-1.5 py-0.5 text-xs w-48"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = (entryEs?.links || []).filter(
                                (_, i) => i !== lIdx
                              )
                              updateLinks(idx, copy)
                            }}
                            className="text-red-500 font-bold hover:opacity-80"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <CmsButton
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          const copy = [
                            ...(entryEs?.links || []),
                            { label: 'GitHub', url: 'https://github.com/...' },
                          ]
                          updateLinks(idx, copy)
                        }}
                      >
                        + Añadir Enlace
                      </CmsButton>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CmsCard>
    </div>
  )
}
