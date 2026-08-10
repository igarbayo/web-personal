import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import ProjectsPage from '@/components/pages/ProjectsPage'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return buildPageMetadata('/projects', params.lang, dict.meta.description)
}

export default async function Page({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  return <ProjectsPage dict={dict} />
}
