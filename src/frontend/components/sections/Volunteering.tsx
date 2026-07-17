import type { VolunteeringData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface VolunteeringProps {
  data: VolunteeringData
  number?: string
}

export default function Volunteering({ data, number }: VolunteeringProps) {
  return (
    <section id="volunteering" className="py-8 scroll-mt-20">
      <SectionTitle number={number}>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.location}
            description={entry.description}
            images={entry.images}
            imagesCaption={entry.imagesCaption}
            timeline={false}
          />
        ))}
      </div>
    </section>
  )
}
