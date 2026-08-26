import Image from 'next/image'
import type { LeadershipData, LeadershipEntry } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { getImageDimensions } from '@/lib/imageDimensions'
import { renderText } from '@/lib/renderText'

interface LeadershipAwardsProps {
  data: LeadershipData
}

/**
 * Logo + fecha, título, organización y la primera viñeta como descripción.
 * Con imágenes (p. ej. Akademia) se parte en dos columnas, con el par de
 * fotos a la derecha; sin ellas, es solo el bloque de texto.
 */
function FeatureCard({ entry }: { entry: LeadershipEntry }) {
  const logoSrc = entry.logo?.[0]
  const logoDims = logoSrc ? getImageDimensions(logoSrc) : { width: 0, height: 0 }
  const images = entry.images?.slice(0, 2) ?? []

  const text = (
    <div className="p-8 flex flex-col justify-center">
      <div className="flex items-center justify-between gap-4">
        {logoSrc && (
          <Image src={`/${logoSrc}`} alt="" width={logoDims.width} height={logoDims.height} className="h-12 w-auto object-contain" />
        )}
        <span className="font-mono text-xs text-muted whitespace-nowrap">{entry.date}</span>
      </div>
      <h3 className="mt-4 font-archivo font-extrabold tracking-[-0.03em] text-[26px] leading-none text-foreground">
        {renderText(entry.title)}
      </h3>
      {entry.organization && (
        <div className="font-mono text-[13px] text-accent mt-2.5">{renderText(entry.organization)}</div>
      )}
      {entry.bullets[0] && (
        <p className="mt-4 text-[14.5px] leading-[1.55] font-figtree font-medium text-foreground">
          {renderText(entry.bullets[0])}
        </p>
      )}
    </div>
  )

  return (
    <div className="h-full rounded-2xl border border-border bg-surface shadow-[0_20px_44px_-34px_rgba(0,0,0,0.5)] overflow-hidden">
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_0.5fr]">
          {text}
          {/* `fill` en vez de `width`/`height`: un `<img>` con dimensiones
              intrínsecas mete su propia proporción en el cálculo de alto de
              la fila del grid (por eso antes esta columna acababa forzando
              la altura de toda la tarjeta). En modo `fill` la imagen se
              posiciona en absoluto dentro de su celda, así que dentro del
              grid no aporta tamaño propio: la altura la sigue marcando solo
              el texto, y la foto se recorta (`object-cover`) para llenarla. */}
          {/* `h-56 sm:h-full`: en móvil el texto y las fotos dejan de compartir
              fila (grid-cols-1), así que `h-full` no tiene un alto de fila
              definido del que partir y la caja colapsaba a 0 — de ahí que no
              se vieran. A partir de `sm` sí comparten fila y vuelve a
              estirarse a la altura real del texto. */}
          <div className="grid grid-rows-2 gap-[3px] bg-border h-56 sm:h-full min-h-0 min-w-0">
            {images.map((src) => (
              <div key={src} className="relative min-h-0 overflow-hidden">
                <Image src={`/${src}`} alt="" fill sizes="(min-width: 640px) 20vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      ) : text}
    </div>
  )
}

// La nota entre paréntesis al final de la primera viñeta ("...(13.92/14).")
// se extrae aquí en vez de en el contenido, igual que en Education, para no
// tocar el esquema por una sola pieza de dato.
const INLINE_GRADE_PATTERN = /\s*\((\d+[.,]\d+)\/(\d+)\)\.?\s*$/

function extractInlineGrade(text?: string) {
  if (!text) return { grade: null as { value: string; scale: string } | null, rest: text }
  const match = text.match(INLINE_GRADE_PATTERN)
  if (!match) return { grade: null, rest: text }
  return { grade: { value: match[1], scale: match[2] }, rest: text.replace(INLINE_GRADE_PATTERN, '.') }
}

/** Título, organización · fecha, descripción opcional y chips de enlaces
 *  opcionales. Para entradas sin logotipo (premios, distinciones). */
function CompactCard({ entry }: { entry: LeadershipEntry }) {
  const { grade, rest } = extractInlineGrade(entry.bullets[0])
  return (
    <div className="h-full p-[26px_28px] bg-surface border border-border rounded-2xl shadow-[0_14px_30px_-26px_rgba(0,0,0,0.5)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-archivo font-bold tracking-[-0.015em] text-[19px] leading-snug text-foreground">
          {renderText(entry.title)}
        </h3>
        <span className="font-mono text-xs text-muted whitespace-nowrap shrink-0">{entry.date}</span>
      </div>
      {/* Nota, en la posición del subtítulo: más pequeña que el formato a
          toda plana del 6a, para no competir con el título. */}
      {grade && (
        <span className="block font-archivo font-black tracking-[-0.02em] text-xl leading-none text-accent mt-1.5">
          {grade.value}
          <span className="text-xs font-semibold opacity-60">/{grade.scale}</span>
        </span>
      )}
      {entry.organization && (
        <div className="font-mono text-[12.5px] text-muted mt-1.5">{renderText(entry.organization)}</div>
      )}
      {rest && (
        <p className="mt-2.5 text-[13.5px] leading-[1.5] font-figtree font-medium text-foreground">
          {renderText(rest)}
        </p>
      )}
      {entry.links && entry.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3.5">
          {entry.links.map((link, i) => (
            <a
              key={`${link.url}-${i}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              // `transition` y no `transition-colors`: hace falta que la lista
              // de propiedades incluya `transform`, o el crecimiento saltaría
              // de golpe mientras el color sí acompaña.
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white hover:scale-105 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5" />
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/** Orden fijo del mosaico: ver el comentario junto a la rejilla más abajo. */
function leadershipRank(entry: LeadershipEntry): number {
  const hasImages = (entry.images?.length ?? 0) > 0
  const hasLinks = (entry.links?.length ?? 0) > 0
  if (entry.logo && !hasImages) return 0 // Generación Propósito
  if (!entry.logo && hasLinks) return 1 // Distinción de honor
  if (entry.logo && hasImages) return 2 // Akademia
  return 3 // Premio
}

export default function LeadershipAwards({ data }: LeadershipAwardsProps) {
  // Cuatro huecos con nombre en vez de un flujo genérico: el mosaico ya no
  // es una rejilla que se acomoda sola, es una composición dibujada a mano.
  // Si el diccionario trae más de una entrada por hueco, las sobrantes caen
  // a `extra` y se pintan debajo con el criterio genérico de antes, para no
  // perder contenido nuevo silenciosamente.
  const groups: LeadershipEntry[][] = [[], [], [], []]
  for (const entry of data.entries) groups[leadershipRank(entry)].push(entry)
  const [proposito] = groups[0]
  const [honors] = groups[1]
  const [akademia] = groups[2]
  const [prize] = groups[3]
  const extra = groups.flatMap((g) => g.slice(1))

  return (
    <section id="leadership" className="py-8 scroll-mt-20">
      <div className="mb-6">
        <SectionTitle variant="eyebrow">{data.title}</SectionTitle>
      </div>
      {/* Mosaico curado a mano: a la izquierda Generación Propósito, a su
          derecha, apiladas y repartiéndose ese mismo alto, Distinción de
          honor y el premio — así el premio queda justo encima de Akademia,
          que cierra la fila siguiente a lo ancho completo. La 2ª columna es
          más ancha porque la Distinción carga más contenido (descripción +
          chips de prensa). Ver DESIGN.md § Signature: trayectoria de espina. */}
      <div className="grid grid-cols-1 sm:grid-cols-[9fr_11fr] gap-4" data-reveal-group>
        {proposito && (
          <div data-reveal>
            <FeatureCard entry={proposito} />
          </div>
        )}
        {(honors || prize) && (
          <div className="flex flex-col gap-4" data-reveal>
            {honors && (
              <div className="flex-[9] sm:flex-[8] min-h-0">
                <CompactCard entry={honors} />
              </div>
            )}
            {prize && (
              <div className="flex-[3.3] sm:flex-[4] min-h-0">
                <CompactCard entry={prize} />
              </div>
            )}
          </div>
        )}
        {akademia && (
          <div className="sm:col-span-2" data-reveal>
            <FeatureCard entry={akademia} />
          </div>
        )}
        {extra.map((entry, i) => {
          const isFeature = !!entry.logo
          const wide = isFeature && (entry.images?.length ?? 0) > 0
          return (
            <div key={i} className={wide ? 'sm:col-span-2' : ''} data-reveal>
              {isFeature ? <FeatureCard entry={entry} /> : <CompactCard entry={entry} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
