import { getSkillIcon } from '@/lib/skillIcons'

interface SkillBadgeProps {
  label: string
}

export default function SkillBadge({ label }: SkillBadgeProps) {
  const Icon = getSkillIcon(label)
  return (
    <span className="inline-flex items-center gap-1 font-mono text-sm px-2 py-0.5 rounded border border-border bg-surface text-foreground hover:border-accent hover:text-accent transition-colors">
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      {label}
    </span>
  )
}
