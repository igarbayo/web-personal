'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** Margen inferior negativo: un elemento no se revela por asomar un píxel, sino
 *  cuando ha entrado de verdad. */
const ROOT_MARGIN = '0px 0px -12% 0px'

/**
 * Revelado al entrar en pantalla. Una sola pasada: cuando un elemento entra se
 * le pone `data-revealed` y se deja de observar.
 *
 * Deliberadamente no decide nada visual. Todo el movimiento vive en
 * `globals.css`, gobernado por `data-motion` en <html> —que pone el script
 * bloqueante del <head>, antes del primer pintado— y por `data-revealed` en
 * cada unidad. Aquí solo está el «cuándo».
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  // useEffect y no useLayoutEffect, justo al revés que ThemeSync. Next restaura
  // el scroll en un efecto de layout; observar antes mediría las intersecciones
  // contra la posición de la página anterior y dispararía media página de golpe
  // al navegar de una larga a una corta.
  useEffect(() => {
    const root = document.documentElement

    // Desactiva el plazo de seguridad del <head>: el bundle ha llegado.
    root.dataset.motionReady = '1'

    // Si el plazo venció antes, el marcador ya no está y el contenido está
    // visible sin estado inicial. Revelar ahora sería un parpadeo. Nos vamos, y
    // no se vuelve a armar en toda la sesión: fallar hacia «todo visible» es el
    // lado seguro.
    if (root.dataset.motion !== 'on') return
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = ''
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: ROOT_MARGIN,
        // threshold 0 y no un porcentaje: una tarjeta con galería puede ser más
        // alta que la ventana, y entonces una proporción mínima no se alcanza
        // NUNCA. Sería contenido invisible para siempre.
        threshold: 0,
      }
    )

    // `:not([data-revealed])` para que una renavegación no vuelva a observar lo
    // que ya salió.
    document
      .querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')
      .forEach((el) => observer.observe(el))

    // Red de accesibilidad: si el foco de teclado aterriza en un enlace de una
    // sección todavía oculta, se revela sin esperar al observador.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      const unit = target?.closest<HTMLElement>('[data-reveal]')
      if (!unit || unit.dataset.revealed !== undefined) return
      unit.dataset.revealed = ''
      observer.unobserve(unit)
    }
    document.addEventListener('focusin', onFocusIn)

    return () => {
      document.removeEventListener('focusin', onFocusIn)
      observer.disconnect()
    }
  }, [pathname])

  return null
}
