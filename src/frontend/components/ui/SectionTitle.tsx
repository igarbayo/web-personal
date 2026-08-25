interface SectionTitleProps {
  children: React.ReactNode
  /** `'load'` para lo que está sobre el pliegue: entra al pintar, sin pasar por
   *  el observador ni esperar a la hidratación. `'none'` para contextos sin
   *  movimiento, como el panel del CMS, donde no hay que emitir ningún atributo
   *  de revelado. */
  reveal?: 'scroll' | 'load' | 'none'
}

export default function SectionTitle({ children, reveal = 'scroll' }: SectionTitleProps) {
  return (
    <div
      className="mb-6"
      data-reveal={reveal === 'scroll' ? '' : undefined}
      data-reveal-load={reveal === 'load' ? '' : undefined}
    >
      <h2 className="text-base font-mono font-bold tracking-widest uppercase text-foreground mb-2">
        {children}
      </h2>
      {/* El filete se dibuja de izquierda a derecha al revelarse. Es el gesto
          firma del sistema: el rótulo mono sobre filete de un píxel. */}
      <div data-reveal-rule={reveal === 'none' ? undefined : ''} className="h-px bg-border" />
    </div>
  )
}
