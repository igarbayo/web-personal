import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import ProjectsPage from '@/components/pages/ProjectsPage'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('en')
  return buildPageMetadata('/projects', 'en', dict.meta.description)
}

export default async function Page() {
  const dict = await getDictionary('en')
  return <ProjectsPage dict={dict} />
}
