// Genera `public/llms.txt` a partir de `dictionaries/en.json`.
// Uso:  node scripts/gen-llms-txt.mjs   (lo encadena `pnpm build`)
//
// `llms.txt` es una convención (Jeremy Howard, 2024) para servir a los modelos
// una versión en Markdown plano del contenido de un sitio. Hoy ningún gran
// proveedor ha confirmado que lo consuma, así que esto es una apuesta barata,
// no una optimización con retorno medido.
//
// Se GENERA, nunca se edita a mano, y por eso está en .gitignore: el único
// coste real de tener este fichero sería que se quedase desactualizado
// respecto a los diccionarios, y generándolo en cada build eso no puede pasar.
//
// Solo se emite el inglés: `llms.txt` es un único fichero en la raíz. Las
// versiones es/gl se enlazan al final.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = 'https://ignaciogarbayo.com'
// Las 4 rutas indexables, con la clave de `nav` de la que sale su etiqueta.
// Espejo de `SUBPATHS` en lib/seo.ts; aquí no se puede importar (es TS).
const PAGES = [
  ['', 'home'],
  ['/experience', 'experience'],
  ['/education', 'education'],
  ['/projects', 'projects'],
]

/** Encabezado de una entrada: "Título — Organización (fecha)". */
const heading = (title, org, date) =>
  `### ${[title, org].filter(Boolean).join(' — ')}${date ? ` (${date})` : ''}`

const bullets = (items = []) => items.map(b => `- ${b}`)

// Va como un bullet más y no como párrafo suelto: una línea pegada al final de
// una lista Markdown se absorbe dentro del último ítem.
const linkLine = (links = []) =>
  links.length ? [`- Links: ${links.map(l => `[${l.label}](${l.url})`).join(', ')}`] : []

/**
 * Renderiza una sección de entradas. `fields` dice de qué claves salen el
 * título y la organización, que cambian de nombre en cada sección
 * (degree/institution, title/company, title/issuer…).
 */
function section(title, entries = [], [titleKey, orgKey]) {
  if (!entries.length) return []
  return [
    `## ${title}`,
    '',
    ...entries.flatMap(e => [
      heading(e[titleKey], e[orgKey], e.date),
      '',
      ...bullets(e.bullets),
      ...(e.description ? [`- ${e.description}`] : []),
      ...(e.note ? [`- ${e.note}`] : []),
      ...linkLine(e.links),
      '',
    ]),
  ]
}

export function buildLlmsTxt(dict) {
  const lines = [
    `# ${dict.header.name}`,
    '',
    `> ${dict.meta.description}`,
    '',
    `Personal CV site: ${SITE_URL}. This file is generated at build time from the`,
    'site\'s English content, so it always matches what the pages show.',
    '',
    `## ${dict.summary.title}`,
    '',
    dict.summary.content,
    '',
    `## ${dict.skills.title}`,
    '',
    ...dict.skills.categories.map(c => `- ${c.name}: ${c.items.join(', ')}`),
    '',
    ...section(dict.education.title, dict.education.entries, ['degree', 'institution']),
    ...section(dict.experience.title, dict.experience.entries, ['title', 'company']),
    ...section(dict.projects.title, dict.projects.entries, ['title', 'organization']),
    ...section(dict.leadership.title, dict.leadership.entries, ['title', 'organization']),
    ...section(dict.certifications.title, dict.certifications.entries, ['title', 'issuer']),
    `## ${dict.languages.title}`,
    '',
    ...dict.languages.entries.map(e => `- ${e.language}: ${e.level}`),
    '',
    ...section(dict.volunteering.title, dict.volunteering.entries, ['title', 'location']),
    '## Links',
    '',
    ...PAGES.map(([path, key]) => `- [${dict.nav[key]}](${SITE_URL}/en${path}/)`),
    `- [${dict.header.name} on GitHub](${dict.header.github})`,
    `- [${dict.header.name} on LinkedIn](${dict.header.linkedin})`,
    `- [${dict.header.name} on Devpost](${dict.header.devpost})`,
    `- Spanish version: ${SITE_URL}/es/`,
    `- Galician version: ${SITE_URL}/gl/`,
    '',
  ]

  // Nunca más de una línea en blanco seguida: `section()` deja una al cerrar
  // cada entrada y otra al empezar la siguiente sección.
  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dict = JSON.parse(readFileSync(join(ROOT, 'dictionaries', 'en.json'), 'utf8'))
  const out = join(ROOT, 'public', 'llms.txt')
  const txt = buildLlmsTxt(dict)
  writeFileSync(out, txt)
  console.log(`gen-llms-txt: public/llms.txt — ${txt.split('\n').length} líneas, ${txt.length} B`)
}
