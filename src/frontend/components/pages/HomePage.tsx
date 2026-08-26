'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Dictionary } from '@/lib/types'
import { renderText } from '@/lib/renderText'

/**
 * Portada, réplica del diseño 1a de referencia (sin la píldora "Open to
 * internships", la etiqueta de ubicación sobre la foto ni la lista de
 * puestos recientes, que no pidió el encargo). Sustituye a `Header`/
 * `Summary`: aquí el nombre y el resumen viven en una sola composición de
 * dos columnas, no en secciones independientes con su propio rótulo. Ese
 * contenido es el mismo de los diccionarios, no texto nuevo.
 */
export default function HomePage({ dict }: { dict: Dictionary }) {
  const [first, ...restWords] = dict.header.name.split(' ')
  const last = restWords.pop()
  // Estado en vez de `group-hover`: el CSS puro no estaba disparando nada
  // (a saber por qué en el entorno donde se probó), así que el hover pasa
  // por `onMouseEnter`/`onMouseLeave`, fácil de verificar sin depender de
  // que la cascada de `:hover` resuelva como se espera. Se reutiliza para
  // acentuar el giro de la foto al pasar el ratón.
  const [hovering, setHovering] = useState(false)

  return (
    <main className="max-w-5xl w-full mx-auto px-6 sm:px-3 pt-24 pb-16 sm:py-20 flex-1 flex flex-col">
      <div className="my-auto grid grid-cols-1 sm:grid-cols-[1.7fr_1fr] gap-10 sm:gap-0 items-stretch">
        {/* Sobre el pliegue: una sola unidad de revelado, como antes hacía
            `Header` con el nombre y el resumen juntos. */}
        <div className="sm:pr-12 flex flex-col justify-center" data-reveal-load>
          <span className="font-mono text-[13px] tracking-[0.14em] uppercase text-accent">
            {dict.header.title}
          </span>
          <h1 className="mt-4 font-archivo font-bold tracking-[-0.01em] text-[44px] sm:text-[64px] leading-[0.95] text-foreground">
            {first}
            <br />
            {restWords.join(' ')}{restWords.length > 0 ? ' ' : ''}
            <span className="text-accent">{last}</span>
          </h1>

          <p className="max-w-[600px] mt-8 text-base leading-relaxed text-foreground">
            {renderText(dict.summary.content)}
          </p>
        </div>

        {/* Foto como una copia analógica: marco blanco grueso, ligeramente
            torcida, con la sombra de estar apoyada sobre el papel. El giro
            se acentúa un poco más al pasar el ratón. */}
        <div className="relative flex items-center justify-center p-2 sm:p-10">
          <div
            className="relative w-full max-w-[560px] sm:max-w-[720px] bg-white p-2.5 pb-9 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${hovering ? 4.5 : 1.5}deg)` }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <Image
              src="/me-movil.webp"
              alt={dict.header.name}
              width={943}
              height={943}
              priority
              className="block sm:hidden w-full h-auto object-cover"
            />
            <Image
              src="/me.webp"
              alt={dict.header.name}
              width={1044}
              height={1507}
              priority
              className="hidden sm:block w-full h-auto object-cover"
            />
            {/* Pie tipo anotación a mano en el margen blanco. Color fijo y no
                `text-muted`: este fondo es blanco siempre, en los dos temas,
                así que el texto tampoco puede invertirse con el tema. */}
            <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-xs tracking-wide text-neutral-500">
              HACKUPC 2026
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
