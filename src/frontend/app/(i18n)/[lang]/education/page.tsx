import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import EducationPage from '@/components/pages/EducationPage'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return buildPageMetadata('/education', params.lang, dict.meta.description)
}

export default async function Page({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  return <EducationPage dict={dict} />
}
