import type { Metadata } from 'next'
import type { Dictionary } from './types'

/** Las 4 secciones del sitio, como sufijo de ruta. '' es la home. */
export const SUBPATHS = ['', '/experience', '/education', '/projects'] as const
export const LANGS = ['en', 'es', 'gl'] as const

export const SITE_URL = 'https://ignaciogarbayo.com'
export const SITE_NAME = 'Ignacio Garbayo Fernández'
const OG_IMAGE = '/me-movil-compressed.png'
const PERSON_IMAGE = '/me.webp'

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

/**
 * Quita el marcado de enlace de un texto: `[IGM WEB](https://…)` → `IGM WEB`.
 * Varios campos del diccionario llevan enlaces en Markdown porque la UI los
 * renderiza; en JSON-LD tienen que ser texto plano.
 */
const stripMarkdownLinks = (s: string) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')

/**
 * Áreas de conocimiento, por delante de la lista de tecnologías de `skills`.
 * Esa lista sola son herramientas ("Docker", "R"), y lo que un grafo de
 * conocimiento necesita para situar a una persona es el campo, no el stack.
 *
 * En inglés y sin traducir, por el mismo motivo que `knowsLanguage` lleva
 * códigos: son los términos contra los que casan las entidades de schema.org.
 */
const KNOWS_ABOUT_TOPICS = [
  'Mathematics',
  'Computer Science',
  'Software Engineering',
  'Artificial Intelligence',
  'Machine Learning',
  'AI Agents',
  'Computer Vision',
  'Mathematical Optimization',
  'Statistics',
  'Distributed Systems',
  'Full Stack Development',
  'Open Source',
]

/**
 * Datos estructurados `Person` de schema.org, en el idioma de la página.
 *
 * A diferencia de `llms.txt`, esto sí lo consumen sistemas reales: el Knowledge
 * Graph de Google y los modelos con búsqueda, que llevan años parseando JSON-LD.
 * Se construye desde el diccionario, así que traduce solo y nunca se
 * desincroniza del contenido visible.
 */
export function buildPersonJsonLd(dict: Dictionary, lang: string) {
  // Dedup sin `Set`: el target del tsconfig es ES5 y spread de Set exigiría
  // `downlevelIteration`.
  const institutions = dict.education.entries
    .map((e) => e.institution)
    .filter((v, i, a) => a.indexOf(v) === i)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: dict.header.name,
    url: `${SITE_URL}/${lang}/`,
    image: `${SITE_URL}${PERSON_IMAGE}`,
    email: `mailto:${dict.header.email}`,
    description: dict.meta.description,
    // Sin `jobTitle` ni `worksFor` a propósito. Saldrían de
    // `experience.entries[0]`, y eso ataría el dato a que la entrada más
    // reciente siga siendo siempre la primera del diccionario.
    alumniOf: institutions.map((name) => ({
      '@type': 'CollegeOrUniversity',
      name: stripMarkdownLinks(name),
    })),
    knowsAbout: [...KNOWS_ABOUT_TOPICS, ...dict.skills.categories.flatMap((c) => c.items)],
    // Códigos BCP-47, no los nombres del diccionario: allí el mismo idioma
    // cambia de nombre según la página ("English", "Inglés", "Inglés") y para
    // una máquina el código es inequívoco.
    knowsLanguage: [...LANGS],
    sameAs: [dict.header.github, dict.header.linkedin, dict.header.devpost],
  }
}

/**
 * Serializa el JSON-LD para meterlo en un `<script>`. Escapar `<` es
 * obligatorio: un `</script>` dentro de una cadena del diccionario cerraría la
 * etiqueta antes de tiempo, y con ella se abriría un XSS.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
