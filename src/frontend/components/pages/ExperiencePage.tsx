import type { Dictionary } from '@/lib/types'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Volunteering from '@/components/sections/Volunteering'

/** Cuerpo de Experiencia. Lo comparten `/[lang]/experience/` y `/experience/`. */
export default function ExperiencePage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-8 pt-28">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
        {dict.experience.pageTitle}
      </h1>
      <Experience data={dict.experience} />
      <Skills data={dict.skills} />
      <Volunteering data={dict.volunteering} />
    </main>
  )
}
