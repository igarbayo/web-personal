'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import ImagePicker from '../ImagePicker'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
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

  const updateLogos = (index: number, field: 'logo' | 'logoDark', logos: string[]) => {
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

  const updateLinks = (index: number, links: EntryLink[]) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].experience?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: links.length > 0 ? links : undefined,
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
      date: '07/2026 – presente',
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
      <CmsCard
        title="Sección: Trayectoria y Experiencia Profesional"
        description="Puestos, empresas, fechas, viñetas de impacto y enlaces."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Experiencia
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.experience?.entries?.[idx]
              const entryEn = bundle.en.experience?.entries?.[idx]
              const entryGl = bundle.gl.experience?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Experiencia #{idx + 1}: {entryEs?.title || 'Sin título'}
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
                      <CmsLabel required>Fechas (MM/YYYY)</CmsLabel>
                      <CmsInput
                        value={entryEs?.date || ''}
                        onChange={(e) =>
                          updateEntryField(idx, 'date', 'es', e.target.value)
                        }
                        placeholder="07/2025 – 09/2025"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TrilingualField
                        label="Puesto / Cargo"
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
                    label="Empresa / Entidad (Soporta enlace Markdown [Empresa](https://...))"
                    values={{
                      es: entryEs?.company || '',
                      en: entryEn?.company || '',
                      gl: entryGl?.company || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'company', lang, val)}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImagePicker
                      label="Logos Empresa (Modo Claro)"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateLogos(idx, 'logo', logos)}
                      multiple={true}
                    />
                    <ImagePicker
                      label="Logos Empresa (Modo Oscuro - Opcional)"
                      selected={entryEs?.logoDark || []}
                      onChange={(logos) => updateLogos(idx, 'logoDark', logos)}
                      multiple={true}
                    />
                  </div>

                  <BulletListEditor
                    label="Logros y Viñetas de Experiencia"
                    bullets={{
                      es: entryEs?.bullets || [],
                      en: entryEn?.bullets || [],
                      gl: entryGl?.bullets || [],
                    }}
                    onChange={(updated) => updateBullets(idx, updated)}
                  />

                  {/* Links / Chips */}
                  <div className="pt-2">
                    <CmsLabel>Chips de Enlaces Externos (ej. Memoria)</CmsLabel>
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
                            placeholder="Etiqueta"
                            className="bg-background border border-border rounded px-1.5 py-0.5 text-xs w-24"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => {
                              const copy = [...(entryEs?.links || [])]
                              copy[lIdx] = { ...copy[lIdx], url: e.target.value }
                              updateLinks(idx, copy)
                            }}
                            placeholder="https://..."
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
                            { label: 'Memoria', url: 'https://...' },
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
