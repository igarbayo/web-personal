'use client'

import React from 'react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  description?: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-ok/40 text-ok',
          error: 'border-danger/40 text-danger',
          warning: 'border-accent/40 text-accent',
          info: 'border-accent/40 text-accent',
        }[toast.type]

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-surface border ${borderColors} rounded-lg p-3.5 shadow-lg flex items-start justify-between gap-3 text-sm`}
          >
            <div>
              <p className="font-semibold text-foreground">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-muted mt-0.5">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-muted hover:text-foreground text-xs font-mono p-1"
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}
