interface SectionTitleProps {
  children: React.ReactNode
  number?: string
}

export default function SectionTitle({ children, number }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        {number && (
          <span className="font-mono text-xl font-medium text-accent mr-3">{number}</span>
        )}
        {children}
      </h2>
      <div className="h-px bg-border" />
    </div>
  )
}
