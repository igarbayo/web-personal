import { renderText } from '@/lib/renderText'
import type { ProjectEntry } from '@/lib/types'

/** Retícula de papel milimetrado embebida en cada esquema SVG. */
function GridDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M12 0H0V12" fill="none" stroke="#2743C0" strokeOpacity="0.12" strokeWidth="0.5" />
      </pattern>
    </defs>
  )
}

/** Grafo de asignación: para el motor de scheduling + enrutamiento. */
function GraphSchematic() {
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Esquema de grafo de asignación">
      <GridDefs id="grid-graph" />
      <rect width="200" height="120" fill="url(#grid-graph)" />
      <g stroke="#63697A" strokeOpacity="0.4" strokeWidth="1.2">
        <line x1="30" y1="30" x2="90" y2="60" />
        <line x1="30" y1="90" x2="90" y2="60" />
        <line x1="90" y1="60" x2="150" y2="30" />
        <line x1="90" y1="60" x2="150" y2="90" />
        <line x1="150" y1="30" x2="185" y2="60" />
        <line x1="150" y1="90" x2="185" y2="60" />
      </g>
      <g stroke="#2743C0" strokeWidth="1.6">
        <line x1="30" y1="30" x2="90" y2="60" />
        <line x1="90" y1="60" x2="150" y2="30" />
        <line x1="150" y1="30" x2="185" y2="60" />
      </g>
      <g>
        <circle cx="30" cy="30" r="5" fill="#2743C0" />
        <circle cx="185" cy="60" r="5" fill="#2743C0" />
        <circle cx="90" cy="60" r="6" fill="#FBFAF7" stroke="#2743C0" strokeWidth="1.6" />
        <circle cx="30" cy="90" r="5" fill="#FBFAF7" stroke="#63697A" strokeWidth="1.4" />
        <circle cx="150" cy="30" r="5" fill="#FBFAF7" stroke="#2743C0" strokeWidth="1.4" />
        <circle cx="150" cy="90" r="5" fill="#FBFAF7" stroke="#63697A" strokeWidth="1.4" />
      </g>
    </svg>
  )
}

/** Serie temporal con una anomalía marcada: para la detección de anomalías. */
function SparklineSchematic() {
  const pts = '8,74 24,68 40,76 56,64 72,72 88,67 104,75 120,66 136,71 152,26 168,64 184,72 196,67'
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Serie temporal con una anomalía detectada">
      <GridDefs id="grid-spark" />
      <rect width="200" height="120" fill="url(#grid-spark)" />
      <line x1="0" y1="70" x2="200" y2="70" stroke="#63697A" strokeOpacity="0.25" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="152" y1="10" x2="152" y2="110" stroke="#2743C0" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
      <polyline points={pts} fill="none" stroke="#1C1E26" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="152" cy="26" r="8" fill="none" stroke="#2743C0" strokeOpacity="0.4" strokeWidth="1.2" />
      <circle cx="152" cy="26" r="4.5" fill="#2743C0" />
    </svg>
  )
}

const arrow = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5" />
  </svg>
)

interface ProjectPlateProps {
  entry: ProjectEntry
  index: number
  featured?: boolean
}

export default function ProjectPlate({ entry, index, featured }: ProjectPlateProps) {
  const image = entry.images?.[0]

  return (
    <article
      className="group h-full flex flex-col rounded-xl border border-border bg-white p-5 transition-all hover:border-accent/30 hover:shadow-[0_6px_28px_rgba(39,67,192,0.09)] fade-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Cabecera: Fig. N + fecha */}
      <div className="flex items-baseline justify-between font-mono text-sm">
        <span className="text-accent font-medium">Fig. {index + 1}</span>
        <span className="text-muted">{entry.date}</span>
      </div>

      {/* Figura: imagen o esquema */}
      <div className={`mt-3 overflow-hidden rounded-lg border border-border bg-background ${featured ? 'h-56 sm:h-72' : 'h-44'}`}>
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : entry.schematic === 'graph' ? (
          <GraphSchematic />
        ) : entry.schematic === 'sparkline' ? (
          <SparklineSchematic />
        ) : null}
      </div>

      {/* Título + organización */}
      <h3 className="font-serif font-bold text-xl text-foreground mt-4 leading-snug">
        {renderText(entry.title)}
      </h3>
      {entry.organization && (
        <p className="text-sm text-accent mt-0.5">{renderText(entry.organization)}</p>
      )}

      {/* Estado + premios */}
      {(entry.status || (entry.awards && entry.awards.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {entry.status && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {entry.status}
            </span>
          )}
          {entry.awards?.map((a) => (
            <span key={a} className="text-xs font-mono px-2 py-0.5 rounded-md bg-accent/10 text-accent">
              {a}
            </span>
          ))}
        </div>
      )}

      {/* Caption */}
      {entry.caption && (
        <p className="text-base text-muted leading-relaxed mt-3">{entry.caption}</p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {entry.tags.map((t) => (
            <span key={t} className="text-xs font-mono px-2 py-0.5 rounded border border-border text-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Empuja el pie hacia abajo para igualar alturas por fila */}
      <div className="flex-1" />

      {/* Detalle técnico plegable (conserva los bullets completos) */}
      {entry.bullets && entry.bullets.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden font-mono text-xs text-accent hover:underline">
            + Detalle técnico
          </summary>
          <ul className="mt-2 space-y-1.5">
            {entry.bullets.map((b, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed flex gap-2 items-baseline">
                <span className="text-accent shrink-0">·</span>
                <span>{renderText(b)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Enlaces */}
      {entry.links && entry.links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {entry.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-border text-accent hover:bg-accent hover:text-white transition-colors"
            >
              {arrow}
              {link.label}
            </a>
          ))}
        </div>
      )}
    </article>
  )
}
