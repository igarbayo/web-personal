import Image from 'next/image'
import type { LanguagesData, LanguageCertification } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { cardSurface } from '@/lib/cardSurface'

interface LanguagesProps {
  data: LanguagesData
}

function CertCard({ cert }: { cert: LanguageCertification }) {
  const range = cert.scaleMax - cert.scaleMin
  const thresholdPct = ((cert.threshold - cert.scaleMin) / range) * 100

  return (
    <div className={cardSurface}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
          <Image src="/cambridge.svg" alt="Cambridge" width={2000} height={2339} className="h-10 w-auto object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground leading-tight">{cert.name}</p>
            <p className="text-sm text-muted">{cert.issuer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-center rounded-lg bg-accent/10 px-3 py-1.5">
            <span className="font-mono font-bold text-accent text-lg leading-none">{cert.overallScore}</span>
            <span className="font-mono text-accent/70 text-[10px] uppercase tracking-wider mt-0.5">Overall</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-accent/10 px-3 py-1.5">
            <span className="font-mono font-bold text-accent text-lg leading-none">{cert.overallLevel}</span>
            <span className="font-mono text-accent/70 text-[10px] uppercase tracking-wider mt-0.5">Level</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-4" />

      {/* Skill bars */}
      <p className="text-xs font-mono font-semibold text-muted uppercase tracking-wider mb-3">{cert.skillsLabel}</p>
      <div className="relative">
        {/* Threshold line: w-32 (8rem) + gap-3 (0.75rem) = 8.75rem; bar width = 100% - 11.5rem */}
        {/* `data-reveal-late`: la marca aparece cuando las barras ya están
            puestas. Solo opacidad, porque su `transform` ya está ocupado
            centrándola. */}
        <div
          data-reveal-late
          className="absolute top-0 bottom-7 z-10 flex flex-col items-center"
          style={{ left: `calc(8.75rem + ${thresholdPct / 100} * (100% - 11.5rem))`, transform: 'translateX(-50%)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
          <div className="flex-1 w-[3px] bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" />
        </div>
        <div className="space-y-2.5">
          {cert.skills.map((skill) => {
            const fillPct = ((skill.score - cert.scaleMin) / range) * 100
            return (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32 shrink-0">{skill.name}</span>
                <div className="flex-1 relative h-2 rounded-full bg-border">
                  {/* El valor final va en una propiedad personalizada y no en
                      `width`: un `width` en línea gana a cualquier regla de la
                      hoja y la barra nunca podría partir de 0. La aserción es
                      necesaria porque React.CSSProperties no admite
                      propiedades personalizadas. */}
                  <div
                    data-reveal-bar
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    style={{ '--reveal-fill': `${fillPct}%` } as React.CSSProperties}
                  />
                </div>
                <span className="font-mono text-sm text-accent font-semibold w-8 text-right shrink-0">{skill.score}</span>
              </div>
            )
          })}
        </div>
        {/* Threshold label aligned under the line */}
        <div className="relative h-6 mt-1">
          <span
            data-reveal-late
            className="absolute -translate-x-1/2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap"
            style={{ left: `calc(8.75rem + ${thresholdPct / 100} * (100% - 11.5rem))` }}
          >
            {cert.thresholdLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Languages({ data }: LanguagesProps) {
  const certEntries = data.entries.filter((e) => e.certification)
  const plainEntries = data.entries.filter((e) => !e.certification)

  return (
    <section id="languages" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div className="space-y-4" data-reveal-group>
        {/* La unidad de revelado envuelve la tarjeta en vez de ser la tarjeta
            para que CertCard no tenga que saber nada del revelado. `space-y-4`
            apunta a hijos directos, así que el envoltorio es neutro para la
            maqueta. */}
        {certEntries.map((entry) => (
          <div key={entry.language} data-reveal>
            <CertCard cert={entry.certification!} />
          </div>
        ))}
        {plainEntries.length > 0 && (
          <div className="flex flex-wrap gap-4" data-reveal>
            {plainEntries.map((entry) => (
              <span key={entry.language} className="text-base text-foreground">
                <strong>{entry.language}</strong>
                <span className="text-muted">: {entry.level}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
