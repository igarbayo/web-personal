import type { ExperienceData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import TimelineEntry from '@/components/ui/TimelineEntry'

interface ExperienceProps {
  data: ExperienceData
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <section id="experience" className="py-8 scroll-mt-20">
      <SectionTitle reveal="load" variant="eyebrow">{data.title}</SectionTitle>
      <h1 className="break-words mt-3.5 mb-9 font-archivo font-bold tracking-[-0.01em] text-[40px] sm:text-[68px] leading-[0.98] text-foreground" data-reveal-load>
        {data.pageTitle}
      </h1>
      <div data-reveal-group>
        {data.entries.map((entry, i) => (
          <TimelineEntry
            key={i}
            date={entry.date}
            title={entry.title}
            subtitle={entry.company}
            bullets={entry.bullets}
            note={entry.note}
            logo={entry.logo}
            logoDark={entry.logoDark}
            logoBoxed={!entry.logoDark}
            links={entry.links}
            images={entry.images}
            priorityImages={i === 0 ? 2 : 0}
            numbered
            index={i}
            last={i === data.entries.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
