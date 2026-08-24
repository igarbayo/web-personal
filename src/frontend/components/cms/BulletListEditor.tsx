'use client'

import React from 'react'
import TrilingualField, { LangKey } from './TrilingualField'
import { CmsButton, CmsLabel } from './ui/CmsInput'

interface BulletListEditorProps {
  label?: string
  bullets: {
    es: string[]
    en: string[]
    gl: string[]
  }
  onChange: (updatedBullets: { es: string[]; en: string[]; gl: string[] }) => void
}

export default function BulletListEditor({
  label = 'Viñetas descriptivas',
  bullets,
  onChange,
}: BulletListEditorProps) {
  const maxLen = Math.max(
    bullets.es?.length || 0,
    bullets.en?.length || 0,
    bullets.gl?.length || 0
  )

  const handleUpdateBullet = (index: number, lang: LangKey, value: string) => {
    const nextEs = [...(bullets.es || [])]
    const nextEn = [...(bullets.en || [])]
    const nextGl = [...(bullets.gl || [])]

    // Ensure array is large enough
    while (nextEs.length <= index) nextEs.push('')
    while (nextEn.length <= index) nextEn.push('')
    while (nextGl.length <= index) nextGl.push('')

    if (lang === 'es') nextEs[index] = value
    if (lang === 'en') nextEn[index] = value
    if (lang === 'gl') nextGl[index] = value

    onChange({ es: nextEs, en: nextEn, gl: nextGl })
  }

  const handleAddBullet = () => {
    onChange({
      es: [...(bullets.es || []), ''],
      en: [...(bullets.en || []), ''],
      gl: [...(bullets.gl || []), ''],
    })
  }

  const handleRemoveBullet = (index: number) => {
    const nextEs = (bullets.es || []).filter((_, i) => i !== index)
    const nextEn = (bullets.en || []).filter((_, i) => i !== index)
    const nextGl = (bullets.gl || []).filter((_, i) => i !== index)
    onChange({ es: nextEs, en: nextEn, gl: nextGl })
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= maxLen) return

    const swap = (arr: string[]) => {
      const copy = [...arr]
      const temp = copy[index]
      copy[index] = copy[targetIdx]
      copy[targetIdx] = temp
      return copy
    }

    onChange({
      es: swap(bullets.es || []),
      en: swap(bullets.en || []),
      gl: swap(bullets.gl || []),
    })
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <CmsLabel>{label} ({maxLen})</CmsLabel>
        <CmsButton
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleAddBullet}
        >
          + Añadir viñeta
        </CmsButton>
      </div>

      {maxLen === 0 ? (
        <div className="p-4 border border-dashed border-border rounded-lg text-center text-xs text-muted font-mono">
          No hay viñetas añadidas. Pulsa &quot;+ Añadir viñeta&quot; para agregar una.
        </div>
      ) : (
        <div className="space-y-3">
          {Array.from({ length: maxLen }).map((_, index) => {
            const values = {
              es: bullets.es?.[index] || '',
              en: bullets.en?.[index] || '',
              gl: bullets.gl?.[index] || '',
            }

            return (
              <div
                key={index}
                className="bg-surface/50 border border-border rounded-lg p-3 space-y-2 relative group"
              >
                <div className="flex items-center justify-between pb-1 border-b border-border/40">
                  <span className="font-mono text-xs text-muted font-bold">
                    Viñeta #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="text-xs px-1.5 py-0.5 rounded text-muted hover:text-foreground disabled:opacity-30"
                      title="Mover arriba"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === maxLen - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="text-xs px-1.5 py-0.5 rounded text-muted hover:text-foreground disabled:opacity-30"
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(index)}
                      className="text-xs px-1.5 py-0.5 rounded text-red-500 hover:bg-red-500/10 ml-1"
                      title="Eliminar viñeta"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <TrilingualField
                  label=""
                  type="textarea"
                  rows={2}
                  values={values}
                  onChange={(lang, val) => handleUpdateBullet(index, lang, val)}
                  required
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
