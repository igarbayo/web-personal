import type { SkillsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import SkillBadge from '@/components/ui/SkillBadge'

interface SkillsProps {
  data: SkillsData
}

export default function Skills({ data }: SkillsProps) {
  return (
    <section id="skills" className="py-8 scroll-mt-20">
      {/* Mismo rótulo eyebrow que Experience y Volunteering, ver DESIGN.md
          § Signature: trayectoria de espina. */}
      <div className="mb-6">
        <SectionTitle variant="eyebrow">{data.title}</SectionTitle>
      </div>
      {/* Se revela el bloque de cada categoría, no cada insignia: cuarenta
          insignias escalonadas una a una no serían sutiles. */}
      <div className="space-y-4" data-reveal-group>
        {data.categories.map((cat) => (
          <div key={cat.name} className="space-y-1.5" data-reveal>
            <span className="text-xs font-mono tracking-[0.12em] text-muted uppercase">
              {cat.name}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <SkillBadge key={item} label={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
