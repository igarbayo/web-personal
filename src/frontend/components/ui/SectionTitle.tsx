interface SectionTitleProps {
  children: React.ReactNode
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
        <span className="font-mono text-accent mr-2.5" aria-hidden="true">//</span>
        {children}
      </h2>
      <div className="h-px bg-border" />
    </div>
  )
}
