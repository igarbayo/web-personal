import type { SummaryData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'

interface SummaryProps {
  data: SummaryData
}

export default function Summary({ data }: SummaryProps) {
  return (
    <section id="summary" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <p className="text-base text-foreground leading-relaxed">{data.content}</p>
    </section>
  )
}
