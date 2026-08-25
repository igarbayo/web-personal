'use client'

import React, { useEffect, useState } from 'react'
import { CmsClient, MediaItem, mediaUrl } from '@/lib/cmsClient'
import { CmsButton, CmsLabel, CmsSelect } from './ui/CmsInput'

interface ImagePickerProps {
  label: string
  selected: string[]
  onChange: (updated: string[]) => void
  multiple?: boolean
  helpText?: string
  /** Para la columna estrecha de logotipo: miniaturas apiladas en una sola
   *  columna y controles uno debajo de otro, en vez de la rejilla y la fila
   *  que usa la galería en el cuerpo ancho de la tarjeta. */
  compact?: boolean
}

export default function ImagePicker({
  label,
  selected = [],
  onChange,
  multiple = true,
  helpText,
  compact = false,
}: ImagePickerProps) {
  const [availableMedia, setAvailableMedia] = useState<MediaItem[]>([])
  const [selectedToAdd, setSelectedToAdd] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadMedia = async () => {
      try {
        setLoading(true)
        const res = await CmsClient.listMedia()
        if (mounted) {
          setAvailableMedia(res.items || [])
          if (res.items && res.items.length > 0) {
            setSelectedToAdd(res.items[0].filename)
          }
        }
      } catch (err) {
        console.error('Error loading media in picker:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadMedia()
    return () => {
      mounted = false
    }
  }, [])

  const handleAdd = () => {
    if (!selectedToAdd) return
    const cleanFilename = selectedToAdd.replace(/^\//, '')
    if (selected.includes(cleanFilename) || selected.includes(`/${cleanFilename}`)) {
      return
    }

    if (multiple) {
      onChange([...selected, cleanFilename])
    } else {
      onChange([cleanFilename])
    }
  }

  const handleRemove = (itemToRemove: string) => {
    onChange(selected.filter((item) => item !== itemToRemove))
  }

  return (
    <div className="space-y-2">
      <CmsLabel>{label}</CmsLabel>
      {helpText && <p className="text-xs text-muted mb-2">{helpText}</p>}

      {/* Miniaturas: la misma proporción que la caja de logo o la rejilla de
          galería de TimelineEntry, para que el hueco lea como el elemento
          público que va a ocupar. */}
      {selected.length > 0 ? (
        <div className={compact ? 'space-y-2 mb-2' : 'grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2'}>
          {selected.map((item) => {
            const cleanUrl = mediaUrl(item)
            return (
              <div
                key={item}
                // Fondo blanco en el selector de logotipo por el mismo motivo
                // que `logoBoxed` en la web: un logo con transparencia no se
                // lee sobre el fondo oscuro. Las galerías son fotos y no lo
                // necesitan.
                className={`relative border border-border rounded-md p-1.5 ${
                  compact ? 'bg-white' : 'bg-background'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="absolute top-0.5 right-0.5 z-10 w-4 h-4 rounded-full bg-danger text-white text-[10px] leading-none flex items-center justify-center"
                  title="Eliminar referencia"
                >
                  ✕
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cleanUrl}
                  alt={item}
                  className={`w-full object-contain ${compact ? 'h-10' : 'h-16'}`}
                  onError={(e) => {
                    ;(e.target as HTMLElement).style.visibility = 'hidden'
                  }}
                />
                <p className="text-[10px] font-mono text-muted truncate mt-1" title={item}>
                  {item}
                </p>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-muted font-mono italic mb-2">Ninguna asignada.</p>
      )}

      {/* Add dropdown */}
      {(multiple || selected.length === 0) && (
        <div className={compact ? 'space-y-1.5' : 'flex items-center gap-2'}>
          <CmsSelect
            value={selectedToAdd}
            onChange={(e) => setSelectedToAdd(e.target.value)}
            className="text-xs py-1.5 min-w-0"
            disabled={loading || availableMedia.length === 0}
          >
            {availableMedia.length === 0 ? (
              <option value="">Cargando imágenes de public/...</option>
            ) : (
              availableMedia.map((m) => (
                <option key={m.filename} value={m.filename}>
                  {m.filename} ({m.size_kb} KB)
                </option>
              ))
            )}
          </CmsSelect>
          <CmsButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleAdd}
            disabled={!selectedToAdd}
            className={compact ? 'w-full' : ''}
          >
            + Asignar
          </CmsButton>
        </div>
      )}
    </div>
  )
}
