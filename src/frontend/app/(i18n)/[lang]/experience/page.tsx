import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import ExperiencePage from '@/components/pages/ExperiencePage'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return buildPageMetadata('/experience', params.lang, dict.meta.description)
}

export default async function Page({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  return <ExperiencePage dict={dict} />
}
