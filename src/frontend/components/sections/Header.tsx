import type { HeaderData } from '@/lib/types'

interface HeaderProps {
  data: HeaderData
}

export default function Header({ data }: HeaderProps) {
  return (
    <header className="pb-4 mb-2">
      <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-1 leading-tight fade-up">
        <span className="block">{data.name.split(' ')[0]}</span>
        <span className="block">
          {data.name.split(' ')[1]}
          <span className="text-accent">_</span>
          <br className="lg:hidden" />
          {data.name.split(' ')[2]}
        </span>
      </h1>
      <p className="text-xl text-muted mt-3 fade-up-delay-1">{data.title}</p>
    </header>
  )
}
