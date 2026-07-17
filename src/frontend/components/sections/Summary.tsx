import type { SummaryData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'

interface SummaryProps {
  data: SummaryData
}

export default function Summary({ data }: SummaryProps) {
  return (
    <section id="summary" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <p className="text-foreground leading-relaxed text-justify hyphens-auto">
        {data.content}
      </p>
      <p className="mt-4">
        <span className="font-bold italic text-sm">{data.keywordsLabel}</span>{' '}
        <span className="font-mono text-[13px] text-muted">{data.keywords.join(' · ')}</span>
      </p>
      <p className="mt-6 font-mono text-sm text-foreground leading-relaxed">
        {data.metrics.map((metric, i) => (
          <span key={metric}>
            {i > 0 && <span className="text-accent mx-2">·</span>}
            {metric}
          </span>
        ))}
      </p>
    </section>
  )
}
