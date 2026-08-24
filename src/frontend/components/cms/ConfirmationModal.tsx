'use client'

import React, { useState } from 'react'
import { CmsButton, CmsInput, CmsLabel } from './ui/CmsInput'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  description?: string
  diffSummary?: {
    section?: string
    fieldsModified?: string[]
    note?: string
  }
  isSubmitting?: boolean
  errorMessage?: string | null
  onClose: () => void
  onConfirm: (password: string, commitMessage: string) => void
}

export default function ConfirmationModal({
  isOpen,
  title,
  description = 'Esta acción validará las restricciones del proyecto y persistirá los cambios.',
  diffSummary,
  isSubmitting = false,
  errorMessage = null,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const [password, setPassword] = useState('')
  const [commitMessage, setCommitMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) return
    onConfirm(password, commitMessage.trim() || 'cms: update content from admin')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-none">
      <div className="bg-surface border border-border rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-foreground tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-muted mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted hover:text-foreground text-sm font-mono p-1"
          >
            ✕
          </button>
        </div>

        {/* Diff summary box */}
        {diffSummary && (
          <div className="bg-background border border-border rounded-lg p-3.5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-muted">
              <span>Sección afectada:</span>
              <strong className="text-accent uppercase">
                {diffSummary.section || 'General'}
              </strong>
            </div>
            {diffSummary.fieldsModified && diffSummary.fieldsModified.length > 0 && (
              <div>
                <span className="text-muted block mb-1">Campos actualizados:</span>
                <div className="flex flex-wrap gap-1">
                  {diffSummary.fieldsModified.map((f) => (
                    <span
                      key={f}
                      className="bg-surface border border-border px-1.5 py-0.5 rounded text-foreground text-[11px]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {diffSummary.note && (
              <p className="text-muted text-[11px] pt-1 border-t border-border/50">
                {diffSummary.note}
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <CmsLabel htmlFor="commit-msg">Mensaje de Commit (Opcional)</CmsLabel>
            <CmsInput
              id="commit-msg"
              name="commit-message-no-autocomplete"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="cms: actualización de contenidos..."
              disabled={isSubmitting}
              className="text-xs"
              autoComplete="off"
            />
          </div>

          <div>
            <CmsLabel htmlFor="conf-password" required>
              Contraseña Maestra de Confirmación
            </CmsLabel>
            <CmsInput
              id="conf-password"
              name="confirmation-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduce tu contraseña maestra..."
              required
              autoFocus
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <p className="text-[11px] text-muted font-sans mt-1">
              Requerida por seguridad en cada cambio para validar en el backend.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-600 dark:text-red-400 font-mono">
              {errorMessage}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <CmsButton
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </CmsButton>
            <CmsButton
              type="submit"
              variant="primary"
              size="md"
              disabled={!password || isSubmitting}
            >
              {isSubmitting ? 'Validando y Publicando...' : 'Confirmar y Publicar'}
            </CmsButton>
          </div>
        </form>
      </div>
    </div>
  )
}
