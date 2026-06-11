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
  timeline = true,
}: TimelineEntryProps) {
  const hasBody = (bullets && bullets.length > 0) || !!description || !!note

  const card = (
    <div className="rounded-xl border border-border bg-white p-5 transition-colors hover:border-accent/20">

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
              <span className="text-sm text-muted shrink-0">{date}</span>
            )}
          </div>
          {subtitle && (
            <span className="text-sm text-accent mt-0.5 block">
              {renderText(subtitle)}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      {hasBody && <div className="h-px bg-border my-4" />}

      {/* Bullets */}
      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-base text-foreground leading-relaxed flex gap-2 items-baseline">
              <span className="text-muted shrink-0">·</span>
              <span>{renderText(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Description */}
      {description && (
        <p className="text-base text-foreground leading-relaxed">
          {renderText(description)}
        </p>
      )}

      {/* Note */}
      {note && (
        <p className="text-sm text-muted mt-3 font-mono italic">
          {renderText(note)}
        </p>
      )}

      {/* Links */}
      {links && links.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-lg border border-border text-accent hover:bg-accent hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 9.5L9.5 2.5M5 2.5h4.5v4.5"/>
              </svg>
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Images */}
      {images && images.length > 0 && (
        images.length === 5 ? (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 mt-4">
            {images.slice(0, 3).map((src) => (
              <img key={src} src={src} alt="" className="sm:col-span-2 w-full h-64 rounded-lg object-cover" />
            ))}
            {images.slice(3).map((src) => (
              <img key={src} src={src} alt="" className="sm:col-span-3 w-full h-64 rounded-lg object-cover" />
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-2 mt-4 ${images.length === 2 ? 'sm:grid-cols-2' : images.length >= 3 ? 'sm:grid-cols-3' : ''}`}>
            {images.map((src) => (
              <img key={src} src={src} alt="" className="w-full h-64 rounded-lg object-cover" />
            ))}
          </div>
        )
      )}

    </div>
  )

  if (!timeline) {
    return <div className="mb-4 last:mb-0">{card}</div>
  }

  return (
    <div className="relative flex gap-5 pb-8 last:pb-0">

      {/* Left: date */}
      <div className="hidden sm:block w-28 shrink-0 text-right pt-2">
        <span className="text-sm text-muted font-mono leading-snug whitespace-pre-line">
          {date.replace(' – ', '\n')}
        </span>
      </div>

      {/* Timeline: dot + line */}
      <div className="hidden sm:flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full border-2 border-accent bg-background mt-2 shrink-0 z-10" />
        <div className="flex-1 w-px bg-border mt-1" />
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0">
        <span className="sm:hidden block text-xs text-muted mb-2">{date}</span>
        {card}
      </div>
    </div>
  )
}
