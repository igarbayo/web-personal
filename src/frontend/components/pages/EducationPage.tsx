import type { Dictionary } from '@/lib/types'
import Education from '@/components/sections/Education'
import LeadershipAwards from '@/components/sections/LeadershipAwards'
import Languages from '@/components/sections/Languages'
import Certifications from '@/components/sections/Certifications'

/** Cuerpo de Educación. Lo comparten `/[lang]/education/` y `/education/`. */
export default function EducationPage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-8 pt-28">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
        {dict.education.pageTitle}
      </h1>
      <Education data={dict.education} />
      <LeadershipAwards data={dict.leadership} />
      <Languages data={dict.languages} />
      <Certifications data={dict.certifications} />
    </main>
  )
}
