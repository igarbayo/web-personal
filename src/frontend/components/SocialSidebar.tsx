import type { HeaderData } from '@/lib/types'

interface SocialSidebarProps {
  data: HeaderData
}

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const DevpostIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.002 1.61L0 12.004 6.002 22.39h11.996L24 12.004 17.998 1.61zm1.593 4.084h3.947c3.605 0 6.276 1.695 6.276 6.31 0 4.436-3.21 6.302-6.456 6.302H7.595zm2.517 2.449v7.714h1.241c2.476 0 3.966-1.102 3.966-3.883 0-2.62-1.243-3.831-3.966-3.831z" />
  </svg>
)

export default function SocialSidebar({ data }: SocialSidebarProps) {
  const links = [
    { href: `mailto:${data.email}`, label: data.email, Icon: EmailIcon },
    { href: data.linkedin, label: 'linkedin.com/in/ignaciogarbayo', Icon: LinkedInIcon, external: true },
    { href: data.github, label: 'github.com/igarbayo', Icon: GitHubIcon, external: true },
    { href: data.devpost, label: 'devpost.com/igarbayo', Icon: DevpostIcon, external: true },
  ]

  return (
    <>
      {/* Desktop: fixed vertical sidebar */}
      <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-0">
        <div className="w-px h-12 bg-border" />
        <div className="flex flex-col items-center gap-4 py-4">
          {links.map(({ href, label, Icon, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group relative text-muted hover:text-accent transition-colors p-1"
              aria-label={label}
            >
              <Icon />
              <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </a>
          ))}
        </div>
        <div className="w-px h-12 bg-border" />
      </aside>

      {/* Mobile: horizontal row in footer */}
      <div id="social-footer-mobile" className="xl:hidden flex justify-center gap-6 mb-4">
        {links.map(({ href, label, Icon, external }) => (
          <a
            key={href}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="text-muted hover:text-accent transition-colors p-1"
            aria-label={label}
          >
            <Icon />
          </a>
        ))}
      </div>
    </>
  )
}
