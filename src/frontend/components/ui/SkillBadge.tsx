import { getSkillIcon } from '@/lib/skillIcons'

interface SkillBadgeProps {
  label: string
}

export default function SkillBadge({ label }: SkillBadgeProps) {
  const Icon = getSkillIcon(label)
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-foreground hover:text-accent transition-colors">
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      {label}
    </span>
  )
}
