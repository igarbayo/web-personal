interface SectionTitleProps {
  children: React.ReactNode
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-mono font-bold tracking-widest uppercase text-foreground mb-2">
        {children}
      </h2>
      <div className="h-px bg-border" />
    </div>
  )
}
