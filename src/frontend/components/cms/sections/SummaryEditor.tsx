'use client'

import React from 'react'
import TrilingualField from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import type { DictionariesBundle } from '@/lib/cmsClient'

interface SummaryEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function SummaryEditor({ bundle, onChange }: SummaryEditorProps) {
  const updateSummaryTitle = (lang: 'es' | 'en' | 'gl', val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        summary: {
          ...bundle[lang].summary,
          title: val,
        },
      },
    })
  }

  const updateSummaryContent = (lang: 'es' | 'en' | 'gl', val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        summary: {
          ...bundle[lang].summary,
          content: val,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <CmsCard
        title="Sección: Sobre mí (Summary)"
        description="Resumen biográfico principal visible en la portada de la web personal."
      >
        <div className="space-y-5">
          <TrilingualField
            label="Título de la Sección"
            values={{
              es: bundle.es.summary?.title || '',
              en: bundle.en.summary?.title || '',
              gl: bundle.gl.summary?.title || '',
            }}
            onChange={(lang, val) => updateSummaryTitle(lang, val)}
            required
          />

          <TrilingualField
            label="Contenido del Resumen"
            type="textarea"
            rows={6}
            values={{
              es: bundle.es.summary?.content || '',
              en: bundle.en.summary?.content || '',
              gl: bundle.gl.summary?.content || '',
            }}
            onChange={(lang, val) => updateSummaryContent(lang, val)}
            required
            helpText="Soporta texto corrido y enlaces markdown [texto](url)."
          />
        </div>
      </CmsCard>
    </div>
  )
}
