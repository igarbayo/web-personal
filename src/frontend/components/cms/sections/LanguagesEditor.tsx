'use client'

import React from 'react'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { LanguageEntry } from '@/lib/types'
import { cardSurface } from '@/lib/cardSurface'

interface LanguagesEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function LanguagesEditor({ bundle, onChange }: LanguagesEditorProps) {
  const entriesCount = bundle.es.languages?.entries?.length || 0

  const updateTitle = (lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        languages: {
          ...bundle[lang].languages,
          title: val,
        },
      },
    })
  }

  const updateLanguageField = (
    index: number,
    field: 'language' | 'level',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    const entries = [...(nextBundle[lang].languages?.entries || [])]
    if (entries[index]) {
      entries[index] = { ...entries[index], [field]: val }
      nextBundle[lang] = {
        ...nextBundle[lang],
        languages: { ...nextBundle[lang].languages, entries },
      }
    }
    onChange(nextBundle)
  }

  const updateCertificationScores = (
    index: number,
    field: 'overallScore' | 'threshold' | 'scaleMin' | 'scaleMax',
    val: number
  ) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].languages?.entries || [])]
      if (entries[index]?.certification) {
        entries[index] = {
          ...entries[index],
          certification: {
            ...entries[index].certification!,
            [field]: val,
          },
        }
        nextBundle[l] = {
          ...nextBundle[l],
          languages: { ...nextBundle[l].languages, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  // `name`, `issuer`, `overallLevel`, `thresholdLabel` y `skillsLabel` son
  // texto visible en la web y difieren por idioma en los diccionarios, pero
  // el editor nunca les dio un campo: solo se podían tocar a mano en el JSON.
  const updateCertTextField = (
    index: number,
    field: 'name' | 'issuer' | 'overallLevel' | 'thresholdLabel' | 'skillsLabel',
    lang: LangKey,
    val: string
  ) => {
    const nextBundle = { ...bundle }
    const entries = [...(nextBundle[lang].languages?.entries || [])]
    if (entries[index]?.certification) {
      entries[index] = {
        ...entries[index],
        certification: { ...entries[index].certification!, [field]: val },
      }
      nextBundle[lang] = {
        ...nextBundle[lang],
        languages: { ...nextBundle[lang].languages, entries },
      }
    }
    onChange(nextBundle)
  }

  const updateSkillName = (langIdx: number, skillIdx: number, lang: LangKey, val: string) => {
    const nextBundle = { ...bundle }
    const entries = [...(nextBundle[lang].languages?.entries || [])]
    if (entries[langIdx]?.certification?.skills?.[skillIdx]) {
      const skills = [...entries[langIdx].certification!.skills]
      skills[skillIdx] = { ...skills[skillIdx], name: val }
      entries[langIdx] = {
        ...entries[langIdx],
        certification: { ...entries[langIdx].certification!, skills },
      }
      nextBundle[lang] = {
        ...nextBundle[lang],
        languages: { ...nextBundle[lang].languages, entries },
      }
    }
    onChange(nextBundle)
  }

  const updateSkillScore = (langIdx: number, skillIdx: number, score: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].languages?.entries || [])]
      if (entries[langIdx]?.certification?.skills?.[skillIdx]) {
        const skills = [...entries[langIdx].certification!.skills]
        skills[skillIdx] = { ...skills[skillIdx], score }
        entries[langIdx] = {
          ...entries[langIdx],
          certification: {
            ...entries[langIdx].certification!,
            skills,
          },
        }
        nextBundle[l] = {
          ...nextBundle[l],
          languages: { ...nextBundle[l].languages, entries },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddLanguage = () => {
    const newEntry: LanguageEntry = {
      language: 'Nuevo Idioma',
      level: 'B2 / Intermedio',
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = [...(nextBundle[l].languages?.entries || []), { ...newEntry }]
      nextBundle[l] = {
        ...nextBundle[l],
        languages: { ...nextBundle[l].languages, entries },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveLanguage = (index: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const entries = (nextBundle[l].languages?.entries || []).filter(
        (_, idx) => idx !== index
      )
      nextBundle[l] = {
        ...nextBundle[l],
        languages: { ...nextBundle[l].languages, entries },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsSection
        title="08 · Idiomas y Certificaciones Lingüísticas"
        description="Niveles de idiomas y desglose de destrezas (Cambridge English Scale)."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddLanguage}>
            + Añadir Idioma
          </CmsButton>
        }
      >
        <div className="mb-6 pb-6 border-b border-border">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.languages?.title || '',
              en: bundle.en.languages?.title || '',
              gl: bundle.gl.languages?.title || '',
            }}
            onChange={(lang, val) => updateTitle(lang, val)}
            required
          />
        </div>

        <div className="space-y-8">
          {Array.from({ length: entriesCount }).map((_, idx) => {
            const entryEs = bundle.es.languages?.entries?.[idx]
            const entryEn = bundle.en.languages?.entries?.[idx]
            const entryGl = bundle.gl.languages?.entries?.[idx]
            const cert = entryEs?.certification
            const certEn = entryEn?.certification
            const certGl = entryGl?.certification
            const range = cert ? cert.scaleMax - cert.scaleMin : 0

            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2 font-mono text-xs">
                  <span className="text-muted">
                    Entrada #{idx + 1}
                    {entryEs?.language ? `: ${entryEs.language}` : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(idx)}
                    className="text-danger hover:bg-danger/10 px-2 py-0.5 rounded"
                  >
                    ✕ Eliminar
                  </button>
                </div>

                {/* Misma tarjeta que CertCard: cabecera, filete, cuerpo. */}
                <div className={cardSurface}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TrilingualField
                      label="Nombre del Idioma"
                      values={{
                        es: entryEs?.language || '',
                        en: entryEn?.language || '',
                        gl: entryGl?.language || '',
                      }}
                      onChange={(lang, val) => updateLanguageField(idx, 'language', lang, val)}
                      required
                      variant="title"
                    />
                    <TrilingualField
                      label="Nivel de Competencia (ej. nativo, C1 Advanced)"
                      values={{
                        es: entryEs?.level || '',
                        en: entryEn?.level || '',
                        gl: entryGl?.level || '',
                      }}
                      onChange={(lang, val) => updateLanguageField(idx, 'level', lang, val)}
                      required
                      variant="subtitle"
                    />
                  </div>

                  {/* Desglose de certificación si existe */}
                  {cert && (
                    <>
                      <div className="h-px bg-border my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <TrilingualField
                          label="Nombre de la Certificación"
                          values={{
                            es: cert.name,
                            en: certEn?.name || '',
                            gl: certGl?.name || '',
                          }}
                          onChange={(lang, val) => updateCertTextField(idx, 'name', lang, val)}
                          required
                        />
                        <TrilingualField
                          label="Emisor"
                          values={{
                            es: cert.issuer,
                            en: certEn?.issuer || '',
                            gl: certGl?.issuer || '',
                          }}
                          onChange={(lang, val) => updateCertTextField(idx, 'issuer', lang, val)}
                          required
                        />
                      </div>

                      {/* Píldoras, misma forma que la web pero editables */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex flex-col items-center rounded-lg bg-accent/10 px-3 py-1.5">
                          <CmsInput
                            type="number"
                            value={cert.overallScore}
                            onChange={(e) =>
                              updateCertificationScores(
                                idx,
                                'overallScore',
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 text-center font-mono font-bold text-accent border-0 bg-transparent p-0 text-lg"
                          />
                          <span className="font-mono text-accent/70 text-[10px] uppercase tracking-wider mt-0.5">
                            Overall
                          </span>
                        </div>
                        <div className="min-w-[8rem]">
                          <TrilingualField
                            label="Nivel (ej. C1)"
                            values={{
                              es: cert.overallLevel,
                              en: certEn?.overallLevel || '',
                              gl: certGl?.overallLevel || '',
                            }}
                            onChange={(lang, val) =>
                              updateCertTextField(idx, 'overallLevel', lang, val)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <CmsLabel>Umbral Aprobado</CmsLabel>
                          <CmsInput
                            type="number"
                            value={cert.threshold}
                            onChange={(e) =>
                              updateCertificationScores(
                                idx,
                                'threshold',
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <CmsLabel>Escala Mínima</CmsLabel>
                          <CmsInput
                            type="number"
                            value={cert.scaleMin}
                            onChange={(e) =>
                              updateCertificationScores(
                                idx,
                                'scaleMin',
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <CmsLabel>Escala Máxima</CmsLabel>
                          <CmsInput
                            type="number"
                            value={cert.scaleMax}
                            onChange={(e) =>
                              updateCertificationScores(
                                idx,
                                'scaleMax',
                                parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </div>

                      <TrilingualField
                        label="Etiqueta de umbral (ej. Umbral C1 · 180)"
                        values={{
                          es: cert.thresholdLabel,
                          en: certEn?.thresholdLabel || '',
                          gl: certGl?.thresholdLabel || '',
                        }}
                        onChange={(lang, val) => updateCertTextField(idx, 'thresholdLabel', lang, val)}
                        required
                      />

                      <div className="mt-4">
                        <TrilingualField
                          label="Etiqueta de la Sección de Destrezas"
                          values={{
                            es: cert.skillsLabel,
                            en: certEn?.skillsLabel || '',
                            gl: certGl?.skillsLabel || '',
                          }}
                          onChange={(lang, val) => updateCertTextField(idx, 'skillsLabel', lang, val)}
                          required
                        />
                      </div>

                      <div className="mt-4 space-y-4">
                        <CmsLabel>Destrezas Individuales</CmsLabel>
                        {cert.skills.map((skill, sIdx) => {
                          const fillPct = range > 0 ? ((skill.score - cert.scaleMin) / range) * 100 : 0
                          return (
                            <div key={sIdx} className="space-y-1.5">
                              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 items-end">
                                <TrilingualField
                                  label={`Destreza #${sIdx + 1}`}
                                  values={{
                                    es: skill.name,
                                    en: certEn?.skills?.[sIdx]?.name || '',
                                    gl: certGl?.skills?.[sIdx]?.name || '',
                                  }}
                                  onChange={(lang, val) => updateSkillName(idx, sIdx, lang, val)}
                                  variant="meta"
                                  required
                                />
                                <div className="lg:w-24">
                                  <CmsLabel>Puntuación</CmsLabel>
                                  <CmsInput
                                    type="number"
                                    value={skill.score}
                                    onChange={(e) =>
                                      updateSkillScore(idx, sIdx, parseInt(e.target.value) || 0)
                                    }
                                  />
                                </div>
                              </div>
                              {/* Vista previa: misma barra que la web, sin revelado. */}
                              <div className="flex items-center gap-3">
                                <div className="flex-1 relative h-2 rounded-full bg-border">
                                  <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                                    style={{ width: `${Math.max(0, Math.min(100, fillPct))}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CmsSection>
    </div>
  )
}
