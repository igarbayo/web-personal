import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import type { Dictionary } from '@/lib/types'
import Navbar from '@/components/Navbar'
import SocialSidebar, { GitHubIcon } from '@/components/SocialSidebar'
import ThemeSync from '@/components/ThemeSync'
import '../app/globals.css'

// A nivel de módulo, como exige `next/font`. Al importarse SiteShell desde los
// dos layouts raíz, la instancia sigue siendo única.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

interface SiteShellProps {
  lang: string
  dict: Dictionary
  children: ReactNode
  /** Se inyecta al final del `<head>`. Lo usa el grupo (default) para el script
   *  bloqueante de detección de idioma. */
  headExtra?: ReactNode
}

/**
 * `<html>` + `<head>` + `<body>` del sitio. Vive aquí y no en un layout porque
 * hay **dos layouts raíz** —`(default)` para las rutas sin prefijo y `(i18n)`
 * para las prefijadas por idioma— y ambos necesitan exactamente el mismo shell
 * con distinto `lang`.
 */
export default function SiteShell({ lang, dict, children, headExtra }: SiteShellProps) {
  return (
    <html lang={lang} className={inter.variable} suppressHydrationWarning>
      {/* `no-head-element` es una regla del Pages Router, donde había que usar
          `next/head`. En App Router el layout raíz renderiza `<head>` de forma
          nativa, que es justo lo que se hace aquí. La regla no saltaba mientras
          este JSX vivía dentro de `app/`; al extraerlo a `components/` sí. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta name="color-scheme" content="light dark" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        {headExtra}
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <ThemeSync />
        <Navbar dict={dict} lang={lang} />
        {children}
        <footer className="border-t border-border mt-auto py-6">
          <SocialSidebar data={dict.header} />
          {/* En móvil, una línea debajo de la otra; en escritorio, ambas en la
              misma línea separadas por una barra vertical. */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-3">
            <p className="text-center text-sm text-muted font-mono">
              Ignacio Garbayo Fernández © 2026
            </p>
            <span aria-hidden="true" className="hidden md:inline text-sm text-muted">
              |
            </span>
            {/* Va en el footer y no en SocialSidebar: en xl+ la fila de iconos
                lleva `xl:hidden` (pasa a ser barra lateral fija), así que un
                enlace ahí no se vería en escritorio. */}
            <p className="mt-2 md:mt-0 text-center">
              <a
                href="https://github.com/igarbayo/web-personal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors"
              >
                <GitHubIcon size={16} />
                {dict.footer.repo}
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
