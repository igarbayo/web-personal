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
    <div className="rounded-xl border border-border bg-white p-5 transition-colors hover:border-accent/20">
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
        <div
          className="absolute top-0 bottom-7 z-10 flex flex-col items-center"
          style={{ left: `calc(8.75rem + ${thresholdPct / 100} * (100% - 11.5rem))`, transform: 'translateX(-50%)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-800 shrink-0" />
          <div className="flex-1 w-[3px] bg-blue-800 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-800 shrink-0" />
        </div>
        <div className="space-y-2.5">
          {cert.skills.map((skill) => {
            const fillPct = ((skill.score - cert.scaleMin) / range) * 100
            return (
              <div key={skill.name} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32 shrink-0">{skill.name}</span>
                <div className="flex-1 relative h-2 rounded-full bg-border">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-accent"
                    style={{ width: `${fillPct}%` }}
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
            className="absolute -translate-x-1/2 text-[10px] font-mono text-blue-800 font-semibold whitespace-nowrap"
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
      <div className="space-y-4">
        {certEntries.map((entry) => (
          <CertCard key={entry.language} cert={entry.certification!} />
        ))}
        {plainEntries.length > 0 && (
          <div className="flex flex-wrap gap-4">
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
