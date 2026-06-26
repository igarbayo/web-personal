import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const description =
  'Software Engineer with a dual foundation in Computer Engineering and Mathematics.'

export const metadata: Metadata = {
  metadataBase: new URL('https://igarbayo.github.io'),
  title: 'Ignacio Garbayo Fernández',
  description,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Ignacio Garbayo Fernández',
    description,
    type: 'profile',
    siteName: 'Ignacio Garbayo Fernández',
    url: '/',
    images: [
      {
        url: '/me-movil-compressed.png',
        width: 600,
        height: 600,
        alt: 'Ignacio Garbayo Fernández',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Ignacio Garbayo Fernández',
    description,
    images: ['/me-movil-compressed.png'],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
