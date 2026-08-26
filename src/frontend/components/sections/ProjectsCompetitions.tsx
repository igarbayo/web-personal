import Image from 'next/image'
import type { ProjectsData, ProjectEntry } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { getImageDimensions } from '@/lib/imageDimensions'
import { renderText } from '@/lib/renderText'

interface ProjectsCompetitionsProps {
  data: ProjectsData
}

/**
 * Orden fijo del mosaico, por forma del contenido y no por posición en el
 * diccionario: la entrada con más imágenes es la pieza destacada a toda
 * fila; sin logotipo pero con enlaces es "Open Source" (necesita hueco para
 * el chip de GitHub); con logotipo y sin imágenes es EGS; sin logotipo y sin
 * enlaces es la de solo texto; con logotipo e imágenes es la revista. Ese
 * orden coincide con el guion pedido: destacada, Open Source + EGS,
 * Automated Referee + revista.
 */
function projectRank(entry: ProjectEntry): number {
  const imagesCount = entry.images?.length ?? 0
  if (imagesCount >= 4) return 0
  if (!entry.logo && (entry.links?.length ?? 0) > 0) return 1
  if (entry.logo && imagesCount === 0) return 2
  if (!entry.logo && imagesCount === 0) return 3
  return 4
}

/** Logotipo de una entrada, con las mismas variantes que ya soportaba
 *  `TimelineEntry` (oscuro, redondeado, borde de color) para no perder
 *  fidelidad frente al header por el que pasaban antes estos proyectos. */
function ProjectLogo({ entry }: { entry: ProjectEntry }) {
  const logoSrc = entry.logo?.[0]
  if (!logoSrc) return null
  const { width, height } = getImageDimensions(logoSrc)
  const darkSrc = entry.logoDark?.[0]
  const borderStyle = entry.logoBorderColor ? { borderColor: entry.logoBorderColor } : undefined
  const cls = `h-9 w-auto object-contain rounded-lg${entry.logoBorderColor ? ' border-[3px]' : ''}`
  return (
    <>
      <Image src={`/${logoSrc}`} alt="" width={width} height={height} style={borderStyle} className={darkSrc ? `${cls} dark:hidden` : cls} />
      {darkSrc && (
        <Image src={`/${darkSrc}`} alt="" width={width} height={height} style={borderStyle} className={`${cls} hidden dark:block`} />
      )}
    </>
  )
}

/** Celda de imagen a sangre. `fill` y no `width`/`height`: dentro de una
 *  rejilla, el tamaño intrínseco de la foto se metería en el cálculo de alto
 *  de la fila y la desbordaría (el mismo problema que ya se resolvió en
 *  Leadership y en las placas de logotipo de Experience). */
function MosaicImage({ src, className, sizes }: { src: string; className?: string; sizes: string }) {
  const { width, height } = getImageDimensions(src)
  return (
    <div className={`relative min-h-0 min-w-0 overflow-hidden ${className ?? ''}`}>
      <Image src={`/${src}`} alt="" fill sizes={sizes} className="object-cover transition-transform duration-500 hover:scale-105" />
    </div>
  )
}

const chipClass = 'inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white hover:scale-105 transition duration-200'
const arrowIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5" />
  </svg>
)

/** Mosaico 2×2 de la pieza destacada. Solo la usa Hackathons, la única
 *  entrada con cuatro fotos — la revista volvió a la tira compacta de
 *  `ProjectCard` al dejar de ir a toda fila. */
function FeatureMosaic({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-[3px] bg-border min-h-[280px] sm:min-h-0">
      {images.map((src) => (
        <MosaicImage key={src} src={src} sizes="(min-width: 640px) 22vw, 50vw" />
      ))}
    </div>
  )
}

/** Pieza destacada a toda fila: texto a la izquierda, mosaico 2×2 a la
 *  derecha. Solo la usa Hackathons. */
function FeatureCard({ entry }: { entry: ProjectEntry }) {
  const images = entry.images ?? []
  return (
    <div className="rounded-2xl border border-border bg-surface shadow-[0_20px_44px_-34px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[1.05fr_0.95fr]">
        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <ProjectLogo entry={entry} />
            <span className="font-mono text-xs text-muted whitespace-nowrap ml-auto">{entry.date}</span>
          </div>
          <h3 className="mt-4 font-archivo font-extrabold tracking-[-0.03em] text-[28px] leading-[1.02] text-foreground">
            {renderText(entry.title)}
          </h3>
          {entry.organization && (
            <div className="font-mono text-[13px] text-accent mt-2.5">{renderText(entry.organization)}</div>
          )}
          {entry.bullets.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2.5">
              {entry.bullets.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-[14.5px] leading-[1.5] font-figtree font-medium text-foreground items-baseline">
                  <span className="text-accent font-mono shrink-0 mt-px">—</span>
                  <span>{renderText(b)}</span>
                </li>
              ))}
            </ul>
          )}
          {entry.links && entry.links.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={chipClass}>
                  {arrowIcon}
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <FeatureMosaic images={images} />
      </div>
    </div>
  )
}

/** Tarjeta compacta: logotipo opcional, título, fecha, organización,
 *  viñetas, chips de enlaces y, si trae fotos (la revista), una tira a
 *  sangre al pie. Cubre Open Source, EGS, Automated Referee y la revista. */
function ProjectCard({ entry }: { entry: ProjectEntry }) {
  const images = entry.images ?? []
  // Solo EGS (logotipo, sin fotos) apila la fecha encima del logo en móvil.
  // La revista también tiene logotipo pero además fotos, y esa cabecera se
  // deja tal cual — el encargo fue "esa no".
  const stackDateOnMobile = !!entry.logo && images.length === 0
  return (
    <div className="h-full flex flex-col rounded-2xl border border-border bg-surface shadow-[0_14px_30px_-26px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="p-7 flex-1 flex flex-col">
        {/* Solo en móvil, y solo para EGS, la fecha se apila encima del logo
            en vez de ir al lado — `order-first` la manda arriba del todo, y
            como el contenedor pasa a columna, `text-right` la mantiene
            alineada a la derecha igual que en `sm`, donde vuelve a la fila
            con `ml-auto`. */}
        <div className={`flex sm:flex-row sm:items-center gap-3 ${stackDateOnMobile ? 'flex-col' : 'items-center'}`}>
          {/* `self-start` solo en la variante apilada: el contenedor sigue
              con `items-stretch` por defecto (lo necesita la fecha para que
              `text-right` tenga ancho de sobra donde alinearse), así que el
              logo tiene que rechazar el estiramiento por su cuenta o quedaría
              centrado/estirado en vez de a la izquierda. */}
          <div className={stackDateOnMobile ? 'self-start' : ''}>
            <ProjectLogo entry={entry} />
          </div>
          <span className={`sm:order-none sm:ml-auto sm:text-left font-mono text-xs text-muted whitespace-nowrap ${stackDateOnMobile ? 'order-first text-right' : 'ml-auto'}`}>
            {entry.date}
          </span>
        </div>
        <h3 className="mt-3 font-archivo font-bold tracking-[-0.02em] text-[22px] leading-[1.08] text-foreground">
          {renderText(entry.title)}
        </h3>
        {entry.organization && (
          <div className="font-mono text-[13px] text-accent mt-2">{renderText(entry.organization)}</div>
        )}
        {entry.bullets.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {entry.bullets.map((b, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-[1.5] font-figtree font-medium text-foreground items-baseline">
                <span className="text-accent font-mono shrink-0 mt-px">—</span>
                <span>{renderText(b)}</span>
              </li>
            ))}
          </ul>
        )}
        {entry.links && entry.links.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {entry.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className={chipClass}>
                {arrowIcon}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className={`grid gap-[3px] bg-border h-28 ${images.length >= 3 ? 'grid-cols-3' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {images.map((src) => (
            <MosaicImage key={src} src={src} sizes="(min-width: 640px) 20vw, 33vw" />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectsCompetitions({ data }: ProjectsCompetitionsProps) {
  // Cuatro huecos con nombre en vez de un flujo genérico, igual que en
  // Leadership: Automated Referee y la revista siguen en la misma fila,
  // pero repartiéndosela sin partes iguales — la revista lleva fotos y
  // necesita más sitio.
  const groups: ProjectEntry[][] = [[], [], [], [], []]
  for (const entry of data.entries) groups[projectRank(entry)].push(entry)
  const [hackathons] = groups[0]
  const [openSource] = groups[1]
  const [egs] = groups[2]
  const [automatedRef] = groups[3]
  const [magazine] = groups[4]
  const extra = groups.flatMap((g) => g.slice(1))

  return (
    <section id="projects" className="py-8 scroll-mt-20">
      <SectionTitle reveal="load" variant="eyebrow">{data.title}</SectionTitle>
      <h1 className="mt-3.5 mb-9 font-archivo font-bold tracking-[-0.01em] text-[40px] sm:text-[68px] leading-[0.98] text-foreground" data-reveal-load>
        {data.pageTitle}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-reveal-group>
        {hackathons && (
          <div className="sm:col-span-2" data-reveal>
            <FeatureCard entry={hackathons} />
          </div>
        )}
        {(egs || openSource) && (
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[5fr_4fr] gap-4">
            {egs && <div data-reveal><ProjectCard entry={egs} /></div>}
            {openSource && <div data-reveal><ProjectCard entry={openSource} /></div>}
          </div>
        )}
        {(automatedRef || magazine) && (
          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
            {automatedRef && <div data-reveal><ProjectCard entry={automatedRef} /></div>}
            {magazine && <div data-reveal><ProjectCard entry={magazine} /></div>}
          </div>
        )}
        {extra.map((entry, i) => (
          <div key={i} data-reveal>
            <ProjectCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  )
}
