'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import ImagePicker from '../ImagePicker'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { CertificationEntry, EntryLink } from '@/lib/types'

interface CertificationsEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function CertificationsEditor({
  bundle,
  onChange,
}: CertificationsEditorProps) {
  const entriesCount = bundle.es.certifications?.entries?.length || 0

  const updateTitle = (lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        certifications: {
          ...bundle[lang].certifications,
          title: val,
        },
      },
    })
  }

  const updateEntryField = (
    index: number,
    field: 'date' | 'title' | 'issuer',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    if (field === 'date') {
      ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
        const entries = [...(nextBundle[l].certifications?.entries || [])]
        if (entries[index]) {
          entries[index] = { ...entries[index], date: val }
          nextBundle[l] = {
            ...nextBundle[l],
            certifications: { ...nextBundle[l].certifications, entries },
          }
        }
      })
    } else {
      const entries = [...(nextBundle[lang].certifications?.entries || [])]
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: val }
        nextBundle[lang] = {
          ...nextBundle[lang],
          certifications: { ...nextBundle[lang].certifications, entries },
        }
      }
    }
    onChange(nextBundle)
  }

  const updateLogos = (index: number, logos: string[]) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].certifications?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          logo: logos.length > 0 ? logos : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          certifications: { ...nextBundle[l].certifications, entries },
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
      const entries = [...(nextBundle[l].certifications?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          bullets: updated[l]?.length > 0 ? updated[l] : undefined,
        }
        nextBundle[l] = {
          ...nextBundle[l],
          certifications: { ...nextBundle[l].certifications, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddEntry = () => {
    const newEntry: CertificationEntry = {
      date: '08/2026',
      title: 'Nueva Certificación / Curso',
      issuer: 'Emisor Oficial (ej. Anthropic, AWS)',
      logo: ['anthropic.webp'],
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [{ ...newEntry }, ...(nextBundle[l].certifications?.entries || [])]
      nextBundle[l] = {
        ...nextBundle[l],
        certifications: { ...nextBundle[l].certifications, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveEntry = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].certifications?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        certifications: { ...nextBundle[l].certifications, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsCard
        title="Sección: Certificados y Cursos Oficiales"
        description="Acreditaciones técnicas, insignias y formación continua."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddEntry}
          >
            + Añadir Certificación
          </CmsButton>
        }
      >
        <div className="space-y-6">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.certifications?.title || '',
              en: bundle.en.certifications?.title || '',
              gl: bundle.gl.certifications?.title || '',
            }}
            onChange={(lang, val) => updateTitle(lang, val)}
            required
          />

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.certifications?.entries?.[idx]
              const entryEn = bundle.en.certifications?.entries?.[idx]
              const entryGl = bundle.gl.certifications?.entries?.[idx]

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Certificación #{idx + 1}: {entryEs?.title || 'Sin título'}
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
                        placeholder="08/2026"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <TrilingualField
                        label="Título del Certificado o Curso"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TrilingualField
                      label="Emisor / Entidad Certificadora"
                      values={{
                        es: entryEs?.issuer || '',
                        en: entryEn?.issuer || '',
                        gl: entryGl?.issuer || '',
                      }}
                      onChange={(lang, val) => updateEntryField(idx, 'issuer', lang, val)}
                      required
                    />

                    <ImagePicker
                      label="Logotipo del Emisor"
                      selected={entryEs?.logo || []}
                      onChange={(logos) => updateLogos(idx, logos)}
                      multiple={false}
                    />
                  </div>

                  <BulletListEditor
                    label="Viñetas Descriptivas (Opcional)"
                    bullets={{
                      es: entryEs?.bullets || [],
                      en: entryEn?.bullets || [],
                      gl: entryGl?.bullets || [],
                    }}
                    onChange={(updated) => updateBullets(idx, updated)}
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
