import type { SkillsData } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import SkillBadge from '@/components/ui/SkillBadge'

interface SkillsProps {
  data: SkillsData
}

export default function Skills({ data }: SkillsProps) {
  return (
    <section id="skills" className="py-8 scroll-mt-20">
      <SectionTitle>{data.title}</SectionTitle>
      <div className="space-y-4">
        {data.categories.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <span className="text-sm font-semibold text-muted uppercase tracking-wider">
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
