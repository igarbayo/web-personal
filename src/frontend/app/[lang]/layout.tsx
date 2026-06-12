import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getDictionary } from '@/lib/dictionaries'
import SocialSidebar from '@/components/SocialSidebar'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
  const dict = await getDictionary(params.lang)
  return {
    metadataBase: new URL('https://igarbayo.github.io'),
    title: 'Ignacio Garbayo Fernández',
    description: dict.meta.description,
    icons: {
      icon: [
        { url: `${base}/favicon.ico`, sizes: 'any' },
        { url: `${base}/favicon.svg`, type: 'image/svg+xml' },
        { url: `${base}/favicon-96x96.png`, sizes: '96x96', type: 'image/png' },
      ],
      apple: `${base}/apple-touch-icon.png`,
    },
    manifest: `${base}/site.webmanifest`,
    openGraph: {
      title: 'Ignacio Garbayo Fernández',
      description: dict.meta.description,
      type: 'profile',
      siteName: 'Ignacio Garbayo Fernández',
      url: `${base}/${params.lang}`,
      images: [
        {
          url: `${base}/me-movil-compressed.png`,
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
      images: [`${base}/me-movil-compressed.png`],
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
    <html lang={params.lang} className={inter.variable}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <footer className="border-t border-border mt-8 py-6">
          <SocialSidebar data={dict.header} />
          <p className="text-center text-sm text-muted font-mono">
            Ignacio Garbayo Fernández © 2026
          </p>
        </footer>
      </body>
    </html>
  )
}
