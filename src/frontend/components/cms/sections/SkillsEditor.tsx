'use client'

import React, { useState } from 'react'
import TrilingualField, { LangKey } from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsBadge } from '../ui/CmsBadge'
import { CmsButton, CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'

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
      <CmsCard
        title="Sección: Aptitudes y Competencias (Skills)"
        description="Categorías de tecnologías, lenguajes, frameworks y bases de datos."
        action={
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAddCategory}
          >
            + Añadir Categoría
          </CmsButton>
        }
      >
        <div className="space-y-6">
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

          <div className="space-y-5 pt-2">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-background border border-border rounded-xl p-4 md:p-5 space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="font-mono text-xs font-bold text-accent uppercase">
                    Categoría #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(idx)}
                    className="text-xs text-red-500 hover:bg-red-500/10 px-2 py-0.5 rounded font-mono"
                  >
                    ✕ Eliminar Categoría
                  </button>
                </div>

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

                <div>
                  <CmsLabel>Insignias de Competencias ({cat.items?.length || 0})</CmsLabel>
                  <div className="flex flex-wrap gap-2 py-2">
                    {(cat.items || []).map((item) => (
                      <CmsBadge key={item} variant="default" size="md">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillItem(idx, item)}
                          className="hover:text-red-500 ml-1 font-bold"
                          title="Eliminar skill"
                        >
                          ✕
                        </button>
                      </CmsBadge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1 max-w-sm">
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
        </div>
      </CmsCard>
    </div>
  )
}
