import type { VolunteeringData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface VolunteeringProps {
  data: VolunteeringData
}

export default function Volunteering({ data }: VolunteeringProps) {
  return (
    <section id="volunteering" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div data-reveal-group>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.location}
            description={entry.description}
            images={entry.images}
            timeline={false}
          />
        ))}
      </div>
    </section>
  )
}
