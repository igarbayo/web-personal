import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { STIX_Two_Text, JetBrains_Mono } from 'next/font/google'
import { getDictionary } from '@/lib/dictionaries'
import SocialSidebar from '@/components/SocialSidebar'
import '../globals.css'

const stix = STIX_Two_Text({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
})

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang)
  return {
    metadataBase: new URL('https://igarbayo.github.io'),
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
    openGraph: {
      title: 'Ignacio Garbayo Fernández',
      description: dict.meta.description,
      type: 'profile',
      siteName: 'Ignacio Garbayo Fernández',
      url: `/${params.lang}`,
      images: [
        {
          url: '/me-movil-compressed.png',
          width: 600,
          height: 600,
          alt: 'Ignacio Garbayo Fernández',
        },
      ],
    },
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
    <html lang={params.lang} className={`${stix.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground font-serif antialiased">
        {children}
        <footer className="border-t border-border mt-8 py-6">
          <SocialSidebar data={dict.header} />
          <p className="text-center text-sm text-muted font-mono">
            {dict.labels.lastRevised} · Ignacio Garbayo Fernández © 2026
          </p>
        </footer>
      </body>
    </html>
  )
}
