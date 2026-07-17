import type { ProjectsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import ProjectPlate from '@/components/ui/ProjectPlate'

interface ProjectsCompetitionsProps {
  data: ProjectsData
}

// Bento asimétrico: alterna el peso 7/5 → 5/7 entre filas.
const SPANS = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7']

export default function ProjectsCompetitions({ data }: ProjectsCompetitionsProps) {
  return (
    <section id="projects" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {data.entries.map((entry, i) => (
          <div key={i} className={SPANS[i] ?? 'md:col-span-6'}>
            <ProjectPlate entry={entry} index={i} featured={i === 0} />
          </div>
        ))}
      </div>
    </section>
  )
}
