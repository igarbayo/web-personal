import type { ReactNode } from 'react'
import { Public_Sans, IBM_Plex_Mono } from 'next/font/google'
import ThemeSync from '@/components/ThemeSync'
import '@/app/globals.css'

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
})

export const metadata = {
  title: 'Ignacio Garbayo | CMS Panel',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${publicSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
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
        {children}
      </body>
    </html>
  )
}
