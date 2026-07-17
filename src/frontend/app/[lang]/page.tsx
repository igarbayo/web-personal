import { getDictionary } from '@/lib/dictionaries'
import Navbar from '@/components/Navbar'
import Header from '@/components/sections/Header'
import Summary from '@/components/sections/Summary'

export default async function CVPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang)

  return (
    <>
      <Navbar dict={dict} lang={params.lang} />
      <main className="max-w-5xl mx-auto px-6 sm:px-3 pb-16 pt-28">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 sm:items-center">
          <figure className="shrink-0">
            <img
              src="/me-movil.webp"
              alt={dict.header.name}
              className="block sm:hidden w-full object-cover border border-border"
            />
            <img
              src="/me.webp"
              alt={dict.header.name}
              className="hidden sm:block w-96 object-cover border border-border"
            />
            <figcaption className="font-mono text-xs text-muted mt-2 text-center sm:text-left">
              {dict.header.photoCaption}
            </figcaption>
          </figure>
          <div className="flex-1 min-w-0">
            <Header data={dict.header} />
            <Summary data={dict.summary} />
          </div>
        </div>
      </main>
    </>
  )
}
