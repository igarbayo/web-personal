import type { ReactNode } from 'react'
import type { Metadata } from 'next'

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const description =
  'Software Engineer with a dual foundation in Computer Engineering and Mathematics.'

export const metadata: Metadata = {
  metadataBase: new URL('https://igarbayo.github.io'),
  title: 'Ignacio Garbayo Fernández',
  description,
  icons: {
    icon: [
      { url: `${base}/favicon.ico`, sizes: 'any' },
      { url: `${base}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${base}/favicon-96x96.png`, sizes: '96x96', type: 'image/png' },
    ],
    apple: `${base}/apple-touch-icon.png`,
  },
  manifest: `${base}/site.webmanifest`,
  openGraph: {
    title: 'Ignacio Garbayo Fernández',
    description,
    type: 'profile',
    siteName: 'Ignacio Garbayo Fernández',
    url: `${base}/`,
    images: [
      {
        url: `${base}/me-movil-compressed.png`,
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
    images: [`${base}/me-movil-compressed.png`],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
