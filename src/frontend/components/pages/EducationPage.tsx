import type { Dictionary } from '@/lib/types'
import Education from '@/components/sections/Education'
import LeadershipAwards from '@/components/sections/LeadershipAwards'
import Languages from '@/components/sections/Languages'
import Certifications from '@/components/sections/Certifications'

/**
 * Cuerpo de Educación. Lo comparten `/[lang]/education/` y `/education/`.
 * Sin `<h1>` propio: en Education vive dentro de `Education.tsx`, junto al
 * rótulo eyebrow, igual que en Experience. Ver DESIGN.md § Typography.
 */
export default function EducationPage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-16 pt-28">
      <Education data={dict.education} />
      <LeadershipAwards data={dict.leadership} />
      <Languages data={dict.languages} />
      <Certifications data={dict.certifications} />
    </main>
  )
}
