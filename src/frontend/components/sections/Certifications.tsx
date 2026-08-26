import Image from 'next/image'
import type { CertificationsData, CertificationEntry } from '@/lib/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { getImageDimensions } from '@/lib/imageDimensions'
import { renderText } from '@/lib/renderText'

interface CertificationsProps {
  data: CertificationsData
}

/**
 * Tarjeta compacta, sin viñetas: solo logo, título, emisor y fecha. Réplica
 * del diseño 6a — a diferencia del resto de entradas del sitio, esta no pasa
 * por `TimelineEntry`, porque su rejilla de dos columnas y su ausencia total
 * de cuerpo no encajan en ese componente. Ver DESIGN.md § Signature:
 * trayectoria de espina.
 */
function CourseCard({ entry }: { entry: CertificationEntry }) {
  const logoSrc = entry.logo?.[0]
  const { width, height } = logoSrc ? getImageDimensions(logoSrc) : { width: 0, height: 0 }

  return (
    <div className="grid grid-cols-[54px_1fr_auto] gap-4 items-center p-[18px_20px] bg-surface border border-border rounded-[14px] shadow-[0_14px_30px_-26px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-accent/50">
      <div className="w-[54px] h-[54px] rounded-xl bg-white border border-border flex items-center justify-center overflow-hidden shrink-0">
        {logoSrc ? (
          // McKinsey lleva más recorte que el resto: su isotipo se lee bien
          // incluso pegado al borde redondeado, y a este tamaño un logo con
          // margen se ve más pequeño que los demás.
          <Image
            src={`/${logoSrc}`}
            alt=""
            width={width}
            height={height}
            className={logoSrc === 'mckinsey.webp' ? 'w-full h-full object-cover' : 'w-full h-full object-contain p-1'}
          />
        ) : (
          <span className="font-archivo font-extrabold text-lg text-muted">{entry.title.charAt(0)}</span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-archivo font-bold tracking-[-0.015em] text-[16.5px] leading-[1.15] text-foreground">
          {renderText(entry.title)}
        </h3>
        <div className="font-mono text-[12.5px] text-accent mt-1">
          {renderText(entry.issuer)}
        </div>
      </div>
      <span className="font-mono text-xs text-muted whitespace-nowrap self-start">{entry.date}</span>
    </div>
  )
}

export default function Certifications({ data }: CertificationsProps) {
  return (
    <section id="certifications" className="py-8 scroll-mt-20">
      <div className="mb-6">
        <SectionTitle variant="eyebrow">{data.title}</SectionTitle>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" data-reveal-group>
        {data.entries.map((entry, i) => (
          <div key={i} data-reveal>
            <CourseCard entry={entry} />
          </div>
        ))}
      </div>
    </section>
  )
}
