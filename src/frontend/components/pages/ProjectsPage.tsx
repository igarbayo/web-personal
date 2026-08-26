import type { Dictionary } from '@/lib/types'
import ProjectsCompetitions from '@/components/sections/ProjectsCompetitions'

/**
 * Cuerpo de Proyectos. Lo comparten `/[lang]/projects/` y `/projects/`.
 * Sin `<h1>` propio: vive dentro de `ProjectsCompetitions`, junto al rótulo
 * eyebrow, igual que en Experience y Education.
 */
export default function ProjectsPage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-16 pt-28">
      <ProjectsCompetitions data={dict.projects} />
    </main>
  )
}
