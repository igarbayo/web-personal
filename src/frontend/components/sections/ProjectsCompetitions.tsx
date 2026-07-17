import type { ProjectsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface ProjectsCompetitionsProps {
  data: ProjectsData
  number?: string
}

export default function ProjectsCompetitions({ data, number }: ProjectsCompetitionsProps) {
  return (
    <section id="projects" className="py-8 scroll-mt-20">
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
            timeline={false}
          />
        ))}
      </div>
    </section>
  )
}
