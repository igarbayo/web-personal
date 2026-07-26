import type { ProjectsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface ProjectsCompetitionsProps {
  data: ProjectsData
}

export default function ProjectsCompetitions({ data }: ProjectsCompetitionsProps) {
  return (
    <section id="projects" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.organization}
            bullets={entry.bullets}
            logo={entry.logo}
            logoDark={entry.logoDark}
            logoRounded
            logoBorderColor={entry.logoBorderColor}
            links={entry.links}
            images={entry.images}
            timeline={false}
            priorityImages={i === 0 ? 5 : 0}
          />
        ))}
      </div>
    </section>
  )
}
