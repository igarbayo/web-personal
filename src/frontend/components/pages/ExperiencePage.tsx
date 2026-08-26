import type { Dictionary } from '@/lib/types'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Volunteering from '@/components/sections/Volunteering'

/**
 * Único `main` de esta página sin su propio `<h1>`: en Experience vive dentro
 * de `Experience.tsx`, junto al rótulo de sección, para reproducir el rótulo
 * eyebrow + titular de las capturas de referencia. Excepción declarada al
 * patrón de Education/Projects, ver DESIGN.md § Typography.
 */
export default function ExperiencePage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-16 pt-28">
      <Experience data={dict.experience} />
      <Skills data={dict.skills} />
      <Volunteering data={dict.volunteering} />
    </main>
  )
}
