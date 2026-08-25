import React, { ReactNode } from 'react'
import { cardSurface } from '@/lib/cardSurface'

interface CmsEntryFrameProps {
  index: number
  heading: string
  /** Carril de fecha + punto + línea, como en la cronología pública. */
  timeline?: boolean
  dateSlot: ReactNode
  logoSlot?: ReactNode
  titleSlot: ReactNode
  subtitleSlot: ReactNode
  onRemove: () => void
  children: ReactNode
}

/**
 * Reproduce el armazón visual de `components/ui/TimelineEntry.tsx` con
 * huecos editables en vez de texto fijo. Es una reimplementación deliberada
 * y no una generalización de `TimelineEntry`: ese componente sirve al sitio
 * público, con `renderText`, `next/image` y los atributos `data-reveal*` que
 * no tienen sentido aquí. La tarjeta en sí viene de `cardSurface`
 * (`lib/cardSurface.ts`), la misma pieza que usa `TimelineEntry`, así que el
 * radio, el borde y el acolchado no pueden divergir entre panel y web.
 *
 * La fila de administración (número de entrada, botón de eliminar) vive
 * fuera de `cardSurface` a propósito: así la tarjeta de dentro es idéntica a
 * la pública y el andamiaje de edición se distingue de un vistazo.
 */
export default function CmsEntryFrame({
  index,
  heading,
  timeline = false,
  dateSlot,
  logoSlot,
  titleSlot,
  subtitleSlot,
  onRemove,
  children,
}: CmsEntryFrameProps) {
  const card = (
    <div className={cardSurface}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* La columna pública mide 8rem porque solo aloja la imagen. Aquí
            aloja el selector completo (miniatura, desplegable y botón), así
            que sube a 14rem. Tampoco lleva el fondo blanco de `logoBoxed`:
            ese recurso existe para que un logo con transparencia se lea en
            modo oscuro, y aquí taparía los controles. */}
        {logoSlot && <div className="w-full sm:w-56 shrink-0">{logoSlot}</div>}
        <div className="flex-1 min-w-0 space-y-3">
          {titleSlot}
          {subtitleSlot}
        </div>
      </div>

      <div className="h-px bg-border my-4" />

      <div className="space-y-4">{children}</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-2 font-mono text-xs">
        <span className="text-muted">
          Entrada #{index + 1}
          {heading ? `: ${heading}` : ''}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-danger hover:bg-danger/10 px-2 py-0.5 rounded"
        >
          ✕ Eliminar
        </button>
      </div>

      {timeline ? (
        <div className="relative flex gap-5">
          {/* El carril público mide 4rem porque solo aloja texto de fecha ya
              formateado. Aquí hay un input, así que el carril se ensancha a
              8rem (el mismo ancho que la columna de logo) para que quepa. */}
          <div className="hidden sm:block w-32 shrink-0 pt-2">{dateSlot}</div>
          <div className="hidden sm:flex flex-col items-center relative">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-accent bg-accent mt-2 shrink-0 z-10" />
            <div className="absolute top-[0.8125rem] bottom-0 left-1/2 -translate-x-1/2 w-px bg-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="sm:hidden mb-2">{dateSlot}</div>
            {card}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {dateSlot}
          {card}
        </div>
      )}
    </div>
  )
}
