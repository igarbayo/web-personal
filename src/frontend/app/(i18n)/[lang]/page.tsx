import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import HomePage from '@/components/pages/HomePage'

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return buildPageMetadata('', params.lang, dict.meta.description)
}

export default async function CVPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)
  return <HomePage dict={dict} />
}
