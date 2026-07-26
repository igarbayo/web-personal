import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getDictionary } from '@/lib/dictionaries'
import Navbar from '@/components/Navbar'
import SocialSidebar from '@/components/SocialSidebar'
import ThemeSync from '@/components/ThemeSync'
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
    <html lang={params.lang} className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <ThemeSync />
        <Navbar dict={dict} lang={params.lang} />
        {children}
        <footer className="border-t border-border mt-auto py-6">
          <SocialSidebar data={dict.header} />
          <p className="text-center text-sm text-muted font-mono">
            Ignacio Garbayo Fernández © 2026
          </p>
        </footer>
      </body>
    </html>
  )
}
