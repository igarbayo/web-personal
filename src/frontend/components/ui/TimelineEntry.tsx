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

/**
 * Rejilla de imágenes a sangre, sin marco ni filete de revelado: las fotos
 * tocan el borde superior de la tarjeta. Solo la usa la tarjeta elevada de
 * Volunteering (`elevated` + `imagesPosition="top"`), ver DESIGN.md
 * § Signature: trayectoria de espina.
 */
function FlushImages({ images, priorityCount }: { images: string[]; priorityCount: number }) {
  const cols = images.length === 1 ? 'grid-cols-1' : images.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'
  return (
    <div className={`grid ${cols} gap-[3px] bg-border h-40`}>
      {images.map((src, i) => {
        const { width, height } = getImageDimensions(src)
        return (
          <div key={src} className="overflow-hidden">
            <Image
              src={`/${src}`}
              alt=""
              width={width}
              height={height}
              priority={i < priorityCount}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )
      })}
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
  /** Variante "trayectoria de espina": placa de logotipo con medallón numerado superpuesto y
   *  espina de conexión en la misma columna, fecha en píldora, viñetas en raya. Requiere
   *  `timeline`. Ver DESIGN.md § Signature: trayectoria de espina. */
  numbered?: boolean
  /** Posición de la entrada dentro de la lista, para el número del medallón (`numbered`). */
  index?: number
  /** Última entrada de la lista: la espina no continúa después de ella (`numbered`). */
  last?: boolean
  /** Tratamiento "placa" de la tarjeta entera (radio de 1rem, sombra flotante, tipografía
   *  Archivo/Figtree): la usa Volunteering. No afecta a `numbered`, cuya placa de logotipo
   *  siempre lleva este tratamiento. Ver DESIGN.md § Elevation & Depth, vocabulario "Placa flotante". */
  elevated?: boolean
  /** Coloca la galería antes de la cabecera en vez de después. Combinada con `elevated`
   *  usa `FlushImages` (a sangre, sin marco). */
  imagesPosition?: 'top' | 'bottom'
  /** Margen inferior entre entradas cuando `timeline` es falso. Se desactiva cuando el contenedor
   *  reparte el espacio con `gap` (p. ej. una rejilla de dos columnas). */
  spacing?: boolean
}

/**
 * Logotipo(s) de una entrada, escalados para caber dentro de la placa. La
 * placa es blanca fija en los dos temas (no `bg-surface`), así
 * que aquí nunca se usa la variante `logoDark`: un logo pensado para modo
 * oscuro (típicamente claro/blanco) sería invisible sobre ese fondo blanco.
 */
function PlateLogos({
  logo,
  logoPriorityCount,
}: {
  logo: string[]
  logoPriorityCount: number
}) {
  // CiTIUS llena la placa a sangre y se recorta contra su borde redondeado,
  // como el logo de McKinsey en Certifications: es un isotipo cuadrado que
  // se lee mejor pegado al marco que con margen alrededor.
  if (logo.length === 1 && logo[0] === 'citius.webp') {
    return (
      <div className="relative w-full h-full">
        <Image src="/citius.webp" alt="" fill sizes="112px" priority={logoPriorityCount > 0} className="object-cover" />
      </div>
    )
  }

  // `fill` en vez de `width`/`height`: los SVG de logo no llevan tamaño
  // intrínseco propio (solo `viewBox`), así que `w-auto h-auto` con un
  // `max-w`/`max-h` en porcentaje no tenía de qué partir y los dejaba
  // minúsculos. Con `fill`, la caja la marca el envoltorio de tamaño fijo.
  // Con dos logos se apilan en columna: el ancho puede ser generoso, el
  // alto tiene que dejar sitio para los dos.
  // `w-full h-full` en el envoltorio: sin una altura definida aquí, el
  // `height` en porcentaje de la caja de cada logo no tiene de qué partir
  // (el padre solo lo centra, no le fija alto) y colapsa a 0 — que es
  // justo el aviso de Next sobre `fill` con altura 0.
  const boxClass = logo.length > 1 ? 'w-[80%] h-[32%]' : 'w-[85%] h-[68%]'
  return (
    <div className={`w-full h-full flex items-center justify-center${logo.length > 1 ? ' flex-col gap-1.5' : ''}`}>
      {logo.map((src, i) => (
        <div key={src} className={`relative ${boxClass}`}>
          <Image src={`/${src}`} alt="" fill sizes="112px" priority={i < logoPriorityCount} className="object-contain" />
        </div>
      ))}
    </div>
  )
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
  numbered = false,
  index = 0,
  last = false,
  elevated = false,
  imagesPosition = 'bottom',
  spacing = true,
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

  const links_ = links && links.length > 0 && (
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
          className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white hover:scale-105 transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5"/>
          </svg>
          {link.label}
        </a>
      ))}
    </div>
  )

  // ==================== Variante "trayectoria de espina" (`numbered`) ====================
  // Estructura propia y no una reutilización del layout por defecto: la placa
  // de logotipo, el medallón y la espina viven en la misma columna de rejilla
  // (128px), con el medallón superpuesto en su esquina, en vez de en carriles
  // separados. Ver DESIGN.md § Signature: trayectoria de espina.
  if (timeline && numbered) {
    return (
      <div
        className="grid grid-cols-[56px_1fr] sm:grid-cols-[96px_1fr] gap-2 sm:gap-10"
        {...revealAttrs}
      >
        <div className="flex flex-col items-center">
          <div className={`w-0.5 h-[10px] shrink-0 ${index > 0 ? 'bg-accent/25' : 'bg-transparent'}`} />
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white border border-border shadow-[0_14px_30px_-22px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center shrink-0 transition-all duration-300 hover:border-accent/55 hover:-translate-y-[3px]">
            {logo && logo.length > 0 && (
              <PlateLogos logo={logo} logoPriorityCount={logoPriorityCount} />
            )}
          </div>
          <div className={`w-0.5 flex-1 min-h-[26px] ${last ? 'bg-transparent' : 'bg-accent/25'}`} />
        </div>

        {/* `min-w-0`: por defecto una pista de grid no encoge por debajo del
            ancho mínimo de su contenido (la misma familia de bug que ya
            apareció con las alturas). En `sm` la columna de 1fr tiene sitio
            de sobra y no se nota, pero en móvil, con la pista mucho más
            estrecha, el contenido se negaba a envolver y desbordaba a lo
            ancho de toda la página. */}
        <div className="min-w-0 pt-1.5 pb-10">
          {/* Píldora de fecha, fondo/texto azul y blanco. Los rangos múltiples
              son una píldora por rango, apiladas en móvil y en fila a partir
              de `sm`. */}
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 mb-3">
            {date.split(' & ').map((range) => (
              // Sin `whitespace-nowrap`: una fecha larga en un móvil muy
              // estrecho tiene que poder envolver dentro de su propia
              // píldora, no forzar el ancho de toda la fila.
              <span key={range} className="inline-flex items-center max-w-full text-xs font-mono text-white bg-accent rounded-2xl px-2.5 py-1 self-start">
                {range}
              </span>
            ))}
          </div>
          <h2 className="break-words font-archivo font-bold tracking-[-0.025em] text-[29px] leading-[1.04] text-foreground">
            {renderText(title)}
          </h2>
          {subtitle && (
            <div className="break-words font-mono text-[13.5px] text-accent mt-[7px]">
              {renderText(subtitle)}
            </div>
          )}
          {bullets && bullets.length > 0 && (
            // Margen negativo solo en móvil: las viñetas se acercan más a la
            // línea que el título/la fecha, que se quedan donde estaban.
            <ul className="-ml-3 sm:ml-0 mt-5 flex flex-col gap-3 max-w-[760px]">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[15.5px] leading-[1.55] font-figtree font-medium text-foreground items-baseline">
                  <span className="text-accent font-mono shrink-0 mt-px">—</span>
                  <span className="min-w-0 break-words">{renderText(b)}</span>
                </li>
              ))}
            </ul>
          )}
          {note && (
            <p className="text-sm text-muted mt-3 font-mono italic">
              {renderText(note)}
            </p>
          )}
          {links_}
        </div>
      </div>
    )
  }

  const useFlushImages = elevated && imagesPosition === 'top'

  const imagesBlock = images && images.length > 0 && (
    useFlushImages ? (
      <FlushImages images={images} priorityCount={imagesPriorityCount} />
    ) : (
      images.length === 5 ? (
        <div className={`grid grid-cols-1 sm:grid-cols-6 gap-2 ${imagesPosition === 'top' ? 'mb-4' : 'mt-4'}`}>
          {images.slice(0, 3).map((src, i) => (
            <GalleryImage key={src} src={src} priority={i < imagesPriorityCount} className="sm:col-span-2" />
          ))}
          {images.slice(3).map((src, i) => (
            <GalleryImage key={src} src={src} priority={i + 3 < imagesPriorityCount} className="sm:col-span-3" />
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-2 ${imagesPosition === 'top' ? 'mb-4' : 'mt-4'} ${images.length === 2 ? 'sm:grid-cols-2' : images.length >= 3 ? 'sm:grid-cols-3' : ''}`}>
          {images.map((src, i) => (
            <GalleryImage key={src} src={src} priority={i < imagesPriorityCount} />
          ))}
        </div>
      )
    )
  )

  // La placa flotante (`elevated`) sustituye el radio y la sombra por los de
  // la firma "trayectoria de espina"; las imágenes a sangre exigen que el
  // padding se mueva del contenedor a un envoltorio interior, para que
  // toquen el borde superior de la tarjeta.
  const outerClassName = elevated
    ? `rounded-2xl border border-border bg-surface shadow-[0_14px_30px_-24px_rgba(0,0,0,0.5)] overflow-hidden${useFlushImages ? '' : ' p-6'}`
    : cardSurface
  const innerClassName = elevated && useFlushImages ? 'p-6' : ''

  const card = (
    <div className={outerClassName}>

      {imagesPosition === 'top' && imagesBlock}

      <div className={innerClassName}>

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
            <span className={elevated ? 'font-archivo font-bold tracking-[-0.02em] text-[21px] text-foreground block leading-snug' : 'font-bold text-lg text-foreground block leading-snug'}>
              {renderText(title)}
            </span>
            {!timeline && (
              <span className={elevated ? 'text-xs font-mono text-muted shrink-0' : 'text-sm text-muted shrink-0'}>{date}</span>
            )}
          </div>
          {subtitle && (
            <span className={elevated ? 'text-xs font-mono text-accent mt-1.5 block' : 'text-sm text-accent mt-0.5 block'}>
              {renderText(subtitle)}
            </span>
          )}
        </div>
      </div>

      {/* Divider. Ausente en la placa flotante (`elevated`): sin filete interno. */}
      {hasBody && !elevated && <div className="h-px bg-border my-4" />}

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
        <p className={elevated ? 'text-[14.5px] font-figtree font-medium text-foreground leading-[1.55] mt-2.5' : 'text-base text-foreground leading-relaxed'}>
          {renderText(description)}
        </p>
      )}

      {/* Note */}
      {note && (
        <p className="text-sm text-muted mt-3 font-mono italic">
          {renderText(note)}
        </p>
      )}

      {links_}

      {/* Images. Las clases de rejilla van en el envoltorio de GalleryImage
          porque es él quien pasa a ser la celda. */}
      {imagesPosition === 'bottom' && imagesBlock}

      </div>
    </div>
  )

  // El revelado se ancla en estas dos raíces y no se envuelve en un div nuevo:
  // `last:pb-0`, `[&:last-child_.tl-line]:hidden` y el escalonado por
  // `nth-child` dependen de que sea esta raíz la que cuelgue del contenedor de
  // la lista.
  if (!timeline) {
    return <div className={spacing ? 'mb-4 last:mb-0' : ''} {...revealAttrs}>{card}</div>
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
