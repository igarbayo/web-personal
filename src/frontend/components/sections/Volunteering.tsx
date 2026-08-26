import type { VolunteeringData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface VolunteeringProps {
  data: VolunteeringData
}

export default function Volunteering({ data }: VolunteeringProps) {
  return (
    <section id="volunteering" className="py-8 scroll-mt-20">
      <div className="mb-6">
        <SectionTitle variant="eyebrow">{data.title}</SectionTitle>
      </div>
      {/* Rejilla de dos columnas con tarjetas elevadas: réplica del diseño 5a,
          ver DESIGN.md § Signature: trayectoria de espina. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" data-reveal-group>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.location}
            description={entry.description}
            images={entry.images}
            timeline={false}
            elevated
            imagesPosition="top"
            spacing={false}
          />
        ))}
      </div>
    </section>
  )
}
