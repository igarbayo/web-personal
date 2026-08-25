import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import ThemeSync from '@/components/ThemeSync'
import '@/app/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="es" className={inter.variable} suppressHydrationWarning>
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
