import { getDictionary } from '@/lib/dictionaries'
import Navbar from '@/components/Navbar'
import Experience from '@/components/sections/Experience'
import Skills from '@/components/sections/Skills'
import Volunteering from '@/components/sections/Volunteering'

export default async function ExperiencePage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-4 pt-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          <span className="font-mono text-accent mr-3">2</span>
          {dict.experience.pageTitle}
        </h1>
        <Experience data={dict.experience} number="2.1" />
        <Skills data={dict.skills} number="2.2" />
        <Volunteering data={dict.volunteering} number="2.3" />
      </main>
    </>
  )
}
