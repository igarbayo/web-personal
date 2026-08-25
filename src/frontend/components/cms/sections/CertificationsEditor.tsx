'use client'

import React from 'react'
import BulletListEditor from '../BulletListEditor'
import CmsEntryFrame from '../CmsEntryFrame'
import ImagePicker from '../ImagePicker'
import LinksEditor from '../LinksEditor'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
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

  const updateLinks = (
    index: number,
    updated: { es: EntryLink[]; en: EntryLink[]; gl: EntryLink[] }
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].certifications?.entries || [])]
      if (entries[index]) {
        entries[index] = {
          ...entries[index],
          links: updated[l].length > 0 ? updated[l] : undefined,
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
      <CmsSection
        title="10 · Certificados y Cursos Oficiales"
        description="Acreditaciones técnicas, insignias y formación continua."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddEntry}>
            + Añadir Certificación
          </CmsButton>
        }
      >
        <div className="mb-6 pb-6 border-b border-border">
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
        </div>

        <div className="space-y-8">
          {Array.from({ length: entriesCount }).map((_, idx) => {
            const entryEs = bundle.es.certifications?.entries?.[idx]
            const entryEn = bundle.en.certifications?.entries?.[idx]
            const entryGl = bundle.gl.certifications?.entries?.[idx]

            return (
              <CmsEntryFrame
                key={idx}
                index={idx}
                heading={entryEs?.title || 'Sin título'}
                timeline
                onRemove={() => handleRemoveEntry(idx)}
                dateSlot={
                  <div>
                    <CmsLabel required>Fechas (MM/YYYY)</CmsLabel>
                    <CmsInput
                      value={entryEs?.date || ''}
                      onChange={(e) => updateEntryField(idx, 'date', 'es', e.target.value)}
                      placeholder="08/2026"
                    />
                  </div>
                }
                logoSlot={
                  <ImagePicker
                    label="Logo"
                    selected={entryEs?.logo || []}
                    onChange={(logos) => updateLogos(idx, logos)}
                    multiple={false}
                    compact
                  />
                }
                titleSlot={
                  <TrilingualField
                    label="Título del Certificado o Curso"
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
                    label="Emisor / Entidad Certificadora"
                    values={{
                      es: entryEs?.issuer || '',
                      en: entryEn?.issuer || '',
                      gl: entryGl?.issuer || '',
                    }}
                    onChange={(lang, val) => updateEntryField(idx, 'issuer', lang, val)}
                    required
                    variant="subtitle"
                  />
                }
              >
                <BulletListEditor
                  label="Viñetas Descriptivas (Opcional)"
                  bullets={{
                    es: entryEs?.bullets || [],
                    en: entryEn?.bullets || [],
                    gl: entryGl?.bullets || [],
                  }}
                  onChange={(updated) => updateBullets(idx, updated)}
                />

                <LinksEditor
                  label="Enlaces de Verificación (ej. Credencial)"
                  links={{
                    es: entryEs?.links || [],
                    en: entryEn?.links || [],
                    gl: entryGl?.links || [],
                  }}
                  onChange={(updated) => updateLinks(idx, updated)}
                  defaultLabel="Credencial"
                />
              </CmsEntryFrame>
            )
          })}
        </div>
      </CmsSection>
    </div>
  )
}
