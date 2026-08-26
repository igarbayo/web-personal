import Link from 'next/link'
import { getDictionary } from '@/lib/dictionaries'
import SiteShell from '@/components/SiteShell'
import { SUBPATHS } from '@/lib/seo'

const LABELS: Record<string, string> = {
  '': 'Home',
  '/experience': 'Experience',
  '/education': 'Education',
  '/projects': 'Projects',
}

/**
 * `out/404.html`, que GitHub Pages sirve ante cualquier ruta desconocida.
 *
 * Tiene que estar en la raíz de `app/`: una not-found dentro de un route group
 * no alimenta el `out/404.html` del export estático — ahí Next emite su 404
 * genérica, comprobado. Y como el layout raíz es una pasarela que no renderiza
 * `<html>`, esta página monta su propio shell.
 *
 * No lleva el script de detección de idioma a propósito: `404.html` se sirve
 * también para rutas que ya llevan prefijo (`/es/loquesea`), y volver a
 * prefijar daría un bucle infinito.
 */
export default async function NotFound() {
  const dict = await getDictionary('en')

  return (
    <SiteShell lang="en" dict={dict}>
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-16 pt-28 flex-1 flex flex-col justify-center">
        <span className="font-mono text-[13px] tracking-[0.16em] uppercase text-accent" data-reveal-load>
          Error
        </span>
        {/* El cursor es el mismo de la marca del nav (`Navbar.tsx`), heredando
            el tamaño de letra de este titular en vez de repetir sus valores
            en píxeles: por eso escala tan grande sin desentonar. */}
        <h1 className="mt-3 font-archivo font-black tracking-[-0.02em] text-[100px] sm:text-[150px] leading-none text-foreground" data-reveal-load>
          404
          <span aria-hidden="true" className="inline-block w-[0.18ch] h-[0.92em] bg-accent rounded-[1px] ml-3 align-[-0.1em] animate-blink" />
        </h1>
        <p className="mt-6 text-base text-foreground leading-relaxed">
          That URL doesn&apos;t exist. Try one of these instead:
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {SUBPATHS.map((subpath) => (
            <Link
              key={subpath}
              href={`/en${subpath}/`}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-accent text-accent hover:bg-accent hover:text-white hover:scale-105 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5" />
              </svg>
              {LABELS[subpath]}
            </Link>
          ))}
        </div>
      </main>
    </SiteShell>
  )
}
