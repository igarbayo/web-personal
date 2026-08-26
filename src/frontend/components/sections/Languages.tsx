import Image from 'next/image'
import type { LanguagesData, LanguageCertification } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'

interface LanguagesProps {
  data: LanguagesData
}

function CertCard({ cert }: { cert: LanguageCertification }) {
  const range = cert.scaleMax - cert.scaleMin
  const thresholdPct = ((cert.threshold - cert.scaleMin) / range) * 100

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-[0_20px_44px_-34px_rgba(0,0,0,0.5)] p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-[280px_1fr] gap-8 sm:gap-9 sm:items-center">
        {/* Left: logo, name, issuer, overall stats */}
        <div className="sm:border-r sm:border-border sm:pr-9">
          <Image src="/cambridge.svg" alt="Cambridge" width={2000} height={2339} className="h-10 w-auto object-contain" />
          <p className="mt-5 font-archivo font-extrabold text-[23px] tracking-[-0.02em] leading-[1.05] text-foreground">{cert.name}</p>
          <p className="mt-1.5 font-mono text-[12.5px] text-muted">{cert.issuer}</p>
          <div className="flex gap-6 mt-5">
            <div>
              <div className="font-archivo font-black text-[34px] text-accent leading-none">{cert.overallScore}</div>
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted mt-1">Overall</div>
            </div>
            <div>
              <div className="font-archivo font-black text-[34px] text-accent leading-none">{cert.overallLevel}</div>
              <div className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted mt-1">Level</div>
            </div>
          </div>
        </div>

        {/* Right: skill bars */}
        <div>
          <div className="flex justify-between font-mono text-[11px] tracking-[0.08em] uppercase mb-4">
            <span className="text-muted">{cert.skillsLabel}</span>
            <span className="text-emerald-600 dark:text-emerald-400">{cert.thresholdLabel}</span>
          </div>
          <div className="flex flex-col gap-3.5">
            {cert.skills.map((skill) => {
              const fillPct = ((skill.score - cert.scaleMin) / range) * 100
              return (
                <div key={skill.name} className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[132px_1fr_40px] sm:gap-3.5 sm:items-center">
                  {/* En móvil el nombre va pegado encima de su barra, no al
                      lado: `sm:contents` saca esta fila de su propia caja a
                      partir de `sm` para que el nombre vuelva a ser la 1ª
                      columna de la rejilla de escritorio. */}
                  <div className="flex items-baseline justify-between sm:contents">
                    <span className="font-mono text-[13px] text-foreground">{skill.name}</span>
                    <span className="font-archivo font-extrabold text-[15px] text-accent sm:hidden">{skill.score}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-border">
                    {/* La marca de umbral vive dentro de la propia barra y se
                        posiciona en `%`, no en un `calc()` con el ancho de la
                        etiqueta: así funciona igual con la barra a ancho
                        completo (móvil) que con la barra recortada por la
                        columna de 132px (`sm`), sin dos fórmulas. A cambio ya
                        no es una única regla que cruza las cinco barras, sino
                        una marca corta por barra. */}
                    <div
                      data-reveal-late
                      className="absolute -top-1 -bottom-1 -translate-x-1/2 w-[3px] bg-emerald-600 dark:bg-emerald-400 rounded-full z-10"
                      style={{ left: `${thresholdPct}%` }}
                    />
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
                  <span className="hidden sm:block font-archivo font-extrabold text-[15px] text-accent text-right">{skill.score}</span>
                </div>
              )
            })}
          </div>
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
      <div className="mb-6">
        <SectionTitle variant="eyebrow">{data.title}</SectionTitle>
      </div>
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
          <div className="flex flex-wrap gap-2.5" data-reveal>
            {plainEntries.map((entry) => (
              <span key={entry.language} className="inline-flex items-center gap-2 font-mono text-sm px-4 py-2 bg-surface border border-border rounded-full">
                <strong className="font-semibold text-foreground">{entry.language}</strong>
                <span className="text-muted">{entry.level}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
