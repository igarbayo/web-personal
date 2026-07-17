import type { EducationData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface EducationProps {
  data: EducationData
  number?: string
}

export default function Education({ data, number }: EducationProps) {
  return (
    <section id="education" className="py-8 scroll-mt-20">
      <SectionTitle number={number}>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.degree}
            subtitle={entry.institution}
            bullets={entry.bullets}
            logo={entry.logo}
            links={entry.links}
            images={entry.images}
            timeline={false}
          />
        ))}
      </div>
    </section>
  )
}
