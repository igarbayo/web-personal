import { getDictionary } from '@/lib/dictionaries'
import ProjectsCompetitions from '@/components/sections/ProjectsCompetitions'

export default async function ProjectsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <>
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-8 pt-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          {dict.projects.pageTitle}
        </h1>
        <ProjectsCompetitions data={dict.projects} />
      </main>
    </>
  )
}
