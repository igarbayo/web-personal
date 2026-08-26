import Image from 'next/image'
import type { EducationData, EducationEntry } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { getImageDimensions } from '@/lib/imageDimensions'
import { renderText } from '@/lib/renderText'

interface EducationProps {
  data: EducationData
}

// La nota final llega como una viñeta más ("Grade: 8.1/10" / "Nota: 8,1/10")
// porque el diccionario no le dedica un campo propio. Se extrae aquí en vez
// de en el contenido para no tocar el esquema por una sola pieza de dato.
const GRADE_PATTERN = /^(?:Grade|Nota):\s*(\d+[.,]\d+)\s*\/\s*(\d+)$/i

function extractGrade(bullets: string[]) {
  const i = bullets.findIndex((b) => GRADE_PATTERN.test(b))
  if (i === -1) return { grade: null as { value: string; scale: string } | null, rest: bullets }
  const match = bullets[i].match(GRADE_PATTERN)!
  return { grade: { value: match[1], scale: match[2] }, rest: bullets.filter((_, j) => j !== i) }
}

/** Una página del libro: el logotipo, la fecha, la nota, el grado y sus viñetas. */
function Page({ entry, priority }: { entry: EducationEntry; priority: boolean }) {
  const logoSrc = entry.logo?.[0]
  const { width, height } = logoSrc ? getImageDimensions(logoSrc) : { width: 0, height: 0 }
  const { grade, rest } = extractGrade(entry.bullets)

  return (
    <div className="p-8 sm:p-10">
      {logoSrc && (
        // Alto fijo y ancho automático, no una caja cuadrada: así la placa se
        // adapta a la proporción real del logotipo (el de la USC es más
        // ancho que alto) en vez de forzarlo a un recuadro que le sobra o le
        // falta por los lados.
        <div className="h-16 inline-flex items-center justify-center rounded-xl bg-white border border-border overflow-hidden px-3 mb-5">
          <Image src={`/${logoSrc}`} alt="" width={width} height={height} priority={priority} className="h-full w-auto object-contain py-2" />
        </div>
      )}
      <div className="flex items-center gap-3.5 flex-wrap">
        <span className="inline-flex items-center whitespace-nowrap text-xs font-mono text-white bg-accent rounded-2xl px-2.5 py-1">
          {entry.date}
        </span>
        {/* Filete de nota, formato del diseño de referencia: fondo de acento
            al 10 %, texto de acento, la escala más pequeña y atenuada. */}
        {grade && (
          <span className="inline-flex items-baseline gap-1 font-archivo font-extrabold text-sm text-accent bg-accent/10 rounded-2xl px-2.5 py-1">
            {grade.value}
            <span className="font-semibold text-xs opacity-70">/{grade.scale}</span>
          </span>
        )}
      </div>
      <h2 className="mt-4 font-archivo font-bold tracking-[-0.02em] text-[23px] leading-[1.1] text-foreground">
        {renderText(entry.degree)}
      </h2>
      <div className="font-mono text-[13px] text-accent mt-1.5">
        {renderText(entry.institution)}
      </div>
      {rest.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {rest.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-[1.55] font-figtree font-medium text-foreground items-baseline">
              <span className="text-accent font-mono shrink-0 mt-px">—</span>
              <span>{renderText(b)}</span>
            </li>
          ))}
        </ul>
      )}
      {entry.links && entry.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
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
      {entry.images && entry.images.length > 0 && (
        <div className={`grid gap-2 mt-4 ${entry.images.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {entry.images.map((src) => {
            const dims = getImageDimensions(src)
            return (
              <div key={src} className="rounded-lg overflow-hidden">
                <Image src={`/${src}`} alt="" width={dims.width} height={dims.height} className="w-full h-32 object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Education({ data }: EducationProps) {
  return (
    <section id="education" className="py-8 scroll-mt-20">
      <SectionTitle reveal="load" variant="eyebrow">{data.title}</SectionTitle>
      <h1 className="mt-3.5 mb-9 font-archivo font-bold tracking-[-0.01em] text-[40px] sm:text-[68px] leading-[0.98] text-foreground" data-reveal-load>
        {data.pageTitle}
      </h1>

      {/* Mockup de libro abierto: cada grado es una página, con el lomo
          marcado por un filete central y una sombra de pliegue. Solo tiene
          sentido con dos entradas — a partir de tres se envolvería a una
          nueva fila y perdería la lectura de "libro". */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-border bg-surface shadow-[0_20px_44px_-34px_rgba(0,0,0,0.5)] overflow-hidden" data-reveal-group>
        {/* Sombra del lomo: solo entre páginas, a partir de sm. */}
        <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-10 -translate-x-1/2 bg-gradient-to-r from-black/[0.05] via-transparent to-black/[0.05] pointer-events-none z-10" aria-hidden="true" />
        {data.entries.map((entry, i) => (
          <div
            key={i}
            className={i === 0 ? 'border-b sm:border-b-0 sm:border-r border-border' : ''}
            data-reveal
          >
            <Page entry={entry} priority={i < 2} />
          </div>
        ))}
      </div>
    </section>
  )
}
