'use client'

import React from 'react'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import type { LanguageEntry } from '@/lib/types'

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
      <CmsCard
        title="Sección: Idiomas y Certificaciones Lingüísticas"
        description="Niveles de idiomas y desglose de destrezas (Cambridge English Scale)."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddLanguage}
          >
            + Añadir Idioma
          </CmsButton>
        }
      >
        <div className="space-y-6">
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

          <div className="space-y-6 pt-2">
            {Array.from({ length: entriesCount }).map((_, idx) => {
              const entryEs = bundle.es.languages?.entries?.[idx]
              const entryEn = bundle.en.languages?.entries?.[idx]
              const entryGl = bundle.gl.languages?.entries?.[idx]
              const cert = entryEs?.certification

              return (
                <div
                  key={idx}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-mono text-xs font-bold text-accent uppercase">
                      Idioma #{idx + 1}: {entryEs?.language || 'Sin nombre'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(idx)}
                      className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded font-mono"
                    >
                      ✕ Eliminar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TrilingualField
                      label="Nombre del Idioma"
                      values={{
                        es: entryEs?.language || '',
                        en: entryEn?.language || '',
                        gl: entryGl?.language || '',
                      }}
                      onChange={(lang, val) =>
                        updateLanguageField(idx, 'language', lang, val)
                      }
                      required
                    />

                    <TrilingualField
                      label="Nivel de Competencia (ej. nativo, C1 Advanced)"
                      values={{
                        es: entryEs?.level || '',
                        en: entryEn?.level || '',
                        gl: entryGl?.level || '',
                      }}
                      onChange={(lang, val) =>
                        updateLanguageField(idx, 'level', lang, val)
                      }
                      required
                    />
                  </div>

                  {/* Certification Scores Breakdown if exists */}
                  {cert && (
                    <div className="bg-surface border border-border rounded-lg p-4 space-y-4 mt-2">
                      <span className="font-mono text-xs font-bold text-accent uppercase block pb-1 border-b border-border">
                        Desglose de Puntuaciones Oficiales ({cert.name})
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                        <div>
                          <CmsLabel>Puntuación Global</CmsLabel>
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
                          />
                        </div>
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

                      <div className="pt-2">
                        <CmsLabel>Destrezas Individuales (Skills)</CmsLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                          {cert.skills.map((skill, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-background border border-border rounded p-2 text-xs flex items-center justify-between gap-2"
                            >
                              <span className="font-mono text-foreground">
                                {skill.name}
                              </span>
                              <input
                                type="number"
                                value={skill.score}
                                onChange={(e) =>
                                  updateSkillScore(
                                    idx,
                                    sIdx,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 bg-surface border border-border rounded px-1.5 py-0.5 text-right font-mono font-bold text-accent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </CmsCard>
    </div>
  )
}
