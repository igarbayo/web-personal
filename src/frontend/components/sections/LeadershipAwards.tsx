import type { LeadershipData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface LeadershipAwardsProps {
  data: LeadershipData
  number?: string
}

export default function LeadershipAwards({ data, number }: LeadershipAwardsProps) {
  return (
    <section id="leadership" className="py-8 scroll-mt-20">
      <SectionTitle number={number}>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.organization}
            bullets={entry.bullets}
            logo={entry.logo}
            links={entry.links}
            images={entry.images}
            imagesCaption={entry.imagesCaption}
            highlightLabel={entry.highlight ? data.resultLabel : undefined}
            timeline={false}
          />
        ))}
      </div>
    </section>
  )
}
