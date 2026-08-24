'use client'

import React from 'react'
import TrilingualField from '../TrilingualField'
import CmsCard from '../ui/CmsCard'
import { CmsInput, CmsLabel } from '../ui/CmsInput'
import type { DictionariesBundle } from '@/lib/cmsClient'

interface HeaderMetaEditorProps {
  bundle: DictionariesBundle
  onChange: (updatedBundle: DictionariesBundle) => void
}

export default function HeaderMetaEditor({ bundle, onChange }: HeaderMetaEditorProps) {
  const updateMeta = (field: 'title' | 'description', lang: 'es' | 'en' | 'gl', val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        meta: {
          ...bundle[lang].meta,
          [field]: val,
        },
      },
    })
  }

  const updateHeaderField = (field: string, val: string) => {
    onChange({
      ...bundle,
      es: { ...bundle.es, header: { ...bundle.es.header, [field]: val } },
      en: { ...bundle.en, header: { ...bundle.en.header, [field]: val } },
      gl: { ...bundle.gl, header: { ...bundle.gl.header, [field]: val } },
    })
  }

  const updateHeaderTitle = (lang: 'es' | 'en' | 'gl', val: string) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        header: {
          ...bundle[lang].header,
          title: val,
        },
      },
    })
  }

  const updateNavLabel = (
    navKey: keyof typeof bundle.es.nav,
    lang: 'es' | 'en' | 'gl',
    val: string
  ) => {
    onChange({
      ...bundle,
      [lang]: {
        ...bundle[lang],
        nav: {
          ...bundle[lang].nav,
          [navKey]: val,
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Meta SEO */}
      <CmsCard
        title="1. Metadatos SEO y Título de Pestaña"
        description="Configuración de etiquetas meta, indexación y descripción para motores de búsqueda."
      >
        <div className="space-y-4">
          <TrilingualField
            label="Título de la Página (Meta Title)"
            values={{
              es: bundle.es.meta?.title || '',
              en: bundle.en.meta?.title || '',
              gl: bundle.gl.meta?.title || '',
            }}
            onChange={(lang, val) => updateMeta('title', lang, val)}
            required
          />

          <TrilingualField
            label="Descripción SEO (Meta Description)"
            type="textarea"
            rows={2}
            values={{
              es: bundle.es.meta?.description || '',
              en: bundle.en.meta?.description || '',
              gl: bundle.gl.meta?.description || '',
            }}
            onChange={(lang, val) => updateMeta('description', lang, val)}
            required
          />
        </div>
      </CmsCard>

      {/* Header & Socials */}
      <CmsCard
        title="2. Cabecera y Perfiles de Contacto"
        description="Nombre, subtítulo profesional y enlaces sociales del raíl lateral."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <CmsLabel required>Nombre Completo</CmsLabel>
              <CmsInput
                value={bundle.es.header?.name || ''}
                onChange={(e) => updateHeaderField('name', e.target.value)}
                placeholder="Ignacio Garbayo Fernández"
              />
            </div>
            <div>
              <CmsLabel required>Email de Contacto</CmsLabel>
              <CmsInput
                type="email"
                value={bundle.es.header?.email || ''}
                onChange={(e) => updateHeaderField('email', e.target.value)}
                placeholder="iggarbayo@gmail.com"
              />
            </div>
          </div>

          <TrilingualField
            label="Subtítulo Profesional / Titular"
            values={{
              es: bundle.es.header?.title || '',
              en: bundle.en.header?.title || '',
              gl: bundle.gl.header?.title || '',
            }}
            onChange={(lang, val) => updateHeaderTitle(lang, val)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <CmsLabel>LinkedIn URL</CmsLabel>
              <CmsInput
                value={bundle.es.header?.linkedin || ''}
                onChange={(e) => updateHeaderField('linkedin', e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
              />
            </div>
            <div>
              <CmsLabel>GitHub URL</CmsLabel>
              <CmsInput
                value={bundle.es.header?.github || ''}
                onChange={(e) => updateHeaderField('github', e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <CmsLabel>Devpost URL</CmsLabel>
              <CmsInput
                value={bundle.es.header?.devpost || ''}
                onChange={(e) => updateHeaderField('devpost', e.target.value)}
                placeholder="https://devpost.com/..."
              />
            </div>
          </div>
        </div>
      </CmsCard>

      {/* Navigation Labels */}
      <CmsCard
        title="3. Etiquetas de la Barra de Navegación"
        description="Textos trilingües para los enlaces del menú principal."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(bundle.es.nav || {}) as Array<keyof typeof bundle.es.nav>).map(
            (navKey) => (
              <TrilingualField
                key={navKey}
                label={`Enlace: ${navKey}`}
                values={{
                  es: bundle.es.nav?.[navKey] || '',
                  en: bundle.en.nav?.[navKey] || '',
                  gl: bundle.gl.nav?.[navKey] || '',
                }}
                onChange={(lang, val) => updateNavLabel(navKey, lang, val)}
                required
              />
            )
          )}
        </div>
      </CmsCard>
    </div>
  )
}
