import type { SummaryData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'

interface SummaryProps {
  data: SummaryData
}

export default function Summary({ data }: SummaryProps) {
  return (
    // El resumen está sobre el pliegue: entra al pintar y no pasa por el
    // observador. Con `Header`, deja la portada sin un solo elemento observado,
    // así que es CSS puro y no espera a la hidratación.
    <section
      id="summary"
      className="py-8 scroll-mt-20"
      data-reveal-group
      style={{ '--reveal-delay-base': '140ms' } as React.CSSProperties}
    >
      <SectionTitle reveal="load">{data.title}</SectionTitle>
      <p data-reveal-load className="text-base text-foreground leading-relaxed">
        {data.content}
      </p>
    </section>
  )
}
