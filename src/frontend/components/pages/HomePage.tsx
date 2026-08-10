import Image from 'next/image'
import type { Dictionary } from '@/lib/types'
import Header from '@/components/sections/Header'
import Summary from '@/components/sections/Summary'

/** Cuerpo de la home. Lo comparten `/[lang]/` y la ruta sin prefijo `/`. */
export default function HomePage({ dict }: { dict: Dictionary }) {
  return (
    <main className="max-w-5xl w-full mx-auto px-6 sm:px-3 py-28 flex-1 flex flex-col">
      <div className="my-auto flex flex-col sm:flex-row gap-6 sm:gap-12 sm:items-center">
        <Image
          src="/me-movil.webp"
          alt={dict.header.name}
          width={943}
          height={943}
          priority
          className="block sm:hidden w-full h-auto rounded-xl object-cover border border-border shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
        />
        <Image
          src="/me.webp"
          alt={dict.header.name}
          width={1044}
          height={1507}
          priority
          className="hidden sm:block w-96 h-auto shrink-0 rounded-xl object-cover border border-border shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
        />
        <div className="flex-1 min-w-0">
          <Header data={dict.header} />
          <Summary data={dict.summary} />
        </div>
      </div>
    </main>
  )
}
