'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { CmsClient, MediaItem } from '@/lib/cmsClient'
import { CmsButton, CmsLabel, CmsSelect } from './ui/CmsInput'

interface ImagePickerProps {
  label: string
  selected: string[]
  onChange: (updated: string[]) => void
  multiple?: boolean
  helpText?: string
}

export default function ImagePicker({
  label,
  selected = [],
  onChange,
  multiple = true,
  helpText,
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

      {/* Selected badges / thumbnails */}
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((item) => {
            const cleanUrl = item.startsWith('/') ? item : `/${item}`
            return (
              <div
                key={item}
                className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1.5 pr-2.5 text-xs font-mono group"
              >
                <div className="relative w-7 h-7 bg-background border border-border rounded overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cleanUrl}
                    alt={item}
                    className="w-full h-full object-contain p-0.5"
                    onError={(e) => {
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                </div>
                <span className="text-foreground max-w-[160px] truncate">{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  className="text-muted hover:text-red-500 font-bold ml-1"
                  title="Eliminar referencia"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-xs text-muted font-mono italic mb-2">
          Ninguna imagen asignada.
        </p>
      )}

      {/* Add dropdown */}
      {(multiple || selected.length === 0) && (
        <div className="flex items-center gap-2">
          <CmsSelect
            value={selectedToAdd}
            onChange={(e) => setSelectedToAdd(e.target.value)}
            className="text-xs py-1.5"
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
          >
            + Asignar
          </CmsButton>
        </div>
      )}
    </div>
  )
}
