interface SectionTitleProps {
  children: React.ReactNode
  /** `'load'` para lo que está sobre el pliegue: entra al pintar, sin pasar por
   *  el observador ni esperar a la hidratación. `'none'` para contextos sin
   *  movimiento, como el panel del CMS, donde no hay que emitir ningún atributo
   *  de revelado. */
  reveal?: 'scroll' | 'load' | 'none'
  /** `'eyebrow'`: rótulo mono en azul de acento, sin filete debajo. Firma de
   *  "trayectoria de espina" (Experience, Volunteering, Skills). Ver DESIGN.md
   *  § Signature: trayectoria de espina. */
  variant?: 'default' | 'eyebrow'
}

export default function SectionTitle({ children, reveal = 'scroll', variant = 'default' }: SectionTitleProps) {
  const revealAttrs = {
    'data-reveal': reveal === 'scroll' ? '' : undefined,
    'data-reveal-load': reveal === 'load' ? '' : undefined,
  }

  if (variant === 'eyebrow') {
    return (
      <span className="block text-[13px] font-mono tracking-[0.16em] uppercase text-accent" {...revealAttrs}>
        {children}
      </span>
    )
  }

  return (
    <div className="mb-6" {...revealAttrs}>
      <h2 className="text-base font-mono font-bold tracking-widest uppercase text-foreground mb-2">
        {children}
      </h2>
      {/* El filete se dibuja de izquierda a derecha al revelarse. Es el gesto
          firma del sistema: el rótulo mono sobre filete de un píxel. */}
      <div data-reveal-rule={reveal === 'none' ? undefined : ''} className="h-px bg-border" />
    </div>
  )
}
