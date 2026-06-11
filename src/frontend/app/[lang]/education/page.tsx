import { getDictionary } from '@/lib/dictionaries'
import Navbar from '@/components/Navbar'
import Education from '@/components/sections/Education'
import LeadershipAwards from '@/components/sections/LeadershipAwards'
import Languages from '@/components/sections/Languages'
import Certifications from '@/components/sections/Certifications'

export default async function EducationPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-24 pt-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
          {dict.education.pageTitle}
        </h1>
        <Education data={dict.education} />
        <LeadershipAwards data={dict.leadership} />
        <Languages data={dict.languages} />
        <Certifications data={dict.certifications} />
      </main>
    </>
  )
}
