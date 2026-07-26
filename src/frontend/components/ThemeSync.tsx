'use client'

import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

// useLayoutEffect en cliente (aplica antes del paint → sin flash), useEffect en SSR (evita warning).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Re-aplica el tema guardado (localStorage 'theme') en cada cambio de ruta.
 *
 * El tema vive como clase `dark` en <html>, añadida imperativamente por el script
 * inline del <head> y por ThemeToggle. Pero cambiar de idioma es una navegación
 * cliente que re-renderiza <html className={inter.variable}> en el layout y pisa
 * esa clase. Este efecto la restaura en el commit, antes del paint, así que el
 * modo oscuro/claro persiste al cambiar de idioma sin parpadeo.
 */
export default function ThemeSync() {
  const pathname = usePathname()

  useIsomorphicLayoutEffect(() => {
    try {
      const t = localStorage.getItem('theme')
      const dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
  }, [pathname])

  return null
}
