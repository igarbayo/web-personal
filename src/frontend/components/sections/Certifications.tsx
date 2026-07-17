import type { CertificationsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface CertificationsProps {
  data: CertificationsData
  number?: string
}

export default function Certifications({ data, number }: CertificationsProps) {
  return (
    <section id="certifications" className="py-8 scroll-mt-20">
      <SectionTitle number={number}>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.issuer}
            bullets={entry.bullets}
            logo={entry.logo}
            links={entry.links}
            images={entry.images}
          />
        ))}
      </div>
    </section>
  )
}
