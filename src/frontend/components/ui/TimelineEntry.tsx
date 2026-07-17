import { renderText } from '@/lib/renderText'

interface EntryLink {
  label: string
  url: string
}

interface TimelineEntryProps {
  date: string
  title: string
  subtitle: string
  bullets?: string[]
  description?: string
  note?: string
  logo?: string[]
  links?: EntryLink[]
  images?: string[]
  imagesCaption?: string
  highlightLabel?: string
  timeline?: boolean
}

export default function TimelineEntry({
  date,
  title,
  subtitle,
  bullets,
  description,
  note,
  logo,
  links,
  images,
  imagesCaption,
  highlightLabel,
  timeline = true,
}: TimelineEntryProps) {
  const body = (
    <div className={`relative ${highlightLabel ? 'border border-foreground p-5' : ''}`}>

      {highlightLabel && (
        <span className="block font-mono text-xs [font-variant-caps:small-caps] tracking-widest text-accent mb-3">
          {highlightLabel}
        </span>
      )}

      {/* Header: logo + title + subtitle (+ date when no timeline) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {logo && logo.length > 0 && (
          <div className="flex flex-row flex-wrap sm:flex-col sm:flex-nowrap items-center justify-center gap-3 w-full sm:w-32 shrink-0">
            {logo.map((src) => (
              <img key={src} src={`/${src}`} alt="" className="h-10 sm:h-auto sm:w-full object-contain" />
            ))}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
            <span className="font-bold text-lg text-foreground block leading-snug">
              {renderText(title)}
            </span>
            {!timeline && (
              <span className="text-sm text-muted font-mono shrink-0">{date}</span>
            )}
          </div>
          {subtitle && (
            <span className="text-sm text-muted italic mt-0.5 block">
              {renderText(subtitle)}
            </span>
          )}
        </div>
      </div>

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5 mt-3">
          {bullets.map((b, i) => (
            <li key={i} className="text-base text-foreground leading-relaxed flex gap-[0.6875rem] items-baseline">
              <span className="text-muted shrink-0">•</span>
              <span>{renderText(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Description */}
      {description && (
        <p className="text-base text-foreground leading-relaxed mt-3">
          {renderText(description)}
        </p>
      )}

      {/* Note: red-pen margin note on xl+, inline below */}
      {note && (
        <p className="text-sm text-accent mt-3 font-mono italic 2xl:absolute 2xl:left-full 2xl:ml-10 2xl:top-1 2xl:mt-0 2xl:w-44 2xl:text-xs 2xl:leading-relaxed">
          {renderText(note)}
        </p>
      )}

      {/* Links as references */}
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-accent hover:underline underline-offset-2"
            >
              [{link.label} ↗]
            </a>
          ))}
        </div>
      )}

      {/* Images as figure */}
      {images && images.length > 0 && (
        <figure className="mt-4">
          {images.length === 5 ? (
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              {images.slice(0, 3).map((src) => (
                <img key={src} src={src} alt="" className="sm:col-span-2 w-full h-64 object-cover" />
              ))}
              {images.slice(3).map((src) => (
                <img key={src} src={src} alt="" className="sm:col-span-3 w-full h-64 object-cover" />
              ))}
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-2 ${images.length === 2 ? 'sm:grid-cols-2' : images.length >= 3 ? 'sm:grid-cols-3' : ''}`}>
              {images.map((src) => (
                <img key={src} src={src} alt="" className="w-full h-64 object-cover" />
              ))}
            </div>
          )}
          {imagesCaption && (
            <figcaption className="font-mono text-xs text-muted mt-2">
              {imagesCaption}
            </figcaption>
          )}
        </figure>
      )}

    </div>
  )

  if (!timeline) {
    return (
      <div className="pb-6 mb-6 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
        {body}
      </div>
    )
  }

  return (
    <div className="relative flex gap-5 pb-8 last:pb-0">

      {/* Left: date */}
      <div className="hidden sm:block w-28 shrink-0 text-right pt-1">
        <span className="text-sm text-muted font-mono leading-snug whitespace-pre-line">
          {date.replace(' – ', '\n')}
        </span>
      </div>

      {/* Timeline: dot + line */}
      <div className="hidden sm:flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 z-10" />
        <div className="flex-1 w-px bg-border mt-1" />
      </div>

      {/* Entry body */}
      <div className="flex-1 min-w-0">
        <span className="sm:hidden block text-xs text-muted font-mono mb-2">{date}</span>
        {body}
      </div>
    </div>
  )
}
