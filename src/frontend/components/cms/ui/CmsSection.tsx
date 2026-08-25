import React, { ReactNode } from 'react'
import SectionTitle from '@/components/ui/SectionTitle'
import { cardSurface } from '@/lib/cardSurface'

interface CmsSectionProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  action?: ReactNode
}

/**
 * Monta cada pestaña del panel sobre las mismas piezas que la página que
 * edita: `SectionTitle` (sin revelado, ver `reveal='none'`) y `cardSurface`,
 * la misma tarjeta que usa `TimelineEntry` en el sitio público.
 */
export default function CmsSection({
  children,
  className = '',
  title,
  description,
  action,
}: CmsSectionProps) {
  return (
    <div>
      {title && <SectionTitle reveal="none">{title}</SectionTitle>}
      <div className={`${cardSurface} ${className}`}>
        {(description || action) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-border">
            {description && <p className="text-xs text-muted font-sans">{description}</p>}
            {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
