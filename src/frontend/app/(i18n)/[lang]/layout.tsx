import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionaries'
import SiteShell from '@/components/SiteShell'

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return {
    metadataBase: new URL('https://ignaciogarbayo.com'),
    title: 'Ignacio Garbayo Fernández',
    description: dict.meta.description,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    // Sin `openGraph` ni `alternates` aquí a propósito: los define cada página
    // vía `buildPageMetadata`, para que `og:url` y el canonical apunten a la
    // página concreta y no a la home del idioma.
    twitter: {
      card: 'summary',
      title: 'Ignacio Garbayo Fernández',
      description: dict.meta.description,
      images: ['/me-movil-compressed.png'],
    },
  }
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }, { lang: 'gl' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { lang: string }
}) {
  const dict = await getDictionary(params.lang)

  return (
    <SiteShell lang={params.lang} dict={dict}>
      {children}
    </SiteShell>
  )
}
