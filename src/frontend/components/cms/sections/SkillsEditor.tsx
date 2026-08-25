'use client'

import React, { useState } from 'react'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsSection from '../ui/CmsSection'
import { CmsButton, CmsInput } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'
import { cardSurface } from '@/lib/cardSurface'
import { getSkillIcon } from '@/lib/skillIcons'

interface SkillsEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function SkillsEditor({ bundle, onChange }: SkillsEditorProps) {
  const [newSkillInput, setNewSkillInput] = useState<{ [categoryIdx: number]: string }>({})

  const updateTitle = (lang: LangKey, val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        skills: {
          ...bundle[lang].skills,
          title: val,
        },
      },
    })
  }

  const categories = bundle.es.skills?.categories || []

  const updateCategoryName = (catIndex: number, lang: LangKey, val: string) => {
    const updateLangCategories = (l: LangKey) => {
      const cats = [...(bundle[l].skills?.categories || [])]
      if (cats[catIndex]) {
        cats[catIndex] = { ...cats[catIndex], name: val }
      }
      return cats
    }

    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        skills: {
          ...bundle[lang].skills,
          categories: updateLangCategories(lang),
        },
      },
    })
  }

  const handleAddSkillItem = (catIndex: number) => {
    const text = (newSkillInput[catIndex] || '').trim()
    if (!text) return

    const updateAllLangs = (currentItems: string[]) => {
      if (currentItems.includes(text)) return currentItems
      return [...currentItems, text]
    }

    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const cats = [...(nextBundle[l].skills?.categories || [])]
      if (cats[catIndex]) {
        cats[catIndex] = {
          ...cats[catIndex],
          items: updateAllLangs(cats[catIndex].items || []),
        }
        nextBundle[l] = {
          ...nextBundle[l],
          skills: { ...nextBundle[l].skills, categories: cats },
        }
      }
    })

    onChange(nextBundle)
    setNewSkillInput({ ...newSkillInput, [catIndex]: '' })
  }

  const handleRemoveSkillItem = (catIndex: number, itemToRemove: string) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const cats = [...(nextBundle[l].skills?.categories || [])]
      if (cats[catIndex]) {
        cats[catIndex] = {
          ...cats[catIndex],
          items: (cats[catIndex].items || []).filter((i) => i !== itemToRemove),
        }
        nextBundle[l] = {
          ...nextBundle[l],
          skills: { ...nextBundle[l].skills, categories: cats },
        }
      }
    })
    onChange(nextBundle)
  }

  const handleAddCategory = () => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const cats = [...(nextBundle[l].skills?.categories || [])]
      cats.push({ name: 'Nueva Categoría', items: [] })
      nextBundle[l] = {
        ...nextBundle[l],
        skills: { ...nextBundle[l].skills, categories: cats },
      }
    })
    onChange(nextBundle)
  }

  const handleRemoveCategory = (catIndex: number) => {
    const nextBundle = { ...bundle }
    ;(['es', 'en', 'gl'] as LangKey[]).forEach((l) => {
      const cats = (nextBundle[l].skills?.categories || []).filter(
        (_, idx) => idx !== catIndex
      )
      nextBundle[l] = {
        ...nextBundle[l],
        skills: { ...nextBundle[l].skills, categories: cats },
      }
    })
    onChange(nextBundle)
  }

  return (
    <div className="space-y-6">
      <CmsSection
        title="03 · Aptitudes y Competencias (Skills)"
        description="Categorías de tecnologías, lenguajes, frameworks y bases de datos."
        action={
          <CmsButton type="button" size="sm" variant="secondary" onClick={handleAddCategory}>
            + Añadir Categoría
          </CmsButton>
        }
      >
        <div className="mb-6 pb-6 border-b border-border">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.skills?.title || '',
              en: bundle.en.skills?.title || '',
              gl: bundle.gl.skills?.title || '',
            }}
            onChange={(lang, val) => updateTitle(lang, val)}
            required
          />
        </div>

        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className="text-muted">Categoría #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(idx)}
                  className="text-danger hover:bg-danger/10 px-2 py-0.5 rounded"
                >
                  ✕ Eliminar
                </button>
              </div>

              {/* Misma forma que la categoría pública: nombre en versalitas
                  sobre las insignias, montada en cardSurface. */}
              <div className={cardSurface}>
                <TrilingualField
                  label="Nombre de la Categoría"
                  values={{
                    es: bundle.es.skills?.categories?.[idx]?.name || '',
                    en: bundle.en.skills?.categories?.[idx]?.name || '',
                    gl: bundle.gl.skills?.categories?.[idx]?.name || '',
                  }}
                  onChange={(lang, val) => updateCategoryName(idx, lang, val)}
                  required
                />

                <div className="h-px bg-border my-4" />

                {/* El icono se pinta aquí con el mismo `getSkillIcon` que usa
                    `SkillBadge` en la web. La correspondencia es por cadena
                    exacta contra el mapa de `lib/skillIcons.ts`, así que un
                    hueco sin icono es la señal de que esa aptitud no está en
                    el mapa y saldrá solo como texto. Sin esta vista previa no
                    había forma de saberlo hasta publicar. */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(cat.items || []).length === 0 && (
                    <p className="text-xs text-muted font-mono italic">
                      Ninguna insignia añadida.
                    </p>
                  )}
                  {(cat.items || []).map((item) => {
                    const Icon = getSkillIcon(item)
                    return (
                      <span
                        key={item}
                        title={Icon ? undefined : `Sin icono: "${item}" no está en lib/skillIcons.ts`}
                        className="inline-flex items-center gap-1 font-mono text-sm pl-2 pr-1 py-0.5 rounded border border-border bg-surface text-foreground"
                      >
                        {Icon && <Icon className="w-5 h-5 shrink-0" />}
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillItem(idx, item)}
                          className="text-muted hover:text-danger font-bold ml-0.5"
                          title="Eliminar skill"
                        >
                          ✕
                        </button>
                      </span>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2 max-w-sm">
                  <CmsInput
                    value={newSkillInput[idx] || ''}
                    onChange={(e) =>
                      setNewSkillInput({
                        ...newSkillInput,
                        [idx]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSkillItem(idx)
                      }
                    }}
                    placeholder="Ej. Docker, TypeScript..."
                    className="text-xs py-1"
                  />
                  <CmsButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddSkillItem(idx)}
                  >
                    + Añadir
                  </CmsButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CmsSection>
    </div>
  )
}
