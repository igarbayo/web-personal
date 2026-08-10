import type { MetadataRoute } from 'next'
import { LANGS, SUBPATHS, SITE_URL } from '@/lib/seo'

/**
 * Las 12 URLs canónicas (3 idiomas × 4 páginas), cada una con su bloque de
 * hreflang. Las 4 rutas sin prefijo (`/`, `/experience/`…) **no se listan** a
 * propósito: no son canónicas, solo puertas de entrada para crawlers sin JS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return LANGS.flatMap((lang) =>
    SUBPATHS.map((subpath) => ({
      url: `${SITE_URL}/${lang}${subpath}/`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${SITE_URL}/en${subpath}/`,
          es: `${SITE_URL}/es${subpath}/`,
          gl: `${SITE_URL}/gl${subpath}/`,
          'x-default': `${SITE_URL}/en${subpath}/`,
        },
      },
    }))
  )
}
