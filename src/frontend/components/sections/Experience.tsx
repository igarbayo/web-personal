import type { ExperienceData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface ExperienceProps {
  data: ExperienceData
  number?: string
}

export default function Experience({ data, number }: ExperienceProps) {
  return (
    <section id="experience" className="py-8 scroll-mt-20">
      <SectionTitle number={number}>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.company}
            bullets={entry.bullets}
            note={entry.note}
            logo={entry.logo}
            links={entry.links}
            images={entry.images}
            imagesCaption={entry.imagesCaption}
          />
        ))}
      </div>
    </section>
  )
}
