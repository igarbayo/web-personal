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
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-8 pt-28 flex-1">
        <p className="text-sm font-mono text-muted">404</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mt-2 mb-4">
          Page not found
        </h1>
        <p className="text-base text-foreground leading-relaxed mb-8">
          That URL doesn&apos;t exist. Try one of these instead:
        </p>
        <ul className="space-y-1.5">
          {SUBPATHS.map((subpath) => (
            <li key={subpath} className="flex gap-[0.6875rem] items-baseline">
              <span className="text-accent text-lg leading-none shrink-0">•</span>
              <Link href={`/en${subpath}/`} className="text-accent hover:underline">
                {LABELS[subpath]}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </SiteShell>
  )
}
