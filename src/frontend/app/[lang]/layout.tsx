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
  const dict = await getDictionary(params.lang)
  return {
    title: 'Ignacio Garbayo Fernández',
    description: dict.meta.description,
    openGraph: {
      title: 'Ignacio Garbayo Fernández',
      description: dict.meta.description,
      type: 'profile',
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
            © 2026 Ignacio Garbayo Fernández
          </p>
        </footer>
      </body>
    </html>
  )
}
