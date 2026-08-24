import { Fragment } from 'react'
import Image from 'next/image'
import { renderText } from '@/lib/renderText'
import { getImageDimensions } from '@/lib/imageDimensions'
import { cardSurface } from '@/lib/cardSurface'

interface EntryLink {
  label: string
  url: string
}

/**
 * Una foto de galería. Tres capas, y cada una tiene su motivo:
 *
 * - El envoltorio exterior **aparece** (opacidad y desplazamiento). No recorta,
 *   porque el filete se dibuja por fuera de la foto.
 * - El marco interior **recorta** el zoom del hover con `overflow: hidden`.
 * - El `<svg>` dibuja el filete recorriendo el contorno.
 *
 * El zoom y la aparición viven en elementos distintos a propósito: `transform`
 * es una sola propiedad y, compartiendo elemento, pasar el ratón a mitad de la
 * aparición la cortaría.
 *
 * El `<rect>` lleva `width`/`height`/`rx` como atributos y no como CSS porque
 * las propiedades geométricas de SVG2 en CSS no son fiables en todos los
 * navegadores. El trazo se controla desde `globals.css`.
 */
function GalleryImage({
  src,
  priority,
  className,
}: {
  src: string
  priority: boolean
  className?: string
}) {
  const { width, height } = getImageDimensions(src)
  return (
    <div data-reveal-media className={className}>
      <div data-reveal-media-frame>
        <Image
          src={`/${src}`}
          alt=""
          width={width}
          height={height}
          priority={priority}
          className="w-full h-64 rounded-lg object-cover"
        />
      </div>
      {/* rx = 8px de radio de la foto + 4px que el filete se separa de ella. */}
      <svg data-reveal-media-ring aria-hidden="true" focusable="false">
        <rect width="100%" height="100%" rx="12" />
      </svg>
    </div>
  )
}

interface TimelineEntryProps {
  date: string
  title: string
  subtitle: string
  bullets?: string[]
  description?: string
  note?: string
  logo?: string[]
  /** Variante por índice del logo mostrada solo en modo oscuro (misma dimensión que `logo[i]`). */
  logoDark?: string[]
  links?: EntryLink[]
  images?: string[]
  timeline?: boolean
  /** Envuelve el/los logo(s) en un contenedor de fondo blanco con borde redondeado (legible en modo oscuro). */
  logoBoxed?: boolean
  /** Redondea las esquinas del propio logo (sin caja ni fondo). Para logos que ya traen su fondo. */
  logoRounded?: boolean
  /** Borde fino (1px) alrededor del logo con este color (p. ej. el propio color de fondo de la imagen). */
  logoBorderColor?: string
  /** Nº de imágenes (logos primero, luego galería, en orden de aparición) a cargar con priority. */
  priorityImages?: number
}

export default function TimelineEntry({
  date,
  title,
  subtitle,
  bullets,
  description,
  note,
  logo,
  logoDark,
  links,
  images,
  timeline = true,
  logoBoxed = false,
  logoRounded = false,
  logoBorderColor,
  priorityImages = 0,
}: TimelineEntryProps) {
  const hasBody = (bullets && bullets.length > 0) || !!description || !!note
  const logoPriorityCount = Math.min(priorityImages, logo?.length ?? 0)
  const imagesPriorityCount = Math.min(priorityImages - logoPriorityCount, images?.length ?? 0)

  // La misma pregunta que ya responde `priorityImages`: ¿está esta entrada
  // sobre el pliegue? Lo que está sobre el pliegue entra al pintar y solo con
  // `transform`, porque una opacidad de partida en 0 excluye al elemento del
  // cálculo de LCP — y en proyectos la primera entrada trae cinco imágenes
  // `priority`.
  const revealAttrs = priorityImages > 0 ? { 'data-reveal-load': '' } : { 'data-reveal': '' }

  const card = (
    <div className={cardSurface}>

      {/* Header: logo + title + subtitle (+ date when no timeline) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {logo && logo.length > 0 && (
          <div className={`flex flex-row flex-wrap sm:flex-col sm:flex-nowrap items-center justify-center gap-3 w-full sm:w-32 shrink-0${logoBoxed ? ' rounded-lg border border-transparent dark:border-border bg-white p-3' : ''}`}>
            {logo.map((src, i) => {
              const { width, height } = getImageDimensions(src)
              const darkSrc = logoDark?.[i]
              const imgClass = `h-10 w-auto sm:h-auto sm:w-full object-contain${logoRounded ? ' rounded-lg' : ''}${logoBorderColor ? ' border-[3px]' : ''}`
              const borderStyle = logoBorderColor ? { borderColor: logoBorderColor } : undefined
              return (
                <Fragment key={src}>
                  <Image
                    src={`/${src}`}
                    alt=""
                    width={width}
                    height={height}
                    priority={i < logoPriorityCount}
                    style={borderStyle}
                    className={darkSrc ? `${imgClass} dark:hidden` : imgClass}
                  />
                  {darkSrc && (
                    <Image
                      src={`/${darkSrc}`}
                      alt=""
                      width={width}
                      height={height}
                      priority={i < logoPriorityCount}
                      style={borderStyle}
                      className={`${imgClass} hidden dark:block`}
                    />
                  )}
                </Fragment>
              )
            })}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <span className="font-bold text-lg text-foreground block leading-snug">
              {renderText(title)}
            </span>
            {!timeline && (
              <span className="text-sm text-muted shrink-0">{date}</span>
            )}
          </div>
          {subtitle && (
            <span className="text-sm text-accent mt-0.5 block">
              {renderText(subtitle)}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      {hasBody && <div className="h-px bg-border my-4" />}

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-base text-foreground leading-relaxed flex gap-[0.6875rem] items-baseline">
              <span className="text-accent text-lg leading-none shrink-0">•</span>
              <span>{renderText(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Description */}
      {description && (
        <p className="text-base text-foreground leading-relaxed">
          {renderText(description)}
        </p>
      )}

      {/* Note */}
      {note && (
        <p className="text-sm text-muted mt-3 font-mono italic">
          {renderText(note)}
        </p>
      )}

      {/* Links */}
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              // `transition` y no `transition-colors`: hace falta que la lista
              // de propiedades incluya `transform`, o el crecimiento saltaría
              // de golpe mientras el color sí acompaña.
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-border text-accent hover:bg-accent hover:text-white hover:scale-105 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5"/>
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Images. Las clases de rejilla van en el envoltorio de GalleryImage
          porque es él quien pasa a ser la celda. */}
      {images && images.length > 0 && (
        images.length === 5 ? (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 mt-4">
            {images.slice(0, 3).map((src, i) => (
              <GalleryImage key={src} src={src} priority={i < imagesPriorityCount} className="sm:col-span-2" />
            ))}
            {images.slice(3).map((src, i) => (
              <GalleryImage key={src} src={src} priority={i + 3 < imagesPriorityCount} className="sm:col-span-3" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-2 mt-4 ${images.length === 2 ? 'sm:grid-cols-2' : images.length >= 3 ? 'sm:grid-cols-3' : ''}`}>
            {images.map((src, i) => (
              <GalleryImage key={src} src={src} priority={i < imagesPriorityCount} />
            ))}
          </div>
        )
      )}

    </div>
  )

  // El revelado se ancla en estas dos raíces y no se envuelve en un div nuevo:
  // `last:pb-0`, `[&:last-child_.tl-line]:hidden` y el escalonado por
  // `nth-child` dependen de que sea esta raíz la que cuelgue del contenedor de
  // la lista.
  if (!timeline) {
    return <div className="mb-4 last:mb-0" {...revealAttrs}>{card}</div>
  }

  return (
    <div
      className="relative flex gap-5 pb-8 last:pb-0 [&:last-child_.tl-line]:hidden"
      {...revealAttrs}
    >

      {/* Left: date */}
      <div className="hidden sm:block w-16 shrink-0 text-right pt-2">
        {date.split(' & ').map((range, i) => (
          <span
            key={range}
            className={`block text-sm text-muted font-mono leading-snug whitespace-pre-line${i > 0 ? ' mt-2' : ''}`}
          >
            {range.replace(' – ', '\n')}
          </span>
        ))}
      </div>

      {/* Timeline: dot + continuous line.
          La línea arranca en el centro del punto (0.8125rem = mt-2 + medio punto)
          y se prolonga 2.8125rem por debajo del content-box (pb-8 2rem + 0.8125rem)
          para alcanzar el punto de la siguiente entrada, quedando continua. */}
      <div className="hidden sm:flex flex-col items-center relative">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-accent bg-accent mt-2 shrink-0 z-10" />
        {/* `-translate-x-1/2` no es redundante con el revelado: cuando no hay
            JS el marcador `data-motion` no existe, las reglas de dibujado de
            globals.css no aplican y esta clase es el único centrado. */}
        <div className="tl-line absolute top-[0.8125rem] -bottom-[2.8125rem] left-1/2 -translate-x-1/2 w-px bg-accent" />
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0">
        <span className="sm:hidden block text-xs text-muted mb-2">{date}</span>
        {card}
      </div>
    </div>
  )
}
