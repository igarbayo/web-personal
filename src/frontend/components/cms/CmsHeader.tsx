'use client'

import React from 'react'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'
import { SITE_URL } from '@/lib/seo'
import favicon from '@/public/favicon.svg'
import { CmsBadge } from './ui/CmsBadge'
import { CmsButton } from './ui/CmsInput'

interface CmsHeaderProps {
  hasUnsavedChanges: boolean
  isSaving: boolean
  onSaveAll: () => void
  onDiscard: () => void
  onLogout: () => void
}

export default function CmsHeader({
  hasUnsavedChanges,
  isSaving,
  onSaveAll,
  onDiscard,
  onLogout,
}: CmsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border [box-shadow:0_4px_20px_rgba(0,0,0,0.035)]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <Image src={favicon} alt="" width={24} height={24} className="w-6 h-6" />
          <div>
            <h1 className="text-sm font-bold text-foreground font-sans tracking-tight leading-none">
              Ignacio Garbayo <span className="text-accent">_</span> CMS
            </h1>
            <p className="text-[10px] font-mono text-muted uppercase tracking-wider mt-0.5">
              Panel de Control Trilingüe
            </p>
          </div>
        </div>

        {/* Center: Save status */}
        <div className="hidden sm:flex items-center gap-2">
          {hasUnsavedChanges ? (
            <CmsBadge variant="warning" size="sm">
              ● Cambios pendientes
            </CmsBadge>
          ) : (
            <CmsBadge variant="success" size="sm">
              ✓ Sincronizado
            </CmsBadge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex text-xs font-mono text-muted hover:text-accent px-2 py-1"
          >
            Ver web ↗
          </a>

          {hasUnsavedChanges && (
            <CmsButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDiscard}
              disabled={isSaving}
              className="text-xs"
            >
              Descartar
            </CmsButton>
          )}

          <CmsButton
            type="button"
            variant="primary"
            size="sm"
            onClick={onSaveAll}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? 'Guardando...' : 'Publicar Cambios'}
          </CmsButton>

          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-mono text-muted hover:text-danger p-1.5 rounded"
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
