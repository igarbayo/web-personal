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
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

/** `size` por defecto 20, el del resto de iconos del sidebar. El footer lo baja
 *  a 16 para que case con el `text-sm` del enlace que lo acompaña. */
export const GitHubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 19 19" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd"/>
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
