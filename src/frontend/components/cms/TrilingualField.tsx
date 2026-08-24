'use client'

import React, { useState } from 'react'
import { CmsButton, CmsInput, CmsLabel, CmsTextarea } from './ui/CmsInput'

export type LangKey = 'es' | 'en' | 'gl'

interface TrilingualFieldProps {
  label: string
  values: {
    es: string
    en: string
    gl: string
  }
  onChange: (lang: LangKey, value: string) => void
  type?: 'input' | 'textarea'
  rows?: number
  placeholder?: {
    es?: string
    en?: string
    gl?: string
  }
  required?: boolean
  helpText?: string
}

export default function TrilingualField({
  label,
  values,
  onChange,
  type = 'input',
  rows = 3,
  placeholder,
  required = false,
  helpText,
}: TrilingualFieldProps) {
  const [activeTab, setActiveTab] = useState<LangKey>('es')

  const langs: { key: LangKey; label: string }[] = [
    { key: 'es', label: 'Español' },
    { key: 'en', label: 'English' },
    { key: 'gl', label: 'Galego' },
  ]

  const isComplete =
    Boolean(values.es?.trim()) &&
    Boolean(values.en?.trim()) &&
    Boolean(values.gl?.trim())

  const copyToOthers = (sourceLang: LangKey) => {
    const text = values[sourceLang]
    if (!text) return
    langs.forEach(({ key }) => {
      if (key !== sourceLang && !values[key]) {
        onChange(key, text)
      }
    })
  }

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CmsLabel required={required}>{label}</CmsLabel>
          {required && (
            <span
              title={
                isComplete
                  ? 'Completo en los 3 idiomas'
                  : 'Faltan traducciones en algún idioma'
              }
              className={`w-2 h-2 rounded-full mb-1.5 ${
                isComplete ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
          )}
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
          {langs.map(({ key, label: langLabel }) => {
            const hasValue = Boolean(values[key]?.trim())
            const isActive = activeTab === key

            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`px-2 py-0.5 text-xs font-mono rounded transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-surface text-accent font-bold shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span>{key.toUpperCase()}</span>
                {required && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasValue ? 'bg-emerald-500/80' : 'bg-amber-500/80'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {helpText && <p className="text-xs text-muted font-sans mb-1">{helpText}</p>}

      <div className="relative">
        {type === 'input' ? (
          <CmsInput
            value={values[activeTab] || ''}
            onChange={(e) => onChange(activeTab, e.target.value)}
            placeholder={
              placeholder?.[activeTab] ||
              `Introduce el texto en ${
                activeTab === 'es'
                  ? 'español'
                  : activeTab === 'en'
                  ? 'inglés'
                  : 'gallego'
              }...`
            }
          />
        ) : (
          <CmsTextarea
            rows={rows}
            value={values[activeTab] || ''}
            onChange={(e) => onChange(activeTab, e.target.value)}
            placeholder={
              placeholder?.[activeTab] ||
              `Introduce el contenido en ${
                activeTab === 'es'
                  ? 'español'
                  : activeTab === 'en'
                  ? 'inglés'
                  : 'gallego'
              }...`
            }
          />
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-0.5">
        <span>
          Idioma activo: <strong className="text-foreground">{activeTab.toUpperCase()}</strong>
        </span>
        {values[activeTab] && (
          <button
            type="button"
            onClick={() => copyToOthers(activeTab)}
            className="text-accent hover:underline"
          >
            Copiar a campos vacíos
          </button>
        )}
      </div>
    </div>
  )
}
