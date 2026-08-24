import React, { ReactNode } from 'react'

interface CmsCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  action?: ReactNode
}

export default function CmsCard({
  children,
  className = '',
  title,
  description,
  action,
}: CmsCardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl p-5 md:p-6 transition-colors ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-border">
          <div>
            {title && (
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted font-sans mt-0.5">{description}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
