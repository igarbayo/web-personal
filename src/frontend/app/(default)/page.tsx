import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import { buildPageMetadata } from '@/lib/seo'
import HomePage from '@/components/pages/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('en')
  return buildPageMetadata('', 'en', dict.meta.description)
}

export default async function Page() {
  const dict = await getDictionary('en')
  return <HomePage dict={dict} />
}
