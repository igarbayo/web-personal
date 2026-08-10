import type { Metadata } from 'next'

/** Las 4 secciones del sitio, como sufijo de ruta. '' es la home. */
export const SUBPATHS = ['', '/experience', '/education', '/projects'] as const
export const LANGS = ['en', 'es', 'gl'] as const

export const SITE_URL = 'https://ignaciogarbayo.com'
export const SITE_NAME = 'Ignacio Garbayo Fernández'
const OG_IMAGE = '/me-movil-compressed.png'

/**
 * Canonical + hreflang de una página. Las URLs canónicas son siempre las
 * prefijadas por idioma: las rutas sin prefijo (`/`, `/experience/`…) son
 * puertas de entrada que apuntan a su equivalente `/en/…`.
 */
export function buildAlternates(subpath: string, lang: string) {
  return {
    canonical: `/${lang}${subpath}/`,
    languages: {
      en: `/en${subpath}/`,
      es: `/es${subpath}/`,
      gl: `/gl${subpath}/`,
      'x-default': `/en${subpath}/`,
    },
  }
}

/**
 * Metadata por página. Además de los `alternates`, repite el bloque `openGraph`
 * completo con `url` apuntando a la canónica de ESA página.
 *
 * Lo de repetirlo entero no es descuido: Next hace merge **superficial** de la
 * metadata, así que un `openGraph` definido en la página **reemplaza** al del
 * layout en vez de fusionarse. Definir solo `url` dejaría la página sin título,
 * descripción ni imagen en Open Graph.
 */
export function buildPageMetadata(subpath: string, lang: string, description: string): Metadata {
  return {
    alternates: buildAlternates(subpath, lang),
    openGraph: {
      title: SITE_NAME,
      description,
      type: 'profile',
      siteName: SITE_NAME,
      url: `/${lang}${subpath}/`,
      images: [{ url: OG_IMAGE, width: 600, height: 600, alt: SITE_NAME }],
    },
  }
}
