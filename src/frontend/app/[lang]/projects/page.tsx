import { getDictionary } from '@/lib/dictionaries'
import Navbar from '@/components/Navbar'
import ProjectsCompetitions from '@/components/sections/ProjectsCompetitions'

export default async function ProjectsPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-4 pt-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          {dict.projects.pageTitle}
        </h1>
        <ProjectsCompetitions data={dict.projects} />
      </main>
    </>
  )
}
