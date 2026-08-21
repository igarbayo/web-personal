import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import type { Dictionary } from '@/lib/types'
import Navbar from '@/components/Navbar'
import SocialSidebar, { GitHubIcon } from '@/components/SocialSidebar'
import ThemeSync from '@/components/ThemeSync'
import ScrollReveal from '@/components/ScrollReveal'
import { buildPersonJsonLd, serializeJsonLd } from '@/lib/seo'
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
    // `suppressHydrationWarning` cubre las dos marcas que se ponen en <html>
    // desde scripts del <head> antes de hidratar: la clase `dark` del tema y
    // `data-motion` del revelado. Quitarlo llena la consola de avisos.
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
        {/* Marcador de movimiento. Bloqueante y en el <head> por el mismo
            motivo que el script del tema: tiene que correr ANTES del primer
            pintado. Puesto desde un efecto, el contenido pintaría visible,
            saltaría a oculto al hidratar y solo entonces entraría — justo el
            parpadeo que se quiere evitar. No hace nada más que poner un
            atributo; el observador y el recorrido del DOM viven en
            ScrollReveal, que carga con normalidad.
            El plazo de 2,5 s es la red de seguridad: si el bundle no llega
            (fallo de red, extensión, excepción) el marcador se retira y el
            contenido aparece. Sin él, «el contenido depende del JavaScript»
            pasaría de ser falso a ser cierto. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(!('IntersectionObserver' in window))return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-motion','on');setTimeout(function(){if(!d.dataset.motionReady)d.removeAttribute('data-motion')},2500);}catch(e){}})();`,
          }}
        />
        {/* Datos estructurados. Va aquí y no en `metadata` porque Next no
            expone JSON-LD en la API de metadata; la propia documentación
            recomienda renderizarlo como <script> en el layout. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildPersonJsonLd(dict, lang)) }}
        />
        {headExtra}
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col">
        <ThemeSync />
        <ScrollReveal />
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
