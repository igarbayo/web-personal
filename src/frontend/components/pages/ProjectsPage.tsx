import type { Dictionary } from '@/lib/types'
import ProjectsCompetitions from '@/components/sections/ProjectsCompetitions'

/** Cuerpo de Proyectos. Lo comparten `/[lang]/projects/` y `/projects/`. */
export default function ProjectsPage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-8 pt-28">
      <h1
        data-reveal-load
        className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6"
      >
        {dict.projects.pageTitle}
      </h1>
      <ProjectsCompetitions data={dict.projects} />
    </main>
  )
}
