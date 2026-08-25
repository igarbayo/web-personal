'use client'

import React from 'react'
import { CmsInput, CmsLabel, CmsTextarea } from './ui/CmsInput'

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
  /** Registro tipográfico del campo, para que lea como el elemento público
   *  que sustituye. Por defecto el cuerpo de texto (viñeta, descripción). */
  variant?: 'title' | 'subtitle' | 'body' | 'meta'
}

const langs: { key: LangKey; label: string }[] = [
  { key: 'es', label: 'ES' },
  { key: 'en', label: 'EN' },
  { key: 'gl', label: 'GL' },
]

const variantClass: Record<NonNullable<TrilingualFieldProps['variant']>, string> = {
  title: 'font-bold text-base',
  subtitle: 'text-accent',
  body: '',
  meta: 'font-mono text-xs',
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
  variant = 'body',
}: TrilingualFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center gap-2">
          <CmsLabel required={required}>{label}</CmsLabel>
        </div>
      )}

      {helpText && <p className="text-xs text-muted font-sans mb-1">{helpText}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {langs.map(({ key, label: langLabel }) => {
          const hasValue = Boolean(values[key]?.trim())
          const canCopyFrom =
            hasValue &&
            langs.some(({ key: otherKey }) => otherKey !== key && !values[otherKey]?.trim())

          const copyToOthers = () => {
            const text = values[key]
            if (!text) return
            langs.forEach(({ key: otherKey }) => {
              if (otherKey !== key && !values[otherKey]) {
                onChange(otherKey, text)
              }
            })
          }

          const fieldPlaceholder =
            placeholder?.[key] ||
            `${key === 'es' ? 'Español' : key === 'en' ? 'English' : 'Galego'}...`

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-mono uppercase tracking-wider ${
                    hasValue ? 'text-muted' : 'text-accent'
                  }`}
                >
                  {langLabel}
                </span>
                {canCopyFrom && (
                  <button
                    type="button"
                    onClick={copyToOthers}
                    className="text-[11px] text-accent hover:underline"
                  >
                    Copiar
                  </button>
                )}
              </div>
              {type === 'input' ? (
                <CmsInput
                  value={values[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={fieldPlaceholder}
                  className={variantClass[variant]}
                />
              ) : (
                <CmsTextarea
                  rows={rows}
                  value={values[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={fieldPlaceholder}
                  className={variantClass[variant]}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
