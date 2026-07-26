import type { EducationData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface EducationProps {
  data: EducationData
}

export default function Education({ data }: EducationProps) {
  return (
    <section id="education" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.degree}
            subtitle={entry.institution}
            bullets={entry.bullets}
            logo={entry.logo}
            logoBoxed
            links={entry.links}
            images={entry.images}
            timeline={false}
            priorityImages={i < 2 ? 1 : 0}
          />
        ))}
      </div>
    </section>
  )
}
