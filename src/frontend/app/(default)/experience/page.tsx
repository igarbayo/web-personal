import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import ExperiencePage from '@/components/pages/ExperiencePage'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('en')
  return buildPageMetadata('/experience', 'en', dict.meta.description)
}

export default async function Page() {
  const dict = await getDictionary('en')
  return <ExperiencePage dict={dict} />
}
